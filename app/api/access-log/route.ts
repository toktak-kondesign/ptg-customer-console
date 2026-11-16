import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type { AccessLogResponse, AccessLogRow } from "@/interfaces/access-log";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 200;

const MODULES = ["payment-list", "truck-list"];
const ACTIONS = ["CREATE", "UPDATE", "DELETE", "CANCEL", "VIEW"];
const RESULTS = ["SUCCESS", "FAIL"];

interface RawLogRow {
  ItemID: bigint | number;
  CustID: string | null;
  Username: string | null;
  Module: string;
  ActionName: string;
  ActionDetail: string | null;
  RefNo: string | null;
  Result: string;
  ErrorMessage: string | null;
  IPAddress: string | null;
  UserAgent: string | null;
  CreatedDate: Date;
}

function serialize(row: RawLogRow): AccessLogRow {
  return {
    itemId: Number(row.ItemID),
    custId: row.CustID,
    username: row.Username,
    module: row.Module,
    actionName: row.ActionName,
    actionDetail: row.ActionDetail,
    refNo: row.RefNo,
    result: row.Result === "FAIL" ? "FAIL" : "SUCCESS",
    errorMessage: row.ErrorMessage,
    ipAddress: row.IPAddress,
    userAgent: row.UserAgent,
    createdDate: row.CreatedDate.toISOString(),
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<AccessLogResponse>> {
  const params = new URL(request.url).searchParams;

  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(params.get("pageSize")) || DEFAULT_PAGE_SIZE),
  );
  const offset = (page - 1) * pageSize;

  const custId = params.get("custId")?.trim();
  const username = params.get("username")?.trim();
  const module = params.get("module")?.trim();
  const actionName = params.get("actionName")?.trim();
  const result = params.get("result")?.trim();
  const refNo = params.get("refNo")?.trim();
  const keyword = params.get("keyword")?.trim();
  const dateFrom = params.get("dateFrom")?.trim();
  const dateTo = params.get("dateTo")?.trim();

  const conditions: Prisma.Sql[] = [];
  if (custId) conditions.push(Prisma.sql`CustID = ${custId}`);
  if (username) conditions.push(Prisma.sql`Username LIKE ${`%${username}%`}`);
  if (module && MODULES.includes(module)) {
    conditions.push(Prisma.sql`Module = ${module}`);
  }
  if (actionName && ACTIONS.includes(actionName)) {
    conditions.push(Prisma.sql`ActionName = ${actionName}`);
  }
  if (result && RESULTS.includes(result)) {
    conditions.push(Prisma.sql`Result = ${result}`);
  }
  if (refNo) conditions.push(Prisma.sql`RefNo LIKE ${`%${refNo}%`}`);
  if (keyword) {
    conditions.push(
      Prisma.sql`(ActionDetail LIKE ${`%${keyword}%`} OR ErrorMessage LIKE ${`%${keyword}%`})`,
    );
  }
  if (dateFrom && /^\d{4}-\d{2}-\d{2}$/.test(dateFrom)) {
    conditions.push(Prisma.sql`CreatedDate >= ${`${dateFrom}T00:00:00`}`);
  }
  if (dateTo && /^\d{4}-\d{2}-\d{2}$/.test(dateTo)) {
    conditions.push(Prisma.sql`CreatedDate < DATEADD(day, 1, ${`${dateTo}T00:00:00`})`);
  }

  const where = conditions.length
    ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
    : Prisma.empty;

  try {
    const [rows, countRows] = await Promise.all([
      prisma.$queryRaw<RawLogRow[]>`
        SELECT ItemID, CustID, Username, Module, ActionName, ActionDetail,
               RefNo, Result, ErrorMessage, IPAddress, UserAgent, CreatedDate
        FROM dbo.tbCustomerAccessLog
        ${where}
        ORDER BY ItemID DESC
        OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
      `,
      prisma.$queryRaw<{ total: number }[]>`
        SELECT COUNT(*) AS total FROM dbo.tbCustomerAccessLog ${where}
      `,
    ]);

    return NextResponse.json({
      status: "success",
      results: rows.map(serialize),
      total: Number(countRows[0]?.total ?? 0),
      page,
      pageSize,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        status: "error",
        results: [],
        total: 0,
        page,
        pageSize,
        error: `ไม่สามารถโหลด log ได้: ${message}`,
      },
      { status: 500 },
    );
  }
}
