"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  setCustomerAccessToken,
  setPtgSystemLink,
  setCustomerInfo,
  notifyCustomerSessionChanged,
} from "@/lib/auth";

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

export default function AuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function validate() {
      setStatus("loading");
      setMessage("กำลังตรวจสอบสิทธิ์ผู้ใช้งาน...");

      try {
        const response = await fetch(`/api/auth/validate?token=${token}`);
        const data: AuthenUserInfo = await response.json();

        if (cancelled) return;

        if (data.response_code !== 200 || data.isExpire) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          removeCookie(TOKEN_COOKIE);
          removeCookie(USER_COOKIE);
          setStatus("error");
          setMessage(
            data.response_desc || "ไม่สามารถเข้าใช้งานได้ กรุณาลองใหม่อีกครั้ง",
          );
          return;
        }

        const payload = { ...data, token };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
        setCookie(TOKEN_COOKIE, token!);
        setCookie(USER_COOKIE, JSON.stringify(data));

        setStatus("success");
        setMessage(`ยินดีต้อนรับ ${data.personName || data.custName || ""}`);

        // Navigate immediately so the static layout renders without
        // waiting for the approve-link round trip (customer-info +
        // createApproveLink can take a while).
        router.push("/");

        // Step 1-3: Generate CustomerAccessToken (JWT), fetch ResaleID,
        // and call createApproveLink. Runs in the background — the page
        // doesn't need to wait for this to finish. Store JWT and link UUID
        // once it resolves.
        fetch("/api/approve-link/ptg-system", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: data.username,
            personName: data.personName,
            custID: data.custID,
            custName: data.custName,
          }),
        })
          .then((res) => res.json())
          .then((approveData) => {
            if (approveData.success) {
              if (approveData.token) setCustomerAccessToken(approveData.token);
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
  }, [token, router]);

  if (!token) return null;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="spinner-container">
              <div className="spinner"></div>
              <Image
                src="/logo/logo.svg"
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
