const THAI_CONSONANTS = "ก-ฮ";

// รูปแบบป้ายทะเบียนรถบรรทุกไทย (ตัดช่องว่างออกก่อนตรวจ):
//  - เลขนำหน้า 2 หลัก + เลข 4 หลัก (มีขีดหรือไม่ก็ได้) + ตัวย่อจังหวัดท้ายป้าย (ถ้ามี)
//    เช่น 82-5941, 810684, 83-1193 นศ, 80-7786ปน
//  - [เลข 1-2 หลัก] + พยัญชนะ 1-2 ตัว + เลข 1-4 หลัก  เช่น 1ขค 1228, 1กก1234
const PLATE_PATTERNS = [
  new RegExp(`^\\d{2}-?\\d{4}[${THAI_CONSONANTS}]{0,3}$`),
  new RegExp(`^\\d{0,2}[${THAI_CONSONANTS}]{1,2}\\d{1,4}$`),
];

export const normalizePlate = (raw: string) =>
  raw.trim().replace(/\s+/g, "").replace(/[‐-―]/g, "-");

export const isValidThaiPlate = (raw: string) => {
  const plate = normalizePlate(raw);
  return PLATE_PATTERNS.some((pattern) => pattern.test(plate));
};
