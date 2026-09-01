"use client";

import { useState } from "react";
import {
  AppstoreOutlined,
  EnvironmentOutlined,
  StarFilled,
  TableOutlined,
} from "@ant-design/icons";
import AnimatedSection from "./AnimatedSection";

type RewardItem = {
  name: string;
  qty: number;
  points: number;
};

type RewardOrder = {
  id: string;
  status: string;
  statusType: "preparing" | "delivered";
  date: string;
  total: number;
  tier: string;
  address: string;
  items: RewardItem[];
};

type ViewMode = "cards" | "table";

const rewards: RewardOrder[] = [
  {
    id: "RW20260721180335",
    status: "จัดเตรียมสินค้า",
    statusType: "preparing",
    date: "21 กรกฎาคม 2569",
    total: 2144,
    tier: "Silver Points",
    address:
      "บ้านเลขที่ 47/1 ม. - ซ. - ถ.ท่านน้ำใส ต.ป่าแพรก อ.ทุ่งสง จ.นครศรีธรรมราช 80110",
    items: [{ name: "แก้วนมดี", qty: 2, points: 2144 }],
  },
  {
    id: "RW20260720143417",
    status: "จัดส่งสำเร็จ",
    statusType: "delivered",
    date: "20 กรกฎาคม 2569",
    total: 6953,
    tier: "Silver Points",
    address:
      "บ้านเลขที่ 47/1 ม. - ซ. - ถ.ท่านน้ำใส ต.ป่าแพรก อ.ทุ่งสง จ.นครศรีธรรมราช 80110",
    items: [
      { name: "ปากกา", qty: 2, points: 92 },
      { name: "Mi Compact Bluetooth Speaker 2", qty: 1, points: 3240 },
      { name: "Mi Window and Door Sensor", qty: 1, points: 3621 },
    ],
  },
  {
    id: "RW20260715105859",
    status: "จัดส่งสำเร็จ",
    statusType: "delivered",
    date: "15 กรกฎาคม 2569",
    total: 11969,
    tier: "Silver Points",
    address:
      "บ้านเลขที่ 123/4 ม.8 ซ.2 ถ.8 ต.หนองจั๊บวัชระ อ.พระนครศรีอยุธยา จ.พระนครศรีอยุธยา 13000",
    items: [
      { name: "หม้อหุงข้าวดิจิตอล 1.8 ลิตร", qty: 1, points: 7419 },
      {
        name: "เครื่องทำน้ำอุ่น กำลังไฟ 1800 วัตต์ หน้าเครื่องคลีนบอร์กันดีด",
        qty: 1,
        points: 4550,
      },
    ],
  },
];

const statusClass = (type: RewardOrder["statusType"]) =>
  type === "preparing"
    ? "bg-purple-600 text-white"
    : "bg-brand-green text-white";

function formatPoints(value: number) {
  return value.toLocaleString("th-TH", { minimumFractionDigits: 1 });
}

function RewardCard({ order }: { order: RewardOrder }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h3 className="text-base font-bold text-gray-900 break-all">
            {order.id}
          </h3>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full w-fit ${statusClass(
              order.statusType,
            )}`}
          >
            {order.status}
          </span>
        </div>
        <div className="text-left sm:text-right">
          <div className="inline-flex items-center gap-1 bg-gray-100 text-gray-900 text-sm font-bold px-3 py-1 rounded-full">
            <StarFilled className="text-xs" />
            {formatPoints(order.total)}
          </div>
          <p className="text-xs text-gray-500 mt-1">{order.tier}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">{order.date}</p>

      <div className="border-t border-gray-100 pt-4 space-y-2">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4"
          >
            <p className="text-sm text-gray-700">
              {item.name} <span className="text-gray-500">x{item.qty}</span>
            </p>
            <p className="text-sm font-medium text-gray-700 sm:whitespace-nowrap text-left sm:text-right">
              {formatPoints(item.points)} คะแนน
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-1 text-xs text-gray-500 mt-4">
        <EnvironmentOutlined className="mt-0.5 text-red-500 shrink-0" />
        <span>{order.address}</span>
      </div>
    </div>
  );
}

export default function Reward() {
  const [view, setView] = useState<ViewMode>("cards");

  return (
    <section className="py-12 bg-gray-50">
      <AnimatedSection className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              REWARD
            </h2>
            <p className="text-blue-500 text-sm">รายการสินค้าแลกแต้ม</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white">
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
              className="text-primary-600 text-sm font-medium hover:text-primary-900 hidden sm:inline"
            >
              ดูทั้งหมด
            </a>
          </div>
        </div>

        {view === "cards" ? (
          <div className="space-y-4">
            {rewards.map((order) => (
              <RewardCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-[#031b63] text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">
                    เลขที่คำสั่งซื้อ
                  </th>
                  <th className="text-left px-4 py-3 font-medium">สถานะ</th>
                  <th className="text-left px-4 py-3 font-medium">วันที่</th>
                  <th className="text-left px-4 py-3 font-medium">
                    รายการสินค้า
                  </th>
                  <th className="text-left px-4 py-3 font-medium">
                    ที่อยู่จัดส่ง
                  </th>
                  <th className="text-right px-4 py-3 font-medium">คะแนนรวม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rewards.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {order.id}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-3 py-1 whitespace-nowrap rounded-full ${statusClass(
                          order.statusType,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.date}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <ul className="space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.name}{" "}
                            <span className="text-gray-500">x{item.qty}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[200px]">
                      {order.address}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      {formatPoints(order.total)}
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
