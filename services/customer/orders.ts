import type { CustomerOrdersResponse } from "@/interfaces/order";
import { BASE_PATH } from "@/lib/env";

export async function getCustomerOrdersService(
  custId: string
): Promise<CustomerOrdersResponse> {
  try {
    const params = new URLSearchParams({ custID: custId });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/orders/?${params.toString()}`,
      { cache: "no-store" }
    );
    const data: CustomerOrdersResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error: data.error ?? `Failed to fetch orders: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching orders: ${message}`,
    };
  }
}
