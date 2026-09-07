import type { CustomerOrdersResponse } from "@/interfaces/order";

const PDF_API_URL =
  process.env.NEXT_PUBLIC_PDF_API_URL || "http://localhost:3100";

export async function getCustomerOrdersService(
  custId: string
): Promise<CustomerOrdersResponse> {
  try {
    const params = new URLSearchParams({ custID: custId });
    const response = await fetch(
      `${PDF_API_URL}/api/customer-info/orders?${params.toString()}`,
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
