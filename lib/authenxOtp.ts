import { SITE_BASE_URL } from "@/lib/env";
import type {
  AuthenXVerifyOtpPayload,
  AuthenXVerifyOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/interfaces/otp";

const AUTHENX_BASE_URL = (
  process.env.AUTH_SITE_BASE_URL || SITE_BASE_URL
).replace(/\/+$/, "");

const DEFAULT_VERIFY_OTP_URL = `${AUTHENX_BASE_URL}/siteService/api/AuthenX/VerifyOTP`;

function getVerifyOtpUrl(): string {
  return process.env.AUTHENX_VERIFY_OTP_URL ?? DEFAULT_VERIFY_OTP_URL;
}

function getOtpApiKey(): string {
  return (
    process.env.AUTHENX_OTP_API_KEY ??
    process.env.NEXT_PUBLIC_AUTHENX_OTP_API_KEY ??
    ""
  );
}

export function isVerifyOtpPayload(value: unknown): value is VerifyOtpPayload {
  if (!value || typeof value !== "object") return false;
  const body = value as Partial<VerifyOtpPayload>;
  return (
    typeof body.otpId === "string" &&
    body.otpId.trim().length > 0 &&
    typeof body.referenceCode === "string" &&
    body.referenceCode.trim().length > 0 &&
    typeof body.otpCode === "string" &&
    /^\d+$/.test(body.otpCode)
  );
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function getResponseMessage(data: unknown, fallback: string): string {
  if (typeof data === "string") return data || fallback;
  if (!data || typeof data !== "object") return fallback;

  const response = data as AuthenXVerifyOtpResponse;
  if (typeof response.error === "string" && response.error.trim()) {
    return response.error.trim();
  }
  if (response.error && typeof response.error === "object") {
    return response.error.description || response.error.message || fallback;
  }
  return response.description || response.message || response.data?.message || fallback;
}

function coerceBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "success", "y", "yes", "ผ่าน"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "fail", "failed", "n", "no", "ไม่ผ่าน"].includes(normalized)) {
      return false;
    }
  }
  return undefined;
}

function getVerifyResult(response: AuthenXVerifyOtpResponse): boolean | undefined {
  return (
    coerceBoolean(response.result) ??
    coerceBoolean(response.success) ??
    coerceBoolean(response.isSuccess) ??
    coerceBoolean(response.status) ??
    coerceBoolean(response.data?.result) ??
    coerceBoolean(response.data?.success) ??
    coerceBoolean(response.data?.isSuccess) ??
    coerceBoolean(response.data?.status)
  );
}

function hasExplicitError(response: AuthenXVerifyOtpResponse): boolean {
  return Boolean(response.error);
}

function getOtpId(response: AuthenXVerifyOtpResponse, fallback: string): string {
  return response.otp_ItemID ?? response.otpId ?? response.OTPId ?? fallback;
}

export async function verifyOtpWithAuthenX(
  payload: VerifyOtpPayload,
): Promise<{ response: VerifyOtpResponse; status: number }> {
  const apiKey = getOtpApiKey();

  if (!apiKey) {
    return {
      response: { success: false, error: "AUTHENX_OTP_API_KEY is not configured" },
      status: 500,
    };
  }

  const externalPayload: AuthenXVerifyOtpPayload = {
    otp_RefCode: payload.referenceCode.trim(),
    otp_ItemID: payload.otpId.trim(),
    otp: payload.otpCode,
  };

  const externalResponse = await fetch(getVerifyOtpUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ApiKey: apiKey,
      request_datetime: Math.floor(Date.now() / 1000).toString(),
    },
    body: JSON.stringify(externalPayload),
    cache: "no-store",
  });
  const externalData = await parseResponseBody(externalResponse);

  if (!externalResponse.ok) {
    return {
      response: {
        success: false,
        error: getResponseMessage(
          externalData,
          `Verify OTP failed: ${externalResponse.status} ${externalResponse.statusText}`,
        ),
      },
      status: externalResponse.status,
    };
  }

  if (!externalData || typeof externalData !== "object") {
    return {
      response: { success: false, error: "Verify OTP response has an invalid structure" },
      status: 502,
    };
  }

  const otpResponse = externalData as AuthenXVerifyOtpResponse;

  if (hasExplicitError(otpResponse)) {
    return {
      response: {
        success: false,
        error: getResponseMessage(otpResponse, "Verify OTP returned an error"),
      },
      status: 502,
    };
  }

  const result = getVerifyResult(otpResponse);

  if (result === undefined) {
    return {
      response: { success: false, error: "Verify OTP response is missing result" },
      status: 502,
    };
  }

  return {
    status: 200,
    response: {
      success: true,
      data: {
        otpId: getOtpId(otpResponse, payload.otpId),
        result,
        isErrorCount: otpResponse.isErrorCount ?? otpResponse.data?.isErrorCount ?? false,
        isExprCode:
          otpResponse.isExprCode ??
          otpResponse.isExpired ??
          otpResponse.data?.isExprCode ??
          otpResponse.data?.isExpired ??
          false,
      },
    },
  };
}
