import { PROCESSES } from "@/constants";
import type { OrdersByProcess } from "@/types/order";

export const emptyOrders = (): OrdersByProcess =>
  Object.fromEntries(
    PROCESSES.map(({ value }) => [value, []]),
  ) as OrdersByProcess;
