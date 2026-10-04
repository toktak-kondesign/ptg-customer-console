export interface PlaceBillCustomer {
  Company: string;
  ResaleID: string;
  Name: string;
  Address1?: string | null;
  Address2?: string | null;
  Address3?: string | null;
  City?: string | null;
  State?: string | null;
  Zip?: string | null;
  PhoneNum?: string | null;
  xRefCustomer_c?: string | null;
  LastDate?: string | null;
}

export interface PlaceBillRow {
  Company: string;
  PlaceCode: string;
  ResaleID: string;
  VanNO?: string | null;
  FilePlace?: string | null;
  PlaceDate?: string | null;
  BeforAmt?: number | null;
  BeforInterAmt?: number | null;
  PlaceAmt?: number | null;
  color?: number | null;
  Sumpay?: number | null;
}

export interface PlaceBillDetails {
  customers: PlaceBillCustomer[];
  bills: PlaceBillRow[];
}

export interface PlaceBillResponse {
  status: string;
  results: PlaceBillDetails;
  error?: string;
}
