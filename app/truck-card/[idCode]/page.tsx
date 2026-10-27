"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import { Button, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { BASE_PATH, img } from "@/lib/env";
import { downloadNodeAsImage } from "@/lib/download-node-image";
import { getCardOtuDetailService } from "@/services/customer/card-otu-request";
import type {
  CardOtuDetailHead,
  CardOtuDetailItem,
} from "@/interfaces/card-temp";

const formatQty = (value: number) =>
  Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });

const formatThaiDate = (value: string) =>
  value
    ? new Date(value).toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

export default function TruckCardPage() {
  const { idCode } = useParams<{ idCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [head, setHead] = useState<CardOtuDetailHead | null>(null);
  const [items, setItems] = useState<CardOtuDetailItem[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!idCode) return;
    getCardOtuDetailService(idCode).then((res) => {
      if (res.status === "success" && res.result) {
        setHead(res.result);
        setItems(res.items ?? []);
      } else {
        setError(res.error ?? "ไม่พบข้อมูลบัตร");
      }
      setLoading(false);
    });
  }, [idCode]);

  const handleDownloadImage = async () => {
    if (!cardRef.current || !head) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      await downloadNodeAsImage(
        cardRef.current,
        `truck-card-${head.IDCode}.png`,
      );
    } catch {
      setDownloadError("ไม่สามารถบันทึกรูปภาพได้");
    }
    setDownloading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto min-h-screen w-full max-w-lg bg-white shadow-lg sm:my-6 sm:min-h-0 sm:rounded-2xl sm:border sm:border-gray-200">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spin />
          </div>
        ) : error || !head ? (
          <p className="py-24 text-center text-sm text-red-600">
            {error ?? "ไม่พบข้อมูลบัตร"}
          </p>
        ) : (
          <>
            <div ref={cardRef} className="p-6">
            <Image
              src={img("/logo/logo.png")}
              alt="PTG"
              width={120}
              height={40}
              className="h-auto w-28"
            />
            <div className="mt-4 flex justify-center">
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                {head.StatusCode === 2 || Number(head.IsInActive) === 1 ? (
                  <Image
                    src={img("/images/qr_cancel.png")}
                    alt="บัตรถูกยกเลิก"
                    width={176}
                    height={176}
                    className="h-44 w-44 object-contain"
                  />
                ) : (
                  <QRCode
                    value={`${window.location.origin}${BASE_PATH}/truck-card/${head.IDCode}`}
                    size={176}
                  />
                )}
              </div>
            </div>
            <p className="mt-2 text-center text-xs tracking-wider text-gray-500">
              <span className="font-bold bg-gray-50 border border-gray-200 px-[3.2rem] py-1 text-blue-600 rounded-lg">
                {head.IDCode}
              </span>
            </p>
            <div className="mt-4 text-center">
              <p className="font-semibold text-gray-800">
                {head.CustName || "-"} ({head.CustID})
              </p>
              <p className="mt-2 mb-2 font-semibold text-gray-800">
                <span className="px-6 py-0.5 bg-green-500 rounded-full text-white">
                  ทะเบียน {head.CarRegister}
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                ออกบัตรเมื่อ {formatThaiDate(head.CreateDate)}
              </p>
            </div>

            {items.length > 0 && (
              <div className="mt-5">
                <p className="font-semibold text-gray-800">
                  คุณสามารถรับสินค้าได้ดังนี้
                </p>
                <div className="mt-3 space-y-1">
                  {items.map((item) => (
                    <div
                      key={`${item.OrderNum}-${item.OrderLine}`}
                      className="rounded-xl border border-gray-200 px-4 py-2 bg-slate-50"
                    >
                      <p className="font-medium text-sm text-gray-800">
                        {item.ItemName}
                      </p>
                      <p className="mt-0.25 font-medium text-red-600 text-sm">
                        จำนวน {formatQty(item.NumSend)} {item.Unit} ({" "}
                        {formatQty(item.NumSend)} {item.Unit} )
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 border-t border-gray-100 pt-3">
              <p className="text-sm font-semibold text-gray-800">
                เงื่อนไขบัตรรถบรรทุกชั่วคราว (Card One Time Use)
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                <li>
                  บัตรนี้เป็นบัตรที่ใช้ได้ครั้งเดียว (One Time Use)
                  ไม่สามารถนำใช้ซ้ำได้
                </li>
                <li>จะต้องใช้บัตรนี้ภายใน 72 ชม.</li>
                <li>สงวนสิทธิ์ เฉพาะรถที่มีทะเบียนตรงกับบัตรนี้เท่านั้น</li>
              </ul>
              <p className="mt-2 text-right text-sm text-gray-700">
                สอบถามข้อมูลเพิ่มเติม โทร : 1634
              </p>
            </div>
            </div>
            <div className="px-6 pb-6">
              <Button
                block
                size="large"
                icon={<DownloadOutlined />}
                loading={downloading}
                onClick={handleDownloadImage}
              >
                ดาวน์โหลดรูปภาพ
              </Button>
              {downloadError && (
                <p className="mt-2 text-center text-sm text-red-600">
                  {downloadError}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
