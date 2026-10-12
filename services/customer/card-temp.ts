import type {
  CancelCardPayload,
  CardTempResponse,
} from "@/interfaces/card-temp";
import type { VerifyOtpResponse } from "@/interfaces/otp";
import { BASE_PATH } from "@/lib/env";

export async function getCardTempListService(
  custID: string,
): Promise<CardTempResponse> {
  try {
    const params = new URLSearchParams({ custID });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/card-temp-list/?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: CardTempResponse = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        results: [],
        error: data.error ?? `Failed to fetch truck cards: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      status: "error",
      results: [],
      error: `An error occurred while fetching truck cards: ${message}`,
    };
  }
}

export async function cancelCardService(
  payload: CancelCardPayload,
): Promise<VerifyOtpResponse> {
  try {
    const response = await fetch(`${BASE_PATH}/api/truck-card/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data: VerifyOtpResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? `Failed to cancel card: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `An error occurred while cancelling card: ${message}`,
    };
  }
}
