import type {
  AccessLogQuery,
  AccessLogResponse,
} from "@/interfaces/access-log";
import { BASE_PATH } from "@/lib/env";

export async function getAccessLogService(
  query: AccessLogQuery,
): Promise<AccessLogResponse> {
  const fallback: AccessLogResponse = {
    status: "error",
    results: [],
    total: 0,
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 50,
  };
  try {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        params.set(key, String(value));
      }
    });
    const response = await fetch(
      `${BASE_PATH}/api/access-log?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: AccessLogResponse = await response.json();
    if (!response.ok || data.status !== "success") {
      return {
        ...fallback,
        error: data.error ?? `Failed to fetch access log: ${response.status}`,
      };
    }
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      ...fallback,
      error: `An error occurred while fetching access log: ${message}`,
    };
  }
}
