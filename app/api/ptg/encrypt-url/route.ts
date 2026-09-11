import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EncryptUrlResponse {
  encrypted?: string;
  error?: string;
}

/**
 * Server-side proxy for the legacy .NET PTGWeb/EncryptUrl endpoint.
 *
 * The original client-side call is same-origin on www.ptg.co.th, but calling
 * it directly from this Next.js app would hit CORS. This route forwards the
 * request from the server, where CORS does not apply, and returns the
 * encrypted payload.
 *
 * Accepts either the full `x` value or the three components used by the
 * original `gotocredit` function:
 *   ?vannew=4570102002&c=PTG&r=0803560001911
 *   ?x=4570102002_PTG_0803560001911
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<EncryptUrlResponse>> {
  try {
    const { searchParams } = request.nextUrl;

    let x: string | null;
    if (searchParams.has("x")) {
      x = searchParams.get("x");
    } else {
      const vannew = searchParams.get("vannew")?.trim() ?? "";
      const c = searchParams.get("c")?.trim() ?? "";
      const r = searchParams.get("r")?.trim() ?? "";
      if (!vannew || !c || !r) {
        return NextResponse.json<EncryptUrlResponse>(
          { error: "Missing x or vannew/c/r parameters" },
          { status: 400 },
        );
      }
      x = `${vannew}_${c}_${r}`;
    }

    if (!x) {
      return NextResponse.json<EncryptUrlResponse>(
        { error: "Missing plaintext to encrypt" },
        { status: 400 },
      );
    }

    const url = `${API_BASE_URL}PTGWeb/EncryptUrl?X=${encodeURIComponent(x)}`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "text/plain, */*",
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        `[ptg/encrypt-url] ${response.status} from ${url}: ${body.slice(0, 500)}`,
      );
      return NextResponse.json<EncryptUrlResponse>(
        { error: `EncryptUrl returned ${response.status}` },
        { status: 502 },
      );
    }

    const encrypted = await response.text();
    return NextResponse.json<EncryptUrlResponse>({ encrypted: encrypted.trim() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[ptg/encrypt-url] Error:", error);
    return NextResponse.json<EncryptUrlResponse>(
      { error: `Failed: ${message}` },
      { status: 500 },
    );
  }
}
