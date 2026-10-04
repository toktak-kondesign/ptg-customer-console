import type { PaymentLogResponse } from "@/interfaces/payment-log";
import { BASE_PATH } from "@/lib/env";

export async function getPaymentLogService(
  vanNo: string,
  company: string,
  date: string,
): Promise<PaymentLogResponse> {
  try {
    const params = new URLSearchParams({ vanNo, company, date });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/payment-log/?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: PaymentLogResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error: data.error ?? `Failed to fetch payment logs: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching payment logs: ${message}`,
    };
  }
}
