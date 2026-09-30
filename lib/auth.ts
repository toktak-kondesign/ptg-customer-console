export interface AuthenUserInfo {
  response_code: number;
  response_desc: string;
  response_ref: string;
  isExpire: boolean;
  personCode: string;
  preName: string;
  personName: string;
  personPosition: string;
  username: string;
  custID: string;
  custName: string;
}

export interface UserSession {
  user: AuthenUserInfo;
  token: string;
  isLoggedIn: boolean;
}

const STORAGE_KEYS = {
  AUTH_USER: "ptg-auth-user",
  CUSTOMER_TOKEN: "ptg-customer-token",
  CUSTOMER_USER: "ptg-customer-user",
  CUSTOMER_ACCESS_TOKEN: "ptg-customer-access-token",
  PTG_SYSTEM_LINK: "ptg-system-link",
  OUTSOURCE_SYSTEM_LINK: "outsource-system-link",
  CUSTOMER_INFO: "ptg-customer-info",
  // รหัสลูกค้าที่กำลังดูอยู่ — ถูกเขียนโดยฝั่ง staff console และฟีเจอร์สลับบัญชี
  // (CustomerPointsContext อ่าน key นี้เพื่อโหลดคะแนนของบัญชีที่เลือก)
  VIEWED_CUSTOMER_ID: "ptg_staff_cid",
} as const;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[2]);
  } catch {
    return match[2];
  }
}

export function getAuthUser(): AuthenUserInfo | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (stored) {
      const parsed = JSON.parse(stored) as AuthenUserInfo & { token?: string };
      if (parsed.response_code === 200 && !parsed.isExpire) {
        return parsed;
      }
    }

    const cookieUser = getCookie(STORAGE_KEYS.CUSTOMER_USER);
    if (cookieUser) {
      const parsed = JSON.parse(cookieUser) as AuthenUserInfo;
      if (parsed.response_code === 200 && !parsed.isExpire) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error reading auth user:", error);
  }

  return null;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as { token?: string };
      if (parsed.token) return parsed.token;
    } catch {
      // ignore
    }
  }

  return getCookie(STORAGE_KEYS.CUSTOMER_TOKEN);
}

export function isLoggedIn(): boolean {
  return getAuthUser() !== null;
}

export function getCustomerAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.CUSTOMER_ACCESS_TOKEN);
}

export function setCustomerAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_ACCESS_TOKEN, token);
}

export function getPtgSystemLink(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.PTG_SYSTEM_LINK);
}

export function setPtgSystemLink(link: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PTG_SYSTEM_LINK, link);
}

export function getOutsourceSystemLink(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.OUTSOURCE_SYSTEM_LINK);
}

export function setOutsourceSystemLink(link: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.OUTSOURCE_SYSTEM_LINK, link);
}

export const CUSTOMER_SESSION_CHANGED_EVENT = "ptg-customer-session-changed";

export function notifyCustomerSessionChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CUSTOMER_SESSION_CHANGED_EVENT));
}

export function getCustomerInfo(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMER_INFO);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function pickField(
  source: Record<string, unknown> | null,
  names: string[],
): string {
  if (!source) return "";
  const keys = Object.keys(source);
  for (const name of names) {
    const key = keys.find((k) => k.toLowerCase() === name.toLowerCase());
    if (key && source[key] !== null && source[key] !== undefined) {
      const value = String(source[key]).trim();
      if (value) return value;
    }
  }
  return "";
}

// รหัสลูกค้าที่กำลังถูกดูอยู่ — เขียนโดยฟีเจอร์ "สลับบัญชี" หรือ staff console
// ส่ง null เพื่อเคลียร์กลับไปใช้บัญชีของ user ที่ login
export function getViewedCustomerId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEYS.VIEWED_CUSTOMER_ID)?.trim() ?? "";
}

export function setViewedCustomerId(custId: string | null): void {
  if (typeof window === "undefined") return;
  if (custId) {
    localStorage.setItem(STORAGE_KEYS.VIEWED_CUSTOMER_ID, custId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.VIEWED_CUSTOMER_ID);
  }
  notifyCustomerSessionChanged();
}

// รหัสลูกค้าสำหรับ route /customer/[customerId]
// ถ้ามีการเลือกบัญชีผ่าน "สลับบัญชี" (หรือ staff view) ให้ใช้ตัวนั้นก่อน
// field name ใน auth user / customer-info response ไม่คงที่ระหว่าง
// environment (custID / custId / CustID) จึงค้นหาแบบ case-insensitive
// และ fallback ไปที่ resaleID ของ customer-info ด้วย
export function getSessionCustomerId(): string {
  const viewed = getViewedCustomerId();
  if (viewed) return viewed;
  const user = getAuthUser();
  const fromUser = pickField(
    user as unknown as Record<string, unknown> | null,
    ["custID", "custId", "customerID", "customerId"],
  );
  if (fromUser) return fromUser;
  return pickField(getCustomerInfo(), [
    "custID",
    "custId",
    "customerID",
    "customerId",
    "resaleID",
  ]);
}

export function setCustomerInfo(info: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_INFO, JSON.stringify(info));
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.PTG_SYSTEM_LINK);
  localStorage.removeItem(STORAGE_KEYS.OUTSOURCE_SYSTEM_LINK);
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_INFO);
  localStorage.removeItem(STORAGE_KEYS.VIEWED_CUSTOMER_ID);

  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `${STORAGE_KEYS.CUSTOMER_TOKEN}=; path=/; ${expire}; SameSite=Lax`;
  document.cookie = `${STORAGE_KEYS.CUSTOMER_USER}=; path=/; ${expire}; SameSite=Lax`;
}
