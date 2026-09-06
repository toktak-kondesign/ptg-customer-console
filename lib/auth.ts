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

export function clearAuth(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);

  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `${STORAGE_KEYS.CUSTOMER_TOKEN}=; path=/; ${expire}; SameSite=Lax`;
  document.cookie = `${STORAGE_KEYS.CUSTOMER_USER}=; path=/; ${expire}; SameSite=Lax`;
}
