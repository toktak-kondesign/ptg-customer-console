import type { VanAccountDtlResponse } from "@/interfaces/van-account";
import { BASE_PATH } from "@/lib/env";

export async function getVanAccountDtlService(
  company: string,
  resaleID: string,
  vanNo: string,
): Promise<VanAccountDtlResponse> {
  try {
    const params = new URLSearchParams({ company, resaleID, vanNo });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/van-account-dtl/?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: VanAccountDtlResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error: data.error ?? `Failed to fetch VAN account detail: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching VAN account detail: ${message}`,
    };
  }
}
