const THAI_CONSONANTS = "ก-ฮ";

// รูปแบบป้ายทะเบียนรถไทย (ตัดช่องว่างออกก่อนตรวจ) — บังคับตัวย่อจังหวัด 2 ตัวอักษรท้ายป้าย:
//  - เลขนำหน้า 2 หลัก + เลข 4 หลัก (มีขีดหรือไม่ก็ได้) + จังหวัด  เช่น 83-1193 นศ, 80-7786ปน
//  - [เลข 1-2 หลัก] + พยัญชนะ 1-2 ตัว + เลข 1-4 หลัก + จังหวัด  เช่น 1ขค 1228 กท
const PLATE_PATTERNS = [
  new RegExp(`^\\d{2}-?\\d{4}[${THAI_CONSONANTS}]{2}$`),
  new RegExp(`^\\d{0,2}[${THAI_CONSONANTS}]{1,2}\\d{1,4}[${THAI_CONSONANTS}]{2}$`),
];

export const normalizePlate = (raw: string) =>
  raw.trim().replace(/\s+/g, "").replace(/[‐-―]/g, "-");

export const isValidThaiPlate = (raw: string) => {
  const plate = normalizePlate(raw);
  return PLATE_PATTERNS.some((pattern) => pattern.test(plate));
};
