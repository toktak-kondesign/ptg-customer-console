"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tooltip } from "antd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCustomerInfo, CUSTOMER_SESSION_CHANGED_EVENT } from "@/lib/auth";
import {
  paymentStatuses,
  companies,
  formatAmount,
  formatCompact,
  type Company,
  type PaymentStatusKey,
  type ViewMode,
} from "./data";
import { getColorDashboardService } from "@/services/customer/color-dashboard";
import type { ColorDashboardRow } from "@/interfaces/color-dashboard";
import Link from "next/link";

const COMPANY_CODE_TO_SLUG: Record<string, string> = {
  PTG: "ptg",
  PTG24: "ptg24",
  AKET: "ake",
  MONO: "mono",
};

const STATUS_BY_COLOR: Record<number, PaymentStatusKey> = {
  0: "not-due",
  1: "overdue-1-15",
  2: "overdue-16-30",
  3: "overdue-30",
};

function buildCompanyRows(
  rows: ColorDashboardRow[] | undefined,
  slug: string,
): Company["rows"] {
  if (!rows || rows.length === 0) return [];
  const filtered = rows.filter(
    (row) => COMPANY_CODE_TO_SLUG[row.Company] === slug,
  );
  const grouped = new Map<
    PaymentStatusKey,
    { count: number; amount: number }
  >();
  for (const row of filtered) {
    const status = STATUS_BY_COLOR[row.Color1];
    if (!status) continue;
    const existing = grouped.get(status);
    if (existing) {
      existing.count += Number(row.Cmt) || 0;
      existing.amount += Number(row.Amt) || 0;
    } else {
      grouped.set(status, {
        count: Number(row.Cmt) || 0,
        amount: Number(row.Amt) || 0,
      });
    }
  }
  return paymentStatuses
    .slice()
    .sort((a, b) => {
      const colorA = Number(
        Object.keys(STATUS_BY_COLOR).find(
          (k) => STATUS_BY_COLOR[Number(k)] === a.key,
        ),
      );
      const colorB = Number(
        Object.keys(STATUS_BY_COLOR).find(
          (k) => STATUS_BY_COLOR[Number(k)] === b.key,
        ),
      );
      return colorB - colorA;
    })
    .map((status) => {
      const data = grouped.get(status.key);
      return data
        ? { status: status.key, count: data.count, amount: data.amount }
        : null;
    })
    .filter((row): row is Company["rows"][number] => row !== null);
}

function getCustomerField(
  info: Record<string, unknown> | null,
  names: string[],
): string {
  if (!info) return "";
  const keys = Object.keys(info);
  for (const name of names) {
    const key = keys.find((k) => k.toLowerCase() === name.toLowerCase());
    if (key) {
      const value = info[key];
      if (value === null || value === undefined) return "";
      return String(value).trim();
    }
  }
  return "";
}

function formatCustomerAddress(info: Record<string, unknown> | null): string {
  if (!info) return "";
  const parts = [
    getCustomerField(info, ["Address1", "address1", "Add1", "add1"]),
    getCustomerField(info, ["Address2", "address2", "Add2", "add2"]),
    getCustomerField(info, ["Address3", "address3", "Add3", "add3"]),
    getCustomerField(info, ["City", "city", "District", "district"]),
    getCustomerField(info, ["State", "state", "Province", "province"]),
    getCustomerField(info, ["ZipCode", "zipCode", "Zipcode", "zipcode", "Zip"]),
  ];
  return parts.filter(Boolean).join(" ");
}

const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
) => {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};

const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
};

function PieChart({ rows }: { rows: Company["rows"] }) {
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  if (rows.length === 0) return null;
  const cx = 100;
  const cy = 100;
  const r = 80;

  let acc = 0;
  const slices = rows.map((row) => {
    const status = paymentStatuses.find((item) => item.key === row.status)!;
    const value = row.amount;
    const startAngle = total > 0 ? (acc / total) * 360 : 0;
    acc += value;
    const endAngle = total > 0 ? (acc / total) * 360 : 0;
    const midAngle = (startAngle + endAngle) / 2;
    const labelPos = polarToCartesian(cx, cy, r * 0.62, midAngle);
    const pct = total > 0 ? (value / total) * 100 : 0;
    return {
      status,
      value,
      pct,
      startAngle,
      endAngle,
      labelPos,
      isFull: endAngle - startAngle >= 359.999,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 py-4 px-6">
      <svg viewBox="0 0 200 200" className="w-48 h-48 shrink-0">
        {slices.map((slice, i) =>
          slice.isFull ? (
            <circle key={i} cx={cx} cy={cy} r={r} fill={slice.status.hex} />
          ) : (
            <path
              key={i}
              d={arcPath(cx, cy, r, slice.startAngle, slice.endAngle)}
              fill={slice.status.hex}
              stroke="#fff"
              strokeWidth={1}
            />
          ),
        )}
        <circle cx={cx} cy={cy} r={36} fill="#fff" />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="fill-gray-400"
          style={{ fontSize: 9 }}
        >
          ยอดรวม
        </text>
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          className="fill-gray-900 font-semibold"
          style={{ fontSize: 10 }}
        >
          {formatCompact(total)}
        </text>
      </svg>
      <ul className="flex-1 space-y-2 w-full">
        {slices.map((slice) => (
          <li
            key={slice.status.key}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: slice.status.hex }}
              />
              <span className="truncate text-gray-600">
                {slice.status.label}
              </span>
            </span>
            <span className="flex items-center gap-3 shrink-0">
              <span className="text-gray-900 font-medium">
                {formatAmount(slice.value)}
              </span>
              <span className="text-gray-400 w-12 text-right">
                {slice.pct.toFixed(1)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ColumnChart({ rows }: { rows: Company["rows"] }) {
  if (rows.length === 0) return null;
  const max = Math.max(...rows.map((row) => row.amount));
  const width = 360;
  const height = 220;
  const padLeft = 56;
  const padRight = 16;
  const padTop = 24;
  const padBottom = 56;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const barGap = 18;
  const barW = (plotW - barGap * (rows.length - 1)) / rows.length;
  const ticks = 4;

  return (
    <div className="py-4 px-6 overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[360px] h-[220px]"
      >
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const v = (max / ticks) * i;
          const y = padTop + plotH - (v / max) * plotH;
          return (
            <g key={i}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth={1}
              />
              <text
                x={padLeft - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-gray-400"
                style={{ fontSize: 9 }}
              >
                {formatCompact(v)}
              </text>
            </g>
          );
        })}
        {rows.map((row, i) => {
          const status = paymentStatuses.find(
            (item) => item.key === row.status,
          )!;
          const h = (row.amount / max) * plotH;
          const x = padLeft + i * (barW + barGap);
          const y = padTop + plotH - h;
          const labelX = x + barW / 2;
          return (
            <g key={row.status}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={4}
                fill={status.hex}
              />
              <text
                x={labelX}
                y={y - 6}
                textAnchor="middle"
                className="fill-gray-700 font-medium"
                style={{ fontSize: 9 }}
              >
                {formatCompact(row.amount)}
              </text>
              <text
                x={labelX}
                y={height - padBottom + 14}
                textAnchor="middle"
                className="fill-gray-500"
                style={{ fontSize: 8.5 }}
              >
                {row.count} รายการ
              </text>
              <text
                x={labelX}
                y={height - padBottom + 30}
                textAnchor="middle"
                className="fill-gray-600"
                style={{ fontSize: 8 }}
              >
                {status.label.length > 18
                  ? status.label.slice(0, 16) + "…"
                  : status.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const viewOptions: { key: ViewMode; label: string }[] = [
  { key: "table", label: "ตาราง" },
  { key: "pie", label: "Pie Chart" },
  { key: "column", label: "Column Graph" },
];

function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {viewOptions.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
            value === opt.key
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function PaymentListPage() {
  const router = useRouter();
  const [viewByCompany, setViewByCompany] = useState<Record<string, ViewMode>>(
    {},
  );
  const [customerInfo, setCustomerInfo] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [apiRows, setApiRows] = useState<ColorDashboardRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCustomerInfo(getCustomerInfo());
    const handleChanged = () => setCustomerInfo(getCustomerInfo());
    window.addEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
    return () => {
      window.removeEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
    };
  }, []);

  const custID = getCustomerField(customerInfo, [
    "CustID",
    "CUSTID",
    "custId",
    "custID",
  ]);

  useEffect(() => {
    if (!custID) {
      setApiRows([]);
      setError(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getColorDashboardService(custID);
      if (cancelled) return;
      if (result.status === "success") {
        setApiRows(result.results);
        setError(null);
      } else {
        setApiRows([]);
        setError(result.error ?? "ไม่สามารถโหลดข้อมูลได้");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [custID]);

  const companiesView: Company[] = companies
    .map((company) => ({
      ...company,
      rows: buildCompanyRows(apiRows, company.slug),
    }))
    .filter((company) => company.rows.length > 0);

  const setView = (companyName: string, view: ViewMode) =>
    setViewByCompany((prev) => ({ ...prev, [companyName]: view }));

  const goToDetail = (company: Company) =>
    router.push(`/payment-list/${company.slug}`);

  const totalCount = companiesView
    .flatMap((company) => company.rows)
    .reduce((sum, row) => sum + row.count, 0);
  const totalAmount = companiesView
    .flatMap((company) => company.rows)
    .reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-7">
            <p className="text-sm text-blue-600 mb-2">
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
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              PAYMENT LIST
            </h1>
            <p className="text-gray-500">รายการชำระเงิน</p>
          </div>

          <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
            <p className="text-sm text-gray-500 mb-1">ข้อมูลลูกค้า</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  CUSTOMER INFORMATION
                </h2>
                <dl className="mt-3 text-sm space-y-1">
                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">รหัสลูกค้า:</dt>
                    <dd className="border-b">
                      {getCustomerField(customerInfo, [
                        "ResaleID",
                        "resaleID",
                        "CUSTID",
                        "CustID",
                        "custId",
                      ])}
                      {getCustomerField(customerInfo, [
                        "CusName",
                        "cusName",
                        "CustomerName",
                        "customerName",
                      ]) && (
                        <>
                          {" : "}
                          {getCustomerField(customerInfo, [
                            "CusName",
                            "cusName",
                            "CustomerName",
                            "customerName",
                          ])}
                        </>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">ที่อยู่:</dt>
                    <dd className="border-b">
                      {formatCustomerAddress(customerInfo) ||
                        "37/2 หมู่ที่ 5 ตำบลทรายขาว อำเภอทัวไทร จังหวัดนครศรีธรรมราช"}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500 shrink-0">โทรศัพท์:</dt>
                    <dd className="border-b">
                      {getCustomerField(customerInfo, [
                        "PhoneNum",
                        "phoneNum",
                        "Phone",
                        "phone",
                        "Tel",
                        "tel",
                      ]) || "075-388157"}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:min-w-[340px]">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-xs text-blue-600">จำนวนรายการทั้งหมด</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {totalCount}
                  </p>
                </div>
                <div className="rounded-xl bg-[#0B132B] p-4 text-white">
                  <p className="text-xs text-gray-300">ยอดค้างชำระทั้งสิ้น</p>
                  <p className="text-xl font-bold mt-1">
                    {formatAmount(totalAmount)}{" "}
                    <span className="text-xs font-normal">บาท</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6 px-1">
            {paymentStatuses.map((status) => (
              <div
                key={status.key}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <span className={`w-3 h-3 rounded-full ${status.color}`} />
                {status.label}
              </div>
            ))}
          </div>

          {isLoading && (
            <p className="text-sm text-gray-500 mb-4 px-1">
              กำลังโหลดข้อมูล...
            </p>
          )}
          {!isLoading && error && (
            <p className="text-sm text-red-500 mb-4 px-1">{error}</p>
          )}

          <div className="space-y-5">
            {companiesView.map((company) => {
              const companyTotal = company.rows.reduce(
                (sum, row) => sum + row.amount,
                0,
              );
              const view = viewByCompany[company.name] ?? "table";
              const hasData = company.rows.length > 0;
              return (
                <section
                  key={company.name}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-5 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-10 shrink-0">
                        <Image
                          src={company.logo}
                          alt={company.name}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {company.name}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {company.nameEn}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <p className="text-sm text-gray-500">
                        ยอดรวม:{" "}
                        <strong className="text-gray-900 text-base">
                          {formatAmount(companyTotal)} บาท
                        </strong>
                      </p>
                      {hasData && (
                        <ViewToggle
                          value={view}
                          onChange={(v) => setView(company.name, v)}
                        />
                      )}
                    </div>
                  </div>

                  {!hasData ? (
                    <div className="px-6 py-10 text-center text-gray-400">
                      ไม่พบรายการชำระเงิน
                    </div>
                  ) : view === "table" ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] text-sm">
                        <thead className="bg-[#34467d] text-white">
                          <tr>
                            <th className="text-left font-medium px-6 py-3">
                              สถานะการชำระ
                            </th>
                            <th className="text-right font-medium px-6 py-3 w-40">
                              จำนวนรายการ
                            </th>
                            <th className="text-right font-medium px-6 py-3 w-56">
                              ยอดเงิน (บาท)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {company.rows.map((row) => {
                            const status = paymentStatuses.find(
                              (item) => item.key === row.status,
                            )!;
                            return (
                              <tr
                                key={row.status}
                                onClick={() => goToDetail(company)}
                                className="hover:bg-blue-50 transition-colors cursor-pointer"
                              >
                                <td className="px-6 py-4">
                                  <span className="flex items-center gap-3">
                                    <span
                                      className={`w-3 h-3 rounded-full ${status.color}`}
                                    />
                                    {status.label}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-700">
                                  {row.count}
                                </td>
                                <td
                                  className={`px-6 py-4 text-right ${status.textClass}`}
                                >
                                  {formatAmount(row.amount)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : view === "pie" ? (
                    <div
                      onClick={() => goToDetail(company)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <PieChart rows={company.rows} />
                    </div>
                  ) : (
                    <div
                      onClick={() => goToDetail(company)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <ColumnChart rows={company.rows} />
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
