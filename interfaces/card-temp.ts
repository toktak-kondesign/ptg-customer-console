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

export interface PendingBillRow {
  OrderCode: string;
  DateSend: string;
  DateBill: string;
  AllCusName: string;
  AllProduct: string;
  CarRegister: string;
  SendStatus: string;
  TxtStatus: string;
}

export interface CarCheckResponse {
  status: string;
  pendingBills: PendingBillRow[];
  pendingCard: string | null;
  error?: string;
}

export interface CardOtuItemPayload {
  itemCode: string;
  orderNum: string;
  orderLine: string;
  numSend: number;
  unit: string;
  numSend2: number;
  unit2: string;
}

export interface CreateCardOtuPayload {
  custID: string;
  custName: string;
  car: string;
  phone: string;
  createBy: string;
  items: CardOtuItemPayload[];
}

export interface CreateCardOtuResponse {
  status: string;
  idCode?: string;
  createDate?: string;
  error?: string;
}

export interface RequestProductRow {
  OrderNum: string;
  OrderLine: number;
  ItemCode: string;
  ItemName: string;
  Unit: string;
  NumToUse: number;
  ProdName: string;
}

export interface RequestProductsResponse {
  status: string;
  results: RequestProductRow[];
  error?: string;
}

export interface CardOtuDetailHead {
  IDCode: string;
  CarRegister: string;
  CustID: string;
  CustName: string;
  CreateDate: string;
}

export interface CardOtuDetailItem {
  ItemCode: string;
  ItemName: string;
  OrderNum: string;
  OrderLine: string;
  NumSend: number;
  Unit: string;
}

export interface CardOtuDetailResponse {
  status: string;
  result?: CardOtuDetailHead;
  items?: CardOtuDetailItem[];
  error?: string;
}
