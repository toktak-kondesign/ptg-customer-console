"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DatePicker, Popover } from "antd";
import dayjs, { Dayjs } from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCompanyBySlug, formatAmount } from "../../../data";
import {
  getCustomerInfo,
  CUSTOMER_SESSION_CHANGED_EVENT,
} from "@/lib/auth";
import { img } from "@/lib/env";
import { getPaymentLogService } from "@/services/customer/payment-log";
import { getVanAccountsService } from "@/services/customer/van-accounts";
import type { PaymentLogRow } from "@/interfaces/payment-log";
import type { VanCustomer } from "@/interfaces/van-account";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const COMPANY_BY_SLUG: Record<string, string> = {
  ptg: "PTG",
  ptg24: "PTG24",
  ake: "AKET",
  mono: "MONO",
};

const THAI_MONTHS_SHORT = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

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

function formatTaxId(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 13
    ? `${digits.slice(0, 1)}-${digits.slice(1, 5)}-${digits.slice(5, 10)}-${digits.slice(10, 12)}-${digits.slice(12)}`
    : value;
}

function formatLogDate(value: string | null | undefined): string {
  const match = String(value || "").match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "-";
  const year = Number(match[1]);
  const buddhistYear = year >= 2400 ? year : year + 543;
  return `${match[3]}/${match[2]}/${buddhistYear}`;
}

function formatMonthTitle(value: Dayjs): string {
  return `${value.format("MMMM")} ${value.year() + 543}`;
}

export default function PaymentLogPage() {
  const params = useParams<{ slug: string; vanNo: string }>();
  const company = getCompanyBySlug(params.slug);
  const companyCode = COMPANY_BY_SLUG[params.slug];
  const vanNoRaw = decodeURIComponent(params.vanNo || "");
  const vanNoDigits = vanNoRaw.replace(/\D/g, "");
  const vanNoDisplay = vanNoDigits ? formatVanNumber(vanNoDigits) : vanNoRaw;

  const [currentMonth, setCurrentMonth] = useState<Dayjs>(() =>
    dayjs().startOf("month"),
  );
  const [pickerYear, setPickerYear] = useState<number>(currentMonth.year());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [customer, setCustomer] = useState<VanCustomer | null>(null);
  const [rows, setRows] = useState<PaymentLogRow[]>([]);
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
  const requestDate = currentMonth.format("YYYY-MM-01");

  useEffect(() => {
    if (!companyCode || !vanNoRaw) {
      setRows([]);
      setCustomer(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const [logResult, accountResult] = await Promise.all([
        getPaymentLogService(vanNoDigits || vanNoRaw, companyCode, requestDate),
        resaleID
          ? getVanAccountsService(companyCode, resaleID)
          : Promise.resolve(null),
      ]);
      if (cancelled) return;

      setCustomer(
        accountResult?.status === "success"
          ? accountResult.results.customer
          : null,
      );
      if (logResult.status === "success") {
        setRows(logResult.results || []);
      } else {
        setRows([]);
        setError(logResult.error || "ไม่สามารถโหลดรายละเอียดการชำระเงินได้");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [companyCode, resaleID, requestDate, vanNoDigits, vanNoRaw]);

  if (!company) return notFound();

  const customerName =
    customer?.Name ||
    getCustomerField(sessionInfo, ["CusName", "customerName", "Name"]) ||
    "-";
  const customerResaleID =
    customer?.ResaleID || customer?.ResaleIDX || resaleID || "-";
  const customerPhone =
    customer?.PhoneNum ||
    getCustomerField(sessionInfo, [
      "PhoneNum",
      "phoneNum",
      "Phone",
      "phone",
      "Tel",
      "tel",
    ]) ||
    "-";
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
    : [
        getCustomerField(sessionInfo, ["Address1", "address1"]),
        getCustomerField(sessionInfo, ["Address2", "address2"]),
        getCustomerField(sessionInfo, ["Address3", "address3"]),
        getCustomerField(sessionInfo, ["City", "city"]),
        getCustomerField(sessionInfo, ["State", "state"]),
        getCustomerField(sessionInfo, ["Zip", "zip", "ZipCode", "zipCode"]),
      ]
        .filter(Boolean)
        .join(" ") || "-";

  const handleChangeMonth = (offset: number) => {
    setCurrentMonth((prev) => prev.add(offset, "month").startOf("month"));
  };

  const handleGoToCurrentMonth = () => {
    setCurrentMonth(dayjs().startOf("month"));
    setPickerYear(dayjs().year());
    setIsMonthPickerOpen(false);
  };

  const handlePickMonth = (value: Dayjs | null) => {
    if (!value) return;
    setCurrentMonth(value.startOf("month"));
  };

  const handleMonthPickerOpenChange = (open: boolean) => {
    if (open) setPickerYear(currentMonth.year());
    setIsMonthPickerOpen(open);
  };

  const handleSelectMonth = (monthIndex: number) => {
    setCurrentMonth(dayjs().year(pickerYear).month(monthIndex).date(1));
    setIsMonthPickerOpen(false);
  };

  const monthPickerContent = (
    <div className="w-64 p-1">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="ปีก่อนหน้า"
          onClick={() => setPickerYear((year) => year - 1)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-gray-800">
          {pickerYear + 543}
        </span>
        <button
          type="button"
          aria-label="ปีถัดไป"
          onClick={() => setPickerYear((year) => year + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {THAI_MONTHS_SHORT.map((month, index) => {
          const isSelected =
            index === currentMonth.month() &&
            pickerYear === currentMonth.year();
          return (
            <button
              key={month}
              type="button"
              onClick={() => handleSelectMonth(index)}
              className={[
                "rounded-md px-1 py-2 text-sm font-medium transition",
                isSelected
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              ].join(" ")}
            >
              {month}
            </button>
          );
        })}
      </div>
      <div className="mt-3 border-t border-gray-200 pt-2">
        <button
          type="button"
          onClick={handleGoToCurrentMonth}
          className="w-full rounded-md py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          เดือนปัจจุบัน
        </button>
      </div>
    </div>
  );

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
              รายการเดินบัญชี
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <Link
              href={`/payment-list/${params.slug}`}
              className="text-gray-500 hover:text-gray-700"
            >
              {company.shortName}
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <Link
              href={`/payment-list/${params.slug}/${encodeURIComponent(params.vanNo)}`}
              className="text-gray-500 hover:text-gray-700"
            >
              {vanNoDisplay}
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-blue-600 font-medium">
              รายละเอียดการชำระเงิน
            </span>
          </p>

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 px-5 sm:px-8 pt-7">
              <div className="text-sm text-gray-800 space-y-2">
                <p>
                  รหัสลูกค้า : {formatTaxId(customerResaleID)} : {customerName}
                </p>
                <p>ที่อยู่ : {address}</p>
                <p>โทรศัพท์ : {customerPhone}</p>
              </div>
              <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
                <div className="relative w-32 h-16">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    fill
                    sizes="128px"
                    className="object-contain"
                  />
                </div>
                <p className="text-xl text-blue-600">
                  เลขบัญชี {vanNoDisplay}
                </p>
              </div>
            </div>

            <div className="mx-5 sm:mx-8 my-6 border-t border-gray-100" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-5 sm:px-8 pb-8">
              <div className="flex items-start gap-5">
                <div className="relative w-14 h-14 shrink-0">
                  <Image
                    src={img("/images/icon-head.png")}
                    alt="รายละเอียดการชำระเงิน"
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    รายละเอียดการชำระเงิน
                  </p>
                  <DatePicker
                    picker="month"
                    value={currentMonth}
                    onChange={handlePickMonth}
                    allowClear={false}
                    variant="borderless"
                    suffixIcon={null}
                    inputReadOnly
                    format={(value) => formatMonthTitle(value)}
                    className="!w-auto !p-0 [&_input]:!w-auto [&_input]:!cursor-pointer [&_input]:!caret-transparent [&_input]:!text-3xl [&_input]:!font-bold [&_input]:!text-blue-600"
                  />
                  <div className="mt-3 inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleChangeMonth(-1)}
                      aria-label="เดือนก่อนหน้า"
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                      ‹
                    </button>
                    <Popover
                      content={monthPickerContent}
                      trigger="click"
                      open={isMonthPickerOpen}
                      onOpenChange={handleMonthPickerOpenChange}
                      placement="bottom"
                    >
                      <button
                        type="button"
                        aria-label="เลือกเดือน"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                      >
                        <span className="block h-2 w-2 rounded-full bg-current" />
                      </button>
                    </Popover>
                    <button
                      type="button"
                      onClick={() => handleChangeMonth(1)}
                      aria-label="เดือนถัดไป"
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-blue-500">
                <Image
                  src={img("/images/payment-method.png")}
                  alt="ยืนยันการรับชำระเงิน"
                  width={44}
                  height={44}
                  className="object-contain"
                />
                <div>
                  <p className="font-medium">ยืนยันการรับชำระเงิน</p>
                  <p className="text-xs text-gray-400">Confirm Payment</p>
                </div>
              </div>
            </div>

            {isLoading && (
              <p className="px-5 sm:px-8 pb-4 text-sm text-gray-500">
                กำลังโหลดรายละเอียดการชำระเงิน...
              </p>
            )}
            {error && (
              <div className="px-5 sm:px-8 pb-4">
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <div className="px-5 sm:px-8 pb-8">
              <div className="overflow-x-auto rounded-lg border border-gray-300">
                <table className="w-full min-w-[900px] text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#55AFF4] text-gray-800">
                      <th className="text-center font-semibold px-5 py-3 border border-gray-300">
                        วันที่โอน
                      </th>
                      <th className="text-center font-semibold px-5 py-3 border border-gray-300">
                        ธนาคาร
                      </th>
                      <th className="text-center font-semibold px-5 py-3 border border-gray-300">
                        ชำระผ่านช่องทาง
                      </th>
                      <th className="text-right font-semibold px-5 py-3 border border-gray-300">
                        จำนวน
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={`${row.Key1 || row.CustID || "row"}-${index}`}
                        className="odd:bg-white even:bg-gray-50"
                      >
                        <td className="text-center px-5 py-2.5 border border-gray-300 text-gray-700">
                          {formatLogDate(row.Date01)}
                        </td>
                        <td className="text-center px-5 py-2.5 border border-gray-300 text-gray-700">
                          {row.xBankName_c?.trim() || "-"}
                        </td>
                        <td className="text-center px-5 py-2.5 border border-gray-300 text-gray-700">
                          {row.TypePay?.trim() || "-"}
                        </td>
                        <td className="text-right px-5 py-2.5 border border-gray-300 text-gray-700">
                          {formatAmount(Number(row.Number01) || 0)}
                        </td>
                      </tr>
                    ))}
                    {!isLoading && rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-gray-400 border border-gray-300"
                        >
                          ไม่พบรายละเอียดการชำระเงินในเดือน
                          {formatMonthTitle(currentMonth)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
