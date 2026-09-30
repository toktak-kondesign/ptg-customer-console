import type { CustomerProfileResponse } from "@/interfaces/customer";
import { getCustomerAccessToken } from "@/lib/auth";
import { BASE_PATH } from "@/lib/env";

export async function getCustomerProfileService(
  custId: string,
  signal?: AbortSignal
): Promise<CustomerProfileResponse> {
  try {
    const params = new URLSearchParams({ custID: custId, company: "PTG" });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/profile/?${params.toString()}`,
      {
        cache: "no-store",
        signal,
        headers: { usertoken: getCustomerAccessToken() ?? "" },
      }
    );
    const data: CustomerProfileResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error: data.error ?? `Failed to fetch customer profile: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching customer profile: ${message}`,
    };
  }
}
