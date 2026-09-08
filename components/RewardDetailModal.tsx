"use client";

import {
  CalendarOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  StarFilled,
  TruckOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import type { RewardOrder } from "@/interfaces/reward";

interface RewardDetailModalProps {
  order: RewardOrder | null;
  open: boolean;
  onClose: () => void;
}

function formatPoints(value: number) {
  return value.toLocaleString("th-TH", { minimumFractionDigits: 1 });
}

function SilverPointsBadge({ points }: { points: number }) {
  return (
    <span className="inline-flex min-h-7 items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[13px] font-extrabold whitespace-nowrap text-slate-700">
      <StarFilled aria-hidden="true" className="text-xs text-slate-500" />
      {formatPoints(points)} คะแนน
    </span>
  );
}

export function RewardDetailModal({
  order,
  open,
  onClose,
}: RewardDetailModalProps) {
  if (!order) return null;

  const totalPoints = order.total;
  const itemPoints = order.items.reduce((sum, item) => sum + item.points, 0);

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={780}
      styles={{ body: { padding: 0 } }}
    >
      <article
        className="overflow-hidden bg-white text-slate-900"
        aria-label="รายละเอียดคำสั่งซื้อ"
      >
        <header className="relative overflow-hidden border-b border-[#062f75] bg-[#063780] px-5 py-5 pr-16 sm:px-7 sm:py-6 sm:pr-16">
          <div className="absolute inset-0 bg-[#062f75]/80" aria-hidden="true" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-1 inline-flex items-center gap-2 text-xs font-bold text-slate-200">
                <FileTextOutlined
                  aria-hidden="true"
                  className="text-[#8ce3ba]"
                />
                รายละเอียดคำสั่งซื้อ
              </p>
              <h2 className="m-0 text-balance text-[21px] leading-tight font-extrabold text-white sm:text-[24px]">
                {order.id}
              </h2>
              <p className="mt-2 mb-0 inline-flex items-center gap-1.5 text-[13px] text-slate-200">
                <CalendarOutlined
                  aria-hidden="true"
                  className="text-slate-300"
                />
                แลกเมื่อ {order.date}
              </p>
            </div>

            <div className="hidden shrink-0 text-right sm:block">
              <p className="m-0 text-[11px] font-bold text-slate-200">
                ใช้คะแนนทั้งหมด
              </p>
              <div className="mt-1">
                <SilverPointsBadge points={totalPoints} />
              </div>
              <p className="mt-1 mb-0 text-[11px] font-semibold text-slate-200">
                {order.tier}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 sm:justify-start">
            <span
              className={`inline-flex min-h-7 items-center rounded-full px-2.5 py-1 text-xs font-extrabold ${
                order.statusType === "preparing"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {order.status}
            </span>
            <div className="sm:hidden">
              <SilverPointsBadge points={totalPoints} />
            </div>
          </div>
        </header>

        <div className="px-5 py-5 sm:px-7 sm:py-6">
          <section aria-labelledby="order-products-heading">
            <div className="mb-2.5 flex items-center justify-between gap-4">
              <h3
                id="order-products-heading"
                className="m-0 inline-flex items-center gap-2 text-[15px] font-extrabold text-slate-900"
              >
                <ShoppingOutlined
                  aria-hidden="true"
                  className="text-[#00A651]"
                />
                รายการสินค้า
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {order.items.length} รายการ
              </span>
            </div>

            <div className="border-t border-slate-200">
              {order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div
                    className="grid grid-cols-1 items-center gap-x-3 border-b border-slate-200 py-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-4"
                    key={index}
                  >
                    <div className="min-w-0">
                      <p className="m-0 text-sm leading-snug font-extrabold text-slate-900">
                        {item.name}
                      </p>
                      <p className="mt-1 mb-0 text-xs leading-snug text-slate-600">
                        จำนวน {item.qty} ชิ้น
                      </p>
                    </div>
                    <strong className="mt-1 text-left text-xs font-extrabold text-slate-600 sm:mt-0 sm:text-right sm:text-[13px]">
                      {formatPoints(item.points)} คะแนน
                    </strong>
                  </div>
                ))
              ) : (
                <p className="m-0 border-b border-slate-200 py-8 text-center text-sm text-slate-400">
                  ไม่พบรายการสินค้า
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 pt-3.5 text-sm font-extrabold text-slate-900">
              <span>คะแนนรวม</span>
              <SilverPointsBadge points={totalPoints || itemPoints} />
            </div>
          </section>

          <section
            className="mt-6 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5"
            aria-labelledby="order-address-heading"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-[15px] text-red-700"
              aria-hidden="true"
            >
              <EnvironmentOutlined />
            </span>
            <div className="min-w-0">
              <h3
                id="order-address-heading"
                className="m-0 text-[15px] font-extrabold text-slate-900"
              >
                ที่อยู่จัดส่ง
              </h3>
              <p className="mt-1 mb-0 text-[13px] leading-6 text-slate-600 [text-wrap:pretty]">
                {order.address}
              </p>
            </div>
          </section>

          {order.statusType === "delivered" && (
            <section
              className="mt-4 flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-3.5"
              aria-labelledby="order-shipping-heading"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[15px] text-sky-700"
                aria-hidden="true"
              >
                <TruckOutlined />
              </span>
              <div className="min-w-0">
                <h3
                  id="order-shipping-heading"
                  className="m-0 text-[15px] font-extrabold text-sky-900"
                >
                  จัดส่งสำเร็จ
                </h3>
                <p className="mt-1 mb-0 text-[13px] leading-6 text-sky-800 [text-wrap:pretty]">
                  รายการนี้จัดส่งสำเร็จแล้ว
                </p>
              </div>
            </section>
          )}
        </div>

        <footer className="flex items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
          <button
            type="button"
            className="inline-flex h-10 min-w-22 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-700 px-3.5 text-[13px] font-extrabold text-white transition-colors duration-150 hover:border-slate-900 hover:bg-slate-900 active:bg-slate-950"
            onClick={onClose}
          >
            <CloseOutlined aria-hidden="true" />
            ปิด
          </button>
        </footer>
      </article>
    </Modal>
  );
}
