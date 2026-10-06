export interface ReceiptLogDtlRow {
  HeadNum?: number | null;
  LegalNumber?: string | null;
  Reference?: string | null;
  InvoiceDate?: string | null;
  DueDate?: string | null;
  DocTranAmt?: number | null;
  status1?: number | null;
  textbox?: string | null;
}

export interface ReceiptLogDtlResponse {
  status: string;
  results: ReceiptLogDtlRow[];
  error?: string;
}
