import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PDF_API_URL = process.env.PDF_API_URL || "http://localhost:3400";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const upstream = await fetch(
      `${PDF_API_URL}/api/customer-info/order-picker${request.nextUrl.search}`,
      { cache: "no-store", signal: request.signal },
    );
    const data: unknown = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { status: "error", results: [], error: "ไม่สามารถเชื่อมต่อบริการรายการสินค้าได้" },
      { status: 502 },
    );
  }
}
