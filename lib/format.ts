/** วันที่แบบไทยเต็ม เช่น "21 กันยายน 2569" (Intl th-TH ให้ปี พ.ศ. อยู่แล้ว) */
export function formatThaiLongDate(
  value: Date | string | null | undefined,
): string {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "-";
  }
}

/** วันที่แบบ DD/MM/YYYY (ค.ศ.) ตามที่ใช้ในใบนำฝากธนาคาร */
export function formatSlashDate(
  value: Date | string | null | undefined,
): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const day = `${date.getDate()}`.padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

/** YYYY-MM-DD ตามเวลาท้องถิ่น (ใช้เป็นค่า input[type=date] และส่งขึ้น API) */
export function toDateInputValue(date: Date = new Date()): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** HH:mm ตามเวลาท้องถิ่น */
export function toTimeInputValue(date: Date = new Date()): string {
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
}

/** เลขบัญชี VAN 10 หลัก -> 4570-1-0200-2 */
export function formatVanNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10
    ? `${digits.slice(0, 4)}-${digits.slice(4, 5)}-${digits.slice(5, 9)}-${digits.slice(9)}`
    : value;
}

/**
 * เลขประจำตัวผู้เสียภาษี 13 หลัก -> 0-8035-60001-91-1
 * masked = true จะปิดบัง 2 กลุ่มท้าย -> 0-8035-60001-xx-x
 */
export function formatTaxId(
  value: string | null | undefined,
  masked = false,
): string {
  const digits = (value ?? "").replace(/\D/g, "");
  if (digits.length !== 13) return value?.trim() || "-";
  const groups = [
    digits.slice(0, 1),
    digits.slice(1, 5),
    digits.slice(5, 10),
    masked ? "xx" : digits.slice(10, 12),
    masked ? "x" : digits.slice(12),
  ];
  return groups.join("-");
}
