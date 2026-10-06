import type { ReceiptLogDtlResponse } from "@/interfaces/receipt-log-dtl";
import { BASE_PATH } from "@/lib/env";

export async function getReceiptLogDtlService(
  vanNo: string,
  receipt: string,
  headNum: string,
): Promise<ReceiptLogDtlResponse> {
  try {
    const params = new URLSearchParams({ vanNo, receipt, headNum });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/receipt-log-dtl/?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: ReceiptLogDtlResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error:
          data.error ?? `Failed to fetch receipt log detail: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching receipt log detail: ${message}`,
    };
  }
}
