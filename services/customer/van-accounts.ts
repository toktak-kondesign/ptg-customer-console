import type {
  VanAccountDetails,
  VanAccountResponse,
} from "@/interfaces/van-account";
import { BASE_PATH } from "@/lib/env";

const emptyResults: VanAccountDetails = {
  branches: [],
  customer: null,
  accounts: [],
};

export async function getVanAccountsService(
  company: string,
  resaleID: string,
): Promise<VanAccountResponse> {
  try {
    const params = new URLSearchParams({ company, resaleID });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/van-accounts/?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: VanAccountResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: emptyResults,
        error: data.error ?? `Failed to fetch VAN accounts: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: emptyResults,
      error: `An error occurred while fetching VAN accounts: ${message}`,
    };
  }
}
