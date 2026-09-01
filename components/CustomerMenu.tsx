"use client";

import { useEffect, useRef, useState } from "react";

const CUSTOMER_INFO_URL =
  "https://depwn2021.ptg.co.th/ptgcustomer/CustomerInfo";
const CUSTOMER_SERVICE_URL = "https://depwn2021.ptg.co.th/PTGWeb/customer";
const CUSTOMER_CART_URL = "https://depwn2021.ptg.co.th/Site/mycart";
const CUSTOMER_ORDER_HISTORY_URL = "https://depwn2021.ptg.co.th/Site/order";

const menuLinkClass =
  "flex items-center gap-2.5 px-3 py-2 rounded-md bg-transparent text-[0.8rem] whitespace-nowrap transition no-underline text-[#cccccc] hover:text-white";

export default function CustomerMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
            บริษัท ทดสอบ จำกัด
          </div>
          <div className="text-[0.7em] text-slate-500 whitespace-nowrap">
            Gold: <span className="text-amber-600 font-semibold">0</span>
            {" | "}
            Silver: <span className="text-slate-600 font-semibold">75</span>
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
          <button
            type="button"
            role="menuitem"
            onClick={() => setShowMenu(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md bg-transparent text-left text-[0.8rem] whitespace-nowrap transition text-[#cccccc] hover:text-white"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
