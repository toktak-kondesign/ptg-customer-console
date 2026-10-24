export interface CardOTURow {
  IDCode?: string | null;
  CarRegister?: string | null;
  CustID?: string | null;
  CustName?: string | null;
  MobilePhone?: string | null;
  CreateDate?: string | null;
  StatusCode?: number | null;
  UseDate?: string | null;
  IsInActive?: number | boolean | null;
}

export interface CardOTUResponse {
  status: string;
  results: CardOTURow[];
  error?: string;
}
