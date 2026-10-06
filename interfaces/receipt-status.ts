export interface ReceiptStatusRow {
  Status01?: number | null;
  Name?: string | null;
  Number01?: number | null;
  Company?: string | null;
  xBankName_c?: string | null;
  Date01?: string | null;
  Date02?: string | null;
  xTimeList_c?: string | null;
  Reference?: string | null;
  TranAmt?: number | null;
  Vanno?: string | null;
  HeadNum?: string | null;
  xReceiptID_c?: string | null;
  TypePay?: string | null;
  xLegalnumber_c?: string | null;
}

export interface ReceiptStatusResponse {
  status: string;
  results: ReceiptStatusRow[];
  error?: string;
}
