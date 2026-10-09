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
