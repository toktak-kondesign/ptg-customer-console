import { NextRequest, NextResponse } from "next/server";
import { getClientIp, logCustomerAccess } from "@/lib/access-log";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PDF_API_URL = process.env.PDF_API_URL || "http://localhost:3400";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
    const upstream = await fetch(`${PDF_API_URL}/api/card-otu/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await upstream.json();

    logCustomerAccess({
      custID: typeof body.custID === "string" ? body.custID : null,
      module: "truck-list",
      action: "CANCEL",
      detail: `ยกเลิกบัตรรถรับสินค้าชั่วคราว ${body.idCode ?? "-"}`,
      refNo: typeof body.idCode === "string" ? body.idCode : null,
      result: upstream.ok && data.status === "success" ? "SUCCESS" : "FAIL",
      errorMessage:
        upstream.ok && data.status === "success"
          ? null
          : (data.error ?? `Upstream returned ${upstream.status}`),
      ipAddress: ip,
      userAgent,
    });

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logCustomerAccess({
      custID: typeof body.custID === "string" ? body.custID : null,
      module: "truck-list",
      action: "CANCEL",
      detail: `ยกเลิกบัตรรถรับสินค้าชั่วคราว ${body.idCode ?? "-"}`,
      refNo: typeof body.idCode === "string" ? body.idCode : null,
      result: "FAIL",
      errorMessage: `Upstream unreachable: ${message}`,
      ipAddress: ip,
      userAgent,
    });
    return NextResponse.json(
      { status: "error", error: `Upstream unreachable: ${message}` },
      { status: 502 },
    );
  }
}
