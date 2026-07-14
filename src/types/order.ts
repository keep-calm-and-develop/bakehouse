import { PROCESSES } from "@/constants";

export type ProcessKey = (typeof PROCESSES)[number]["value"];

export type OrdersByProcess = Record<ProcessKey, Order[]>;

export interface Order {
  id: string;
  status?: string;
  orderNo?: string;
  deliveryDate?: number;
  customer?: {
    name?: string;
  };
  layering?: { label?: string; value?: string };
  finishing?: { label?: string; value?: string };
  decorating?: { label?: string; value?: string };
  fondantFinishing?: { label?: string; value?: string };
}
