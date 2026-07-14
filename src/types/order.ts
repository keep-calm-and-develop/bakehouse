import { PROCESSES } from "@/constants";

export type ProcessKey = (typeof PROCESSES)[number]["value"];

export type OrdersByProcess = Record<ProcessKey, Order[]>;

export interface OrderProperty {
  cake?: string;
  filling?: string;
  frosting?: string;
}

export interface Order {
  id: string;
  status?: string;
  orderNo?: string;
  productType?: string;
  deliveryDate?: number;
  deliveryType?: string;
  specialInstructions?: string;
  imageUrl?: string;
  properties?: OrderProperty[];
  customer?: {
    name?: string;
  };
  layering?: { label?: string; value?: string };
  finishing?: { label?: string; value?: string };
  decorating?: { label?: string; value?: string };
  fondantFinishing?: { label?: string; value?: string };
}
