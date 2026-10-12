export interface CardTempRow {
  Row1: number;
  RunID: number;
  CardID: string;
  CarRegister: string;
  CustID: string;
  Remark: string | null;
  DateCreated: string;
  LastUseCard: string | null;
  IsInActive: number | boolean | null;
}

export interface CardTempResponse {
  status: string;
  results: CardTempRow[];
  error?: string;
}

export interface CancelCardPayload {
  custID: string;
  runID: number;
  userName: string;
  otpId: string;
  referenceCode: string;
  otpCode: string;
}
