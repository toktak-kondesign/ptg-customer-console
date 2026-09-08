import type { RewardsQuery, RewardsResponse } from "@/interfaces/reward";

export async function getRewardsService(
  query: RewardsQuery,
): Promise<RewardsResponse> {
  try {
    const params = new URLSearchParams({
      custId: query.custId,
      limit: String(query.limit ?? 5),
    });

    const response = await fetch(
      `/api/customer/rewards?${params.toString()}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${query.token}`,
        },
      },
    );

    const data: RewardsResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? `Failed to fetch rewards: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `An error occurred while fetching rewards: ${message}`,
    };
  }
}
