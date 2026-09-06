"use client";

import { useEffect, useRef, useState } from "react";
import { useCustomerPoints } from "@/lib/CustomerPointsContext";
import { formatPoint } from "@/lib/pointPrecision";
import type { AuthenUserInfo } from "@/lib/auth";

const CUSTOMER_INFO_URL =
  "https://depwn2021.ptg.co.th/ptgcustomer/CustomerInfo";
const CUSTOMER_SERVICE_URL = "https://depwn2021.ptg.co.th/PTGWeb/customer";
const CUSTOMER_CART_URL = "https://depwn2021.ptg.co.th/Site/mycart";
const CUSTOMER_ORDER_HISTORY_URL = "https://depwn2021.ptg.co.th/Site/order";

const menuLinkClass =
  "flex items-center gap-2.5 px-3 py-2 rounded-md bg-transparent text-[0.8rem] whitespace-nowrap transition no-underline text-[#cccccc] hover:text-white";

interface CustomerMenuProps {
  customer?: AuthenUserInfo | null;
  isLoading?: boolean;
  onLogout?: () => void;
}

export default function CustomerMenu({
  customer,
  isLoading = false,
  onLogout,
}: CustomerMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    goldPoints,
    silverPoints,
    isLoading: isPointsLoading,
  } = useCustomerPoints();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400" />
        </span>
        <span className="text-[0.8rem] text-slate-900 hidden sm:inline">
          กำลังโหลด...
        </span>
      </div>
    );
  }

  const displayName = customer
    ? customer.custName || customer.personName || customer.username || ""
    : "";

  if (!customer) {
    return (
      <div className="pl-2 sm:pl-3 border-l border-slate-200">
        <a
          href="https://depwn2021.ptg.co.th/Site/Authentication/login"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-[0.8rem] font-semibold rounded-md transition"
        >
          เข้าสู่ระบบ
        </a>
      </div>
    );
  }

  return (
    <div
      className="relative pl-2 sm:pl-3 border-l border-slate-200"
      ref={menuRef}
    >
      <button
        type="button"
        onClick={() => setShowMenu((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={showMenu}
        className="flex items-center gap-1.5 sm:gap-2 p-1 rounded hover:bg-slate-50 transition text-left"
      >
        <span className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-lg shrink-0">
          👤
        </span>
        <span className="leading-tight hidden sm:inline">
          <div className="text-[0.8em] text-slate-900 max-w-[180px] truncate">
            {displayName}
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              color: "#64748B",
              whiteSpace: "nowrap",
            }}
          >
            Gold :{" "}
            <span style={{ color: "#B7791F", fontWeight: 600 }}>
              {isPointsLoading ? "..." : formatPoint(goldPoints)}
            </span>{" "}
            | Silver :{" "}
            <span style={{ color: "#64748B", fontWeight: 600 }}>
              {isPointsLoading ? "..." : formatPoint(silverPoints)}
            </span>
          </div>
        </span>
        <span
          className={`text-slate-500 text-[0.7em] transition-transform shrink-0 ${
            showMenu ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {showMenu && (
        <div
          id="customer-menu"
          role="menu"
          aria-label="เมนูบัญชีผู้ใช้"
          className="absolute top-full right-0 mt-2 p-1.5 min-w-[180px] bg-[#444444] text-[#cccccc] rounded-lg shadow-2xl z-50"
        >
          <a
            href={CUSTOMER_INFO_URL}
            className={menuLinkClass}
            onClick={() => setShowMenu(false)}
          >
            ข้อมูลทั่วไป
          </a>
          <a
            href={CUSTOMER_SERVICE_URL}
            className={menuLinkClass}
            onClick={() => setShowMenu(false)}
          >
            ระบบบริการลูกค้า
          </a>
          <a
            href={CUSTOMER_CART_URL}
            className={menuLinkClass}
            onClick={() => setShowMenu(false)}
          >
            ตะกร้าของฉัน
          </a>
          <a
            href={CUSTOMER_ORDER_HISTORY_URL}
            className={menuLinkClass}
            onClick={() => setShowMenu(false)}
          >
            ประวัติการสั่งซื้อ
          </a>
          {onLogout && (
            <>
              <div className="h-px bg-slate-600 my-1.5" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setShowMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md bg-transparent text-left text-[0.8rem] whitespace-nowrap transition text-red-300 hover:text-white"
              >
                ออกจากระบบ
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
