import type {
  CreatePayingBillRequest,
  PayingBillResponse,
} from "@/interfaces/paying-bill";
import { BASE_PATH } from "@/lib/env";

export async function createPayingBillService(
  payload: CreatePayingBillRequest,
): Promise<PayingBillResponse> {
  try {
    const response = await fetch(`${BASE_PATH}/api/paying-bill/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data: PayingBillResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error ?? `บันทึกข้อมูลไม่สำเร็จ (${response.status})`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: `เกิดข้อผิดพลาดระหว่างบันทึก: ${message}` };
  }
}

export async function getPayingBillService(
  runno: string,
): Promise<PayingBillResponse> {
  try {
    const params = new URLSearchParams({ runno });
    const response = await fetch(
      `${BASE_PATH}/api/paying-bill/?${params.toString()}`,
      { cache: "no-store" },
    );
    const data: PayingBillResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error ?? `ไม่สามารถโหลดใบนำจ่ายได้ (${response.status})`,
      };
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: `เกิดข้อผิดพลาดระหว่างโหลดข้อมูล: ${message}` };
  }
}
