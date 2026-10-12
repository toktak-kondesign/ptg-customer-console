import type { CardOTUResponse } from "@/interfaces/card-otu";
import { BASE_PATH } from "@/lib/env";

export async function getCardOTUListService(
  custID: string,
  date: string,
): Promise<CardOTUResponse> {
  try {
    const params = new URLSearchParams({ custID, date });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/card-otu-list/?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: CardOTUResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error:
          data.error ?? `Failed to fetch card requests: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching card requests: ${message}`,
    };
  }
}
