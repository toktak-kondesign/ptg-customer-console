import type {
  RequestOtpPayload,
  RequestOtpResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/interfaces/otp";
import { BASE_PATH } from "@/lib/env";

export async function requestOtpService(
  payload: RequestOtpPayload,
): Promise<RequestOtpResponse> {
  try {
    const response = await fetch(`${BASE_PATH}/api/otp/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: RequestOtpResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? `Failed to request OTP: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `An error occurred while requesting OTP: ${message}`,
    };
  }
}

export async function resendOtpService(
  payload: ResendOtpPayload,
): Promise<ResendOtpResponse> {
  try {
    const response = await fetch(`${BASE_PATH}/api/otp/resend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: ResendOtpResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? `Failed to resend OTP: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `An error occurred while resending OTP: ${message}`,
    };
  }
}

export async function verifyOtpService(
  payload: VerifyOtpPayload,
): Promise<VerifyOtpResponse> {
  try {
    const response = await fetch(`${BASE_PATH}/api/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: VerifyOtpResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error ?? `Failed to verify OTP: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `An error occurred while verifying OTP: ${message}`,
    };
  }
}
