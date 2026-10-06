export interface ChequeListRow {
  Runno?: string | null;
  company?: string | null;
  BankType?: string | null;
  BankReceipt?: string | null;
  CheckNo?: string | null;
  AMOUNT?: number | null;
  Billdate?: string | null;
  VANNO?: string | null;
  chequeStatus?: string | null;
  ReceiptPerson?: string | null;
  ReceiptPerson02?: string | null;
  CustID?: string | null;
  Name?: string | null;
  receivedate?: string | null;
  Createdate?: string | null;
  DateChequeReceipt01?: string | null;
  DateChequeReceipt02?: string | null;
  createname?: string | null;
}

export interface ChequeListResponse {
  status: string;
  results: ChequeListRow[];
  error?: string;
}
