import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/env";
import { generateCustomerAccessToken } from "@/lib/jwt";
import type { Customer } from "@/interfaces/customer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PDF_API_URL =
  process.env.NEXT_PUBLIC_PDF_API_URL || "http://localhost:3100";

interface PtgSystemRequest {
  // AuthenUserInfo fields (from /api/auth/validate) — used to build Customer for JWT
  username?: string;
  personName?: string;
  custID?: string;
  custName?: string;
}

interface CreateApproveLinkResponse {
  status?: string;
  message?: string;
  results?: string;
}

interface CustomerInfoResponse {
  status: string;
  results: Record<string, unknown>[];
}

interface PtgSystemResponse {
  success: boolean;
  token?: string;
  link?: string;
  error?: string;
}

/**
 * Step 1-3: Build Customer from AuthenUserInfo, generate JWT,
 * fetch ResaleID from customer-info API, then call createApproveLink.
 * Returns the JWT (for client storage) and the approve-link UUID.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<PtgSystemResponse>> {
  try {
    const body: PtgSystemRequest = await request.json();
    const custID = body.custID?.trim() ?? "";

    if (!custID) {
      return NextResponse.json<PtgSystemResponse>(
        { success: false, error: "Missing custID" },
        { status: 400 },
      );
    }

    // Step 1: Build Customer from AuthenUserInfo and generate JWT
    const customer: Customer = {
      username: body.username ?? "",
      userFullName: body.personName ?? "",
      custID: custID,
      customerName: body.custName ?? "",
      positionLevel: 0,
      pointSilver: 0,
      pointGold: 0,
      active: 1,
    };
    const token = generateCustomerAccessToken(customer);

    // Step 2: Fetch ResaleID from customer-info API
    const customerInfoParams = new URLSearchParams({
      custID: custID,
      company: "PTG",
    });
    const customerInfoRes = await fetch(
      `${PDF_API_URL}/api/customer-info/customer?${customerInfoParams.toString()}`,
      { cache: "no-store" },
    );

    if (!customerInfoRes.ok) {
      return NextResponse.json<PtgSystemResponse>(
        {
          success: false,
          error: `Failed to fetch customer info: ${customerInfoRes.status}`,
        },
        { status: 502 },
      );
    }

    const customerInfoData: CustomerInfoResponse =
      await customerInfoRes.json();
    const customerRow = customerInfoData.results?.[0];
    if (!customerRow) {
      return NextResponse.json<PtgSystemResponse>(
        { success: false, error: "Customer not found" },
        { status: 404 },
      );
    }

    // ResaleID may vary in casing from DB — check common variants
    const resaleID =
      (customerRow.ResaleID as string) ??
      (customerRow.resaleID as string) ??
      (customerRow.RESALEID as string) ??
      "";

    // Step 3: Call createApproveLink with ref1=ResaleID, ref2=custID, ref3=custID
    const baseUrl = getApiBaseUrl();
    const approveLinkUrl = `${baseUrl}approvalapiex/v1/master/createApproveLink`;
    const requestBody = {
      ref1: resaleID,
      ref2: custID,
      ref3: custID,
      ref4: "",
    };
    console.log("[ptg-system] JWT token:", token);
    console.log("[ptg-system] createApproveLink URL:", approveLinkUrl);
    console.log("[ptg-system] request body:", JSON.stringify(requestBody));
    const approveLinkRes = await fetch(approveLinkUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify(requestBody),
    });

    if (!approveLinkRes.ok) {
      const errBody = await approveLinkRes.text().catch(() => "");
      console.error(
        `[ptg-system] createApproveLink returned ${approveLinkRes.status}: ${errBody.slice(0, 500)}`,
      );
      return NextResponse.json<PtgSystemResponse>(
        {
          success: false,
          error: `createApproveLink returned ${approveLinkRes.status}`,
        },
        { status: 502 },
      );
    }

    const approveData: CreateApproveLinkResponse = await approveLinkRes.json();
    const link = approveData.results ?? "";

    return NextResponse.json<PtgSystemResponse>({
      success: true,
      token,
      link,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[ptg-system] Error:", error);
    return NextResponse.json<PtgSystemResponse>(
      { success: false, error: `Failed: ${message}` },
      { status: 500 },
    );
  }
}
