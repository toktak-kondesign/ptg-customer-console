import { BASE_PATH } from "@/lib/env";

// ใช้ proxy ผ่าน /api/customer-info/etax-invoice-pdf เพื่อให้ iframe ใน modal
// เป็น same-origin (เรียก contentWindow.print() ได้) — upstream จริงคือ
// {rdpdf}/e-taxpdf/E-Tax/ETax{company}/{YYYYMM}/{YYYYMMDD}/Invoice/{legalNumber}_Sign.pdf
// คืนค่า "" เมื่อข้อมูลไม่พอสำหรับสร้าง URL
export function getEtaxInvoicePdfUrl(
  company: string,
  invoiceDate: string | null | undefined,
  legalNumber: string | null | undefined,
): string {
  const invoice = legalNumber?.trim();
  const match = String(invoiceDate ?? "").match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!invoice || !company.trim() || !match) return "";

  const year = Number(match[1]);
  const gregorianYear = year >= 2400 ? year - 543 : year;
  const params = new URLSearchParams({
    company: company.trim(),
    invoiceDate: `${gregorianYear}-${match[2]}-${match[3]}`,
    invoice,
  });

  return `${BASE_PATH}/api/customer-info/etax-invoice-pdf?${params.toString()}`;
}
