import { NEXT_STATUS_MAPPING } from "@/constants";

export type AdvanceableStatus = keyof typeof NEXT_STATUS_MAPPING;

export function canAdvanceStatus(
  status?: string,
): status is AdvanceableStatus {
  return !!status && status in NEXT_STATUS_MAPPING;
}

export function getNextStatus(status: AdvanceableStatus) {
  return NEXT_STATUS_MAPPING[status];
}

export function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ").toLowerCase();
}
