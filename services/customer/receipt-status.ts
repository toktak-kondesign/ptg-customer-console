import type { ReceiptStatusResponse } from "@/interfaces/receipt-status";
import { BASE_PATH } from "@/lib/env";

export async function getReceiptStatusListService(
  company: string,
  receipt: string,
): Promise<ReceiptStatusResponse> {
  try {
    const params = new URLSearchParams({ company, receipt });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/receipt-status-list/?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: ReceiptStatusResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error: data.error ?? `Failed to fetch receipt status: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching receipt status: ${message}`,
    };
  }
}
