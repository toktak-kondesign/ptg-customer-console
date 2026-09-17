import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PDF_API_URL = process.env.PDF_API_URL || "http://localhost:3400";
const AUTH_API_KEY =
  process.env.AUTH_API_KEY ||
  "yeFxnJ0dOPxG4GXA4L6FLOl1O4K2qUeL16Fen9wYzaUyeFxnJ0dOPxG4GXA4L6FLOl1O4K2qUeL16Fen9wYzaU";

interface SyncTokenRequest {
  ref1?: string;
  username?: string;
  custID?: string;
}

interface SyncTokenResponse {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * For links that need a session-sync step (e.g. myCart, OrderHistory):
 * 1. resolve the approve-link LinkId via ptgpdfapi (find-or-create row)
 * 2. call CreateLinkToken with the resolved targetUrl
 * 3. return the SyncAuthenLink URL — the browser navigates to it and the
 *    system activates the link/session automatically.
 * The ApiKey stays server-side; it must never be sent to the browser.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<SyncTokenResponse>> {
  try {
    const body: SyncTokenRequest = await request.json();
    const ref1 = body.ref1?.trim() ?? "";
    const username = body.username?.trim() ?? "";
    const custID = body.custID?.trim() ?? "";

    if (!ref1 || !username || !custID) {
      return NextResponse.json<SyncTokenResponse>(
        { success: false, error: "Missing ref1, username or custID" },
        { status: 400 },
      );
    }

    // Step 1: find-or-create the approve-link row, get its LinkId
    const resolveRes = await fetch(`${PDF_API_URL}/api/approve-link/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref1, username, custID }),
      cache: "no-store",
    });

    const resolveData = await resolveRes.json();
    if (!resolveRes.ok || resolveData.status !== "success" || !resolveData.linkId) {
      return NextResponse.json<SyncTokenResponse>(
        {
          success: false,
          error:
            resolveData.error ?? `resolveApproveLink failed: ${resolveRes.status}`,
        },
        { status: 502 },
      );
    }

    const baseUrl = getApiBaseUrl();
    const targetUrl = `${baseUrl}CustomerBase/ApproveLinkToPTG?x=${resolveData.linkId}`;

    // Step 2: exchange targetUrl for a sync token
    const tokenRes = await fetch(
      `${baseUrl}siteService/api/AuthenX/CreateLinkToken`,
      {
        method: "POST",
        headers: {
          ApiKey: AUTH_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, targetUrl }),
        cache: "no-store",
      },
    );

    const tokenData = await tokenRes.json();
    if (
      !tokenRes.ok ||
      tokenData.response_code !== 200 ||
      !tokenData.token
    ) {
      return NextResponse.json<SyncTokenResponse>(
        {
          success: false,
          error:
            tokenData.response_desc ??
            `CreateLinkToken failed: ${tokenRes.status}`,
        },
        { status: 502 },
      );
    }

    // Step 3: browser navigates here; the system activates the link itself
    const url = `${baseUrl}Site/Authentication/SyncAuthenLink?t=${encodeURIComponent(tokenData.token)}`;
    return NextResponse.json<SyncTokenResponse>({ success: true, url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[approve-link/sync-token] Error:", error);
    return NextResponse.json<SyncTokenResponse>(
      { success: false, error: `Failed: ${message}` },
      { status: 500 },
    );
  }
}
