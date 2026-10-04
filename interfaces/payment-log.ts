export interface PaymentLogRow {
  CustID?: string;
  Key1?: string;
  Company?: string;
  ResaleID?: string;
  Number01?: number | null;
  Date01?: string | null;
  xBankName_c?: string | null;
  OtherDetails?: string | null;
  status1?: number | null;
  TypePay?: string | null;
  TypePay1?: number | null;
  TypePay2?: number | null;
}

export interface PaymentLogResponse {
  status: string;
  results: PaymentLogRow[];
  error?: string;
}
