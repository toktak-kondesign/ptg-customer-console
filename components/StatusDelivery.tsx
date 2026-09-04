"use client";

import { useState } from "react";
import Image from "next/image";
import { AppstoreOutlined, TableOutlined } from "@ant-design/icons";
import AnimatedSection from "./AnimatedSection";
import { Tooltip } from "antd";

const statuses = [
  {
    id: "260800287",
    date: "29-08-2026 14:01 น.",
    product: "คอนกรีตผสมเสร็จ",
    plate: "70-4682 นค",
    province: "ราชสีมา",
    driver: "นายกาญจน์ สร้างธรรม",
    amount: "2.75",
  },
  {
    id: "260800281",
    date: "28-08-2026 07:51 น.",
    product: "คอนกรีตผสมเสร็จ",
    plate: "70-4884 นค",
    province: "ราชสีมา",
    driver: "นายประวิทย์ ศรีสวัสดิ์",
    amount: "4.00",
  },
  {
    id: "260800280",
    date: "28-08-2026 16:23 น.",
    product: "คอนกรีตผสมเสร็จ",
    plate: "45-661 นค",
    province: "ราชสีมา",
    driver: "นายสัญชัย อดฉิมศรี",
    amount: "4.50",
  },
];

type ViewMode = "cards" | "table";

export default function StatusDelivery() {
  const [view, setView] = useState<ViewMode>("cards");

  return (
    <section className="py-12 bg-white">
      <AnimatedSection className="max-w-7xl mx-auto px-6 shadow-lg py-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              STATUS DELIVERY
            </h2>
            <p className="text-blue-500 text-sm">สถานะสั่งสินค้า</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setView("cards")}
                aria-label="cards view"
                className={`w-8 h-8 flex items-center justify-center rounded-md transition ${
                  view === "cards"
                    ? "bg-primary-600 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <AppstoreOutlined />
              </button>
              <button
                onClick={() => setView("table")}
                aria-label="table view"
                className={`w-8 h-8 flex items-center justify-center rounded-md transition ${
                  view === "table"
                    ? "bg-primary-600 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <TableOutlined />
              </button>
            </div>
            <a
              href="#"
              className="text-primary-600 text-sm font-medium hover:text-primary-900"
            >
              ดูทั้งหมด ›
            </a>
          </div>
        </div>

        {view === "cards" ? (
          <div className="space-y-4">
            {statuses.map((status) => (
              <div
                key={status.id}
                className="status-card border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 cursor-pointer"
              >
                <div className="relative w-20 h-20 sm:w-[120px] sm:h-[120px] aspect-square shrink-0 mx-auto sm:mx-0">
                  <Image
                    src="/images/logistic-delivery.png"
                    alt="logistic delivery"
                    fill
                    sizes="(max-width: 640px) 80px, 120px"
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="text-xs text-gray-600 mb-1">
                    เลขที่ใบส่งสินค้า: {status.id} / {status.date}
                  </div>
                  <div className="font-bold text-primary-600 mb-1">
                    {status.product}
                  </div>
                  <div className="text-xs text-gray-500">
                    ทะเบียนรถ {status.plate}: {status.province} :{" "}
                    {status.driver}
                  </div>
                </div>
                <div className="w-full sm:w-auto text-center sm:text-right border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                  <div className="text-xs text-gray-600 mb-1">
                    ปริมาณ (ลบ.ม.)
                  </div>
                  <div className="font-bold text-lg text-gray-900 mb-2">
                    {status.amount}
                  </div>
                </div>
                <Tooltip title="ดูใบส่งสินค้า">
                  <Image
                    src="/images/deliveryNote.svg"
                    alt="devivery note"
                    width={32}
                    height={32}
                    className="ml-auto"
                  />
                </Tooltip>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-[#031b63] text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">
                    เลขที่ใบส่งสินค้า
                  </th>
                  <th className="text-left px-4 py-3 font-medium">วันที่</th>
                  <th className="text-left px-4 py-3 font-medium">สินค้า</th>
                  <th className="text-left px-4 py-3 font-medium">ทะเบียนรถ</th>
                  <th className="text-left px-4 py-3 font-medium">จังหวัด</th>
                  <th className="text-left px-4 py-3 font-medium">พขร.</th>
                  <th className="text-right px-4 py-3 font-medium">
                    ปริมาณ (ลบ.ม.)
                  </th>
                  <th className="text-center px-4 py-3 font-medium w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {statuses.map((status) => (
                  <tr
                    key={status.id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-gray-900">{status.id}</td>
                    <td className="px-4 py-3 text-gray-600">{status.date}</td>
                    <td className="px-4 py-3 font-medium text-primary-600">
                      {status.product}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{status.plate}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {status.province}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{status.driver}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      {status.amount}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Tooltip title="ดูใบส่งสินค้า">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center cursor-pointer hover:opacity-70 transition"
                        >
                          <Image
                            src="/images/deliveryNote.svg"
                            alt="delivery note"
                            width={28}
                            height={28}
                          />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnimatedSection>
    </section>
  );
}
