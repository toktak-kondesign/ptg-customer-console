import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PDF_API_URL = process.env.PDF_API_URL || "http://localhost:3400";

interface ResolveRequest {
  ref1?: string;
  username?: string;
  custID?: string;
}

interface ResolveResponse {
  success: boolean;
  linkId?: string;
  error?: string;
}

/**
 * Proxy to ptgpdfapi's find-or-create approve-link endpoint. Given a system
 * key (ref1) and the logged-in customer's username/custID, it returns the
 * LinkId (UUID) to redirect to via getApiBaseUrl() + "CustomerBase/ApproveLinkToPTG?x=".
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ResolveResponse>> {
  try {
    const body: ResolveRequest = await request.json();
    const ref1 = body.ref1?.trim() ?? "";
    const username = body.username?.trim() ?? "";
    const custID = body.custID?.trim() ?? "";

    if (!ref1 || !username || !custID) {
      return NextResponse.json<ResolveResponse>(
        { success: false, error: "Missing ref1, username or custID" },
        { status: 400 },
      );
    }

    const response = await fetch(`${PDF_API_URL}/api/approve-link/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref1, username, custID }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success" || !data.linkId) {
      return NextResponse.json<ResolveResponse>(
        { success: false, error: data.error ?? `Failed: ${response.status}` },
        { status: response.ok ? 502 : response.status },
      );
    }

    return NextResponse.json<ResolveResponse>({
      success: true,
      linkId: data.linkId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[approve-link/resolve] Error:", error);
    return NextResponse.json<ResolveResponse>(
      { success: false, error: `Failed: ${message}` },
      { status: 500 },
    );
  }
}
