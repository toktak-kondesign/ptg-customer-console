import type {
  CustomerLatestOrderResponse,
  CustomerLatestOrdersResponse,
  RewardOrder,
  RewardsResponse,
} from "@/interfaces/reward";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

const rewardsApiBaseUrl =
  process.env.REWARDS_API_URL ?? "http://deprewards.ptg.co.th";

const statusLabelMap: Record<number, string> = {
  0: "รอดำเนินการ",
  1: "จัดเตรียมสินค้า",
  2: "อยู่ระหว่างจัดส่ง",
  3: "จัดส่งสำเร็จ",
  4: "ยกเลิก",
};

function getStatusType(status: number | null): RewardOrder["statusType"] {
  if (status === 3) return "delivered";
  return "preparing";
}

function formatRewardDate(dateStr: string | null): string {
  if (!dateStr) return "-";

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatRewardAddress(
  order: CustomerLatestOrderResponse,
): string {
  const delivery = order.deliveryLocation;
  if (!delivery) return "ไม่พบข้อมูลที่อยู่จัดส่ง";

  return [
    delivery.houseNo ? `บ้านเลขที่ ${delivery.houseNo}` : null,
    delivery.villageNo ? `ม.${delivery.villageNo}` : null,
    delivery.lane ? `ซ.${delivery.lane}` : null,
    delivery.road ? `ถ.${delivery.road}` : null,
    delivery.subDistrict ? `ต.${delivery.subDistrict}` : null,
    delivery.district ? `อ.${delivery.district}` : null,
    delivery.province ? `จ.${delivery.province}` : null,
    delivery.zipCode,
  ]
    .filter(Boolean)
    .join(" ");
}

function serializeRewardOrder(order: CustomerLatestOrderResponse): RewardOrder {
  const status = order.osStatus ?? 0;
  const items = order.details.map((detail) => ({
    name: detail.productName ?? "ไม่มีข้อมูลสินค้า",
    qty: detail.qty ?? 0,
    points: (detail.score ?? 0) * (detail.qty ?? 0),
  }));

  const total =
    order.totalScoreOd ??
    items.reduce((sum, item) => sum + item.points, 0);

  return {
    id: order.orderCode ?? `Order #${order.orderId}`,
    status: statusLabelMap[status] ?? "ไม่ทราบสถานะ",
    statusType: getStatusType(status),
    date: formatRewardDate(order.orderDate),
    total,
    tier: "Silver Points",
    address: formatRewardAddress(order),
    items,
  };
}

function jsonResponse(response: RewardsResponse, status = 200): Response {
  return Response.json(response, { status, headers: noStoreHeaders });
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const custId = searchParams.get("custId")?.trim();
    const limitParam = searchParams.get("limit");
    const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 5;
    const limit = Number.isInteger(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 20)
      : 5;

    if (!custId) {
      const response: RewardsResponse = {
        success: false,
        error: "Missing custId",
      };
      return jsonResponse(response, 400);
    }

    const authHeader = request.headers.get("authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      const response: RewardsResponse = {
        success: false,
        error: "Missing authorization token",
      };
      return jsonResponse(response, 401);
    }

    const params = new URLSearchParams({
      customerCode: custId,
      limit: String(limit),
    });

    const upstreamResponse = await fetch(
      `${rewardsApiBaseUrl}/api/orders?${params.toString()}`,
      {
        cache: "no-store",
        headers: {
          Authorization: authHeader,
          Accept: "*/*",
        },
      },
    );

    const upstreamData: CustomerLatestOrdersResponse = await upstreamResponse.json();

    if (!upstreamResponse.ok || !upstreamData.success) {
      const response: RewardsResponse = {
        success: false,
        error:
          upstreamData.error ??
          "Failed to fetch rewards from rewards system",
      };
      return jsonResponse(response, upstreamResponse.status);
    }

    const data = (upstreamData.data ?? [])
      .filter((order) => order.osStatus !== 4)
      .map(serializeRewardOrder);

    const response: RewardsResponse = {
      success: true,
      data,
    };

    return jsonResponse(response);
  } catch (error) {
    console.error("Failed to fetch customer rewards:", error);
    const response: RewardsResponse = {
      success: false,
      error: "Failed to fetch customer rewards",
    };
    return jsonResponse(response, 500);
  }
}
