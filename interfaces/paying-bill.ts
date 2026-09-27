/** วิธีชำระเงินที่เลือกได้ในหน้ารายละเอียดบัญชี VAN (ใช้เป็น segment ของ URL หน้าพิมพ์ด้วย) */
export type PaymentMethodKey = "van" | "bank" | "cheque-ktb" | "cheque-uob";

export const PAYMENT_METHODS: PaymentMethodKey[] = [
  "van",
  "bank",
  "cheque-ktb",
  "cheque-uob",
];

export function isPaymentMethodKey(value: string): value is PaymentMethodKey {
  return (PAYMENT_METHODS as string[]).includes(value);
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethodKey, string> = {
  van: "จ่ายโดยวิธีการโอน ผ่านระบบ VAN",
  bank: "โอนผ่านแอปฯ",
  "cheque-ktb": "จ่ายโดยเช็ค (กรุงไทย)",
  "cheque-uob": "จ่ายโดยเช็ค (UOB)",
};

export interface CreatePayingBillRequest {
  method: PaymentMethodKey;
  company: string;
  custId13: string;
  custId: string;
  branchId: string;
  vanNo: string;
  amount: number;
  /** รหัสธนาคารต้นทาง (bank = โอนจาก, cheque = ธนาคารเจ้าของเช็ค, van = UOB) */
  bankType: string;
  /** รหัสธนาคารปลายทาง */
  bankReceipt: string;
  checkNo?: string;
  /** YYYY-MM-DD — โอน: วันที่โอน, เช็ค: วันที่บนเช็ค */
  billDate: string;
  /** HH:mm */
  tranferTime: string;
  bankBranch?: string;
  userCreate: string;
}

/** ค่าจากฟอร์มใน PayingBillModal ที่ส่งให้ API (ส่วนที่เหลือมาจาก session/page) */
export type PayingBillFormValues = Pick<
  CreatePayingBillRequest,
  | "amount"
  | "bankType"
  | "bankReceipt"
  | "checkNo"
  | "billDate"
  | "tranferTime"
  | "bankBranch"
>;

export interface PayingBillRow {
  itemId: number;
  runno: string | null;
  company: string | null;
  custId13: string | null;
  custId: string | null;
  branchId: string | null;
  vanNo: string | null;
  type: string | null;
  amount: number | null;
  bankType: string | null;
  bankReceipt: string | null;
  checkNo: string | null;
  billDate: string | null;
  tranferTime: string | null;
  receiveDate: string | null;
  bankBranch: string | null;
  createDate: string | null;
  userCreate: string | null;
}

export interface PayingBillResponse {
  success: boolean;
  data?: PayingBillRow;
  error?: string;
}
