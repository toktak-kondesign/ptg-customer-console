"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AppstoreOutlined, TableOutlined } from "@ant-design/icons";
import AnimatedSection from "./AnimatedSection";
import { Tooltip } from "antd";
import { getAuthUser } from "@/lib/auth";
import { getCustomerOrdersService } from "@/services/customer/orders";
import type { CustomerOrder } from "@/interfaces/order";

function formatThaiDateTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${yyyy} ${hh}:${min} น.`;
}

type ViewMode = "cards" | "table";

export default function StatusDelivery() {
  const [view, setView] = useState<ViewMode>("cards");
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      const user = getAuthUser();
      if (!user?.custID) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const result = await getCustomerOrdersService(user.custID);
      if (result.status === "success") {
        setOrders(result.results);
        setError(null);
      } else {
        setOrders([]);
        setError(result.error ?? "ไม่สามารถโหลดข้อมูลได้");
      }
      setIsLoading(false);
    };

    loadOrders();
  }, []);

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
            {/* <a
              href="#"
              className="text-primary-600 text-sm font-medium hover:text-primary-900"
            >
              ดูทั้งหมด ›
            </a> */}
          </div>
        </div>

        {view === "cards" ? (
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-500 py-8">กำลังโหลด...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : orders.length === 0 ? (
              <div className="text-center text-gray-500 py-8">ไม่มีข้อมูล</div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.BillID}
                  className="status-card border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 cursor-pointer"
                >
                  <div className="relative w-20 h-20 sm:w-[80px] sm:h-[80px] aspect-square shrink-0 mx-auto sm:mx-0 p-6">
                    <Image
                      src="/images/delivered2.svg"
                      alt="logistic delivery"
                      fill
                      sizes="(max-width: 640px) 80px, 80px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="text-xs text-gray-600 mb-1">
                      เลขที่ใบส่งสินค้า: {order.BillID} /{" "}
                      {formatThaiDateTime(order.DateScale)}
                    </div>
                    <div className="font-bold text-primary-600 mb-1">
                      {order.Typename}
                    </div>
                    <div className="text-xs text-gray-500">
                      ทะเบียนรถ {order.CarRegister} : {order.CarDriverName}
                    </div>
                  </div>
                  <div className="w-full sm:w-auto text-center sm:text-right border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <div className="text-xs text-gray-600 mb-1">
                      ปริมาณ (ลบ.ม.)
                    </div>
                    <div className="font-bold text-lg text-gray-900 mb-2">
                      {order.VolSend}
                    </div>
                  </div>
                  {order.custsign === 1 && (
                    <Tooltip title="ดูใบส่งสินค้า">
                      <Image
                        src="/images/deliveryNote.svg"
                        alt="devivery note"
                        width={32}
                        height={32}
                        className="ml-auto"
                      />
                    </Tooltip>
                  )}
                </div>
              ))
            )}
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
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-8">
                      กำลังโหลด...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="text-center text-red-500 py-8">
                      {error}
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-8">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.BillID}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-gray-900">
                        {order.BillID}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatThaiDateTime(order.DateScale)}
                      </td>
                      <td className="px-4 py-3 font-medium text-primary-600">
                        {order.Typename}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {order.CarRegister}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {order.Company}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {order.CarDriverName}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        {order.VolSend}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {order.custsign === 1 && (
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
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </AnimatedSection>
    </section>
  );
}
