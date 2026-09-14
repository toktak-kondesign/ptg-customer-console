import type { ColorDashboardResponse } from "@/interfaces/color-dashboard";
import { BASE_PATH } from "@/lib/env";

export async function getColorDashboardService(
  custId: string
): Promise<ColorDashboardResponse> {
  try {
    const params = new URLSearchParams({ custID: custId });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/color-dashboard/?${params.toString()}`,
      { cache: "no-store" }
    );
    const data: ColorDashboardResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error: data.error ?? `Failed to fetch color dashboard: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching color dashboard: ${message}`,
    };
  }
}
