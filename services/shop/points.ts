import type {
  CustomerPointQuery,
  CustomerPointsResponse,
} from "@/interfaces/point";

export async function getCustomerPointsService(
  query: CustomerPointQuery
): Promise<CustomerPointsResponse> {
  try {
    const params = new URLSearchParams({ custId: query.custId });
    const response = await fetch(`/api/customer/points?${params.toString()}`, {
      cache: "no-store",
    });
    const data: CustomerPointsResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? `Failed to fetch customer points: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `An error occurred while fetching customer points: ${message}`,
    };
  }
}
