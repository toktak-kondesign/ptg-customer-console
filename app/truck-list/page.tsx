"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Modal } from "antd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OtpConfirmModal from "@/components/OtpConfirmModal";
import {
  CUSTOMER_SESSION_CHANGED_EVENT,
  getAuthUser,
  getSessionCustomerId,
} from "@/lib/auth";
import { img } from "@/lib/env";
import {
  cancelCardService,
  getCardTempListService,
} from "@/services/customer/card-temp";
import type { CardTempRow as TruckCard } from "@/interfaces/card-temp";
import type { VerifyOtpPayload } from "@/interfaces/otp";
import RequestCardModal from "./RequestCardModal";

type ViewMode = "table" | "card";

const CancelIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
  </svg>
);

const CancelButton = ({
  plate,
  cardId,
  runId,
  onCancelled,
}: {
  plate: string;
  cardId: string;
  runId: number;
  onCancelled: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpCustId, setOtpCustId] = useState("");
  const [doneOpen, setDoneOpen] = useState(false);

  const handleConfirmCancel = () => {
    setOtpCustId(getSessionCustomerId());
    setOpen(false);
    setOtpOpen(true);
  };

  const handleVerifyAndCancel = (payload: VerifyOtpPayload) =>
    cancelCardService({
      ...payload,
      custID: otpCustId,
      runID: runId,
      userName: getAuthUser()?.username || otpCustId,
    });

  const handleOtpVerified = () => {
    setOtpOpen(false);
    setDoneOpen(true);
  };

  const handleDoneClose = () => {
    setDoneOpen(false);
    onCancelled();
  };

  return (
    <>
      <button
        type="button"
        aria-label={`ยกเลิกบัตร ${plate}`}
        onClick={() => setOpen(true)}
        className="flex flex-col items-center gap-0.5 text-xs text-red-600 hover:text-red-700 transition"
      >
        <CancelIcon />
        ยกเลิกบัตร
      </button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        width={640}
      >
        <div className="px-4 py-2 text-center">
          <div className="flex items-center justify-center gap-2 text-red-600">
            <CancelIcon className="h-14 w-14" />
            <h3 className="text-xl font-semibold">
              ยืนยันการยกเลิกบัตรรับสินค้า
            </h3>
          </div>
          <p className="mt-5 text-gray-800">
            คุณต้องการยกเลิกบัตรรับสินค้า หมายเลข{" "}
            <span className="font-semibold">{cardId}</span>
          </p>
          <p className="mt-1">
            <span className="bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
              ทะเบียนรถ {plate}
            </span>
          </p>
          <p className="mt-6 text-left text-red-600">หมายเหตุ</p>
          <p className="mt-1 border border-gray-300 px-4 py-3 text-left text-sm leading-relaxed text-red-600">
            เมื่อคุณทำการยกเลิกบัตรไปแล้ว
            ไม่สามารถที่จะนำบัตรใบนี้กลับมาใช้งานได้อีก
            ไม่ว่ากรณีใดก็ตามธุรกรรมอื่นใดที่เกี่ยวข้องกับบัตรใบนี้
            ที่เกิดขึ้นก่อนการยกเลิก ถือว่าอยู่ในความรับผิดชอบของลูกค้าทุกประการ
            และเพื่อความปลอดภัยในข้อมูล ของลูกค้าเอง ให้ดำเนินการส่งบัตรนั้นคืน
            ทางบริษัทฯ ทันทีเพื่อทำลาย
          </p>
          <Button
            type="primary"
            size="large"
            className="mt-6 px-10"
            onClick={handleConfirmCancel}
          >
            ยืนยันการยกเลิกบัตร
          </Button>
        </div>
      </Modal>
      <OtpConfirmModal
        open={otpOpen}
        custId={otpCustId}
        title="ยืนยัน OTP เพื่อยกเลิกบัตร"
        description={
          <p className="text-gray-800">
            ยกเลิกบัตรรับสินค้า หมายเลข{" "}
            <span className="font-semibold">{cardId}</span>
            <br />
            <span className="bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
              ทะเบียนรถ {plate}
            </span>
          </p>
        }
        onCancel={() => setOtpOpen(false)}
        onVerify={handleVerifyAndCancel}
        onVerified={handleOtpVerified}
      />
      <Modal
        open={doneOpen}
        onCancel={handleDoneClose}
        footer={null}
        centered
        width={420}
      >
        <div className="px-4 py-2 text-center">
          <h3 className="text-xl font-semibold text-green-600">
            ยกเลิกบัตรเรียบร้อย
          </h3>
          <p className="mt-3 text-gray-700">
            บัตรรับสินค้า หมายเลข{" "}
            <span className="font-semibold">{cardId}</span> ถูกยกเลิกแล้ว
          </p>
          <Button
            type="primary"
            className="mt-5 px-10"
            onClick={handleDoneClose}
          >
            ปิด
          </Button>
        </div>
      </Modal>
    </>
  );
};

function ActionCard({
  title,
  icon,
  href,
  classOptional,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  href?: string;
  classOptional?: string;
  onClick?: () => void;
}) {
  const className = `group flex items-center gap-3 rounded-xl border border-white/30  px-4 py-3 shadow-lg  transition hover:-translate-y-0.5 hover:shadow-xl ${classOptional || "bg-gradient-to-br from-gray-100/95 via-gray-300/90 to-gray-500/90 backdrop-blur"}`;
  const content = (
    <>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/70 text-gray-700">
        {icon}
      </span>
      <span className="flex-1 text-base font-semibold text-gray-800">
        {title}
      </span>
      <span className="text-gray-600 transition group-hover:translate-x-1">
        ›
      </span>
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} w-full text-left`}
      >
        {content}
      </button>
    );
  }
  return (
    <Link href={href ?? "#"} className={className}>
      {content}
    </Link>
  );
}

function TruckCardFlip({ truck }: { truck: TruckCard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={`บัตรรถทะเบียน ${truck.CarRegister} กดเพื่อสลับด้าน`}
        className="block w-full [perspective:1400px]"
      >
        <div
          className={`relative aspect-[1004/638] w-full transition-transform duration-500 [container-type:inline-size] [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          <div className="absolute inset-0 overflow-hidden rounded-xl shadow-md [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
            <Image
              src={img("/images/card-front.png")}
              alt={`บัตรรถ ${truck.CarRegister}`}
              fill
              sizes="(max-width: 640px) 100vw, 620px"
              className="object-cover"
            />
            <div className="absolute left-[4%] top-[26%] flex h-[13%] w-[29%] items-center justify-center">
              <span className="truncate text-[3.8cqw] font-bold tracking-wider text-white">
                {truck.CardID}
              </span>
            </div>
            <div className="absolute left-[37%] top-[26%] flex h-[13%] w-[58%] items-center">
              <span className="truncate px-[2cqw] text-[3.4cqw] font-bold text-[#2b2b4e]">
                {truck.Remark}
              </span>
            </div>
            <div className="absolute left-[42%] top-[49%] w-[54%] text-center">
              <span className="text-[10.5cqw] font-extrabold leading-none text-red-600">
                {truck.CarRegister}
              </span>
            </div>
            <span className="absolute bottom-[10.5%] left-[7%] text-[2.4cqw] font-medium text-white/90">
              • {truck.CustID} | {truck.Remark}
            </span>
          </div>
          <div className="absolute inset-0 overflow-hidden rounded-xl shadow-md [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Image
              src={img("/images/card-back.png")}
              alt="เงื่อนไขและคำแนะนำ ด้านหลังบัตร"
              fill
              sizes="(max-width: 640px) 100vw, 620px"
              className="object-cover"
            />
          </div>
        </div>
      </button>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {flipped ? "ด้านหลังบัตร" : "ด้านหน้าบัตร"} — กดที่บัตรเพื่อสลับ
        </p>
        {/* <CancelButton plate={truck.CarRegister} cardId={truck.CardID} /> */}
      </div>
    </div>
  );
}

const CardIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18" strokeLinecap="round" />
  </svg>
);

const CardZoomButton = ({ truck }: { truck: TruckCard }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={`ดูบัตร ${truck.CarRegister}`}
        onClick={() => setOpen(true)}
        className="flex flex-col items-center gap-0.5 text-xs text-blue-600 hover:text-blue-700 transition"
      >
        <CardIcon />
        ดูบัตร
      </button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        width={720}
        title={`บัตรรถ ${truck.CarRegister}`}
      >
        <div className="pt-2">
          <TruckCardFlip truck={truck} />
        </div>
      </Modal>
    </>
  );
};

export default function TruckListPage() {
  const [view, setView] = useState<ViewMode>("table");
  const [query, setQuery] = useState("");
  const [custID, setCustID] = useState("");
  const [allTrucks, setAllTrucks] = useState<TruckCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [requestOpen, setRequestOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCustID(getSessionCustomerId());
    const handleChanged = () => setCustID(getSessionCustomerId());
    window.addEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
    return () =>
      window.removeEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
  }, []);

  useEffect(() => {
    if (!custID) {
      setAllTrucks([]);
      setError(null);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getCardTempListService(custID);
      if (cancelled) return;
      if (result.status === "success") {
        setAllTrucks(result.results || []);
      } else {
        setAllTrucks([]);
        setError(result.error || "ไม่สามารถโหลดข้อมูลรถบรรทุกได้");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [custID, reloadKey]);

  const trucks = useMemo<TruckCard[]>(
    () =>
      allTrucks.filter((t) =>
        t.CarRegister.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [allTrucks, query],
  );

  // รีเซ็ตกลับไปหน้าแรกเมื่อข้อมูลหรือจำนวนรายการต่อหน้าเปลี่ยน
  useEffect(() => {
    setCurrentPage(1);
  }, [trucks, pageSize]);

  const totalPages = Math.max(1, Math.ceil(trucks.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * pageSize;
  const pagedTrucks = trucks.slice(pageStart, pageStart + pageSize);
  const firstPageInWindow = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => firstPageInWindow + i,
  );

  const paginationBar = (
    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-600 shadow-sm sm:flex-row sm:items-center sm:justify-end">
      <div className="flex flex-wrap items-center gap-2">
        <span>
          {trucks.length === 0 ? 0 : pageStart + 1}-
          {Math.min(pageStart + pageSize, trucks.length)} จาก {trucks.length}{" "}
          รายการ
        </span>
        <button
          type="button"
          onClick={() => setCurrentPage(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ก่อนหน้า
        </button>
        {pageNumbers.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setCurrentPage(num)}
            className={`h-8 w-8 rounded-lg border ${
              num === page
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCurrentPage(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ถัดไป
        </button>
      </div>
    </div>
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
              {/* <div className="w-1/4 min-w-[96px] rounded-lg bg-white/90 px-3 py-2 text-center shadow">
                <p className="text-lg font-bold leading-tight text-gray-900">
                  {mockTrucks.length}{" "}
                  <span className="text-xs font-medium">คัน</span>
                </p>
              </div> */}
              <ActionCard
                title="ขอบัตรรถรับสินค้าชั่วคราว"
                onClick={() => setRequestOpen(true)}
                classOptional="a_gradient_blue"
                icon={
                  <Image
                    src={img("/images/profile_card.png")}
                    alt="temporary card"
                    width={32}
                    height={32}
                  />
                }
              />
              <ActionCard
                title="ประวัติการขอบัตรรถ"
                href="/truck-list/history"
                classOptional=""
                icon={
                  <Image
                    src={img("/images/history_icon.png")}
                    alt="history"
                    width={32}
                    height={32}
                  />
                }
              />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-semibold text-gray-900">
              รถทั้งหมด <span className="text-blue-600">{trucks.length}</span>{" "}
              คัน
            </h2>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                แสดง
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded-lg border border-gray-300 bg-white px-2 py-1"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                รายการ
              </label>
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

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white py-16 text-gray-500">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
              กำลังโหลดข้อมูลรถบรรทุก...
            </div>
          ) : trucks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
              ไม่พบข้อมูลรถบรรทุก
            </div>
          ) : (
            <>
              {view === "card" ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {pagedTrucks.map((t) => (
                    <TruckCardFlip key={t.RunID} truck={t} />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                  <table className="w-full min-w-[860px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-semibold uppercase tracking-wide bg-[#19368f] text-white">
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
                      {pagedTrucks.map((t) => (
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
                          <td className="px-4 py-3 text-gray-500">
                            {t.CustID}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {t.Remark}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                            {t.DateCreated.slice(0, 16)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                            {t.LastUseCard ? t.LastUseCard.slice(0, 16) : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-4">
                              <CardZoomButton truck={t} />
                              <CancelButton
                                plate={t.CarRegister}
                                cardId={t.CardID}
                                runId={t.RunID}
                                onCancelled={() => setReloadKey((k) => k + 1)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {paginationBar}
            </>
          )}
        </div>
      </main>
      <RequestCardModal
        open={requestOpen}
        custId={custID}
        onClose={() => setRequestOpen(false)}
      />
      <Footer />
    </div>
  );
}
