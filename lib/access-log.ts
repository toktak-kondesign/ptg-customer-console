import { prisma } from "@/lib/prisma";

export type AccessLogAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "CANCEL"
  | "VIEW";

export interface AccessLogEntry {
  /** รหัสลูกค้าที่ทำรายการ/ถูกกระทำ */
  custID?: string | null;
  /** user ที่ login ทำรายการ */
  username?: string | null;
  /** ระบบ/หน้าที่ทำรายการ เช่น 'payment-list', 'truck-list' */
  module: string;
  action: AccessLogAction;
  /** รายละเอียดกิจกรรม — ห้ามใส่ข้อมูล sensitive (OTP, token, password) */
  detail?: string | null;
  /** เลขอ้างอิง เช่น Runno, IDCode, CardID */
  refNo?: string | null;
  result?: "SUCCESS" | "FAIL";
  errorMessage?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

const truncate = (value: string | null | undefined, max: number) =>
  value ? value.slice(0, max) : null;

/** ดึง client IP จาก request headers (pattern เดียวกับ car-card/create) */
export function getClientIp(request: Request): string | null {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null
  );
}

/**
 * บันทึก access log ลง dbo.tbCustomerAccessLog (DBWEBPTG)
 * Fire-and-forget — catch error ภายในเสมอ ไม่ throw กลับ
 * เพื่อไม่ให้ logging ทำให้ request หลักล้มเหลว
 */
export function logCustomerAccess(entry: AccessLogEntry): void {
  prisma
    .$executeRaw`
      INSERT INTO dbo.tbCustomerAccessLog
        (CustID, Username, Module, ActionName, ActionDetail, RefNo,
         Result, ErrorMessage, IPAddress, UserAgent)
      VALUES
        (${truncate(entry.custID, 20)},
         ${truncate(entry.username, 50)},
         ${truncate(entry.module, 50)},
         ${truncate(entry.action, 20)},
         ${truncate(entry.detail, 500)},
         ${truncate(entry.refNo, 50)},
         ${entry.result ?? "SUCCESS"},
         ${truncate(entry.errorMessage, 500)},
         ${truncate(entry.ipAddress, 45)},
         ${truncate(entry.userAgent, 300)})
    `
    .catch((error) => {
      console.error("[access-log] failed to write log:", error);
    });
}
