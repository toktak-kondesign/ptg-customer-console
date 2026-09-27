import { floorPointToOneDecimal } from "@/lib/pointPrecision";

export interface CustomerProfile {
  id: string;
  type: string;
  name: string;
  taxId: string;
  addressLine1: string;
  addressLine2: string;
  addressFull: string;
  lat: number;
  lng: number;
  goldPoints: number;
  silverPoints: number;
  phone: string;
  email: string;
  line: string;
  ongoingProjects: number;
  caretakerName: string;
  caretakerPhone: string;
}

export const mockCustomer: CustomerProfile = {
  id: "C2005794",
  type: "Other",
  name: "1 หมู่ที่ 1 ตำบลสะมาย อำเภอทุ่งสง จังหวัดนครศรีธรรมราช 80110",
  taxId: "1111111111111",
  addressLine1: "1 หมู่ที่ 1 ตำบลสะมาย อำเภอทุ่งสง",
  addressLine2: "จังหวัดนครศรีธรรมราช 80110",
  addressFull:
    "1 หมู่ที่ 1 ตำบลสะมาย อำเภอทุ่งสง จังหวัดนครศรีธรรมราช 80110",
  lat: 8.155269489364073,
  lng: 99.699725254207192,
  goldPoints: 10,
  silverPoints: 0,
  phone: "081-1111111",
  email: "cs@ptg.co.th",
  line: "0872794306",
  ongoingProjects: 14,
  caretakerName: "นางสาววาโชติกา สิงห์พันธ์ (น้อย)",
  caretakerPhone: "0910350148",
};

function getField(
  info: Record<string, unknown> | null,
  names: string[],
): string {
  if (!info) return "";
  const keys = Object.keys(info);
  for (const name of names) {
    const key = keys.find((k) => k.toLowerCase() === name.toLowerCase());
    if (key && info[key] !== null && info[key] !== undefined) {
      return String(info[key]).trim();
    }
  }
  return "";
}

export function formatPointValue(value: number): string {
  return floorPointToOneDecimal(value).toLocaleString("th-TH", {
    maximumFractionDigits: 1,
  });
}

export function resolveCustomerProfile(
  customerId: string,
  info: Record<string, unknown> | null,
  points: { goldPoints: number; silverPoints: number },
): CustomerProfile {
  const streetParts = [
    getField(info, ["Address1", "address1"]),
    getField(info, ["Address2", "address2"]),
    getField(info, ["Address3", "address3"]),
  ].filter(Boolean);
  const provinceParts = [
    getField(info, ["City", "city"]),
    getField(info, ["State", "state"]),
    getField(info, ["ZipCode", "zipCode", "Zip", "zip"]),
  ].filter(Boolean);
  const addressFull = [...streetParts, ...provinceParts].join(" ");
  const name =
    getField(info, ["CusName", "cusName", "CustomerName", "customerName"]) ||
    mockCustomer.name;

  return {
    ...mockCustomer,
    id: customerId || mockCustomer.id,
    type:
      getField(info, ["GroupDesc", "groupDesc", "CustType", "custType"]) ||
      mockCustomer.type,
    name,
    addressFull: addressFull || mockCustomer.addressFull,
    addressLine1: streetParts.join(" ") || mockCustomer.addressLine1,
    addressLine2: provinceParts.join(" ") || mockCustomer.addressLine2,
    phone:
      getField(info, ["PhoneNum", "phoneNum", "Phone", "phone", "Tel"]) ||
      mockCustomer.phone,
    goldPoints: points.goldPoints,
    silverPoints: points.silverPoints,
  };
}
