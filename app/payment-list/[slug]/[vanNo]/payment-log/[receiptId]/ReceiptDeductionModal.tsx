"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { CheckCircleFilled, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { formatAmount } from "@/app/payment-list/data";
import { getReceiptLogDtlService } from "@/services/customer/receipt-log-dtl";
import type { ReceiptLogDtlRow } from "@/interfaces/receipt-log-dtl";

interface ReceiptDeductionModalProps {
  open: boolean;
  vanNo: string;
  receipt: string;
  headNum: string;
  onClose: () => void;
}

function formatDate(value: string | null | undefined): string {
  const parsed = value ? dayjs(value) : null;
  return parsed?.isValid() ? parsed.format("DD/MM/YYYY") : "-";
}

export default function ReceiptDeductionModal({
  open,
  vanNo,
  receipt,
  headNum,
  onClose,
}: ReceiptDeductionModalProps) {
  const [rows, setRows] = useState<ReceiptLogDtlRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !vanNo || !receipt || !headNum) return;
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getReceiptLogDtlService(vanNo, receipt, headNum);
      if (cancelled) return;
      if (result.status === "success") {
        setRows(result.results || []);
      } else {
        setError(result.error || "ไม่สามารถโหลดรายละเอียดการตัดชำระสินค้าได้");
      }
      setIsLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [open, vanNo, receipt, headNum]);

  const total = rows.reduce((sum, row) => sum + (Number(row.DocTranAmt) || 0), 0);

  return (
    <Modal
      title={
        <span className="text-xl font-medium text-gray-800">
          รายละเอียดการตัดชำระสินค้า
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={960}
      closeIcon={<CloseOutlined className="text-gray-400" />}
    >
      <div className="pt-4 overflow-x-auto">
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-12">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            <span className="text-sm text-gray-500">กำลังโหลดข้อมูล...</span>
          </div>
        )}

        {error && !isLoading && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#55AFF4] text-white">
                <th className="border border-[#55AFF4] px-3 py-2 font-medium">ลำดับ</th>
                <th className="border border-[#55AFF4] px-3 py-2 font-medium">เลขที่เอกสาร</th>
                <th className="border border-[#55AFF4] px-3 py-2 font-medium">กลุ่มสินค้า</th>
                <th className="border border-[#55AFF4] px-3 py-2 font-medium">วันที่ซื้อ</th>
                <th className="border border-[#55AFF4] px-3 py-2 font-medium">ครบกำหนดชำระ</th>
                <th className="border border-[#55AFF4] px-3 py-2 font-medium">จำนวนที่ตัด</th>
                <th className="border border-[#55AFF4] px-3 py-2 font-medium">สถานะ</th>
                <th className="border border-[#55AFF4] px-3 py-2 font-medium">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="border border-gray-300 px-3 py-8 text-center text-gray-400">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
              {rows.map((row, index) => (
                <tr key={`${row.LegalNumber}-${index}`} className="text-gray-700">
                  <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 px-3 py-2 text-[#55AFF4]">
                    {(row.LegalNumber ?? "").trim() || "-"}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {(row.Reference ?? "").trim() || "-"}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {formatDate(row.InvoiceDate)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {formatDate(row.DueDate)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {formatAmount(Number(row.DocTranAmt) || 0)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {Number(row.status1) === 1 ? (
                      <CheckCircleFilled className="text-lg text-[#8CC63F]" />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {(row.textbox ?? "").trim() || ""}
                  </td>
                </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="bg-[#55AFF4] text-white font-medium">
                  <td colSpan={5} className="border border-[#55AFF4] px-3 py-2 text-center">
                    รวม
                  </td>
                  <td className="border border-[#55AFF4] px-3 py-2 text-right">
                    {formatAmount(total)}
                  </td>
                  <td colSpan={2} className="border border-[#55AFF4] px-3 py-2" />
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>
    </Modal>
  );
}
