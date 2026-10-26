"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DatePicker, Popover } from "antd";
import dayjs, { Dayjs } from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCustomerInfo, CUSTOMER_SESSION_CHANGED_EVENT } from "@/lib/auth";
import { img } from "@/lib/env";
import { getCardOTUListService } from "@/services/customer/card-otu";
import type { CardOTURow } from "@/interfaces/card-otu";

dayjs.extend(buddhistEra);
dayjs.locale("th");

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

const TABLE_HEADERS = [
  "ลำดับ",
  "รหัส",
  "รหัสลูกค้า",
  "ชื่อลูกค้า",
  "ทะเบียนรถ",
  "เบอร์โทรศัพท์มือถือ",
  "วันที่ขอบัตร",
  "สถานะ",
  "วันที่ใช้บัตร",
  "ดำเนินการ",
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

function formatDate(value: string | null | undefined): string {
  const match = String(value || "").match(/(\d{4})[-/](\d{2})[-/](\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : "-";
}

function formatMonthTitle(value: Dayjs): string {
  return `${value.format("MMMM")} ${value.year() + 543}`;
}

function cleanName(value: string | null | undefined): string {
  return String(value || "")
    .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s().,&/-]/g, "")
    .trim();
}

function getStatus(row: CardOTURow): { label: string; className: string } {
  if (row.StatusCode === 2 || Number(row.IsInActive) === 1) {
    return { label: "ยกเลิก", className: "text-red-600" };
  }
  if (row.UseDate) return { label: "ใช้บัตรแล้ว", className: "text-green-600" };
  return { label: "รอใช้งาน", className: "text-blue-600" };
}

const StatusIcon = ({ cancelled }: { cancelled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
  >
    {cancelled ? (
      <path d="M5 5l14 14M19 5L5 19" />
    ) : (
      <path d="M5 13l4 4L19 7" />
    )}
  </svg>
);

export default function TruckCardHistoryPage() {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(() =>
    dayjs().startOf("month"),
  );
  const [pickerYear, setPickerYear] = useState<number>(currentMonth.year());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [rows, setRows] = useState<CardOTURow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSessionInfo(getCustomerInfo());
    const handleChanged = () => setSessionInfo(getCustomerInfo());
    window.addEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
    return () =>
      window.removeEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
  }, []);

  const custID = getCustomerField(sessionInfo, [
    "CustID",
    "custID",
    "CUSTID",
    "ResaleID",
    "resaleID",
  ]);
  const requestDate = currentMonth.format("YYYY-MM-01");

  useEffect(() => {
    if (!custID) {
      setRows([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getCardOTUListService(custID, requestDate);
      if (cancelled) return;
      if (result.status === "success") {
        setRows(result.results || []);
      } else {
        setRows([]);
        setError(result.error || "ไม่สามารถโหลดประวัติการขอบัตรรถได้");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [custID, requestDate]);

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
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-sm mb-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              หน้าหลัก
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <Link
              href="/truck-list"
              className="text-gray-500 hover:text-gray-700"
            >
              ข้อมูลรายการรถบรรทุก
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-blue-600 font-medium">
              รายละเอียดการขอบัตรรถบรรทุกชั่วคราว
            </span>
          </p>

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-start gap-5 px-5 sm:px-8 py-8">
              <div className="relative w-14 h-14 shrink-0">
                <Image
                  src={img("/images/icon-head.png")}
                  alt="รายละเอียดการขอบัตรรถบรรทุกชั่วคราว"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  รายละเอียดการขอบัตรรถบรรทุกชั่วคราว
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

            {error && (
              <div className="px-5 sm:px-8 pb-4">
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <div className="px-5 sm:px-8 pb-8">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[900px] text-sm border-collapse">
                  <thead>
                    <tr className="bg-white text-gray-800 border-b border-gray-200">
                      {TABLE_HEADERS.map((header) => (
                        <th
                          key={header}
                          className="text-center font-semibold px-4 py-3"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                      const status = getStatus(row);
                      return (
                        <tr
                          key={`${row.IDCode || "row"}-${index}`}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-blue-50/40 transition-colors"
                        >
                          <td className="text-center px-4 py-2.5 text-gray-600">
                            {index + 1}.
                          </td>
                          <td className="text-center px-4 py-2.5 text-gray-600">
                            {row.IDCode?.trim() ? (
                              <Link
                                href={`/truck-card/${row.IDCode.trim()}`}
                                target="_blank"
                                className="text-blue-600 underline-offset-2 hover:underline"
                              >
                                {row.IDCode.trim()}
                              </Link>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="text-center px-4 py-2.5 text-gray-600">
                            {row.CustID?.trim() || "-"}
                          </td>
                          <td className="text-center px-4 py-2.5 text-gray-600">
                            {cleanName(row.CustName) || "-"}
                          </td>
                          <td className="text-center px-4 py-2.5 text-gray-600">
                            {row.CarRegister?.trim() || "-"}
                          </td>
                          <td className="text-center px-4 py-2.5 text-gray-600">
                            {row.MobilePhone?.trim() || ""}
                          </td>
                          <td className="text-center px-4 py-2.5 text-gray-600">
                            {formatDate(row.CreateDate)}
                          </td>
                          <td className="px-4 py-2.5 whitespace-nowrap">
                            <span
                              className={`flex items-center justify-center gap-1.5 ${status.className}`}
                            >
                              <StatusIcon
                                cancelled={
                                  row.StatusCode === 2 ||
                                  Number(row.IsInActive) === 1
                                }
                              />
                              <span className="text-gray-700">
                                {status.label}
                              </span>
                            </span>
                          </td>
                          <td className="text-center px-4 py-2.5 text-gray-600">
                            {formatDate(row.UseDate)}
                          </td>
                          <td className="text-center px-4 py-2.5">
                            {row.StatusCode === 0 && (
                              // <button
                              //   type="button"
                              //   className="rounded-md border border-red-200 px-3 py-1 text-red-600 transition hover:bg-red-50"
                              // >
                              //   ยกเลิก
                              // </button>
                              <Image
                                src="/images/cancel-button.png"
                                alt="cancel"
                                width={80}
                                height={30}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {isLoading && (
                      <tr>
                        <td
                          colSpan={TABLE_HEADERS.length}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          <div className="flex items-center justify-center gap-3">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                            กำลังโหลดประวัติการขอบัตรรถ...
                          </div>
                        </td>
                      </tr>
                    )}
                    {!isLoading && rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={TABLE_HEADERS.length}
                          className="px-6 py-8 text-center text-gray-400"
                        >
                          ไม่พบประวัติการขอบัตรรถในเดือน
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
