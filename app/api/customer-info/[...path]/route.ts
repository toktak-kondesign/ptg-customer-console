import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PDF_API_URL =
  process.env.PDF_API_URL || "http://localhost:3400";

export async function GET(request: NextRequest): Promise<Response> {
  const path = request.nextUrl.pathname.replace(/^\/api\/customer-info\/?/, "");
  const query = request.nextUrl.search;
  const upstreamUrl = `${PDF_API_URL}/api/customer-info/${path}${query}`;

  try {
    const upstream = await fetch(upstreamUrl, { cache: "no-store" });
    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { status: "error", results: [], error: `Upstream unreachable: ${message}` },
      { status: 502 },
    );
  }
}
