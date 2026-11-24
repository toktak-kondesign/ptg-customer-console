import type { OrderPickerResponse } from "@/interfaces/order-picker";
import { BASE_PATH } from "@/lib/env";

export async function getOrderPickerProductsService(
  custID: string,
  signal?: AbortSignal,
): Promise<OrderPickerResponse> {
  try {
    const params = new URLSearchParams({ custID });
    const response = await fetch(
      `${BASE_PATH}/api/customer-info/order-picker?${params.toString()}`,
      { cache: "no-store", signal },
    );
    const data: OrderPickerResponse = await response.json();
    if (!response.ok || data.status !== "success") {
      return { status: "error", results: [], error: data.error || "ไม่สามารถโหลดรายการสินค้าได้" };
    }
    return data;
  } catch {
    return { status: "error", results: [], error: "ไม่สามารถเชื่อมต่อบริการรายการสินค้าได้" };
  }
}
