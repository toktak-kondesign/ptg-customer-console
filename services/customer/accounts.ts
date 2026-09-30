import type { CustomerAccountsResponse } from "@/interfaces/customer";
import { BASE_PATH } from "@/lib/env";

export async function getCustomerAccountsService(
  custId: string,
  signal?: AbortSignal
): Promise<CustomerAccountsResponse> {
  try {
    const params = new URLSearchParams({ custID: custId, company: "PTG" });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/accounts/?${params.toString()}`,
      { cache: "no-store", signal }
    );
    const data: CustomerAccountsResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error: data.error ?? `Failed to fetch customer accounts: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching customer accounts: ${message}`,
    };
  }
}
