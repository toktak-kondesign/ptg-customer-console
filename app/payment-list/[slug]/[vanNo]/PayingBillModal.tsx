"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BankOutlined, CloseOutlined } from "@ant-design/icons";
import { DatePicker, Modal, Select } from "antd";
import thTH from "antd/es/date-picker/locale/th_TH";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import { BANKS, getBankLogo, getBankName } from "@/lib/banks";
import { toDateInputValue, toTimeInputValue } from "@/lib/format";
import type {
  PaymentMethodKey,
  PayingBillFormValues,
} from "@/interfaces/paying-bill";

interface PayingBillModalProps {
  open: boolean;
  method: PaymentMethodKey | null;
  /** ยอดรวมของรายการที่เลือกไว้ ใช้เป็นค่าตั้งต้นของช่องจำนวนเงิน */
  defaultAmount: number;
  customerName: string;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: PayingBillFormValues) => void;
}

dayjs.extend(buddhistEra);

const thaiPickerLocale = {
  ...thTH,
  lang: { ...thTH.lang, yearFormat: "BBBB", cellYearFormat: "BBBB" },
};

const bankSelectOptions = BANKS.map((bank) => ({
  value: bank.code,
  label: bank.name,
}));

function BankPicker({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const logo = getBankLogo(value);

  return (
    <div
      className={`flex items-center gap-4 rounded-lg border border-dashed border-gray-300 p-4 ${
        disabled ? "bg-gray-100" : "bg-white"
      }`}
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
        {logo ? (
          <div className="relative h-11 w-11">
            <Image
              src={logo}
              alt={getBankName(value)}
              fill
              sizes="44px"
              className="object-contain"
            />
          </div>
        ) : (
          <BankOutlined className="text-2xl text-gray-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-sm text-gray-500">{label}</p>
        <Select
          value={value || undefined}
          onChange={onChange}
          options={bankSelectOptions}
          placeholder="เลือกธนาคาร"
          variant="borderless"
          className="w-full [&_.ant-select-selector]:!px-0"
          popupMatchSelectWidth={320}
        />
      </div>
    </div>
  );
}

function AmountInput({
  value,
  onChange,
  placeholder = "0.00",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      placeholder={placeholder}
      onChange={(event) => {
        const next = event.target.value.replace(/,/g, "");
        // กรอกได้เฉพาะตัวเลขและทศนิยมไม่เกิน 2 ตำแหน่ง
        if (next === "" || /^\d*\.?\d{0,2}$/.test(next)) onChange(next);
      }}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-right text-lg text-gray-700 focus:border-blue-500 focus:outline-none"
    />
  );
}

export default function PayingBillModal({
  open,
  method,
  defaultAmount,
  customerName,
  saving,
  error,
  onClose,
  onSubmit,
}: PayingBillModalProps) {
  const isCheque = method === "cheque-ktb" || method === "cheque-uob";
  const receiveBank = method === "cheque-uob" ? "UOB" : "KTB";

  const [amount, setAmount] = useState("");
  const [bankFrom, setBankFrom] = useState("");
  const [bankTo, setBankTo] = useState("");
  const [checkNo, setCheckNo] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [billDate, setBillDate] = useState(toDateInputValue());
  const [tranferTime, setTranferTime] = useState(toTimeInputValue());
  const [localError, setLocalError] = useState<string | null>(null);

  // รีเซ็ตฟอร์มทุกครั้งที่เปิด modal ใหม่ / เปลี่ยนวิธีชำระ
  useEffect(() => {
    if (!open) return;
    setAmount(defaultAmount > 0 ? defaultAmount.toFixed(2) : "");
    setBankFrom("");
    setBankTo(method === "bank" ? "KTB" : "");
    setCheckNo("");
    setBankBranch("");
    setBillDate(toDateInputValue());
    setTranferTime(toTimeInputValue());
    setLocalError(null);
  }, [open, method, defaultAmount]);

  if (!method) return null;

  const handleSubmit = () => {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setLocalError("กรุณากรอกจำนวนเงินที่ต้องการชำระ");
      return;
    }
    if (method === "bank" && (!bankFrom || !bankTo)) {
      setLocalError("กรุณาเลือกธนาคารต้นทางและปลายทาง");
      return;
    }
    if (isCheque && (!checkNo.trim() || !bankFrom || !bankBranch.trim())) {
      setLocalError("กรุณากรอกเลขที่เช็ค ธนาคาร และสาขาให้ครบ");
      return;
    }

    setLocalError(null);
    onSubmit({
      amount: parsed,
      bankType: method === "van" ? "UOB" : bankFrom,
      bankReceipt:
        method === "bank" ? bankTo : method === "van" ? "KTB" : receiveBank,
      checkNo: isCheque ? checkNo.trim() : "",
      billDate,
      tranferTime,
      bankBranch: isCheque ? bankBranch.trim() : undefined,
    });
  };

  const message = error ?? localError;

  return (
    <Modal
      title={
        <span className="text-xl font-medium text-gray-800">กรอกข้อมูล</span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={method === "van" ? 640 : 760}
      closeIcon={<CloseOutlined className="text-gray-400" />}
      mask={{ closable: !saving }}
    >
      <div className="pt-4">
        {method === "van" && (
          <div className="flex items-center justify-center gap-4">
            <label className="text-base text-gray-700">
              กรอกจำนวนเงินที่ต้องการชำระ :
            </label>
            <div className="w-80">
              <AmountInput value={amount} onChange={setAmount} />
            </div>
          </div>
        )}

        {method === "bank" && (
          <>
            <p className="mb-3 text-lg text-gray-800">โอนเงินผ่านธนาคาร :</p>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex-1">
                <BankPicker
                  label="โอนจาก :"
                  value={bankFrom}
                  onChange={setBankFrom}
                />
              </div>
              <span className="text-2xl text-gray-400">&rarr;</span>
              <div className="flex-1">
                <BankPicker
                  label="ไปยัง :"
                  value={bankTo}
                  onChange={setBankTo}
                />
              </div>
            </div>

            <p className="mb-3 text-lg text-gray-800">รายละเอียดการโอน :</p>
            <div className="mb-3 flex items-center gap-4 rounded-lg border border-gray-200 p-4">
              <span className="text-base text-gray-600">จำนวนเงิน :</span>
              <div className="ml-auto w-72">
                <AmountInput value={amount} onChange={setAmount} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-base text-gray-600">
                  วันที่ทำรายการโอนชำระ :
                </p>
                <DatePicker
                  value={dayjs(billDate)}
                  onChange={(date) => {
                    if (date) setBillDate(date.format("YYYY-MM-DD"));
                  }}
                  format="D MMMM BBBB"
                  locale={thaiPickerLocale}
                  allowClear={false}
                  size="large"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="text-base text-gray-600">เวลาที่โอนชำระ :</p>
                  <input
                    type="time"
                    value={tranferTime}
                    onChange={(event) => setTranferTime(event.target.value)}
                    className="mt-1 rounded-md border border-gray-300 px-3 py-1.5 text-lg text-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <span className="mt-6 text-base text-gray-600">น.</span>
              </div>
            </div>
          </>
        )}

        {isCheque && (
          <>
            <p className="mb-3 text-lg text-gray-800">
              รายละเอียดเช็ค (นำฝาก
              {receiveBank === "UOB" ? "ธนาคารยูโอบี" : "ธนาคารกรุงไทย"}) :
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-1 text-base text-gray-600">จำนวนเงิน :</p>
                <AmountInput value={amount} onChange={setAmount} />
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-1 text-base text-gray-600">เลขที่เช็ค :</p>
                <input
                  type="text"
                  inputMode="numeric"
                  value={checkNo}
                  onChange={(event) =>
                    setCheckNo(
                      event.target.value.replace(/\D/g, "").slice(0, 30),
                    )
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-lg text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-1 text-base text-gray-600">
                  ธนาคารเจ้าของเช็ค :
                </p>
                <Select
                  value={bankFrom || undefined}
                  onChange={setBankFrom}
                  options={bankSelectOptions}
                  placeholder="เลือกธนาคาร"
                  className="w-full"
                />
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-1 text-base text-gray-600">สาขา :</p>
                <input
                  type="text"
                  value={bankBranch}
                  onChange={(event) =>
                    setBankBranch(event.target.value.slice(0, 100))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-lg text-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="mb-1 text-base text-gray-600">วันที่บนเช็ค :</p>
                <DatePicker
                  value={dayjs(billDate)}
                  onChange={(date) => {
                    if (date) setBillDate(date.format("YYYY-MM-DD"));
                  }}
                  format="D MMMM BBBB"
                  locale={thaiPickerLocale}
                  allowClear={false}
                  size="large"
                  className="w-full"
                />
              </div>
            </div>
          </>
        )}

        {customerName && method === "bank" && (
          <p className="mt-3 text-sm text-gray-400">ผู้โอน : {customerName}</p>
        )}

        {message && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {message}
          </p>
        )}

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-md bg-[#1155BB] px-16 py-3 text-lg font-medium text-white transition hover:bg-[#0d47a1] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
