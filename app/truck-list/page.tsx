"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { img } from "@/lib/env";
import { mockTrucks, type TruckCard } from "./data";

type ViewMode = "table" | "card";

const TruckAvatar = ({ size = "h-16 w-16" }: { size?: string }) => (
  <div
    className={`relative ${size} shrink-0 rounded-full bg-gray-100 border border-gray-200 overflow-hidden`}
  >
    <Image
      src={img("/images/Trucks-2.png")}
      alt=""
      fill
      sizes="64px"
      className="object-contain p-2 opacity-70"
    />
  </div>
);

const CancelButton = ({ plate }: { plate: string }) => (
  <button
    type="button"
    aria-label={`ยกเลิกบัตร ${plate}`}
    className="flex flex-col items-center gap-0.5 text-xs text-red-600 hover:text-red-700 transition"
  >
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
    </svg>
    ยกเลิกบัตร
  </button>
);

function ActionCard({
  title,
  icon,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-white/30 bg-gradient-to-br from-gray-100/95 via-gray-300/90 to-gray-500/90 px-4 py-3 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/70 text-gray-700">
        {icon}
      </span>
      <span className="flex-1 text-sm font-semibold text-gray-800">
        {title}
      </span>
      <span className="text-gray-600 transition group-hover:translate-x-1">
        ›
      </span>
    </Link>
  );
}

export default function TruckListPage() {
  const [view, setView] = useState<ViewMode>("table");
  const [query, setQuery] = useState("");

  const trucks = useMemo<TruckCard[]>(
    () =>
      mockTrucks.filter((t) =>
        t.CarRegister.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header />
      <main className="flex-1">
        <section
          className="relative h-[320px] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${img("/images/banner_truck.jpg")})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
          <div className="relative mx-auto h-full max-w-7xl px-4 sm:px-6">
            <p className="pt-6 text-sm text-dark/80">
              <Link href="/" className="hover:text-dark/80">
                หน้าหลัก
              </Link>
              <span className="mx-2 text-dark-80">|</span>
              <span className="text-dark/80">ข้อมูลรายการรถบรรทุก</span>
            </p>
            <div className="absolute bottom-8 left-4 sm:left-6 text-white">
              <h1 className="text-3xl sm:text-4xl font-bold drop-shadow">
                รายการรถบรรทุก
              </h1>
              <p className="text-right text-base font-medium text-gray-300">
                Find Truck
              </p>
            </div>

            <div className="absolute right-4 top-1/2 hidden w-80 -translate-y-1/2 space-y-3 sm:right-6 md:block">
              <div className="w-1/4 min-w-[96px] rounded-lg bg-white/90 px-3 py-2 text-center shadow">
                <p className="text-lg font-bold leading-tight text-gray-900">
                  {mockTrucks.length}{" "}
                  <span className="text-xs font-medium">คัน</span>
                </p>
              </div>
              <ActionCard
                title="ขอบัตรรถรับสินค้าชั่วคราว"
                href="#"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M12 9v6M9 12h6" strokeLinecap="round" />
                  </svg>
                }
              />
              <ActionCard
                title="ประวัติการขอบัตรรถ"
                href="#"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" strokeLinecap="round" />
                  </svg>
                }
              />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              รถทั้งหมด <span className="text-blue-600">{trucks.length}</span>{" "}
              คัน
            </h2>
            <div className="flex items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาทะเบียนรถ"
                className="w-full sm:w-56 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                {(["table", "card"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setView(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                      view === key
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {key === "table" ? "ตาราง" : "การ์ด"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {trucks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
              ไม่พบข้อมูลรถบรรทุก
            </div>
          ) : view === "card" ? (
            <ul className="space-y-3">
              {trucks.map((t) => (
                <li
                  key={t.RunID}
                  className="flex items-center gap-4 rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm transition hover:shadow-md sm:gap-6"
                >
                  <span className="w-8 text-center text-sm text-gray-500">
                    {t.Row1}
                  </span>
                  <TruckAvatar />
                  <div className="border-l border-gray-300 pl-3 leading-tight">
                    <p className="text-xs text-gray-500">ทะเบียนรถ</p>
                    <p className="text-base font-semibold text-blue-700">
                      {t.CarRegister}
                    </p>
                  </div>
                  <p className="hidden flex-1 truncate text-xs text-gray-500 sm:block">
                    {t.Remark}
                  </p>
                  <div className="ml-auto sm:ml-0 sm:w-40 sm:flex sm:justify-center">
                    <CancelButton plate={t.CarRegister} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">RunID</th>
                    <th className="px-4 py-3 font-medium">เลขบัตร</th>
                    <th className="px-4 py-3 font-medium">ทะเบียนรถ</th>
                    <th className="px-4 py-3 font-medium">รหัสลูกค้า</th>
                    <th className="px-4 py-3 font-medium">หมายเหตุ</th>
                    <th className="px-4 py-3 font-medium">วันที่สร้าง</th>
                    <th className="px-4 py-3 font-medium">ใช้บัตรล่าสุด</th>
                    <th className="px-4 py-3 text-center font-medium">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {trucks.map((t) => (
                    <tr
                      key={t.RunID}
                      className="transition hover:bg-blue-50/40"
                    >
                      <td className="px-4 py-3 text-gray-500">{t.Row1}</td>
                      <td className="px-4 py-3 text-gray-500">{t.RunID}</td>
                      <td className="px-4 py-3 font-mono text-gray-700">
                        {t.CardID}
                      </td>
                      <td className="px-4 py-3 font-semibold text-blue-700">
                        {t.CarRegister}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{t.CustID}</td>
                      <td className="px-4 py-3 text-gray-500">{t.Remark}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        {t.DateCreated.slice(0, 16)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        {t.LastUseCard ? t.LastUseCard.slice(0, 16) : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <CancelButton plate={t.CarRegister} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
