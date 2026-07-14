import { create } from "zustand";
import { emptyOrders } from "@/lib/orders";
import type { OrdersByProcess } from "@/types/order";

interface OrdersState {
  orders: OrdersByProcess;
  setOrders: (orders: OrdersByProcess) => void;
  resetOrders: () => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: emptyOrders(),

  setOrders: (orders) => set({ orders }),

  resetOrders: () => set({ orders: emptyOrders() }),
}));

export const useOrders = () => useOrdersStore((state) => state.orders);

export const useSetOrders = () => useOrdersStore((state) => state.setOrders);
