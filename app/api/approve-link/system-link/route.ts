import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PDF_API_URL = process.env.PDF_API_URL || "http://localhost:3400";

interface SystemLinkRequest {
  ref1?: string;
  username?: string;
  personCode?: string;
}

interface SystemLinkResponse {
  success: boolean;
  linkId?: string;
  error?: string;
}

/**
 * Proxy to ptgpdfapi's PTGApprove.dbo.ApproveLinkToPTGSystem lookup. Used in
 * staff mode (EMP viewing a customer via ?cid) where the outsource link
 * (e.g. ptg-rewards) must come from the staff member's own existing row
 * (ref2=username, ref3=personCode) instead of createApproveLink.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<SystemLinkResponse>> {
  try {
    const body: SystemLinkRequest = await request.json();
    const ref1 = body.ref1?.trim() ?? "";
    const username = body.username?.trim() ?? "";
    const personCode = body.personCode?.trim() ?? "";

    if (!ref1 || !username) {
      return NextResponse.json<SystemLinkResponse>(
        { success: false, error: "Missing ref1 or username" },
        { status: 400 },
      );
    }

    const response = await fetch(`${PDF_API_URL}/api/approve-link/system-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref1, username, personCode }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success" || !data.linkId) {
      return NextResponse.json<SystemLinkResponse>(
        { success: false, error: data.error ?? `Failed: ${response.status}` },
        { status: response.ok ? 502 : response.status },
      );
    }

    return NextResponse.json<SystemLinkResponse>({
      success: true,
      linkId: data.linkId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[approve-link/system-link] Error:", error);
    return NextResponse.json<SystemLinkResponse>(
      { success: false, error: `Failed: ${message}` },
      { status: 500 },
    );
  }
}
