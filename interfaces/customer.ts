// Mirrors C# Customer class (ApproveV2) — property names match [JsonPropertyName]
// so JSON.stringify output is identical to System.Text.Json.JsonSerializer.Serialize(cust).
export interface Customer {
  username?: string;
  userFullName?: string;
  custID?: string;
  customerName?: string;
  positionLevel: number;
  pointSilver: number;
  pointGold: number;
  active: number;
  // metadata from ApproveLinkToPTGSystem
  systemId?: string; // ref1
  linkId?: string;
}

// Row จาก GET /api/customer-info/profile (ptgpdfapi — query ERP10 dbo.Customer
// join Erp.CustGrup / VEmployee / tbSecUsers)
// เป็น type (ไม่ใช่ interface) เพื่อให้มี implicit index signature — assign เข้า
// Record<string, unknown> ของ localStorage customer-info ได้โดยตรง
export type CustomerProfileRow = {
  CustID: string;
  Name: string;
  Address1: string;
  Address2: string;
  Address3: string;
  City: string;
  State: string;
  Zip: string;
  ResaleID: string;
  GroupCode: string;
  GroupDesc: string | null;
  SalesRepCode: string;
  PersonName: string | null;
  OfficePhone: string | null;
  Tel1: string | null;
  Fax: string | null;
  LineID: string | null;
  Facebook: string | null;
  Latitude: number | null;
  Longitude: number | null;
};

export type CustomerImage = {
  id: number;
  name: string;
  mimeType: string;
  src: string;
};

export type CustomerImages = {
  logo: CustomerImage | null;
  interior: CustomerImage[];
  exterior: CustomerImage[];
};

export interface CustomerProfileResponse {
  status: string;
  results: CustomerProfileRow[];
  images?: CustomerImages;
  error?: string;
  imageError?: string;
}

// Row จาก GET /api/customer-info/accounts — บัญชีลูกค้าที่ลิงก์กัน
// (CustID ตรงกัน หรือ xRefCustomer_c ชี้มาที่ CustID เดียวกัน)
// สำหรับ dialog "สลับบัญชี" ใน CustomerHero
export type CustomerAccountRow = {
  CustID: string;
  Name: string;
  xFullName_c: string | null;
};

export interface CustomerAccountsResponse {
  status: string;
  results: CustomerAccountRow[];
  error?: string;
}
