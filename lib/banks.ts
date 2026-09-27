import { img } from "@/lib/env";

export interface BankOption {
  code: string;
  name: string;
  /** ไฟล์โลโก้ใน /public/images/bank_acc_img (null = ไม่มีโลโก้ ใช้ไอคอนแทน) */
  logo: string | null;
}

export const BANKS: BankOption[] = [
  { code: "BAAC", name: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (BAAC)", logo: "BAAC.png" },
  { code: "BAY", name: "ธนาคารกรุงศรีอยุธยา", logo: "BAY.png" },
  { code: "BBL", name: "ธนาคารกรุงเทพ", logo: "BBL.png" },
  { code: "GHB", name: "ธนาคารอาคารสงเคราะห์", logo: "GHB.png" },
  { code: "GSB", name: "ธนาคารออมสิน", logo: "GSB.png" },
  { code: "UOB", name: "ธนาคารยูโอบี", logo: "UOB.png" },
  { code: "KBANK", name: "ธนาคารกสิกรไทย", logo: "KBANK.png" },
  { code: "KTB", name: "ธนาคารกรุงไทย", logo: "KTB.png" },
  { code: "SCB", name: "ธนาคารไทยพาณิชย์", logo: "SCB.png" },
  { code: "TTB", name: "ธนาคารทหารไทยธนชาต (ttb)", logo: "TTB.png" },
  { code: "ISLAMIC", name: "ธนาคารอิสลามแห่งประเทศไทย", logo: "i-bank.png" },
  { code: "OTH", name: "อื่นๆ", logo: null },
];

const BANK_BY_CODE = new Map(BANKS.map((bank) => [bank.code, bank]));

export function getBank(code: string | null | undefined): BankOption | null {
  return code ? BANK_BY_CODE.get(code.trim().toUpperCase()) ?? null : null;
}

export function getBankName(code: string | null | undefined): string {
  return getBank(code)?.name ?? code?.trim() ?? "";
}

export function getBankLogo(code: string | null | undefined): string | null {
  const logo = getBank(code)?.logo;
  return logo ? img(`/images/bank_acc_img/${logo}`) : null;
}
