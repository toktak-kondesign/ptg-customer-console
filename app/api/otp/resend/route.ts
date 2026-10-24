import { NextRequest, NextResponse } from "next/server";
import { SITE_BASE_URL } from "@/lib/env";
import type {
  AuthenXSendOtpPayload,
  AuthenXSendOtpResponse,
  ResendOtpPayload,
  ResendOtpResponse,
} from "@/interfaces/otp";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AUTHENX_BASE_URL = (
  process.env.AUTH_SITE_BASE_URL || SITE_BASE_URL
).replace(/\/+$/, "");

const DEFAULT_SEND_OTP_URL = `${AUTHENX_BASE_URL}/siteService/api/AuthenX/SendOTPToCustomer`;

function getSendOtpUrl(): string {
  return process.env.AUTHENX_SEND_OTP_URL ?? DEFAULT_SEND_OTP_URL;
}

function getOtpApiKey(): string {
  return (
    process.env.AUTHENX_OTP_API_KEY ??
    process.env.NEXT_PUBLIC_AUTHENX_OTP_API_KEY ??
    ""
  );
}

function isResendOtpPayload(value: unknown): value is ResendOtpPayload {
  if (!value || typeof value !== "object") return false;
  const body = value as Partial<ResendOtpPayload>;
  return typeof body.custId === "string" && body.custId.trim().length > 0;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function getObjectValue(
  data: AuthenXSendOtpResponse,
  keys: Array<keyof AuthenXSendOtpResponse>,
): string | undefined {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function getNestedObjectValue(
  data: AuthenXSendOtpResponse,
  keys: Array<keyof NonNullable<AuthenXSendOtpResponse["data"]>>,
): string | undefined {
  for (const key of keys) {
    const value = data.data?.[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function getResponseMessage(data: unknown, fallback: string): string {
  if (typeof data === "string") return data || fallback;
  if (!data || typeof data !== "object") return fallback;

  const response = data as AuthenXSendOtpResponse;
  if (typeof response.error === "string" && response.error.trim()) {
    return response.error.trim();
  }
  if (response.error && typeof response.error === "object") {
    return response.error.description || response.error.message || fallback;
  }
  return response.description || response.message || response.data?.message || fallback;
}

function isExplicitFailure(response: AuthenXSendOtpResponse): boolean {
  return (
    response.success === false ||
    response.isSuccess === false ||
    response.result === false ||
    response.status === false ||
    response.status === "false" ||
    response.status === "0" ||
    Boolean(response.error)
  );
}

function buildOtpResponseData(
  response: AuthenXSendOtpResponse,
  custId: string,
): NonNullable<ResendOtpResponse["data"]> {
  const otpId =
    getObjectValue(response, [
      "otpId",
      "OTPId",
      "otpid",
      "otpID",
      "otp_ItemID",
      "otpItemID",
      "itemID",
      "ItemID",
    ]) ??
    getNestedObjectValue(response, [
      "otpId",
      "OTPId",
      "otpid",
      "otpID",
      "otp_ItemID",
      "otpItemID",
      "itemID",
      "ItemID",
    ]) ??
    custId;
  const referenceCode =
    getObjectValue(response, [
      "referenceCode",
      "refCode",
      "RefCode",
      "otpRef",
      "OTPRef",
      "otp_RefCode",
      "otpRefCode",
    ]) ??
    getNestedObjectValue(response, [
      "referenceCode",
      "refCode",
      "RefCode",
      "otpRef",
      "OTPRef",
      "otp_RefCode",
      "otpRefCode",
    ]) ??
    "";

  return {
    otpId,
    referenceCode,
    success: response.message
      ? { message: response.message, description: response.description ?? "" }
      : undefined,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<ResendOtpResponse>> {
  try {
    const apiKey = getOtpApiKey();

    if (!apiKey) {
      return NextResponse.json<ResendOtpResponse>(
        { success: false, error: "AUTHENX_OTP_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const body: unknown = await request.json();

    if (!isResendOtpPayload(body)) {
      return NextResponse.json<ResendOtpResponse>(
        { success: false, error: "Invalid resend OTP request payload" },
        { status: 400 },
      );
    }

    const custId = body.custId.trim();

    const externalPayload: AuthenXSendOtpPayload = { custID: custId };
    const requestDatetime = Math.floor(Date.now() / 1000).toString();

    const externalResponse = await fetch(getSendOtpUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ApiKey: apiKey,
        request_datetime: requestDatetime,
      },
      body: JSON.stringify(externalPayload),
      cache: "no-store",
    });
    const externalData = await parseResponseBody(externalResponse);

    if (!externalResponse.ok) {
      return NextResponse.json<ResendOtpResponse>(
        {
          success: false,
          error: getResponseMessage(
            externalData,
            `Resend OTP failed: ${externalResponse.status} ${externalResponse.statusText}`,
          ),
        },
        { status: externalResponse.status },
      );
    }

    if (!externalData || typeof externalData !== "object") {
      return NextResponse.json<ResendOtpResponse>(
        { success: false, error: "Resend OTP response has an invalid structure" },
        { status: 502 },
      );
    }

    const otpResponse = externalData as AuthenXSendOtpResponse;

    if (isExplicitFailure(otpResponse)) {
      return NextResponse.json<ResendOtpResponse>(
        {
          success: false,
          error: getResponseMessage(otpResponse, "Resend OTP returned an error"),
        },
        { status: 502 },
      );
    }

    return NextResponse.json<ResendOtpResponse>({
      success: true,
      data: buildOtpResponseData(otpResponse, custId),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json<ResendOtpResponse>(
      { success: false, error: `Failed to resend OTP: ${message}` },
      { status: 500 },
    );
  }
}
