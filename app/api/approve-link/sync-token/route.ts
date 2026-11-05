import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getApproveLinkBaseUrl, getSiteBaseUrl } from "@/lib/env";

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
  personCode?: string;
}

interface SyncTokenResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// AuthenX/CreateLinkToken response
interface CreateLinkTokenResponse {
  response_code: number;
  response_desc: string;
  token?: string;
}

/**
 * For links that need a session-sync step (e.g. myCart, OrderHistory):
 * 1. resolve the approve-link LinkId via ptgpdfapi (find-or-create row)
 * 2. call CreateLinkToken with the resolved targetUrl
 * 3. return the SyncAuthenLink URL — the browser navigates to it and the
 *    system activates the link/session automatically.
 *
 * Staff mode (&cid) ordering online (myCart) is the exception: it goes
 * through the new CS cart system, so the approve-link hop is skipped and
 * CreateLinkToken is called with the impersonated custID plus a direct
 * Site/wp/cartx/index?l={uuid} targetUrl.
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
    const personCode = body.personCode?.trim() ?? "";

    if (!ref1 || !custID || (!username && !personCode)) {
      return NextResponse.json<SyncTokenResponse>(
        {
          success: false,
          error: "Missing ref1, custID, or both username and personCode",
        },
        { status: 400 },
      );
    }

    const siteBaseUrl = getSiteBaseUrl();
    // personCode is only sent in staff mode (employee viewing a customer via
    // ?cid) — see getApproveLinkIdentity() in services/approve-link.ts.
    const isStaffCartLink = ref1 === "myCart" && !!personCode;

    let targetUrl: string;
    if (isStaffCartLink) {
      // ?l = generated uuid (spec ของ หนึ่ง CS)
      targetUrl = `${siteBaseUrl}Site/wp/cartx/index?l=${randomUUID()}`;
    } else {
      // Step 1: find-or-create the approve-link row, get its LinkId
      const resolveRes = await fetch(`${PDF_API_URL}/api/approve-link/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref1, username, custID, personCode }),
        cache: "no-store",
      });

      const resolveData = await resolveRes.json();
      if (
        !resolveRes.ok ||
        resolveData.status !== "success" ||
        !resolveData.linkId
      ) {
        return NextResponse.json<SyncTokenResponse>(
          {
            success: false,
            error:
              resolveData.error ??
              `resolveApproveLink failed: ${resolveRes.status}`,
          },
          { status: 502 },
        );
      }

      const customerBaseUrl = getApproveLinkBaseUrl();
      targetUrl = `${customerBaseUrl}CustomerBase/ApproveLinkToPTG?x=${resolveData.linkId}`;
    }

    // Step 2: exchange targetUrl for a sync token. In staff mode the
    // impersonated custID is included (customer mode sends none).
    const tokenRes = await fetch(
      `${siteBaseUrl}siteService/api/AuthenX/CreateLinkToken`,
      {
        method: "POST",
        headers: {
          ApiKey: AUTH_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isStaffCartLink
            ? { username, custID, targetUrl }
            : { username, targetUrl },
        ),
        cache: "no-store",
      },
    );

    const tokenData: CreateLinkTokenResponse = await tokenRes.json();
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
    const url = `${siteBaseUrl}Site/Authentication/SyncAuthenLink?t=${encodeURIComponent(tokenData.token)}`;
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
