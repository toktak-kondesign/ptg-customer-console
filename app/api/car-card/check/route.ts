import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PDF_API_URL = process.env.PDF_API_URL || "http://localhost:3400";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const upstream = await fetch(
      `${PDF_API_URL}/api/card-otu/check-car${request.nextUrl.search}`,
      { cache: "no-store" },
    );
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { status: "error", error: `Upstream unreachable: ${message}` },
      { status: 502 },
    );
  }
}
