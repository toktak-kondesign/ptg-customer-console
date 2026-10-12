import { NextRequest, NextResponse } from "next/server";
import { isVerifyOtpPayload, verifyOtpWithAuthenX } from "@/lib/authenxOtp";
import type { VerifyOtpResponse } from "@/interfaces/otp";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest): Promise<NextResponse<VerifyOtpResponse>> {
  try {
    const body: unknown = await request.json();

    if (!isVerifyOtpPayload(body)) {
      return NextResponse.json<VerifyOtpResponse>(
        { success: false, error: "Invalid verify OTP request payload" },
        { status: 400 },
      );
    }

    const { response, status } = await verifyOtpWithAuthenX(body);
    return NextResponse.json<VerifyOtpResponse>(response, { status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json<VerifyOtpResponse>(
      { success: false, error: `Failed to verify OTP: ${message}` },
      { status: 500 },
    );
  }
}
