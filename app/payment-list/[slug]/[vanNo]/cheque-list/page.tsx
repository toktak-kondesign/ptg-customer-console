"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DatePicker, Popover } from "antd";
import dayjs, { Dayjs } from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { companies, getCompanyBySlug, formatAmount } from "../../../data";
import { getBank, getBankLogo, getBankName } from "@/lib/banks";
import { getCustomerInfo, CUSTOMER_SESSION_CHANGED_EVENT } from "@/lib/auth";
import { img } from "@/lib/env";
import { getChequeListService } from "@/services/customer/cheque-list";
import type { ChequeListRow } from "@/interfaces/cheque-list";
import ChequeDetailModal from "./ChequeDetailModal";

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

type ViewMode = "table" | "list";

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
  const match = String(value || "").match(/(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (!match) return "-";
  const year = Number(match[1]);
  return `${match[3]}/${match[2]}/${year >= 2400 ? year - 543 : year}`;
}

function formatMonthTitle(value: Dayjs): string {
  return `${value.format("MMMM")} ${value.year() + 543}`;
}

function parseMonthParam(value: string | null): Dayjs {
  const match = String(value || "").match(/(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (!match) return dayjs().startOf("month");
  const year = Number(match[1]);
  const parsed = dayjs(
    `${year >= 2400 ? year - 543 : year}-${match[2]}-${match[3]}`,
  );
  return parsed.isValid() ? parsed.startOf("month") : dayjs().startOf("month");
}

function getStatus(value: string | null | undefined): {
  label: string;
  className: string;
} {
  switch (String(value ?? "").trim()) {
    case "-1":
      return { label: "รอตรวจสอบ", className: "text-amber-500" };
    case "-2":
      return { label: "ยกเลิก", className: "text-red-500" };
    case "1":
      return { label: "การตลาดรับเช็คแล้ว", className: "text-blue-600" };
    case "2":
      return { label: "การเงินรับเช็คแล้ว", className: "text-green-600" };
    default:
      return { label: "รอตรวจสอบ", className: "text-amber-500" };
  }
}

function matchesKeyword(row: ChequeListRow, keyword: string): boolean {
  if (!keyword) return true;
  return [
    row.Name,
    row.CustID,
    row.CheckNo,
    row.Runno,
    row.BankType,
    getBankName(row.BankType),
    row.createname,
  ]
    .filter(Boolean)
    .some((text) => String(text).toLowerCase().includes(keyword));
}

function BankBadge({ code, size }: { code?: string | null; size: number }) {
  const bank = getBank(code);
  const logo = getBankLogo(code);
  if (!logo)
    return (
      <div
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-[10px] font-medium text-gray-600"
        title={bank?.name || code || ""}
      >
        {code?.trim() || "-"}
      </div>
    );
  return (
    <Image
      src={logo}
      alt={bank?.name || code || "ธนาคาร"}
      width={size}
      height={size}
      className="shrink-0 object-contain"
      title={bank?.name}
    />
  );
}

export default function ChequeListPage() {
  const params = useParams<{ slug: string; vanNo: string }>();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const company = getCompanyBySlug(params.slug);
  const initialCompanyCode = COMPANY_BY_SLUG[params.slug];
  const [companyCode, setCompanyCode] = useState(initialCompanyCode);
  const vanNoRaw = decodeURIComponent(params.vanNo || "");
  const vanNoDigits = vanNoRaw.replace(/\D/g, "");
  const vanNoDisplay = vanNoDigits ? formatVanNumber(vanNoDigits) : vanNoRaw;

  const [currentMonth, setCurrentMonth] = useState<Dayjs>(() =>
    parseMonthParam(dateParam),
  );
  const [pickerYear, setPickerYear] = useState<number>(currentMonth.year());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [rowsByCompany, setRowsByCompany] = useState<
    Record<string, ChequeListRow[]>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [keyword, setKeyword] = useState("");
  const [selectedRow, setSelectedRow] = useState<ChequeListRow | null>(null);

  useEffect(() => {
    setSessionInfo(getCustomerInfo());
    const handleChanged = () => setSessionInfo(getCustomerInfo());
    window.addEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
    return () =>
      window.removeEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
  }, []);

  const custID = getCustomerField(sessionInfo, ["custID", "CustID", "CUSTID"]);
  const requestDate = currentMonth.format("YYYY-MM-01");
  const companyCodes = companies.map((item) => COMPANY_BY_SLUG[item.slug]);

  useEffect(() => {
    if (!custID) {
      setRowsByCompany({});
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const results = await Promise.all(
        companyCodes.map((code) =>
          getChequeListService(custID, code, requestDate),
        ),
      );
      if (cancelled) return;

      const nextRows: Record<string, ChequeListRow[]> = {};
      let firstError: string | null = null;
      results.forEach((result, index) => {
        if (result.status === "success") {
          nextRows[companyCodes[index]] = result.results || [];
        } else {
          nextRows[companyCodes[index]] = [];
          if (!firstError)
            firstError = result.error || "ไม่สามารถโหลดรายการเช็คได้";
        }
      });
      setRowsByCompany(nextRows);
      setError(firstError);
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [custID, requestDate]);

  const filteredRows = useMemo(() => {
    const text = keyword.trim().toLowerCase();
    return (rowsByCompany[companyCode] || []).filter((row) =>
      matchesKeyword(row, text),
    );
  }, [rowsByCompany, companyCode, keyword]);

  if (!company) return notFound();

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

  const viewButtonClass = (mode: ViewMode) =>
    [
      "px-3 py-1.5 text-sm font-medium transition",
      viewMode === mode
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-600 hover:bg-gray-100",
    ].join(" ");

  const emptyText = `ไม่พบรายการเช็คในเดือน${formatMonthTitle(currentMonth)}`;

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
            <Link
              href={`/payment-list/${params.slug}/${encodeURIComponent(params.vanNo)}/payment-log?date=${requestDate}`}
              className="text-gray-500 hover:text-gray-700"
            >
              รายละเอียดการชำระเงิน
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-blue-600 font-medium">รายการเช็ค</span>
          </p>

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 sm:px-8 pt-7 text-blue-500">
              <Image
                src={img("/images/payment-method.png")}
                alt="ยืนยันการรับชำระเงิน"
                width={44}
                height={44}
                className="object-contain"
              />
              <div>
                <p className="text-xl font-medium">ยืนยันการรับชำระเงิน</p>
                <p className="text-xs text-gray-400">Confirm Payment</p>
              </div>
            </div>

            <div className="mx-5 sm:mx-8 my-6 border-t border-gray-100" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 px-5 sm:px-8 pb-6">
              <div className="flex items-start gap-5">
                <div className="relative w-14 h-14 shrink-0">
                  <Image
                    src={img("/images/icon-head.png")}
                    alt="รายการรับชำระเงิน"
                    fill
                    sizes="56px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">รายการรับชำระเงิน</p>
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

              <div className="flex flex-col items-start lg:items-end gap-4 shrink-0">
                <div className="flex flex-wrap gap-2">
                  {companies.map((item) => {
                    const code = COMPANY_BY_SLUG[item.slug];
                    const isActive = code === companyCode;
                    const count = rowsByCompany[code]?.length;
                    return (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => setCompanyCode(code)}
                        className={[
                          "relative rounded-xl border px-4 py-3 transition",
                          isActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300",
                        ].join(" ")}
                      >
                        {count !== undefined && (
                          <span
                            className={`absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-base font-semibold text-white ${count > 0 ? "bg-green-700" : "bg-gray-500"}`}
                          >
                            {count}
                          </span>
                        )}
                        <Image
                          src={item.logo}
                          alt={item.shortName}
                          width={72}
                          height={28}
                          className="h-7 w-auto object-contain"
                        />
                        <p className="mt-1 text-sm leading-tight text-gray-500">
                          {item.shortName}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm font-medium text-gray-700">
                  ข้อมูล ณ วันที่ {dayjs().format("D MMMM")}{" "}
                  {dayjs().year() + 543}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 sm:px-8 pb-5">
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="ค้นหารายการตาม ชื่อลูกค้า / เลขที่เช็ค / เลขที่ใบรับ"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
              />
              <div className="inline-flex overflow-hidden rounded-lg border border-gray-300 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={viewButtonClass("table")}
                >
                  ตาราง
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`${viewButtonClass("list")} border-l border-gray-300`}
                >
                  รายการ
                </button>
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
              {isLoading && (
                <div className="flex items-center justify-center gap-3 rounded-lg border border-gray-300 px-6 py-8 text-gray-500">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                  กำลังโหลดรายการเช็ค...
                </div>
              )}

              {!isLoading && filteredRows.length === 0 && (
                <div className="rounded-lg border border-gray-300 px-6 py-8 text-center text-gray-400">
                  {emptyText}
                </div>
              )}

              {!isLoading &&
                filteredRows.length > 0 &&
                viewMode === "table" && (
                  <div className="overflow-auto max-h-[70vh] rounded-lg border border-gray-300">
                    <table className="w-full min-w-[1100px] text-sm border-collapse">
                      <thead className="sticky top-0 z-10">
                        <tr className="text-gray-800">
                          {[
                            "ลำดับ",
                            "เลขที่ใบรับ",
                            "วันที่ใบรับ",
                            "ธนาคาร",
                            "เลขที่เช็ค",
                            "วันที่รับเช็ค",
                            "วันที่สั่งจ่ายเช็ค",
                            "ผู้บันทึกใบรับ",
                            "ลูกค้า",
                            "สถานะ",
                            "จำนวนเงิน",
                          ].map((title, index, all) => (
                            <th
                              key={title}
                              className={`${index === all.length - 1 ? "text-right" : "text-center"} font-semibold px-4 py-3 border border-gray-300 bg-[#55AFF4]`}
                            >
                              {title}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRows.map((row, index) => {
                          const status = getStatus(row.chequeStatus);
                          return (
                            <tr
                              key={`${row.Runno || "row"}-${index}`}
                              onClick={() => setSelectedRow(row)}
                              className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors text-gray-700"
                            >
                              <td className="text-center px-4 py-2.5 border border-gray-300">
                                {index + 1}
                              </td>
                              <td className="text-center px-4 py-2.5 border border-gray-300">
                                {row.Runno?.trim() || "-"}
                              </td>
                              <td className="text-center px-4 py-2.5 border border-gray-300">
                                {formatDate(row.receivedate)}
                              </td>
                              <td className="px-4 py-2.5 border border-gray-300 whitespace-nowrap">
                                <span className="flex items-center justify-center gap-2 w-full">
                                  <BankBadge code={row.BankType} size={20} />
                                  {getBankName(row.BankType) || "-"}
                                </span>
                              </td>
                              <td className="text-center px-4 py-2.5 border border-gray-300">
                                {row.CheckNo?.trim() || "-"}
                              </td>
                              <td className="text-center px-4 py-2.5 border border-gray-300">
                                {formatDate(row.receivedate)}
                              </td>
                              <td className="text-center px-4 py-2.5 border border-gray-300">
                                {formatDate(row.Billdate)}
                              </td>
                              <td className="px-4 py-2.5 border border-gray-300">
                                {row.createname?.trim() || "-"}
                              </td>
                              <td className="px-4 py-2.5 border border-gray-300">
                                {row.CustID} {row.Name?.trim()}
                              </td>
                              <td
                                className={`text-center px-4 py-2.5 border border-gray-300 font-medium ${status.className}`}
                              >
                                {status.label}
                              </td>
                              <td className="text-right px-4 py-2.5 border border-gray-300">
                                {formatAmount(Number(row.AMOUNT) || 0)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

              {!isLoading && filteredRows.length > 0 && viewMode === "list" && (
                <div className="space-y-3">
                  {filteredRows.map((row, index) => {
                    const status = getStatus(row.chequeStatus);
                    return (
                      <div
                        key={`${row.Runno || "row"}-${index}`}
                        onClick={() => setSelectedRow(row)}
                        className="flex gap-4 rounded-lg border border-gray-300 p-4 text-sm text-gray-700 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex w-20 shrink-0 flex-col items-center justify-center rounded-md border border-gray-300 py-2 text-gray-500">
                          <span>รายการ</span>
                          <span>ที่ {index + 1}</span>
                        </div>
                        <div className="flex flex-1 flex-col gap-3 md:flex-row md:justify-between">
                          <div className="space-y-1">
                            <p>
                              เลขที่ใบรับ : {row.Runno?.trim() || "-"} |
                              วันที่ใบรับ : {formatDate(row.receivedate)}
                            </p>
                            <p className="flex items-center gap-2 text-xl font-semibold text-blue-700">
                              <BankBadge code={row.BankType} size={28} />
                              {getBankName(row.BankType) || "-"}
                            </p>
                            <p>
                              เลขที่เช็ค : {row.CheckNo?.trim() || "-"} |
                              วันที่รับเช็ค : {formatDate(row.receivedate)}
                            </p>
                            <p>
                              ผู้บันทึกใบรับ : {row.createname?.trim() || "-"}
                            </p>
                          </div>
                          <div className="space-y-1 md:text-right">
                            <p>
                              ลูกค้า : {row.CustID} | {row.Name?.trim()}
                            </p>
                            <p className="text-2xl text-blue-700">
                              {formatAmount(Number(row.AMOUNT) || 0)}{" "}
                              <span className="text-sm text-gray-700">บาท</span>
                            </p>
                            <p>
                              วันที่สั่งจ่ายเช็ค : {formatDate(row.Billdate)}
                            </p>
                            <p>
                              สถานะ :{" "}
                              <span
                                className={`font-medium ${status.className}`}
                              >
                                {status.label}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <ChequeDetailModal
        row={selectedRow}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
}
