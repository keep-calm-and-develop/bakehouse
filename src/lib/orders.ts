import { endOfDay, startOfDay } from "date-fns";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  type Query,
} from "firebase/firestore";
import { PROCESSES } from "@/constants";
import { firestore } from "@/firebase";
import { parseQuerySnapshot } from "@/lib/firestore";
import type { Order, OrdersByProcess } from "@/types/order";

export const EXCLUDED_ORDER_STATUSES = new Set([
  "CANCELLED",
  "READY",
  "COMPLETED",
]);

const PROCESS_KEYS = PROCESSES.map(({ value }) => value);

export const emptyOrders = (): OrdersByProcess =>
  Object.fromEntries(
    PROCESSES.map(({ value }) => [value, []]),
  ) as OrdersByProcess;

export function getDayBounds(day: Date) {
  return {
    start: startOfDay(day).getTime(),
    end: endOfDay(day).getTime(),
  };
}

export function buildDayOrdersQuery(day: Date): Query {
  const { start, end } = getDayBounds(day);

  return query(
    collection(firestore, "orders"),
    where("deliveryDate", ">=", start),
    where("deliveryDate", "<", end),
    orderBy("deliveryDate", "asc"),
  );
}

export function groupOrdersByProcess(
  orders: Order[],
  employeeId: string,
): OrdersByProcess {
  const grouped = emptyOrders();

  for (const order of orders) {
    if (!order.status || EXCLUDED_ORDER_STATUSES.has(order.status)) {
      continue;
    }

    for (const process of PROCESS_KEYS) {
      if (order[process]?.value === employeeId) {
        grouped[process].push(order);
      }
    }
  }

  return grouped;
}

export function subscribeToDayOrders(
  day: Date,
  employeeId: string,
  onData: (orders: OrdersByProcess) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    buildDayOrdersQuery(day),
    (snapshot) => {
      const orders = parseQuerySnapshot<Order>(snapshot);
      onData(groupOrdersByProcess(orders, employeeId));
    },
    (error) => onError(error),
  );
}

export function getActiveOrdersForProcess(
  orders: Order[],
  expectedStatus: string,
) {
  return orders.filter((order) => order.status === expectedStatus);
}
