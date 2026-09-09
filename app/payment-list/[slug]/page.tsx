"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCompanyBySlug, formatAmount } from "../data";
import { getCustomerInfo, CUSTOMER_SESSION_CHANGED_EVENT } from "@/lib/auth";
import { getVanAccountsService } from "@/services/customer/van-accounts";
import type { VanAccountDetails } from "@/interfaces/van-account";

const COMPANY_BY_SLUG: Record<string, string> = {
  ptg: "PTG",
  ptg24: "PTG24",
  ake: "AKET",
  mono: "MONO",
};

function getCustomerField(
  info: Record<string, unknown> | null,
  names: string[],
): string {
  if (!info) return "";
  const keys = Object.keys(info);
  for (const name of names) {
    const key = keys.find((item) => item.toLowerCase() === name.toLowerCase());
    if (key && info[key] !== null && info[key] !== undefined) {
      return String(info[key]).trim();
    }
  }
  return "";
}

function formatVanNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10
    ? `${digits.slice(0, 4)}-${digits.slice(4, 5)}-${digits.slice(5, 9)}-${digits.slice(9)}`
    : value;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default function PaymentAccountDetailPage() {
  const params = useParams<{ slug: string }>();
  const company = getCompanyBySlug(params.slug);
  const companyCode = COMPANY_BY_SLUG[params.slug];
  const [showAllAccounts, setShowAllAccounts] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [details, setDetails] = useState<VanAccountDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSessionInfo(getCustomerInfo());
    const handleChanged = () => setSessionInfo(getCustomerInfo());
    window.addEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
    return () =>
      window.removeEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
  }, []);

  const resaleID = getCustomerField(sessionInfo, [
    "ResaleID",
    "resaleID",
    "CUSTID",
    "CustID",
    "custID",
  ]);

  useEffect(() => {
    if (!companyCode || !resaleID) {
      setDetails(null);
      setError(null);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getVanAccountsService(companyCode, resaleID);
      if (cancelled) return;
      if (result.status === "success") {
        setDetails(result.results);
      } else {
        setDetails(null);
        setError(result.error || "ไม่สามารถโหลดข้อมูลบัญชีได้");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [companyCode, resaleID]);

  if (!company) return notFound();

  const customer = details?.customer;
  const accounts = details?.accounts || [];
  const visibleAccounts = showAllAccounts
    ? accounts
    : accounts.filter((account) => account.IsShow === 0);
  const totalUsed = accounts.reduce(
    (sum, account) => sum + (Number(account.DocInvoiceAmt) || 0),
    0,
  );
  const totalCredit = accounts.reduce(
    (sum, account) => sum + (Number(account.CreditLemit) || 0),
    0,
  );
  const address = customer
    ? [
        customer.Address1,
        customer.Address2,
        customer.Address3,
        customer.City,
        customer.State,
        customer.Zip,
      ]
        .filter(Boolean)
        .join(" ")
    : "-";

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              หน้าหลัก
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <Link
              href="/payment-list"
              className="text-gray-500 hover:text-gray-700"
            >
              รายการชำระเงิน
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-blue-600 font-medium">
              {company.shortName}
            </span>
          </p>

          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
            <p className="text-base text-gray-500 mb-1">ข้อมูลลูกค้า</p>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <h2 className="text-3xl text-gray-900 tracking-wide">
                  CUSTOMER INFORMATION
                </h2>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">รหัสลูกค้า :</dt>
                    <dd className="border-b text-gray-800">
                      {customer
                        ? `${customer.ResaleIDX || customer.ResaleID} : ${customer.Name}`
                        : "-"}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">ที่อยู่ :</dt>
                    <dd className="border-b text-gray-800">{address}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">โทรศัพท์ :</dt>
                    <dd className="border-b text-gray-800">
                      {customer?.PhoneNum || "-"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col sm:items-center gap-5 shrink-0">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-500">
                    ยอดค้างชำระทั้งสิ้น{" "}
                    <span className="text-gray-400">(Total Amount)</span>
                  </p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">
                    {formatAmount(Number(customer?.DocInvoiceAmt) || 0)}{" "}
                    <span className="text-sm font-normal">บาท</span>
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    ข้อมูล ณ วันที่ {formatDate(customer?.LastDate)} น.
                  </p>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-3 border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-12 h-12 shrink-0">
                    <Image
                      src="/images/placebill.jpg"
                      alt="รายการใบวางบิล"
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    รายการใบวางบิล
                  </span>
                  <span className="text-gray-400">&rsaquo;</span>
                </button>
              </div>
            </div>
          </section>

          {!resaleID && (
            <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
              ไม่พบ ResaleID ในข้อมูลลูกค้า กรุณาเข้าสู่ระบบใหม่
            </p>
          )}
          {isLoading && (
            <p className="mb-4 text-sm text-gray-500">
              กำลังโหลดข้อมูลบัญชี...
            </p>
          )}
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <label className="inline-flex items-center gap-2 mb-4 cursor-pointer select-none px-1.5 py-1.5 bg-[#1156ac] text-white rounded-lg">
            <input
              type="checkbox"
              checked={showAllAccounts}
              onChange={(e) => setShowAllAccounts(e.target.checked)}
              className="w-6 h-6 checkbox checkbox-lg rounded border-gray-300 bg-transparent text-transparent checked:bg-transparent focus:ring-0"
            />
            <span className="text-sm text-white">แสดงเลขบัญชีทั้งหมด</span>
          </label>

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                รายงานบัญชี{" "}
                {customer?.THBranchID === "00000"
                  ? "สำนักงานใหญ่"
                  : customer?.THBranchID || "-"}
              </h3>
              <p className="text-xl text-blue-600 font-medium">
                วงเงินทั้งหมด : {formatAmount(totalCredit)} บาท
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left font-semibold px-6 py-3 w-16">
                      ลำดับ
                    </th>
                    <th className="text-left font-semibold px-6 py-3">
                      เลขที่บัญชี
                    </th>
                    <th className="text-left font-semibold px-6 py-3">
                      ประเภทวงเงิน
                    </th>
                    <th className="text-right font-semibold px-6 py-3">
                      วงเงิน
                    </th>
                    <th className="text-right font-semibold px-6 py-3">
                      ใช้ไป
                    </th>
                    <th className="text-right font-semibold px-6 py-3">
                      คงเหลือ
                    </th>
                    <th className="text-center font-semibold px-6 py-3">
                      สถานะ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visibleAccounts.map((account, index) => {
                    const hasVanNumber = Boolean(account.VANNO);
                    const dataClass = hasVanNumber
                      ? "text-red-600"
                      : "text-gray-400";
                    return (
                      <tr
                        key={`${account.CustID}-${account.VANNO}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        <td className={`px-6 py-3 ${dataClass} font-medium`}>
                          {index + 1}
                        </td>
                        <td className={`px-6 py-3 ${dataClass} font-medium`}>
                          {hasVanNumber
                            ? formatVanNumber(account.VANNO)
                            : "---"}
                        </td>
                        <td className={`px-6 py-3 ${dataClass}`}>
                          {account.CreditDesc || "-"}
                        </td>
                        <td className="px-6 py-3 text-right text-gray-500">
                          {formatAmount(Number(account.CreditLemit) || 0)}
                        </td>
                        <td
                          className={`px-6 py-3 text-right ${dataClass} font-medium`}
                        >
                          {formatAmount(Number(account.DocInvoiceAmt) || 0)}
                        </td>
                        <td className="px-6 py-3 text-right text-gray-500">
                          {formatAmount(Number(account.DocInvoiceBal) || 0)}
                        </td>
                        <td
                          className={`px-6 py-3 text-center ${dataClass} font-medium`}
                        >
                          {account.StatusCredit || "-"}
                        </td>
                      </tr>
                    );
                  })}
                  {!isLoading && visibleAccounts.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-400"
                      >
                        ไม่พบข้อมูลบัญชี
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-semibold text-gray-800">
                    <td className="px-6 py-3" colSpan={4}>
                      รวม
                    </td>
                    <td className="px-6 py-3 text-right">
                      {formatAmount(totalUsed)}
                    </td>
                    <td className="px-6 py-3" />
                    <td className="px-6 py-3" />
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 sm:px-6 py-4 border-t border-gray-200">
              <p className="text-sm flex items-center gap-2">
                <span className="font-bold text-blue-900">
                  <Image
                    src="/images/UOB-logo.png"
                    alt="UOB"
                    width={60}
                    height={60}
                  />
                </span>{" "}
                <span className="text-gray-500">
                  บริการยูโอบี เวอร์ชวลแอคเคาท์ คืออะไร{" "}
                </span>
                <a
                  href="https://www.uob.co.th/corporate/cash-management/van.page"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  &gt;&gt;อ่านต่อ
                </a>
              </p>
              <p className="text-xs text-gray-400">
                ระยะเวลาในการประมวลผลเครดิต 1 วันทำการ
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
