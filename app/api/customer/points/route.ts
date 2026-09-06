import { prisma } from "@/lib/prisma";
import { prismaDataCenter } from "@/lib/prismaDataCenter";
import { floorPointToOneDecimal } from "@/lib/pointPrecision";
import type {
  CustomerGoldPointData,
  CustomerPointQuery,
  CustomerPointsResponse,
  CustomerSilverPointData,
} from "@/interfaces/point";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

function jsonResponse(
  response: CustomerPointsResponse,
  status = 200
): Response {
  return Response.json(response, { status, headers: noStoreHeaders });
}

function parseQueryParams(request: Request): CustomerPointQuery | null {
  const { searchParams } = new URL(request.url);
  const custId = searchParams.get("custId")?.trim();

  return custId ? { custId } : null;
}

interface CustomerPointProcedureRow {
  waitpaypoint: number | null;
  waitpaypointSilver: number | null;
}

async function getCustomerPointsFromProcedure(
  custId: string
): Promise<CustomerPointProcedureRow | null> {
  const rows = await prismaDataCenter.$queryRaw<CustomerPointProcedureRow[]>`
    EXEC dbo.prDash_Point2017_Test ${custId}
  `;

  return rows[0] ?? null;
}

function toNullablePoint(value: number | null): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? floorPointToOneDecimal(value)
    : null;
}

function serializeGoldPoint(
  point: {
    currentPoint: number | null;
    unfundedPoint: number | null;
    xStatus: number | null;
  }
): CustomerGoldPointData {
  return {
    currentPoint: toNullablePoint(point.currentPoint),
    unfundedPoint: toNullablePoint(point.unfundedPoint),
    xStatus: point.xStatus,
  };
}

function serializeSilverPoint(
  point: {
    currentPoint: number | null;
    xStatus: number | null;
  }
): CustomerSilverPointData {
  return {
    currentPoint: toNullablePoint(point.currentPoint),
    xStatus: point.xStatus,
  };
}

export async function GET(request: Request): Promise<Response> {
  try {
    const query = parseQueryParams(request);
    if (!query) {
      const response: CustomerPointsResponse = {
        success: false,
        error: "Missing custId",
      };
      return jsonResponse(response, 400);
    }

    const [goldPoint, silverPoint, pendingPoint] = await Promise.all([
      prisma.tbCustPointGoldCurrent2017.findFirst({
        where: { custId: query.custId },
        orderBy: { itemId: "desc" },
        select: {
          currentPoint: true,
          unfundedPoint: true,
          xStatus: true,
        },
      }),
      prisma.tbCustPointSilverCurrent2017.findFirst({
        where: { custId: query.custId },
        orderBy: { itemId: "desc" },
        select: {
          currentPoint: true,
          xStatus: true,
        },
      }),
      getCustomerPointsFromProcedure(query.custId),
    ]);

    const response: CustomerPointsResponse = {
      success: true,
      data: {
        custId: query.custId,
        gold: goldPoint ? serializeGoldPoint(goldPoint) : null,
        silver: silverPoint ? serializeSilverPoint(silverPoint) : null,
        waitpaypointGold: pendingPoint
          ? toNullablePoint(pendingPoint.waitpaypoint)
          : null,
        waitpaypointSilver: pendingPoint
          ? toNullablePoint(pendingPoint.waitpaypointSilver)
          : null,
      },
    };

    return jsonResponse(response);
  } catch (error) {
    console.error("Failed to fetch customer points:", error);
    const response: CustomerPointsResponse = {
      success: false,
      error: "Failed to fetch customer points",
    };
    return jsonResponse(response, 500);
  }
}
