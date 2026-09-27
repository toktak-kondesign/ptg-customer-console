import { prisma } from "@/lib/prisma";
import { prismaDataCenter } from "@/lib/prismaDataCenter";
import {
  isPaymentMethodKey,
  type CreatePayingBillRequest,
  type PayingBillResponse,
  type PayingBillRow,
} from "@/interfaces/paying-bill";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

function jsonResponse(response: PayingBillResponse, status = 200): Response {
  return Response.json(response, { status, headers: noStoreHeaders });
}

type PayingBillRecord = Awaited<
  ReturnType<typeof prismaDataCenter.ptgPayingBill.create>
>;

function serialize(row: PayingBillRecord): PayingBillRow {
  return {
    itemId: row.itemId,
    runno: row.runno,
    company: row.company,
    custId13: row.custId13,
    custId: row.custId,
    branchId: row.branchId,
    vanNo: row.vanNo,
    type: row.type,
    amount: row.amount,
    bankType: row.bankType,
    bankReceipt: row.bankReceipt,
    checkNo: row.checkNo,
    billDate: row.billDate?.toISOString() ?? null,
    tranferTime: row.tranferTime,
    receiveDate: row.receiveDate?.toISOString() ?? null,
    bankBranch: row.bankBranch,
    createDate: row.createDate?.toISOString() ?? null,
    userCreate: row.userCreate,
  };
}

/** แปลง YYYY-MM-DD เป็น Date แบบ UTC เที่ยงคืน กัน timezone เลื่อนวัน */
function toDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * ขอเลขที่เอกสารจาก DBWEBPTG (คนละเซิร์ฟเวอร์กับตาราง PTGPayingBill)
 * exec prDocumentRunno {ตัวอักษรตัวแรก, หัวข้อ, ประเภทเลข}
 */
async function generateRunno(isCheque: boolean): Promise<string> {
  const prefix = isCheque ? "C" : "T";
  const topic = isCheque ? "Runno Cheque number" : "Runno Tranfer number";
  const rows = await prisma.$queryRaw<Record<string, unknown>[]>`
    EXEC dbo.prDocumentRunno ${prefix}, ${topic}, ${"M"}
  `;

  const row = rows[0];
  if (!row) throw new Error("prDocumentRunno returned no row");

  const value = row.Runno ?? row.runno ?? Object.values(row)[0];
  const runno = typeof value === "string" ? value.trim() : String(value ?? "");
  if (!runno) throw new Error("prDocumentRunno returned an empty Runno");

  return runno;
}

function validate(body: Partial<CreatePayingBillRequest>): string | null {
  if (!body.method || !isPaymentMethodKey(body.method)) return "method ไม่ถูกต้อง";
  if (!body.company?.trim()) return "ไม่พบรหัสบริษัท";
  if (!body.custId?.trim()) return "ไม่พบรหัสลูกค้า";
  if (!body.vanNo?.trim()) return "ไม่พบเลขที่บัญชี VAN";
  if (!body.userCreate?.trim()) return "ไม่พบผู้ทำรายการ กรุณาเข้าสู่ระบบใหม่";

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) return "กรุณาระบุจำนวนเงินให้ถูกต้อง";

  if (!body.bankType?.trim()) return "กรุณาเลือกธนาคารต้นทาง";
  if (!body.bankReceipt?.trim()) return "กรุณาเลือกธนาคารปลายทาง";
  if (!body.billDate || !toDateOnly(body.billDate)) return "กรุณาระบุวันที่ให้ถูกต้อง";

  if (body.method.startsWith("cheque")) {
    if (!body.checkNo?.trim()) return "กรุณาระบุเลขที่เช็ค";
    if (!body.bankBranch?.trim()) return "กรุณาระบุสาขาของธนาคารเจ้าของเช็ค";
  }

  return null;
}

export async function POST(request: Request): Promise<Response> {
  let body: Partial<CreatePayingBillRequest>;
  try {
    body = (await request.json()) as Partial<CreatePayingBillRequest>;
  } catch {
    return jsonResponse({ success: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" }, 400);
  }

  // ตรวจให้ครบก่อนขอ Runno เสมอ เพราะ SP อยู่คนละเซิร์ฟเวอร์กับตาราง
  // จึง rollback เลขที่ถูกใช้ไปแล้วไม่ได้ถ้า INSERT ล้มเหลว
  const invalid = validate(body);
  if (invalid) return jsonResponse({ success: false, error: invalid }, 400);

  const isCheque = body.method!.startsWith("cheque");
  const billDate = toDateOnly(body.billDate!)!;
  const receiveDate = toDateOnly(new Date().toISOString().slice(0, 10))!;

  try {
    const runno = await generateRunno(isCheque);
    const created = await prismaDataCenter.ptgPayingBill.create({
      data: {
        runno,
        company: body.company!.trim(),
        custId13: body.custId13?.trim() || null,
        custId: body.custId!.trim(),
        branchId: body.branchId?.trim() || "00000",
        vanNo: body.vanNo!.replace(/\D/g, ""),
        type: isCheque ? "check" : "tranfer",
        amount: Number(body.amount),
        bankType: body.bankType!.trim(),
        bankReceipt: body.bankReceipt!.trim(),
        checkNo: body.checkNo?.trim() || "",
        billDate,
        tranferTime: body.tranferTime?.trim() || "",
        typeBill: "",
        receiveDate,
        bankBranch: body.bankBranch?.trim() || null,
        userCreate: body.userCreate!.trim(),
      },
    });

    return jsonResponse({ success: true, data: serialize(created) });
  } catch (error) {
    console.error("Failed to create paying bill:", error);
    return jsonResponse({ success: false, error: "บันทึกข้อมูลไม่สำเร็จ" }, 500);
  }
}

export async function GET(request: Request): Promise<Response> {
  const runno = new URL(request.url).searchParams.get("runno")?.trim();
  if (!runno) return jsonResponse({ success: false, error: "Missing runno" }, 400);

  try {
    const row = await prismaDataCenter.ptgPayingBill.findFirst({
      where: { runno },
      orderBy: { itemId: "desc" },
    });

    if (!row) return jsonResponse({ success: false, error: "ไม่พบใบนำจ่าย" }, 404);

    return jsonResponse({ success: true, data: serialize(row) });
  } catch (error) {
    console.error("Failed to fetch paying bill:", error);
    return jsonResponse({ success: false, error: "ไม่สามารถโหลดใบนำจ่ายได้" }, 500);
  }
}
