const THAI_CONSONANTS = "ก-ฮ";

// รูปแบบป้ายทะเบียนไทย (ตัดช่องว่าง/ขีดออกก่อนตรวจ):
//  - ป้ายรถบรรทุก/ธุรกิจ: เลขนำหน้า 2 หลัก + "-" + เลข 4 หลัก   เช่น 80-1234
//  - ป้ายทั่วไป: [เลข 1-2 หลัก] + พยัญชนะ 1-2 ตัว + เลข 1-4 หลัก  เช่น 1กก1234, กข123
const PLATE_PATTERNS = [
  /^\d{2}-\d{4}$/,
  new RegExp(`^\\d{0,2}[${THAI_CONSONANTS}]{1,2}\\d{1,4}$`),
];

export const normalizePlate = (raw: string) =>
  raw.trim().replace(/\s+/g, "").replace(/[‐-―]/g, "-");

export const isValidThaiPlate = (raw: string) => {
  const plate = normalizePlate(raw);
  if (PLATE_PATTERNS[0].test(plate)) return true;
  return PLATE_PATTERNS[1].test(plate.replace(/-/g, ""));
};
