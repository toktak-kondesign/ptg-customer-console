"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCompanyBySlug, formatAmount } from "../../data";
import { getCustomerInfo, CUSTOMER_SESSION_CHANGED_EVENT } from "@/lib/auth";
import { getVanAccountDtlService } from "@/services/customer/van-account-dtl";
import type { VanAccountDtlRow } from "@/interfaces/van-account";

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
  try {
    return new Intl.DateTimeFormat("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function formatThaiLongDate(value: Date | string | null | undefined): string {
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

function amountClass(color1: number | null | undefined): string {
  if (color1 === 3) return "text-red-600";
  if (color1 === 4) return "text-green-600";
  return "text-gray-900";
}

function BankIcon({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <div
      className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
      title={label}
    >
      {label}
    </div>
  );
}

export default function VanAccountDetailPage() {
  const params = useParams<{ slug: string; vanNo: string }>();
  const company = getCompanyBySlug(params.slug);
  const companyCode = COMPANY_BY_SLUG[params.slug];
  const vanNoRaw = decodeURIComponent(params.vanNo || "");
  const vanNoDigits = vanNoRaw.replace(/\D/g, "");
  const vanNoDisplay = vanNoDigits ? formatVanNumber(vanNoDigits) : vanNoRaw;

  const [sessionInfo, setSessionInfo] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [rows, setRows] = useState<VanAccountDtlRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [paymentMethods, setPaymentMethods] = useState<Record<string, boolean>>({
    "mobile-app": false,
    "debit-uob": false,
    "debit-ktb": false,
  });

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

  const customerName =
    getCustomerField(sessionInfo, ["CusName", "customerName", "Name"]) ||
    rows[0]?.Name ||
    "-";
  const customerResaleID = resaleID || rows[0]?.ResaleID || "-";
  const customerPhone =
    getCustomerField(sessionInfo, [
      "PhoneNum",
      "phoneNum",
      "Phone",
      "phone",
      "Tel",
      "tel",
    ]) || "-";

  const addressParts = useMemo(() => {
    const parts = [
      getCustomerField(sessionInfo, ["Address1", "address1"]),
      getCustomerField(sessionInfo, ["Address2", "address2"]),
      getCustomerField(sessionInfo, ["Address3", "address3"]),
      getCustomerField(sessionInfo, ["City", "city"]),
      getCustomerField(sessionInfo, ["State", "state"]),
      getCustomerField(sessionInfo, ["Zip", "zip", "ZipCode", "zipCode"]),
    ].filter(Boolean);
    return parts.length ? parts.join(" ") : rows[0]?.Address1 || "-";
  }, [sessionInfo, rows]);

  useEffect(() => {
    if (!companyCode || !resaleID || !vanNoRaw) {
      setRows([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getVanAccountDtlService(
        companyCode,
        resaleID,
        vanNoRaw,
      );
      if (cancelled) return;
      if (result.status === "success") {
        setRows(result.results || []);
      } else {
        setRows([]);
        setError(result.error || "ไม่สามารถโหลดรายละเอียดบัญชีได้");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [companyCode, resaleID, vanNoRaw]);

  if (!company) return notFound();

  const totalAmount = rows.reduce(
    (sum, row) => sum + (Number(row.DocInvoiceAmt) || 0),
    0,
  );

  const selectedRows = rows.filter((_, index) => selected.has(index));
  const selectedCount = selectedRows.length;
  const selectedTotal = selectedRows.reduce(
    (sum, row) => sum + (Number(row.DocInvoiceAmt) || 0),
    0,
  );

  const toggleRow = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(rows.map((_, index) => index)));
  };

  const clearSelection = () => {
    setSelected(new Set());
  };

  const togglePaymentMethod = (key: string) => {
    setPaymentMethods((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const anyPaymentMethod = Object.values(paymentMethods).some(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1 py-8 sm:py-8">
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
            <Link
              href={`/payment-list/${params.slug}`}
              className="text-gray-500 hover:text-gray-700"
            >
              {company.shortName}
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-blue-600 font-medium">{vanNoDisplay}</span>
          </p>

          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
            <p className="text-base text-gray-500 mb-1">ข้อมูลลูกค้า</p>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-3xl text-gray-900 tracking-wide">
                  CUSTOMER INFORMATION
                </h2>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">รหัสลูกค้า :</dt>
                    <dd className="border-b text-gray-800">
                      {customerResaleID} : {customerName}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">ที่อยู่ :</dt>
                    <dd className="border-b text-gray-800">{addressParts}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">โทรศัพท์ :</dt>
                    <dd className="border-b text-gray-800">
                      {customerPhone}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col items-end gap-5 shrink-0">
                <div className="relative w-28 h-16">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    fill
                    sizes="112px"
                    className="object-contain"
                  />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    ยอดค้างชำระทั้งสิ้{" "}
                    <span className="text-gray-400">(Total Amount)</span>
                  </p>
                  <p className="text-3xl font-bold text-blue-700 mt-1">
                    {formatAmount(totalAmount)}{" "}
                    <span className="text-sm font-normal">บาท</span>
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    ข้อมูล ณ วันที่ {formatThaiLongDate(new Date())} น.
                  </p>
                </div>
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
              กำลังโหลดรายละเอียดบัญชี...
            </p>
          )}
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                รายละเอียดบัญชีเลขที่ {vanNoDisplay}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-[#00C853] hover:bg-[#00a344] rounded-lg transition"
                >
                  เลือกทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  ยกเลิก
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="text-center font-semibold px-4 py-3 w-14">
                      เลือก
                    </th>
                    <th className="text-left font-semibold px-4 py-3 w-14">
                      ลำดับ
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      เลขที่บิล/เลขที่เอกสาร
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      วันที่ซื้อ
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      ครบกำหนดชำระ
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      ประเภทสินค้า
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      พนักงาน
                    </th>
                    <th className="text-right font-semibold px-4 py-3">
                      จำนวนเงิน
                    </th>
                    <th className="text-left font-semibold px-4 py-3">
                      หมายเหตุ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row, index) => {
                    const color = amountClass(row.Color1);
                    const checked = selected.has(index);
                    return (
                      <tr key={`${index}-${row.Legalnumber ?? row.HeadNum ?? ""}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleRow(index)}
                            className="w-5 h-5 accent-green-600 cursor-pointer"
                          />
                        </td>
                        <td className={`px-4 py-3 ${color} font-medium`}>
                          {index + 1}.
                        </td>
                        <td className={`px-4 py-3 ${color} font-medium`}>
                          {row.Legalnumber?.trim() || "-"}
                        </td>
                        <td className={`px-4 py-3 ${color}`}>
                          {formatDate(row.InvoiceDate)}
                        </td>
                        <td className={`px-4 py-3 ${color}`}>
                          {formatDate(row.DueDate)}
                        </td>
                        <td className={`px-4 py-3 ${color}`}>
                          {row.Description?.trim() || "-"}
                        </td>
                        <td className={`px-4 py-3 ${color}`}>
                          {row.Address1?.trim() || "-"}
                        </td>
                        <td className={`px-4 py-3 text-right ${color} font-medium`}>
                          {formatAmount(Number(row.DocInvoiceAmt) || 0)}
                        </td>
                        <td className={`px-4 py-3 ${color}`}>
                          {row.CustID?.trim() || "-"}
                        </td>
                      </tr>
                    );
                  })}
                  {!isLoading && rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-8 text-center text-gray-400"
                      >
                        ไม่พบรายการบัญชี
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 px-5 sm:px-6 py-4 border-t border-gray-200 bg-white">
              <div className="text-right text-sm text-gray-600">
                <p className="text-xs text-gray-400">*** รายการที่ระบุปลายทางถูกต้องเรียบร้อย ***</p>
                <p>
                  จำนวนรายการที่ต้องการจ่าย :{" "}
                  <span className="text-red-600 font-bold text-lg">
                    {selectedCount}
                  </span>{" "}
                  รายการ
                </p>
                <p>
                  จำนวนเงิน :{" "}
                  <span className="text-red-600 font-bold text-lg">
                    {formatAmount(selectedTotal)}
                  </span>{" "}
                  บาท
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">
                เลือกวิธีชำระเงินวงเงิน โอน ผ่าน VAN
              </h4>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  checked={paymentMethods["mobile-app"]}
                  onChange={() => togglePaymentMethod("mobile-app")}
                  className="w-5 h-5 accent-green-600"
                />
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">
                    จ่ายโดยวิธีการโอน ผ่านระบบ VAN
                  </span>
                  <div className="relative w-10 h-10">
                    <Image
                      src="/images/UOB-logo.png"
                      alt="UOB"
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </div>
                  <span className="font-semibold text-[#0B132B]">UOB</span>
                </div>
              </label>
              <p className="mt-2 text-sm text-gray-600">
                เลขที่บัญชี : {vanNoDigits || "-"}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">
                การชำระเงินโอน/เดบิต
              </h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <BankIcon label="KB" color="bg-[#1BA5E0]" />
                <BankIcon label="KS" color="bg-[#00A651]" />
                <BankIcon label="BAY" color="bg-[#6E2C91]" />
                <div className="relative w-12 h-12">
                  <Image
                    src="/images/UOB-logo.png"
                    alt="UOB"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <BankIcon label="TTB" color="bg-[#0056A6]" />
                <BankIcon label="SCB" color="bg-[#4E2A84]" />
                <BankIcon label="KB" color="bg-[#FFD400]" />
                <BankIcon label="SCB" color="bg-[#F37021]" />
                <BankIcon label="KTB" color="bg-[#1E479C]" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods["mobile-app"]}
                    onChange={() => togglePaymentMethod("mobile-app")}
                    className="w-5 h-5 accent-green-600"
                  />
                  <span className="text-sm text-gray-700">โอนผ่านแอปฯ</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods["debit-uob"]}
                    onChange={() => togglePaymentMethod("debit-uob")}
                    className="w-5 h-5 accent-green-600"
                  />
                  <span className="text-sm text-gray-700">
                    จ่ายโดยเดบิต (UOB)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods["debit-ktb"]}
                    onChange={() => togglePaymentMethod("debit-ktb")}
                    className="w-5 h-5 accent-green-600"
                  />
                  <span className="text-sm text-gray-700">
                    จ่ายโดยเดบิต (กรุงไทย)
                  </span>
                </label>
              </div>
            </div>
          </section>

          <div className="flex justify-end mb-8">
            <button
              type="button"
              disabled={selectedCount === 0 || !anyPaymentMethod}
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#0B132B] hover:bg-[#1a2744] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition"
            >
              ยืนยันการชำระเงิน
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
