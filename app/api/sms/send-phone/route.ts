import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SMS_API_URL_PROD =
  "https://www.ptg.co.th/ptgdataapi/v1/sms/send-phone";
const SMS_API_URL_STAGING =
  "https://depwn2021.ptg.co.th/ptgdataapi/v1/sms/send-phone";

const SMS_API_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJrb25kZXNpZ24iLCJqdGkiOiJkZTgyMzU5Ny04MTZhLTQ0OTEtYjRhYi1lZGM4ZWExY2YwYTYiLCJTeXN0ZW1OYW1lIjoiUFRHLVJld2FyZCIsIlRva2VuR3JvdXAiOiJQVEciLCJleHAiOjIxMDM0ODE1NjMsImlzcyI6Imh0dHBzOi8vd3d3LnB0Zy5jby50aCIsImF1ZCI6IkdhcmRlbkNvbm5lY3QifQ.vTXtI0Oh_RWigbaSPM-hMH8_Df8O0EqEShgnLobiHZc";

function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

function getApiUrl(): string {
  return (
    process.env.PTG_SMS_API_URL?.trim() ||
    (isDevelopment() ? SMS_API_URL_STAGING : SMS_API_URL_PROD)
  );
}

function getApiToken(): string {
  return process.env.PTG_SMS_API_TOKEN?.trim() || SMS_API_TOKEN;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: unknown = await request.json();
    const { phoneNumber, message } = (body ?? {}) as {
      phoneNumber?: unknown;
      message?: unknown;
    };

    const phone = String(phoneNumber ?? "").replace(/[\s-]/g, "");
    const text = String(message ?? "").trim();

    if (!phone || !text) {
      return Response.json(
        { success: false, error: "phoneNumber and message are required" },
        { status: 400 },
      );
    }

    const externalResponse = await fetch(getApiUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getApiToken()}`,
      },
      body: JSON.stringify({ phoneNumber: phone, message: text }),
      cache: "no-store",
    });

    const data = await externalResponse.text();

    if (!externalResponse.ok) {
      return Response.json(
        {
          success: false,
          error: `SMS request failed: ${externalResponse.status} - ${data}`,
        },
        { status: externalResponse.status },
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[sms/send-phone] Error:", message);
    return Response.json(
      { success: false, error: `Failed to send SMS: ${message}` },
      { status: 503 },
    );
  }
}
