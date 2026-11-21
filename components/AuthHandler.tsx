"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  setCustomerAccessToken,
  setPtgSystemLink,
  setCustomerInfo,
  setViewedCustomerId,
  setStaffViewMode,
  notifyCustomerSessionChanged,
  getAuthUser,
} from "@/lib/auth";
import { BASE_PATH, LOGIN_URL, img } from "@/lib/env";

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
  UserType?: "EMP" | "CUS";
}

const AUTH_STORAGE_KEY = "ptg-auth-user";
const TOKEN_COOKIE = "ptg-customer-token";
const USER_COOKIE = "ptg-customer-user";

function setCookie(name: string, value: string, days = 1) {
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

// ?redirect=...&external=false → path ภายในระบบ เช่น truck-list → /truck-list/
// ?redirect=...&external=true  → URL ภายนอก (อนุญาตเฉพาะ http/https)
function resolveRedirect(
  redirect: string | null,
  external: boolean,
): { external: boolean; url: string } | null {
  const value = redirect?.trim();
  if (!value) return null;

  if (external) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:"
        ? { external: true, url: url.href }
        : null;
    } catch {
      return null;
    }
  }

  // กัน protocol-relative (//evil.com), backslash และ scheme ใด ๆ
  if (/[\\]|:\/\//.test(value)) return null;
  const match = value.match(/^([^?#]*)(.*)$/)!;
  const path = match[1].replace(/^\/+|\/+$/g, "");
  return { external: false, url: `/${path ? `${path}/` : ""}${match[2]}` };
}

export default function AuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  // เจ้าหน้าที่ login ในนามลูกค้า: ?token=...&cid={custID}
  const staffCid = searchParams.get("cid")?.trim() || null;
  const redirectParam = searchParams.get("redirect");
  const externalParam =
    searchParams.get("external")?.trim().toLowerCase() === "true";
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      // No login token in the URL — if there's no stored session either,
      // this visitor is unauthenticated, so send them to the login page.
      if (!getAuthUser()) {
        setStatus("loading");
        setMessage("กำลังไปยังหน้าเข้าสู่ระบบ...");
        window.location.href = LOGIN_URL;
      }
      return;
    }

    let cancelled = false;

    async function validate() {
      setStatus("loading");
      setMessage("กำลังตรวจสอบสิทธิ์ผู้ใช้งาน...");

      try {
        const response = await fetch(
          `${BASE_PATH}/api/auth/validate/?token=${token}`,
        );
        const data: AuthenUserInfo = await response.json();

        if (cancelled) return;

        // เจ้าหน้าที่สวมสิทธิ์: token ไม่มี custID — ใช้ &cid แทน
        const custID = staffCid ?? data.custID?.trim();
        const missingUserData =
          !data.username?.trim() || !data.personCode?.trim() || !custID;

        if (data.response_code !== 200 || data.isExpire || missingUserData) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          removeCookie(TOKEN_COOKIE);
          removeCookie(USER_COOKIE);
          setStatus("error");
          setMessage(
            data.isExpire
              ? "ลิงก์เข้าใช้งานหมดอายุ กำลังไปยังหน้าเข้าสู่ระบบ..."
              : missingUserData
                ? "ข้อมูลผู้ใช้ไม่ครบถ้วน กรุณาเข้าสู่ระบบใหม่อีกครั้ง"
                : data.response_desc ||
                  "ไม่สามารถเข้าใช้งานได้ กรุณาลองใหม่อีกครั้ง",
          );
          if (data.isExpire) {
            window.setTimeout(() => {
              window.location.href = LOGIN_URL;
            }, 2000);
          }
          return;
        }

        // โหมดเจ้าหน้าที่ (cid) — อนุญาตเฉพาะ token ที่เป็นเจ้าหน้าที่ (EMP)
        // ลูกค้า (CUS) ไม่สามารถใช้ cid เข้าสู่ระบบในนามลูกค้ารายอื่นได้

        if (staffCid && data.UserType !== "EMP") {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          removeCookie(TOKEN_COOKIE);
          removeCookie(USER_COOKIE);
          setStatus("error");
          setMessage("ไม่มีสิทธิ์เข้าใช้งานในนามลูกค้า");
          return;
        }

        // ตรวจสอบว่ารหัสลูกค้ามีอยู่จริงผ่าน customer search API
        // ก่อนเข้าสู่ระบบในนามลูกค้า
        if (staffCid) {
          const searchRes = await fetch(`${BASE_PATH}/api/customer/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ searchTerm: staffCid }),
          });
          const searchData = (await searchRes.json()) as {
            success?: boolean;
            data?: Record<string, unknown> | null;
          };
          if (
            cancelled ||
            !searchRes.ok ||
            !searchData.success ||
            !searchData.data
          ) {
            if (!cancelled) {
              setStatus("error");
              setMessage(`ไม่พบข้อมูลลูกค้า ${staffCid}`);
            }
            return;
          }
        }

        // เก็บ custID ลูกค้าแยกต่างหาก และให้ขั้นตอนถัดไปทำงานด้วย
        // รหัสลูกค้าเหมือนลูกค้า login เอง (null = เคลียร์ค่าเดิม)
        const payload = { ...data, token };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
        setCookie(TOKEN_COOKIE, token!);
        setCookie(USER_COOKIE, JSON.stringify(data));
        localStorage.removeItem("ptg-session-expires-at");
        localStorage.setItem("ptg-session-last-activity", String(Date.now()));
        setStaffViewMode(Boolean(staffCid));
        setViewedCustomerId(staffCid);

        setStatus("success");
        setMessage(`ยินดีต้อนรับ ${data.personName || data.custName || ""}`);

        // Navigate immediately so the static layout renders without
        // waiting for the approve-link round trip (customer-info +
        // createApproveLink can take a while).
        const target = resolveRedirect(redirectParam, externalParam);
        if (target?.external) {
          window.location.href = target.url;
        } else {
          router.push(target?.url ?? "/");
        }

        // Step 1-3: Generate CustomerAccessToken (JWT), fetch ResaleID,
        // and call createApproveLink. Runs in the background — the page
        // doesn't need to wait for this to finish. Store JWT and link UUID
        // once it resolves. Delayed slightly so it doesn't compete for
        // connections with the page's critical requests on load.
        window.setTimeout(() => {
          // Intentionally not gated on `cancelled`: this writes to
          // localStorage (no component state) and must still run after
          // router.push("/") re-runs this effect.
          fetch(`${BASE_PATH}/api/approve-link/ptg-system/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: data.username,
              personName: data.personName,
              custID,
              custName: staffCid ? "" : data.custName,
            }),
          })
            .then((res) => res.json())
            .then((approveData) => {
              if (approveData.success) {
                if (approveData.warning)
                  console.warn(
                    "[AuthHandler] approve-link degraded:",
                    approveData.warning,
                  );
                if (approveData.token)
                  setCustomerAccessToken(approveData.token);
                if (approveData.link) setPtgSystemLink(approveData.link);
                if (approveData.customerInfo)
                  setCustomerInfo(approveData.customerInfo);
                // Notify subscribers (CustomerPointsContext, payment-list,
                // etc.) that customer session data was just persisted, so
                // they can re-read from localStorage without waiting for a
                // page reload.
                notifyCustomerSessionChanged();
              } else {
                console.error(
                  "[AuthHandler] approve-link failed:",
                  approveData.error,
                );
              }
            })
            .catch((approveError) => {
              console.error("[AuthHandler] approve-link error:", approveError);
            });
        }, 1500);
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
        );
      }
    }

    validate();

    return () => {
      cancelled = true;
    };
  }, [token, staffCid, redirectParam, externalParam, router]);

  if (!token) return null;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="spinner-container">
              <div className="spinner"></div>
              <Image
                src={img("/logo/logo.svg")}
                alt="Logo"
                width={60}
                height={15}
                className="spinner-logo"
              />
            </div>
          </div>
          <p className="text-gray-600 animate-pulse">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {status === "success" && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 shadow border border-green-100">
          {message}
        </div>
      )}
      {status === "error" && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 shadow border border-red-100">
          {message}
        </div>
      )}
    </div>
  );
}
