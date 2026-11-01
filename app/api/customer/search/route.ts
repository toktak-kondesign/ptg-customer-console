import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_COMPANY_CODE = "PTG24";

const SEARCH_API_URL_PROD =
  "https://www.ptg.co.th/ptgdataapi/v1/customer/search";
const SEARCH_API_URL_STAGING =
  "https://depwn2021.ptg.co.th/ptgdataapi/v1/customer/search";

const SEARCH_API_TOKEN_PROD =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb2N1bWVudCIsImp0aSI6IjE3ZDcxYjIyLTM0N2ItNDkwMS1iMDczLTk1ODVkY2U0YzhiYiIsIlN5c3RlbU5hbWUiOiJQVEctRG9jdW1lbnQiLCJUb2tlbkdyb3VwIjoiUFRHIiwiZXhwIjoyMTAzMTk3MjA2LCJpc3MiOiJodHRwczovL3d3dy5wdGcuY28udGgiLCJhdWQiOiJHYXJkZW5Db25uZWN0In0.HFXmEwjA4yU_-BWWMlhRQH5bdKhgd509b8W1_ocUAbk";
const SEARCH_API_TOKEN_STAGING =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJrb25kZXNpZ24iLCJqdGkiOiJkZTgyMzU5Ny04MTZhLTQ0OTEtYjRhYi1lZGM4ZWExY2YwYTYiLCJTeXN0ZW1OYW1lIjoiUFRHLVJld2FyZCIsIlRva2VuR3JvdXAiOiJQVEciLCJleHAiOjIxMDM0ODE1NjMsImlzcyI6Imh0dHBzOi8vd3d3LnB0Zy5jby50aCIsImF1ZCI6IkdhcmRlbkNvbm5lY3QifQ.vTXtI0Oh_RWigbaSPM-hMH8_Df8O0EqEShgnLobiHZc";

function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

function getApiUrl(): string {
  return (
    process.env.PTG_CUSTOMER_SEARCH_API_URL?.trim() ||
    (isDevelopment() ? SEARCH_API_URL_STAGING : SEARCH_API_URL_PROD)
  );
}

function getApiToken(): string {
  return (
    process.env.PTG_CUSTOMER_SEARCH_API_TOKEN?.trim() ||
    (isDevelopment() ? SEARCH_API_TOKEN_STAGING : SEARCH_API_TOKEN_PROD)
  );
}

interface CustomerSearchApiResponse {
  status?: string;
  message?: string;
  results?: {
    total?: number;
    page?: number;
    pageSize?: number;
    customerList?: Record<string, unknown>[];
  };
}

interface CustomerSearchResponse {
  success: boolean;
  data?: Record<string, unknown> | null;
  error?: string;
}

// ค้นหา/ตรวจสอบลูกค้าด้วย searchTerm (เช่น custID จากพารามิเตอร์ cid ของเจ้าหน้าที่)
export async function POST(
  request: NextRequest,
): Promise<Response> {
  try {
    const body: unknown = await request.json();
    const searchTerm =
      body && typeof body === "object"
        ? String((body as { searchTerm?: unknown }).searchTerm ?? "").trim()
        : "";

    if (!searchTerm) {
      return Response.json(
        { success: false, error: "searchTerm is required" },
        { status: 400 },
      );
    }

    const externalResponse = await fetch(getApiUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getApiToken()}`,
      },
      body: JSON.stringify({
        company:
          process.env.PTG_CUSTOMER_SEARCH_COMPANY_CODE?.trim() ||
          DEFAULT_COMPANY_CODE,
        searchTerm,
        page: 1,
        pageSize: 1000,
      }),
      cache: "no-store",
    });

    if (!externalResponse.ok) {
      const text = await externalResponse.text();
      return Response.json(
        {
          success: false,
          error: `Customer search request failed: ${externalResponse.status} ${externalResponse.statusText} - ${text}`,
        },
        { status: externalResponse.status },
      );
    }

    const data = (await externalResponse.json()) as CustomerSearchApiResponse;
    const customer = data?.results?.customerList?.[0] ?? null;

    return Response.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[customer/search] Error:", message);
    return Response.json(
      { success: false, error: `Failed to search customer: ${message}` },
      { status: 503 },
    );
  }
}
