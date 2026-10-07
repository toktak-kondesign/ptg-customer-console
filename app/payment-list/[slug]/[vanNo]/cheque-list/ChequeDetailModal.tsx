"use client";

import Image from "next/image";
import { Modal } from "antd";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import { getCompanyBySlug, formatAmount } from "../../../data";
import { getBank, getBankLogo, getBankName } from "@/lib/banks";
import { formatSlashDate } from "@/lib/format";
import type { ChequeListRow } from "@/interfaces/cheque-list";

interface ChequeDetailModalProps {
  row: ChequeListRow | null;
  onClose: () => void;
}

const SLUG_BY_CODE: Record<string, string> = {
  PTG: "ptg",
  PTG24: "ptg24",
  AKET: "ake",
  MONO: "mono",
};

const STEP_LABELS = ["รอยืนยันใบรับ", "ยืนยันใบรับแล้ว", "การเงินรับแล้ว"];

/** chequeStatus: -2=ยกเลิก, -1/ว่าง=รอตรวจสอบ(step1), 1=การตลาดรับแล้ว(step2), 2=การเงินรับแล้ว(step3) */
function getStepIndex(value: string | null | undefined): number {
  switch (String(value ?? "").trim()) {
    case "2":
      return 3;
    case "1":
      return 2;
    case "-2":
      return 0;
    default:
      return 1;
  }
}

export default function ChequeDetailModal({
  row,
  onClose,
}: ChequeDetailModalProps) {
  const stepIndex = getStepIndex(row?.chequeStatus);
  const isCancelled = String(row?.chequeStatus ?? "").trim() === "-2";
  const company = getCompanyBySlug(SLUG_BY_CODE[row?.company ?? ""] ?? "");
  const bank = getBank(row?.BankType);
  const bankLogo = getBankLogo(row?.BankType);

  return (
    <Modal
      title={
        <span className="text-xl font-medium text-gray-800">
          รายละเอียดการรับเช็ค
        </span>
      }
      open={!!row}
      onCancel={onClose}
      footer={null}
      centered
      width={680}
      closeIcon={<CloseOutlined className="text-gray-400" />}
    >
      {row && (
        <div className="space-y-4 pt-2 text-sm text-gray-700">
          <div className="flex items-start justify-center px-8">
            {STEP_LABELS.map((label, index) => {
              const step = index + 1;
              const isDone = stepIndex >= step;
              return (
                <div
                  key={label}
                  className="flex flex-1 items-start last:flex-none"
                >
                  <div className="flex w-24 flex-col items-center gap-2">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-4 text-lg font-medium ${
                        isDone
                          ? "border-green-500 text-green-600"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                    <span
                      className={`text-center text-xs leading-tight ${
                        isDone ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {step < STEP_LABELS.length && (
                    <span
                      className={`mt-6 h-1.5 flex-1 rounded-full ${
                        stepIndex > step ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {isCancelled && (
            <p className="text-center font-medium text-4xl text-red-500">
              ยกเลิก
            </p>
          )}

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <span>ช่องทางการชำระเงิน :</span>
            <span className="text-xl font-semibold text-blue-600">
              ชำระเงินโดยเช็คธนาคาร
            </span>
          </div>

          <div className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p>
              ชื่อลูกค้า : {row.CustID} {row.Name?.trim()}
            </p>
            <p>เลขที่ใบรับ : {row.Runno?.trim() || "-"}</p>
            <div className="flex justify-between gap-4">
              <p>ผู้บันทึกใบรับ : {row.createname?.trim() || "-"}</p>
              <p>วันที่ใบรับ : {formatSlashDate(row.receivedate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            {bankLogo ? (
              <Image
                src={bankLogo}
                alt={bank?.name || row.BankType || "ธนาคาร"}
                width={72}
                height={72}
                className="h-16 w-16 shrink-0 rounded-full border border-gray-200 bg-white object-contain p-1"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-medium text-gray-600">
                {row.BankType?.trim() || "-"}
              </div>
            )}
            <div className="space-y-1">
              <p>เลขที่เช็ค : {row.CheckNo?.trim() || "-"}</p>
              <p className="text-xl font-semibold text-blue-700">
                {getBankName(row.BankType) || "-"}
              </p>
              <p>
                วันที่รับเช็ค : {formatSlashDate(row.DateChequeReceipt01)}{" "}
                ผู้รับเช็ค : {row.ReceiptPerson?.trim() || "-"}
              </p>
              <p>วันที่สั่งจ่ายเช็ค : {formatSlashDate(row.Billdate)}</p>
            </div>
          </div>

          <div className="flex justify-center text-2xl text-gray-300">
            <DownOutlined />
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            {company?.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={72}
                height={72}
                className="h-16 w-16 shrink-0 rounded-full border border-gray-200 bg-white object-contain p-1"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-medium text-gray-600">
                {row.company?.trim() || "-"}
              </div>
            )}
            <div className="space-y-1">
              <p className="text-gray-500">รับเช็คเข้าบริษัท</p>
              <p className="text-xl font-semibold text-blue-700">
                {company?.name || row.company || "-"}
              </p>
              <p>เลขที่บัญชี : {row?.VANNO || "-"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <span>จำนวนเงิน :</span>
            <span className="text-2xl font-semibold text-blue-700">
              {formatAmount(Number(row.AMOUNT) || 0)}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <span>ผู้ยืนยันการรับเช็ค :</span>
            <span className="text-right">
              <span className="block text-xl font-semibold text-blue-700">
                {row.ReceiptPerson?.trim() || "-"}
              </span>
              <span className="text-blue-600">
                ({formatSlashDate(row.DateChequeReceipt02)})
              </span>
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}
