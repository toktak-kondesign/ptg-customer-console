import { NextRequest, NextResponse } from "next/server";

export interface AuthenUserInfo {
  response_code: number;
  response_desc: string;
  response_ref: string;
  isExpire: boolean;
  personCode: string;
  preName: string;
  personName: string;
  personPosition: string;
  username: string;
  custID: string;
  custName: string;
}

const AUTH_API_BASE_URL =
  process.env.AUTH_API_BASE_URL || "https://depwn2021.ptg.co.th";
const AUTH_API_KEY =
  process.env.AUTH_API_KEY ||
  "yeFxnJ0dOPxG4GXA4L6FLOl1O4K2qUeL16Fen9wYzaUyeFxnJ0dOPxG4GXA4L6FLOl1O4K2qUeL16Fen9wYzaU";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      {
        response_code: 400,
        response_desc: "Missing token parameter",
      },
      { status: 400 },
    );
  }

  try {
    const requestDatetime = Math.floor(Date.now() / 1000).toString();

    const response = await fetch(
      `${AUTH_API_BASE_URL}/siteService/api/AuthenX/CheckUserInfo`,
      {
        method: "POST",
        headers: {
          ApiKey: AUTH_API_KEY,
          "Content-Type": "application/json",
          request_datetime: requestDatetime,
        },
        body: JSON.stringify({ token }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          response_code: response.status,
          response_desc: `External API error: ${response.statusText}`,
        },
        { status: response.status },
      );
    }

    const data: AuthenUserInfo = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        response_code: 500,
        response_desc: message,
      },
      { status: 500 },
    );
  }
}
