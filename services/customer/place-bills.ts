import type {
  PlaceBillDetails,
  PlaceBillResponse,
} from "@/interfaces/place-bill";
import { BASE_PATH, PLACE_BILL_PDF_BASE_URL } from "@/lib/env";

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
  const match = String(placeDate).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";

  const year = Number(match[1]);
  const gregorianYear = year >= 2400 ? year - 543 : year;
  const folderDate = `${gregorianYear}${match[2]}${match[3]}`;
  const fileName = /\.pdf$/i.test(file) ? file : `${file}.pdf`;

  return `${PLACE_BILL_PDF_BASE_URL}/${encodeURIComponent(company)}/${folderDate}/${encodeURIComponent(fileName)}`;
}
