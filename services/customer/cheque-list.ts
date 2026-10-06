import type { ChequeListResponse } from "@/interfaces/cheque-list";
import { BASE_PATH } from "@/lib/env";

export async function getChequeListService(
  custID: string,
  company: string,
  date: string,
): Promise<ChequeListResponse> {
  try {
    const params = new URLSearchParams({ custID, company, date });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/cheque-list/?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: ChequeListResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error: data.error ?? `Failed to fetch cheque list: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching cheque list: ${message}`,
    };
  }
}
