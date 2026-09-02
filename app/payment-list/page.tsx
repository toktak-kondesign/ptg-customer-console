"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const paymentStatuses = [
  {
    key: "not-due",
    label: "ยังไม่เกินกำหนดชำระ",
    color: "bg-gray-400",
    hex: "#9CA3AF",
  },
  {
    key: "overdue-1-15",
    label: "เกินกำหนดน้อยกว่า 15 วัน",
    color: "bg-[#8BC53F]",
    hex: "#8BC53F",
  },
  {
    key: "overdue-16-30",
    label: "เกินกำหนด 16–30 วัน",
    color: "bg-[#FFD400]",
    hex: "#FFD400",
  },
  {
    key: "overdue-30",
    label: "เกินกำหนดมากกว่า 30 วัน",
    color: "bg-[#ED1C24]",
    hex: "#ED1C24",
  },
] as const;

type PaymentStatusKey = (typeof paymentStatuses)[number]["key"];
type ViewMode = "table" | "pie" | "column";

type Company = {
  name: string;
  nameEn: string;
  rows: { status: PaymentStatusKey; count: number; amount: number }[];
};

const companies: Company[] = [
  {
    name: "บริษัท ผาทองทุ่งสง จำกัด",
    nameEn: "PHATHONG THUNGSONG Co.,Ltd",
    rows: [{ status: "not-due", count: 8, amount: 301587.35 }],
  },
  {
    name: "บริษัท ผาทอง24 จำกัด",
    nameEn: "PHATHONG24 Co.,Ltd",
    rows: [
      { status: "overdue-30", count: 59, amount: 720762.12 },
      { status: "overdue-16-30", count: 14, amount: 80627.5 },
      { status: "overdue-1-15", count: 29, amount: 393413.21 },
      { status: "not-due", count: 86, amount: 4656669.84 },
    ],
  },
  {
    name: "บริษัท เอกทรานสปอร์ต 2016 จำกัด",
    nameEn: "Ake Transport Co,Ltd",
    rows: [],
  },
  {
    name: "บริษัท โมโนเซเปียน จำกัด",
    nameEn: "Monosapian Co,Ltd",
    rows: [],
  },
];

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatCompact = (amount: number) => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return `${amount}`;
};

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
  const [viewByCompany, setViewByCompany] = useState<Record<string, ViewMode>>(
    {},
  );

  const setView = (companyName: string, view: ViewMode) =>
    setViewByCompany((prev) => ({ ...prev, [companyName]: view }));

  const totalCount = companies
    .flatMap((company) => company.rows)
    .reduce((sum, row) => sum + row.count, 0);
  const totalAmount = companies
    .flatMap((company) => company.rows)
    .reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-7">
            <p className="text-sm text-blue-600 mb-2">
              หน้าหลัก / รายการชำระเงิน
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
                <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-1 mt-3 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-gray-500">รหัสลูกค้า:</dt>
                    <dd className="font-medium">C1601451</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500">บริษัท:</dt>
                    <dd className="font-medium">PTG GROUP</dd>
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

          <div className="space-y-5">
            {companies.map((company) => {
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
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {company.name}
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {company.nameEn}
                      </p>
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
                        <thead className="bg-gray-50 text-gray-500">
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
                                className="hover:bg-gray-50 transition-colors"
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
                                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                  {formatAmount(row.amount)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : view === "pie" ? (
                    <PieChart rows={company.rows} />
                  ) : (
                    <ColumnChart rows={company.rows} />
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
