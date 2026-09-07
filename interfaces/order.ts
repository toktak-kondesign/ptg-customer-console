export interface CustomerOrder {
  BillID: string;
  IMGID: string;
  DateSend: string;
  DateScale: string;
  VolSend: number;
  NumSend: number;
  TotalPrice: number;
  NetMoney: number;
  CarRegister: string;
  EQID: string;
  CarDriverName: string;
  TypeProductID: string;
  Typename: string;
  SendStatus: string;
  Company: string;
  custsign: number;
}

export interface CustomerOrdersResponse {
  status: string;
  results: CustomerOrder[];
  error?: string;
}
