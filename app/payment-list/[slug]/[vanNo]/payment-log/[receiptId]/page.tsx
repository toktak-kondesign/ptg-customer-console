"use client";

import { useEffect, useMemo, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCompanyBySlug, formatAmount } from "@/app/payment-list/data";
import { getCustomerInfo, CUSTOMER_SESSION_CHANGED_EVENT } from "@/lib/auth";
import { img } from "@/lib/env";
import { getReceiptStatusListService } from "@/services/customer/receipt-status";
import type { ReceiptStatusRow } from "@/interfaces/receipt-status";
import ReceiptDeductionModal from "./ReceiptDeductionModal";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const COMPANY_BY_SLUG: Record<string, string> = {
  ptg: "PTG",
  ptg24: "PTG24",
  ake: "AKET",
  mono: "MONO",
};

const STEPS = [
  { label: "ตรวจสอบข้อมูล", key: 1, icon: "/images/step-search.svg" },
  { label: "ประมวลผลข้อมูล", key: 2, icon: "/images/step-process.svg" },
  { label: "ดำเนินการเสร็จสิ้น", key: 3, icon: "/images/step-done.svg" },
];

function getStatusLabel(status: number): string {
  if (status >= 3) return "ดำเนินการเสร็จสิ้น";
  if (status === 2) return "ถึงประมวณผล";
  return "ตรวจสอบข้อมูล";
}

function getStatusBadgeClass(status: number): string {
  if (status >= 3) return "bg-green-700 text-white border border-green-200";
  if (status === 2) return "bg-blue-100 text-blue-700 border border-blue-200";
  return "bg-yellow-100 text-yellow-700 border border-yellow-200";
}

function parseDate(value: string | null | undefined): dayjs.Dayjs | null {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
}

function formatThaiDateTime(value: string | null | undefined): string {
  const date = parseDate(value);
  if (!date) return "-";
  const dayName = date.format("dddd");
  const buddhistYear = date.year() + 543;
  return `วัน${dayName}ที่ ${date.format("D MMMM")} ${buddhistYear} เวลา ${date.format("HH:mm:ss")} น.`;
}

function formatThaiDate(value: string | null | undefined): string {
  const date = parseDate(value);
  if (!date) return "-";
  const buddhistYear = date.year() + 543;
  return `${date.format("D MMMM")} ${buddhistYear}`;
}

export default function ReceiptStatusPage() {
  const params = useParams<{
    slug: string;
    vanNo: string;
    receiptId: string;
  }>();
  const company = getCompanyBySlug(params.slug);
  const companyCode = COMPANY_BY_SLUG[params.slug];
  const vanNoRaw = decodeURIComponent(params.vanNo || "");
  const receiptId = decodeURIComponent(params.receiptId || "");

  const [sessionInfo, setSessionInfo] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [rows, setRows] = useState<ReceiptStatusRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deductionOpen, setDeductionOpen] = useState(false);

  useEffect(() => {
    setSessionInfo(getCustomerInfo());
    const handleChanged = () => setSessionInfo(getCustomerInfo());
    window.addEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
    return () =>
      window.removeEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
  }, []);

  useEffect(() => {
    if (!companyCode || !receiptId) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getReceiptStatusListService(companyCode, receiptId);
      if (cancelled) return;
      if (result.status === "success") {
        setRows(result.results || []);
      } else {
        setError(result.error || "ไม่สามารถโหลดสถานะใบเสร็จได้");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [companyCode, receiptId]);

  const data: ReceiptStatusRow = useMemo(() => rows[0] || {}, [rows]);

  const status01 = Number(data.Status01) || 0;

  const customerName =
    (data.Name ?? "").trim() ||
    (typeof sessionInfo?.CusName === "string" && sessionInfo.CusName.trim()) ||
    "-";

  if (!company) return notFound();

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
              {vanNoRaw}
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <Link
              href={`/payment-list/${params.slug}/${encodeURIComponent(params.vanNo)}/payment-log`}
              className="text-gray-500 hover:text-gray-700"
            >
              รายละเอียดการชำระเงิน
            </Link>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-blue-600 font-medium">สถานะใบเสร็จ</span>
          </p>

          <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 px-5 sm:px-8 pt-7">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  สถานะการชำระเงิน
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  รายละเอียดสถานะใบเสร็จและประวัติการดำเนินการ
                </p>
              </div>
              {/* <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="ค้นหา"
                  className="w-48 sm:w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  className="rounded-lg bg-[#55AFF4] px-5 py-2 text-sm font-medium text-white hover:bg-blue-500 transition"
                >
                  ค้นหา
                </button>
              </div> */}
            </div>

            <div className="px-5 sm:px-8 py-8">
              {/* Stepper */}
              <div className="flex items-center justify-center">
                <div className="flex items-center w-full max-w-2xl">
                  {STEPS.map((step, index) => {
                    const isActive = status01 >= step.key;
                    const isLast = index === STEPS.length - 1;
                    return (
                      <div key={step.key} className="flex-1 flex items-center">
                        <div
                          className={`flex flex-col ${!isLast ? "items-center" : "items-start"} flex-1`}
                        >
                          <div
                            className={[
                              "flex h-[5rem] w-[5rem] items-center justify-center rounded-full border-4 transition",
                              isActive
                                ? "border-blue-300 bg-gradient-to-br from-[#7CC4F7] to-[#2E9BE6] text-white"
                                : "border-gray-200 bg-gray-100 text-gray-400",
                            ].join(" ")}
                          >
                            <Image
                              src={img(step.icon)}
                              alt={step.label}
                              width={44}
                              height={44}
                              className="object-contain"
                              style={{
                                filter: isActive
                                  ? "brightness(0) invert(1)"
                                  : "grayscale(1) opacity(0.45)",
                              }}
                            />
                          </div>
                          <span
                            className={[
                              "mt-2 text-xs font-medium text-center",
                              isActive ? "text-[#55AFF4]" : "text-gray-400",
                            ].join(" ")}
                          >
                            {step.label}
                          </span>
                        </div>
                        {!isLast && (
                          <div
                            className={[
                              "h-1 flex-1 mx-2 rounded",
                              status01 > step.key
                                ? "bg-[#55AFF4]"
                                : "bg-gray-200",
                            ].join(" ")}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center gap-3 py-12">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                  <span className="text-sm text-gray-500">
                    กำลังโหลดสถานะใบเสร็จ...
                  </span>
                </div>
              )}

              {error && !isLoading && (
                <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {!isLoading && !error && (
                <>
                  {/* Info card */}
                  <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 ">
                      <h2 className="text-sm font-semibold text-gray-800">
                        ข้อมูลการชำระเงิน :
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                      <div className="px-5 py-4 gradient-gray-top">
                        <p className="text-xs text-gray-500 mb-1">
                          เลขที่ใบเสร็จ :
                        </p>
                        <p className="text-2xl font-medium text-blue-600">
                          {(data.xReceiptID_c ?? "").trim() || "-"}
                        </p>
                      </div>
                      <div className="px-5 py-4 gradient-gray-top">
                        <p className="text-xs text-gray-500 mb-1">
                          ประเภทการชำระเงิน :
                        </p>
                        <p className="text-2xl font-medium text-gray-800">
                          {(data.TypePay ?? "").trim() || "-"}
                        </p>
                      </div>
                      <div className="px-5 py-4 gradient-gray-top">
                        <p className="text-xs text-gray-500 mb-1">
                          รับชำระเข้าบัญชีบริษัท :
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="relative h-8 w-12">
                            <Image
                              src={company.logo}
                              alt={company.name}
                              fill
                              sizes="64px"
                              className="object-contain"
                            />
                          </div>
                          <span className="text-lg font-medium text-gray-800">
                            {company.name}
                          </span>
                        </div>
                      </div>
                      <div className="px-5 py-4 gradient-gray-top">
                        <p className="text-xs text-gray-500 mb-1">
                          สถานะการชำระเงิน :
                        </p>
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xl font-medium",
                            getStatusBadgeClass(status01),
                          ].join(" ")}
                        >
                          {getStatusLabel(status01)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* History timeline */}
                  <div className="mt-8">
                    <h2 className="text-sm font-semibold text-gray-800 mb-4">
                      สถานะการชำระเงิน :
                    </h2>
                    <div className="relative pl-4">
                      <div className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-gray-200" />
                      <div className="space-y-6">
                        {/* Transfer */}
                        <div className="relative pl-6">
                          <span className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-gray-300 bg-white" />
                          <p className="text-sm text-[#df9b1c]">
                            {formatThaiDateTime(data.Date01)}
                          </p>
                          <p className="mt-1 text-sm text-gray-800">
                            โอนเงินผ่านธนาคาร :{" "}
                            <span className="font-medium">
                              {(data.xBankName_c ?? "").trim() || "-"}
                            </span>
                          </p>
                        </div>

                        {/* Finance verification */}
                        <div className="relative pl-6">
                          <span className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-gray-300 bg-white" />
                          <p className="text-sm text-[#df9b1c]">
                            {formatThaiDateTime(data.Date02)}
                          </p>
                          <p className="mt-1 text-sm text-gray-800">
                            ฝ่ายการเงิน ตรวจสอบข้อมูลและทำรายการรับเงินเข้าระบบ
                          </p>
                          <div className="mt-1 ml-4 text-sm text-gray-700 space-y-0.5">
                            <p>
                              - ลูกค้า :{" "}
                              <span className="font-medium">
                                {(data.Name ?? "").trim() || "-"}
                              </span>
                            </p>
                            <p>
                              - รับเงินโอนเข้า{" "}
                              <span className="font-medium">
                                {formatAmount(Number(data.Number01) || 0)}
                              </span>{" "}
                              บาท
                            </p>
                          </div>
                        </div>

                        {/* Deduction group */}
                        <div className="relative pl-6">
                          <span className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-gray-300 bg-white" />
                          <p className="text-sm text-[#df9b1c]">
                            {formatThaiDate(data.xTimeList_c)}
                          </p>
                          <p className="mt-1 text-sm text-gray-800">
                            กลุ่มที่ตัดชำระค่าสินค้า
                          </p>
                          <div className="mt-1 ml-4 text-sm text-gray-700">
                            <p>
                              - กลุ่มสินค้าที่ตัดชำระ{" "}
                              <span className="font-medium">
                                {(data.Reference ?? "").trim() || "-"}
                              </span>{" "}
                              จำนวน :{" "}
                              <span className="font-medium">
                                {formatAmount(Number(data.TranAmt) || 0)}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Completed */}
                        {status01 >= 3 && (
                          <div className="relative pl-6">
                            <span className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full bg-green-500 ring-4 ring-green-100" />
                            <p className="text-sm font-medium text-green-600">
                              ดำเนินการเสร็จสิ้น
                            </p>
                            <button
                              type="button"
                              onClick={() => setDeductionOpen(true)}
                              className="text-sm text-gray-400 mt-0.5 hover:text-blue-500 transition"
                            >
                              <span className="underline underline-offset-2">
                                ดูรายละเอียดการตัดชำระสินค้า
                              </span>
                              {" | "}
                              {(data.xReceiptID_c ?? "").trim() || "-"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
      <ReceiptDeductionModal
        open={deductionOpen}
        vanNo={vanNoRaw}
        receipt={(data.xReceiptID_c ?? "").trim()}
        headNum={String(data.HeadNum ?? "")}
        onClose={() => setDeductionOpen(false)}
      />
      <Footer />
    </div>
  );
}
