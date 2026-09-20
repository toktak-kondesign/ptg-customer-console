import type { LogPayCustResponse } from "@/interfaces/van-account";
import { BASE_PATH } from "@/lib/env";

export async function getLogPayCustService(
  company: string,
  resaleID: string,
  vanNo: string,
): Promise<LogPayCustResponse> {
  try {
    const params = new URLSearchParams({ company, resaleID, vanNo });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/log-pay-cust/?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: LogPayCustResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error: data.error ?? `Failed to fetch payment log: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching payment log: ${message}`,
    };
  }
}
