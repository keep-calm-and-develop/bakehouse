import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { getNextStatus, type AdvanceableStatus } from "@/lib/status";

export async function advanceOrderStatus(
  orderId: string,
  currentStatus: AdvanceableStatus,
  updatedBy?: string,
) {
  await updateDoc(doc(firestore, "orders", orderId), {
    status: getNextStatus(currentStatus),
    updatedBy: updatedBy ?? null,
    updatedOn: Timestamp.now(),
  });
}
