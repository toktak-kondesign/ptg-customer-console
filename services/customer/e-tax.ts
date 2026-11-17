import { ETAX_PDF_BASE_URL } from "@/lib/env";

// รูปแบบ: {base}/ETax{company}/{YYYYMM}/{YYYYMMDD}/Invoice/{legalNumber}_Sign.pdf
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
  const yearMonth = `${gregorianYear}${match[2]}`;

  return `${ETAX_PDF_BASE_URL}/ETax${encodeURIComponent(company.trim())}/${yearMonth}/${yearMonth}${match[3]}/Invoice/${encodeURIComponent(invoice)}_Sign.pdf`;
}
