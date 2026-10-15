export interface TruckCard {
  Row1: number;
  RunID: number;
  CardID: string;
  CarRegister: string;
  CustID: string;
  Remark: string;
  DateCreated: string;
  LastUseCard: string;
  IsInActive: number;
}

// Mock rows shaped like DBPTG_Logistic.tbCardTemp (IsInActive <> 1).
// Replace with API: select ROW_NUMBER() OVER(PARTITION BY CustID ORDER BY CarRegister) AS Row1, *
// from tbCardTemp where CustID = @custID and IsInActive <> 1
const company = "บริษัท ซี.ซี.จักรกลและก่อสร้าง จำกัด";
const plates = ["81-1194", "81-1216", "81-4185", "81-4186", "81-4474"];

export const mockTrucks: TruckCard[] = plates.map((CarRegister, i) => ({
  Row1: i + 1,
  RunID: 2727 + i,
  CardID: `000264427${i + 3}`,
  CarRegister,
  CustID: "C2309241",
  Remark: company,
  DateCreated: "2023-06-05 08:55:18.730",
  LastUseCard: "",
  IsInActive: 0,
}));

// สินค้าที่เลือกรับได้ใน dialog "ขอบัตรรถรับสินค้าชั่วคราว" — mock รอ API จริง
export interface RequestProductItem {
  docNo: string;
  name: string;
  available: number;
  unit: string;
}

export const mockRequestProducts: RequestProductItem[] = [
  {
    docNo: "685199",
    name: "ศิลาเหลี่ยม 30*30*6.00 ซม. สีเทา",
    available: 2184,
    unit: "ก้อน",
  },
  { docNo: "289739", name: 'หิน 3/4"', available: 52.27, unit: "คิว" },
  { docNo: "290423", name: 'หิน 1"', available: 79.16, unit: "คิว" },
  { docNo: "290991", name: 'หิน 3/4"', available: 227.6, unit: "คิว" },
];
