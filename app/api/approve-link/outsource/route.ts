import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CreateApproveLinkResponse {
  status?: string;
  message?: string;
  results?: string;
}

interface OutsourceRequest {
  ref1: string;
  ref2: string;
  ref3: string;
  ref4?: string;
}

interface OutsourceResponse {
  success: boolean;
  link?: string;
  error?: string;
}

/**
 * Step 4: Proxy to createApproveLink using the client-provided JWT
 * (stored from step 1). The client sends the JWT via Authorization header.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<OutsourceResponse>> {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return NextResponse.json<OutsourceResponse>(
        { success: false, error: "Missing authorization token" },
        { status: 401 },
      );
    }

    const body: OutsourceRequest = await request.json();
    if (!body.ref1 || !body.ref2 || !body.ref3) {
      return NextResponse.json<OutsourceResponse>(
        { success: false, error: "Missing ref1, ref2, or ref3" },
        { status: 400 },
      );
    }

    const baseUrl = getApiBaseUrl();
    const approveLinkUrl = `${baseUrl}approvalapiex/v1/master/createApproveLink`;

    const approveLinkRes = await fetch(approveLinkUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        ref1: body.ref1,
        ref2: body.ref2,
        ref3: body.ref3,
        ref4: body.ref4 ?? "",
      }),
    });

    if (!approveLinkRes.ok) {
      const errBody = await approveLinkRes.text().catch(() => "");
      console.error(
        `[outsource] createApproveLink returned ${approveLinkRes.status}: ${errBody.slice(0, 500)}`,
      );
      return NextResponse.json<OutsourceResponse>(
        {
          success: false,
          error: `createApproveLink returned ${approveLinkRes.status}`,
        },
        { status: 502 },
      );
    }

    const approveData: CreateApproveLinkResponse =
      await approveLinkRes.json();
    const link = approveData.results ?? "";

    return NextResponse.json<OutsourceResponse>({
      success: true,
      link,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[outsource] Error:", error);
    return NextResponse.json<OutsourceResponse>(
      { success: false, error: `Failed: ${message}` },
      { status: 500 },
    );
  }
}
