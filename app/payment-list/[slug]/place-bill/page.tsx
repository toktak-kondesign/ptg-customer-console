"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DatePicker, Popover } from "antd";
import dayjs, { Dayjs } from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCompanyBySlug, formatAmount } from "../../data";
import { getCustomerInfo, CUSTOMER_SESSION_CHANGED_EVENT } from "@/lib/auth";
import { img } from "@/lib/env";
import {
  getPlaceBillPdfUrl,
  getPlaceBillsService,
} from "@/services/customer/place-bills";
import type {
  PlaceBillCustomer,
  PlaceBillDetails,
  PlaceBillRow,
} from "@/interfaces/place-bill";

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

function formatVanNumber(value: string | null | undefined): string {
  const raw = (value || "").trim();
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10
    ? `${digits.slice(0, 4)}-${digits.slice(4, 5)}-${digits.slice(5, 9)}-${digits.slice(9)}`
    : raw;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "-";
  }
}

function formatPlaceDate(value: string | null | undefined): string {
  const match = String(value || "").match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "-";
  const year = Number(match[1]);
  const buddhistYear = year >= 2400 ? year : year + 543;
  return `${match[3]}/${match[2]}/${buddhistYear}`;
}

function placeDateParam(value: string | null | undefined): string {
  return String(value || "").match(/\d{4}-\d{2}-\d{2}/)?.[0] || "";
}

function formatMonthTitle(value: Dayjs): string {
  return `${value.format("MMMM")} ${value.year() + 543}`;
}

export default function PlaceBillPage() {
  const params = useParams<{ slug: string }>();
  const company = getCompanyBySlug(params.slug);
  const companyCode = COMPANY_BY_SLUG[params.slug];
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(() =>
    dayjs().startOf("month"),
  );
  const [pickerYear, setPickerYear] = useState<number>(currentMonth.year());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [details, setDetails] = useState<PlaceBillDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSessionInfo(getCustomerInfo());
    const handleChanged = () => setSessionInfo(getCustomerInfo());
    window.addEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
    return () =>
      window.removeEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
  }, []);

  const customerID = getCustomerField(sessionInfo, [
    "CustID",
    "CUSTID",
    "custID",
    "custId",
    "customerID",
    "customerId",
  ]);
  const placeDate = currentMonth.format("YYYY-MM-01");

  useEffect(() => {
    if (!companyCode || !customerID) {
      setDetails(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getPlaceBillsService(
        customerID,
        companyCode,
        placeDate,
      );
      if (cancelled) return;
      if (result.status === "success") {
        setDetails(result.results);
      } else {
        setDetails(null);
        setError(result.error || "ไม่สามารถโหลดข้อมูลใบวางบิลได้");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [companyCode, customerID, placeDate]);

  const sections = useMemo(() => {
    const customers = details?.customers || [];
    const bills = details?.bills || [];
    const billsByResale = new Map<string, PlaceBillRow[]>();
    bills.forEach((bill) => {
      const key = bill.ResaleID?.trim() || "";
      const rows = billsByResale.get(key) || [];
      rows.push(bill);
      billsByResale.set(key, rows);
    });

    const accountSections: Array<{
      key: string;
      title: string;
      customer?: PlaceBillCustomer;
      rows: PlaceBillRow[];
    }> = customers.map((customer: PlaceBillCustomer) => ({
      key: customer.ResaleID,
      title: customer.Name || "-",
      customer,
      rows: billsByResale.get(customer.ResaleID?.trim() || "") || [],
    }));
    const knownResaleIds = new Set(
      customers.map((customer) => customer.ResaleID?.trim() || ""),
    );
    const unmatchedRows = bills.filter(
      (bill) => !knownResaleIds.has(bill.ResaleID?.trim() || ""),
    );
    if (unmatchedRows.length) {
      accountSections.push({
        key: "other",
        title: "บัญชีอื่น ๆ",
        customer: undefined,
        rows: unmatchedRows,
      });
    }
    return accountSections;
  }, [details]);

  if (!company) return notFound();

  const bills = details?.bills || [];
  const totalAmount = bills.reduce(
    (sum, bill) => sum + (Number(bill.PlaceAmt) || 0),
    0,
  );
  const lastDate =
    details?.customers
      .map((customer) => customer.LastDate)
      .filter(Boolean)
      .sort()
      .at(-1) || null;

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
            <span className="text-blue-600 font-medium">ใบวางบิล</span>
          </p>

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 px-5 sm:px-8 py-8">
              <div className="flex items-start gap-5">
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={img("/images/icon-head.png")}
                    alt="ใบวางบิล"
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ใบวางบิลประจำเดือน</p>
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
                  <p className="text-xs text-blue-500 mt-1">
                    ข้อมูล ณ วันที่ {formatDateTime(lastDate)} น.
                  </p>
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

              <div className="flex flex-col items-start lg:items-end gap-5 shrink-0">
                <div className="relative w-40 h-20">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    fill
                    sizes="160px"
                    className="object-contain"
                  />
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-xs text-gray-500">
                    ยอดค้างชำระทั้งสิ้น{" "}
                    <span className="text-gray-400">(Total Amount)</span>
                  </p>
                  <p className="text-4xl font-bold text-blue-700 mt-1">
                    {formatAmount(totalAmount)}{" "}
                    <span className="text-base font-normal">บาท</span>
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    รวมใบวางบิล {bills.length} ใบ
                  </p>
                </div>
              </div>
            </div>

            {!customerID && (
              <div className="px-5 sm:px-8 pb-4">
                <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  ไม่พบรหัสลูกค้าในข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่
                </p>
              </div>
            )}
            {isLoading && (
              <p className="px-5 sm:px-8 pb-4 text-sm text-gray-500">
                กำลังโหลดข้อมูลใบวางบิล...
              </p>
            )}
            {error && (
              <div className="px-5 sm:px-8 pb-4">
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <div className="px-5 sm:px-8 pb-6 space-y-8">
              {sections.map((section) => {
                const sectionTotal = section.rows.reduce(
                  (sum, bill) => sum + (Number(bill.PlaceAmt) || 0),
                  0,
                );
                return (
                  <section key={section.key}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        รายงานบัญชี {section.title}
                      </h3>
                      <p className="text-xl text-blue-600 font-medium">
                        วงเงินทั้งหมด : {formatAmount(sectionTotal)} บาท
                      </p>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full min-w-[900px] text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="text-left font-semibold px-5 py-3 w-16">
                              ลำดับ
                            </th>
                            <th className="text-left font-semibold px-5 py-3">
                              เลขที่บัญชี
                            </th>
                            <th className="text-left font-semibold px-5 py-3">
                              เลขที่ใบวางบิล
                            </th>
                            <th className="text-left font-semibold px-5 py-3">
                              วันที่ใบบิล
                            </th>
                            <th className="text-right font-semibold px-5 py-3">
                              ยอดยกมา
                            </th>
                            <th className="text-right font-semibold px-5 py-3">
                              ยอดรวมที่ต้องชำระ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {section.rows.map((bill, index) => {
                            const billDate = placeDateParam(bill.PlaceDate);
                            const pdfUrl =
                              bill.FilePlace && billDate
                                ? getPlaceBillPdfUrl(
                                    bill.Company || companyCode,
                                    billDate,
                                    bill.FilePlace,
                                  )
                                : "";
                            return (
                              <tr
                                key={`${bill.PlaceCode}-${bill.FilePlace}-${index}`}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-5 py-3 text-gray-700">
                                  {index + 1}
                                </td>
                                <td className="px-5 py-3 text-gray-700">
                                  {formatVanNumber(bill.VanNO) || "---"}
                                </td>
                                <td className="px-5 py-3">
                                  {pdfUrl ? (
                                    <a
                                      href={pdfUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-700 underline underline-offset-4 hover:text-blue-600"
                                    >
                                      {bill.PlaceCode}
                                    </a>
                                  ) : (
                                    <span className="text-gray-700">
                                      {bill.PlaceCode || "-"}
                                    </span>
                                  )}
                                </td>
                                <td className="px-5 py-3 text-gray-700">
                                  {formatPlaceDate(bill.PlaceDate)}
                                </td>
                                <td className="px-5 py-3 text-right text-gray-700">
                                  {formatAmount(Number(bill.BeforAmt) || 0)}
                                </td>
                                <td className="px-5 py-3 text-right text-gray-700">
                                  {formatAmount(Number(bill.PlaceAmt) || 0)}
                                </td>
                              </tr>
                            );
                          })}
                          {!isLoading && section.rows.length === 0 && (
                            <tr>
                              <td
                                colSpan={6}
                                className="px-6 py-8 text-center text-gray-400"
                              >
                                ไม่พบข้อมูลใบวางบิล
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                );
              })}

              {!isLoading && !error && sections.length === 0 && (
                <p className="rounded-xl border border-gray-200 px-6 py-10 text-center text-gray-400">
                  ไม่พบข้อมูลใบวางบิลในเดือน{formatMonthTitle(currentMonth)}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 sm:px-8 py-4 border-t border-gray-200">
              <p className="text-sm flex items-center gap-2">
                <span className="font-bold text-blue-900">
                  <Image
                    src={img("/images/UOB-logo.png")}
                    alt="UOB"
                    width={60}
                    height={60}
                  />
                </span>
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
