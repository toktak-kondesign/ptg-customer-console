"use client";

import { useEffect, useState } from "react";
import type { CustomerAccountRow } from "@/interfaces/customer";
import type { OrderPickerProduct } from "@/interfaces/order-picker";
import {
  CUSTOMER_SESSION_CHANGED_EVENT,
  getAuthUser,
  getSessionCustomerId,
  getViewedCustomerId,
  setViewedCustomerId,
} from "@/lib/auth";
import { refreshCustomerSession } from "@/services/approve-link";
import { getCustomerAccountsService } from "@/services/customer/accounts";
import { getOrderPickerProductsService } from "@/services/customer/order-picker";

type IconName = "user" | "package" | "truck" | "layers";

const ACCOUNT_PREVIEW_COUNT = 6;
const PRODUCTS_PER_PAGE = 20;

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const paths: Record<IconName, string> = {
    user: "M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    package:
      "m12 3 9 4.5v9L12 21l-9-4.5v-9L12 3Zm0 9v9M3 7.5 12 12l9-4.5M7.5 5.25l9 4.5",
    truck:
      "M3 16V5h12v11H3Zm12-8h4l3 5v3h-7M8 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
    layers: "m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5",
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}

function RemainingQuantity({ product }: { product: OrderPickerProduct }) {
  return (
    <div
      className={`flex items-center justify-end gap-3 rounded-full px-3 py-1.5 ${product.isLowStock ? "bg-rose-50 text-rose-700" : "bg-gradient-to-r from-transparent to-blue-100/70 text-[#0754b8]"}`}
    >
      <span className="mr-auto text-xs font-normal text-slate-600 lg:text-[11px]">
        คงเหลือ :
      </span>
      <span className="text-lg font-bold tabular-nums">
        {product.NumToUse.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 20,
        })}
      </span>
      <span
        className={`min-w-12 rounded-full px-2 py-0.5 text-center text-xs font-bold ${product.isLowStock ? "bg-rose-100" : "bg-blue-200/70"}`}
      >
        {product.Unit}
      </span>
    </div>
  );
}

export default function OrderPickerContent() {
  const [accounts, setAccounts] = useState<CustomerAccountRow[]>([]);
  const [custID, setCustID] = useState("");
  const [products, setProducts] = useState<OrderPickerProduct[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [accountsError, setAccountsError] = useState("");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [switching, setSwitching] = useState(false);
  const [accountsExpanded, setAccountsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let controller: AbortController | undefined;
    const load = () => {
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      const current = getSessionCustomerId();
      const base = getAuthUser()?.custID?.trim() || current;
      setCustID(current);
      setAccountsLoading(Boolean(base));
      setAccountsError("");
      if (!base) {
        setAccounts([]);
        return;
      }
      void getCustomerAccountsService(base, signal).then((result) => {
        if (signal.aborted) return;
        setAccountsLoading(false);
        if (result.status === "success") {
          setAccounts(result.results);
        } else {
          setAccounts([]);
          setAccountsError(result.error || "ไม่สามารถโหลดรายการลูกค้าได้");
        }
      });
    };
    load();
    const syncCustomer = () => setCustID(getSessionCustomerId());
    window.addEventListener(CUSTOMER_SESSION_CHANGED_EVENT, syncCustomer);
    return () => {
      controller?.abort();
      window.removeEventListener(CUSTOMER_SESSION_CHANGED_EVENT, syncCustomer);
    };
  }, [retry]);

  useEffect(() => {
    if (switching) return;
    const controller = new AbortController();
    setProducts([]);
    setError("");
    setLoading(Boolean(custID));
    if (custID) {
      void getOrderPickerProductsService(custID, controller.signal).then(
        (result) => {
          if (controller.signal.aborted) return;
          setLoading(false);
          if (result.status === "success") {
            setProducts(result.results);
            setCurrentPage(1);
          } else setError(result.error || "ไม่สามารถโหลดรายการสินค้าได้");
        },
      );
    }
    return () => controller.abort();
  }, [custID, retry, switching]);

  const selectAccount = async (account: CustomerAccountRow) => {
    if (switching || account.CustID === custID) return;
    setSwitching(true);
    setProducts([]);
    setCurrentPage(1);
    const previous = getViewedCustomerId();
    setViewedCustomerId(
      account.CustID === getAuthUser()?.custID?.trim() ? null : account.CustID,
    );
    const refreshed = await refreshCustomerSession();
    if (!refreshed) {
      setViewedCustomerId(previous || null);
      setAccountsError("ไม่สามารถสลับลูกค้าได้ กรุณาลองใหม่");
    }
    setCustID(getSessionCustomerId());
    setSwitching(false);
  };

  const customerName =
    accounts.find((account) => account.CustID === custID)?.Name || custID;
  const firstAccounts = accounts.slice(0, ACCOUNT_PREVIEW_COUNT);
  const selectedOutsidePreview = accounts.find(
    (account) => account.CustID === custID && !firstAccounts.includes(account),
  );
  const visibleAccounts = accountsExpanded
    ? accounts
    : selectedOutsidePreview
      ? [
          ...accounts.slice(0, ACCOUNT_PREVIEW_COUNT - 1),
          selectedOutsidePreview,
        ]
      : firstAccounts;
  const hiddenAccountCount = accounts.length - visibleAccounts.length;
  const totalPages = Math.max(
    1,
    Math.ceil(products.length / PRODUCTS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PRODUCTS_PER_PAGE;
  const pageProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );
  const pageItems: Array<number | "…"> =
    totalPages <= 7
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : safePage <= 4
        ? [1, 2, 3, 4, 5, "…", totalPages]
        : safePage >= totalPages - 3
          ? [
              1,
              "…",
              totalPages - 4,
              totalPages - 3,
              totalPages - 2,
              totalPages - 1,
              totalPages,
            ]
          : [1, "…", safePage - 1, safePage, safePage + 1, "…", totalPages];
  const retryButton = (
    <button
      type="button"
      onClick={() => setRetry((value) => value + 1)}
      className="ml-3 rounded-lg border border-blue-200 bg-white px-3 py-1 text-blue-700 hover:bg-blue-50 focus-visible:outline-blue-600"
    >
      ลองใหม่
    </button>
  );

  return (
    <div className="relative mt-4 rounded-3xl border border-white bg-white/80 p-3 shadow-lg shadow-blue-900/10 sm:p-5">
      <section
        aria-labelledby="customer-selection-title"
        aria-busy={accountsLoading || switching}
        className="mb-5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-white p-2 sm:p-3"
      >
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start">
          <h2
            id="customer-selection-title"
            className="shrink-0 py-3 text-sm font-bold text-[#12366b]"
          >
            เลือกรหัส :
          </h2>
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleAccounts.map((account) => (
              <button
                key={account.CustID}
                type="button"
                aria-pressed={account.CustID === custID}
                disabled={switching}
                onClick={() => void selectAccount(account)}
                className={`group flex min-w-0 items-center gap-3 rounded-2xl border p-3 text-left shadow-sm shadow-blue-900/10 transition duration-200 hover:border-blue-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-wait motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none ${account.CustID === custID ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100" : "border-blue-100 bg-white"}`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-white to-blue-100 text-blue-700 shadow-inner">
                  <Icon name="user" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-sm font-bold text-[#0754b8]">
                    {account.CustID}
                  </span>
                  <span className="mt-0.5 block break-words text-xs text-slate-600">
                    {account.Name}
                  </span>
                </span>
                <span aria-hidden="true" className="text-blue-700">
                  {account.CustID === custID ? "✓" : "⌄"}
                </span>
              </button>
            ))}
          </div>
        </div>
        {accounts.length > ACCOUNT_PREVIEW_COUNT && (
          <div className="flex justify-end px-2 pt-3">
            <button
              type="button"
              aria-expanded={accountsExpanded}
              onClick={() => setAccountsExpanded((expanded) => !expanded)}
              className="rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {accountsExpanded
                ? "แสดงน้อยลง ⌃"
                : `ดูเพิ่มเติม (${hiddenAccountCount}) ⌄`}
            </button>
          </div>
        )}
        {accountsLoading && (
          <p role="status" className="p-3 text-sm text-slate-600">
            กำลังโหลดรายการลูกค้า…
          </p>
        )}
        {accountsError && (
          <div role="alert" className="p-3 text-sm text-rose-700">
            {accountsError}
            {retryButton}
          </div>
        )}
        {!accountsLoading && !accountsError && !accounts.length && (
          <p role="status" className="p-3 text-sm text-slate-600">
            ไม่พบข้อมูลบัญชีลูกค้า กรุณาเข้าสู่ระบบ
          </p>
        )}
      </section>
      <section
        aria-label="รายการสินค้าคงเหลือ"
        aria-busy={loading || switching}
      >
        <div
          aria-hidden="true"
          className="sticky top-4 z-20 hidden grid-cols-[40px_1fr_1.5fr_1.4fr_1fr_1.5fr] items-center gap-3 rounded-2xl border border-blue-400 bg-gradient-to-r from-[#527cbd] via-[#28579f] to-[#0754b8] px-4 py-3 text-xs font-bold text-white shadow-md shadow-blue-900/20 lg:grid"
        >
          <span className="text-center">#</span>
          <span>เลขที่ / รหัสสินค้า</span>
          <span className="flex items-center gap-2">
            <Icon name="package" />
            สินค้า
          </span>
          <span className="flex items-center gap-2">
            <Icon name="user" />
            ลูกค้า
          </span>
          <span className="flex items-center gap-2">
            <Icon name="truck" />
            วิธีรับสินค้า
          </span>
          <span className="flex items-center justify-center gap-2">
            <Icon name="layers" />
            คงเหลือ
          </span>
        </div>
        <ol className="mt-2 space-y-2">
          {pageProducts.map((product, index) => (
            <li
              key={`${product.Company}-${product.OrderNum}-${product.OrderLine}-${product.ItemCode}`}
              className="grid min-w-0 grid-cols-[32px_1fr] items-center gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-white to-[#f5f8ff] p-4 shadow-sm shadow-blue-900/10 transition-shadow hover:border-blue-300 hover:shadow-md motion-reduce:transition-none lg:grid-cols-[40px_1fr_1.5fr_1.4fr_1fr_1.5fr] lg:py-2.5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-100 bg-gradient-to-b from-white to-blue-200 text-sm font-bold text-blue-700 shadow-sm">
                {startIndex + index + 1}
              </span>
              <div className="min-w-0 break-words">
                <span className="text-xs">เลขที่ : </span>
                <strong className="text-sm text-[#0754b8]">
                  {product.ItemCode}
                </strong>
                <span className="inline-block text-[12px] text-slate-500 bg-blue-50 border border-blue-100 rounded-full px-4 py-1">
                  {product.OrderNum ? "SO:" + product.OrderNum : "-"}
                </span>
              </div>
              <div className="col-start-2 flex min-w-0 items-start gap-2 lg:col-auto">
                <Icon name="layers" className="h-5 w-5 text-sky-500" />
                <div className="min-w-0">
                  <p className="break-words text-sm font-bold text-[#12366b]">
                    {product.ItemName}
                  </p>
                  <p className="mt-1 break-words text-[11px] text-slate-500">
                    {product.ProdName}
                  </p>
                </div>
              </div>
              <p className="col-start-2 break-words text-xs text-slate-600 lg:col-auto">
                {customerName}
              </p>
              <p className="col-start-2 flex items-center gap-2 break-words text-xs text-slate-600 lg:col-auto">
                <Icon name="truck" className="h-4 w-4" />
                {product.WorkCus || "-"}
              </p>
              <div className="col-span-2 min-w-0 lg:col-span-1">
                <RemainingQuantity product={product} />
              </div>
            </li>
          ))}
        </ol>
        {products.length > PRODUCTS_PER_PAGE && (
          <nav
            aria-label="เปลี่ยนหน้ารายการสินค้า"
            className="mt-4 flex flex-col items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/90 px-4 py-3 text-sm sm:flex-row"
          >
            <p className="text-xs text-slate-600">
              แสดง {startIndex + 1}–{startIndex + pageProducts.length} จาก{" "}
              {products.length.toLocaleString("th-TH")} รายการ
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                aria-label="หน้าก่อนหน้า"
                disabled={safePage === 1}
                onClick={() => setCurrentPage(safePage - 1)}
                className="rounded-xl border border-blue-200 px-3 py-1.5 font-bold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ‹
              </button>
              {pageItems.map((page, index) =>
                page === "…" ? (
                  <span
                    key={`ellipsis-${index}`}
                    aria-hidden="true"
                    className="px-1 text-slate-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    aria-label={`ไปหน้า ${page}`}
                    aria-current={page === safePage ? "page" : undefined}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-xl px-2 font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${page === safePage ? "bg-[#0754b8] text-white shadow-md shadow-blue-900/20" : "border border-blue-100 bg-white text-blue-700 hover:bg-blue-50"}`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                type="button"
                aria-label="หน้าถัดไป"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(safePage + 1)}
                className="rounded-xl border border-blue-200 px-3 py-1.5 font-bold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </nav>
        )}
        {(loading || switching) && (
          <div
            role="status"
            className="rounded-2xl bg-blue-50/70 px-4 py-16 text-center text-sm text-blue-700"
          >
            กำลังโหลดรายการสินค้า…
          </div>
        )}
        {error && !switching && (
          <div
            role="alert"
            className="rounded-2xl bg-rose-50 px-4 py-12 text-center text-sm text-rose-700"
          >
            {error}
            {retryButton}
          </div>
        )}
        {!loading && !switching && !error && !products.length && (
          <div
            role="status"
            className="rounded-2xl bg-blue-50/60 px-4 py-16 text-center"
          >
            <Icon
              name="package"
              className="mx-auto mb-3 h-10 w-10 text-blue-300"
            />
            <p className="font-bold text-[#12366b]">ไม่พบรายการสินค้า</p>
            <p className="mt-2 text-sm text-slate-500">
              เลือกบัญชีลูกค้าเพื่อตรวจสอบรายการ Order สินค้า
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
