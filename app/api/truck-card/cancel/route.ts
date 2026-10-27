import { NextRequest, NextResponse } from "next/server";
import { isVerifyOtpPayload, verifyOtpWithAuthenX } from "@/lib/authenxOtp";
import { getClientIp, logCustomerAccess } from "@/lib/access-log";
import type { CancelCardPayload } from "@/interfaces/card-temp";
import type { VerifyOtpResponse } from "@/interfaces/otp";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PDF_API_URL = process.env.PDF_API_URL || "http://localhost:3400";

interface PdfApiResult {
  status: string;
  error?: string;
  logID?: number;
}

function isCancelCardPayload(value: unknown): value is CancelCardPayload {
  if (!value || typeof value !== "object") return false;
  const body = value as Partial<CancelCardPayload>;
  return (
    typeof body.custID === "string" &&
    body.custID.trim().length > 0 &&
    Number.isInteger(body.runID) &&
    isVerifyOtpPayload(body)
  );
}

async function postPdfApi(
  path: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; data: PdfApiResult }> {
  const response = await fetch(`${PDF_API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data: PdfApiResult = await response
    .json()
    .catch(() => ({ status: "error", error: `Upstream returned ${response.status}` }));
  return { ok: response.ok && data.status === "success", data };
}

/**
 * Cancel card flow (server-enforced OTP):
 * 1. INSERT tbCardTempCancalLog (OTGstatus = 0) with the OTP the user entered
 * 2. Verify the OTP with AuthenX
 * 3. On success: OTGstatus = 1, tbCardTemp.IsInActive = 1 (one transaction)
 * Response is VerifyOtpResponse-shaped so OtpConfirmModal can render the errors.
 */
export async function POST(request: NextRequest): Promise<NextResponse<VerifyOtpResponse>> {
  try {
    const body: unknown = await request.json();

    if (!isCancelCardPayload(body)) {
      return NextResponse.json<VerifyOtpResponse>(
        { success: false, error: "Invalid cancel card request payload" },
        { status: 400 },
      );
    }

    const custID = body.custID.trim();

    const logAccess = (result: "SUCCESS" | "FAIL", errorMessage?: string) =>
      logCustomerAccess({
        custID,
        username: body.userName,
        module: "truck-list",
        action: "CANCEL",
        detail: `ยกเลิกบัตรรถชั่วคราว runID=${body.runID}`,
        refNo: String(body.runID),
        result,
        errorMessage: errorMessage ?? null,
        ipAddress: getClientIp(request),
        userAgent: request.headers.get("user-agent"),
      });

    const log = await postPdfApi("/api/card-temp/cancel-log", {
      custID,
      runID: body.runID,
      otp: body.otpCode,
      userCreated: body.userName,
    });
    if (!log.ok || log.data.logID === undefined) {
      logAccess("FAIL", log.data.error ?? "ไม่สามารถบันทึกรายการยกเลิกบัตรได้");
      return NextResponse.json<VerifyOtpResponse>(
        { success: false, error: log.data.error ?? "ไม่สามารถบันทึกรายการยกเลิกบัตรได้" },
        { status: 502 },
      );
    }

    const { response: verify, status } = await verifyOtpWithAuthenX({
      otpId: body.otpId,
      referenceCode: body.referenceCode,
      otpCode: body.otpCode,
    });
    if (!verify.success || !verify.data?.result) {
      logAccess("FAIL", verify.error ?? "OTP verification failed");
      return NextResponse.json<VerifyOtpResponse>(verify, {
        status: verify.success ? 200 : status,
      });
    }

    const confirm = await postPdfApi("/api/card-temp/cancel-confirm", {
      custID,
      runID: body.runID,
      logID: log.data.logID,
    });
    if (!confirm.ok) {
      logAccess("FAIL", confirm.data.error ?? "ไม่สามารถยกเลิกบัตรได้");
      return NextResponse.json<VerifyOtpResponse>(
        { success: false, error: confirm.data.error ?? "ไม่สามารถยกเลิกบัตรได้" },
        { status: 502 },
      );
    }

    logAccess("SUCCESS");
    return NextResponse.json<VerifyOtpResponse>(verify);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json<VerifyOtpResponse>(
      { success: false, error: `Failed to cancel card: ${message}` },
      { status: 500 },
    );
  }
}
