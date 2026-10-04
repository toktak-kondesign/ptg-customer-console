import type {
  PlaceBillDetails,
  PlaceBillResponse,
} from "@/interfaces/place-bill";
import { BASE_PATH } from "@/lib/env";

const emptyResults: PlaceBillDetails = {
  customers: [],
  bills: [],
};

export async function getPlaceBillsService(
  customerID: string,
  company: string,
  placeDate: string,
): Promise<PlaceBillResponse> {
  try {
    const params = new URLSearchParams({ customerID, company, placeDate });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/place-bills/?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: PlaceBillResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: emptyResults,
        error: data.error ?? `Failed to fetch place bills: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: emptyResults,
      error: `An error occurred while fetching place bills: ${message}`,
    };
  }
}

export function getPlaceBillPdfUrl(
  company: string,
  placeDate: string,
  file: string,
): string {
  const params = new URLSearchParams({ company, placeDate, file });
  return `${BASE_PATH}/api/customer-info/place-bill-pdf/?${params.toString()}`;
}
