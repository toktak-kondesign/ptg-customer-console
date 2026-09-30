import type { CustomerImages } from "@/interfaces/customer";
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
  caretakerCode: string;
  caretakerName: string;
  caretakerPhone: string;
  images: CustomerImages;
}

export const mockCustomer: CustomerProfile = {
  id: "",
  type: "Other",
  name: "",
  taxId: "",
  addressLine1: "",
  addressLine2: "",
  addressFull:
    "",
  lat: 8.155269489364073,
  lng: 99.699725254207192,
  goldPoints: 10,
  silverPoints: 0,
  phone: "-",
  email: "-",
  line: "-",
  ongoingProjects: 14,
  caretakerCode: "",
  caretakerName: "",
  caretakerPhone: "",
  images: { logo: null, interior: [], exterior: [] },
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

function toCoordinate(raw: string): number | null {
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function resolveCustomerProfile(
  customerId: string,
  info: Record<string, unknown> | null,
  points: { goldPoints: number; silverPoints: number },
  images: CustomerImages = mockCustomer.images,
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
    getField(info, [
      "CusName",
      "cusName",
      "CustomerName",
      "customerName",
      "Name",
      "name",
    ]) || mockCustomer.name;
  const lat = toCoordinate(getField(info, ["Latitude", "latitude", "lat"]));
  const lng = toCoordinate(
    getField(info, ["Longitude", "longitude", "long", "lng"]),
  );

  return {
    ...mockCustomer,
    id: customerId || mockCustomer.id,
    type:
      getField(info, ["GroupDesc", "groupDesc", "CustType", "custType"]) ||
      mockCustomer.type,
    name,
    taxId:
      getField(info, ["ResaleID", "resaleID", "TaxID", "taxId"]) ||
      mockCustomer.taxId,
    addressFull: addressFull || mockCustomer.addressFull,
    addressLine1: streetParts.join(" ") || mockCustomer.addressLine1,
    addressLine2: provinceParts.join(" ") || mockCustomer.addressLine2,
    lat: lat ?? mockCustomer.lat,
    lng: lng ?? mockCustomer.lng,
    phone:
      getField(info, [
        "PhoneNum",
        "phoneNum",
        "Phone",
        "phone",
        "Tel",
        "Tel1",
        "tel1",
      ]) || mockCustomer.phone,
    line:
      getField(info, ["LineID", "lineID", "lineId", "Line"]) ||
      mockCustomer.line,
    caretakerCode:
      getField(info, ["SalesRepCode", "salesRepCode"]) ||
      mockCustomer.caretakerCode,
    caretakerName:
      getField(info, [
        "PersonName",
        "personName",
        "CaretakerName",
        "caretakerName",
      ]) || mockCustomer.caretakerName,
    caretakerPhone:
      getField(info, [
        "OfficePhone",
        "officePhone",
        "CaretakerPhone",
        "caretakerPhone",
      ]) || mockCustomer.caretakerPhone,
    goldPoints: points.goldPoints,
    silverPoints: points.silverPoints,
    images,
  };
}
