"use client";

import Image from "next/image";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";
import { bahttext } from "bahttext";
import type { Company } from "@/app/payment-list/data";
import { getBankLogo, getBankName } from "@/lib/banks";
import { formatSlashDate, formatTaxId, formatVanNumber } from "@/lib/format";
import type { PaymentMethodKey, PayingBillRow } from "@/interfaces/paying-bill";
import type { SlipCustomer } from "./page";

interface PayingBillPrintProps {
  method: PaymentMethodKey;
  bill: PayingBillRow;
  company: Company;
  customer: SlipCustomer;
}

const formatAmount = (amount: number | null) =>
  new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount ?? 0);

function BankLogo({ code, size = 40 }: { code: string | null; size?: number }) {
  const logo = getBankLogo(code);
  if (!logo) return null;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src={logo}
        alt={getBankName(code)}
        fill
        sizes={`${size}px`}
        className="object-contain"
      />
    </div>
  );
}

/** บล็อกข้อมูลลูกค้าด้านบนใบนำจ่ายทุกแบบ */
function CustomerHeader({
  company,
  bill,
  customer,
}: {
  company: Company;
  bill: PayingBillRow;
  customer: SlipCustomer;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b-2 border-gray-800 pb-4">
      <div className="relative h-14 w-28 shrink-0">
        <Image
          src={company.logo}
          alt={company.name}
          fill
          sizes="112px"
          className="object-contain"
        />
      </div>
      <div className="flex-1 text-sm leading-relaxed">
        <p className="font-semibold">
          {customer.custId} : {customer.name || "-"}
        </p>
        <p>เลขประจำตัวผู้เสียภาษี : {formatTaxId(customer.custId13, true)}</p>
        <p>{customer.address || "-"}</p>
        <p>โทรศัพท์ : {customer.phone || "-"}</p>
      </div>
      <div className="shrink-0 text-right text-sm">
        <p className="text-lg font-bold">ใบนำจ่าย</p>
        <p>เลขที่ : {bill.runno ?? "-"}</p>
        <p>วันที่ : {formatSlashDate(bill.createDate)}</p>
      </div>
    </div>
  );
}

function AmountWords({ amount }: { amount: number | null }) {
  return (
    <span className="text-sm text-gray-600">({bahttext(amount ?? 0)})</span>
  );
}

/** ใบนำจ่าย VAN — Barcode/QR = เลขบัญชี VAN */
function VanSlip({
  bill,
  company,
  customer,
}: Omit<PayingBillPrintProps, "method">) {
  const vanNo = bill.vanNo ?? "";

  return (
    <div>
      <CustomerHeader company={company} bill={bill} customer={customer} />

      <div className="mt-6 rounded-lg border-2 border-gray-800 p-5">
        <div className="flex items-center gap-3">
          <BankLogo code="UOB" size={44} />
          <div>
            <p className="font-semibold">จ่ายโดยวิธีการโอน ผ่านระบบ VAN</p>
            <p className="text-sm text-gray-600">
              เลขที่บัญชี : {formatVanNumber(vanNo)}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-gray-500">จำนวนเงิน (บาท)</p>
            <p className="text-3xl font-bold">{formatAmount(bill.amount)}</p>
            <AmountWords amount={bill.amount} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-end justify-center gap-16">
        <div className="text-center">
          <QRCode value={vanNo} size={110} />
          <p className="mt-2 text-xs text-gray-600">{formatVanNumber(vanNo)}</p>
        </div>
        <div className="text-center">
          <Barcode value={vanNo || "-"} height={80} fontSize={14} />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-16 text-center text-sm">
        <div>
          <p className="border-b border-gray-400 pb-8" />
          <p className="mt-2">ผู้ชำระเงิน</p>
        </div>
        <div>
          <p className="border-b border-gray-400 pb-8" />
          <p className="mt-2">เจ้าหน้าที่ผู้รับเงิน</p>
        </div>
      </div>
    </div>
  );
}

/** ใบนำจ่ายโอนผ่านธนาคาร — Barcode/QR = Runno */
function BankSlip({
  bill,
  company,
  customer,
}: Omit<PayingBillPrintProps, "method">) {
  const runno = bill.runno ?? "";

  return (
    <div>
      <CustomerHeader company={company} bill={bill} customer={customer} />

      {company.payee.address && (
        <div className="mt-4 rounded-lg border border-gray-300 p-4 text-sm">
          <p className="font-semibold">ชำระเงินเข้าบัญชี : {company.name}</p>
          <p className="text-gray-600">{company.payee.address}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="font-semibold">รายการโอนชำระเงินผ่านธนาคาร :</p>
        <p className="text-sm text-gray-600">
          วันที่บันทึกใบรับ : {formatSlashDate(bill.receiveDate)}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-4 rounded-lg border border-gray-300 p-4">
        <div className="flex flex-1 items-center gap-3">
          <BankLogo code={bill.bankType} />
          <div>
            <p className="text-xs text-gray-500">โอนจาก</p>
            <p className="font-medium">{getBankName(bill.bankType) || "-"}</p>
          </div>
        </div>
        <span className="text-2xl text-gray-400">&rarr;</span>
        <div className="flex flex-1 items-center gap-3">
          <BankLogo code={bill.bankReceipt} />
          <div>
            <p className="text-xs text-gray-500">ไปยัง</p>
            <p className="font-medium">
              {getBankName(bill.bankReceipt) || "-"}
            </p>
          </div>
        </div>
      </div>

      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr className="border-y-2 border-gray-800 text-left">
            <th className="py-2">รายการ</th>
            <th className="py-2 text-right">จำนวนเงิน (บาท)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-300">
            <td className="py-2">
              ชำระเงิน <AmountWords amount={bill.amount} />
            </td>
            <td className="py-2 text-right font-semibold">
              {formatAmount(bill.amount)}
            </td>
          </tr>
        </tbody>
      </table>

      <p className="mt-3 text-sm text-gray-600">
        วันที่ทำรายการโอนชำระ : {formatSlashDate(bill.billDate)} เวลา{" "}
        {bill.tranferTime || "-"} น.
      </p>

      <div className="mt-8 flex items-end justify-center gap-16">
        <div className="text-center">
          <QRCode value={runno} size={110} />
          <p className="mt-2 text-xs text-gray-600">{runno}</p>
        </div>
        <div className="text-center">
          <Barcode value={runno || "-"} height={80} fontSize={14} />
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">
        สำหรับเจ้าหน้าที่ทำการเงิน สแกนเพื่อตรวจสอบ
      </p>

      <div className="mt-10 grid grid-cols-2 gap-16 text-center text-sm">
        <div>
          <p className="border-b border-gray-400 pb-8" />
          <p className="mt-2">ผู้ชำระเงิน</p>
        </div>
        <div>
          <p className="border-b border-gray-400 pb-8" />
          <p className="mt-2">เจ้าหน้าที่ผู้รับเงิน</p>
        </div>
      </div>
    </div>
  );
}

/** ใบรับฝากเงิน กรุงไทย (เช็ค) — ไม่มี Barcode/QR */
function ChequeKtbSlip({
  bill,
  company,
  customer,
}: Omit<PayingBillPrintProps, "method">) {
  return (
    <div>
      <CustomerHeader company={company} bill={bill} customer={customer} />

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">กรุณาชำระเงิน</p>
        <p className="text-4xl font-bold text-red-600">
          {formatAmount(bill.amount)}
        </p>
        <AmountWords amount={bill.amount} />
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-t-lg bg-[#00A6E6] px-4 py-2 text-white">
        <BankLogo code="KTB" size={36} />
        <p className="font-semibold">
          สาขา/Branch : {company.payee.ktbBranch || "-"}
        </p>
        <p className="ml-auto text-sm">
          วันที่และเวลา/Date and Time : {formatSlashDate(bill.createDate)}{" "}
          {bill.tranferTime || ""}
        </p>
      </div>

      <div className="rounded-b-lg border border-t-0 border-gray-300 p-5">
        <p className="text-center text-lg font-bold tracking-wide">
          ใบรับฝากเงิน <span className="text-sm font-normal">DEPOSIT SLIP</span>
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex gap-2">
            <span className="w-40 shrink-0 text-gray-600">
              ชื่อบัญชี/Name :
            </span>
            <span className="flex-1 border-b border-dashed border-gray-400 font-medium">
              {company.payee.ktbAccountName || company.name}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-40 shrink-0 text-gray-600">
              เลขที่บัญชี/Account No. :
            </span>
            <span className="flex-1 border-b border-dashed border-gray-400 font-medium tracking-widest">
              {company.payee.ktbAccountNo || "-"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-40 shrink-0 text-gray-600">
              เลขที่เช็ค/Cheque No. :
            </span>
            <span className="w-40 border-b border-dashed border-gray-400 font-medium">
              {bill.checkNo || "-"}
            </span>
            <span className="flex-1 border-b border-dashed border-gray-400 font-medium">
              {getBankName(bill.bankType)} {bill.bankBranch ?? ""}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-40 shrink-0 text-gray-600">
              เช็คลงวันที่/Cheque Date :
            </span>
            <span className="flex-1 border-b border-dashed border-gray-400 font-medium">
              {formatSlashDate(bill.billDate)}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-40 shrink-0 text-gray-600">
              จำนวนเงิน/Amount :
            </span>
            <span className="flex-1 border-b border-dashed border-gray-400 font-medium">
              {formatAmount(bill.amount)} บาท
            </span>
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-gray-600">
          ได้รับเงิน/เช็คตามรายการข้างต้นไว้ถูกต้องแล้ว / Received the above
          items for deposit subject to verification and collection.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-8 text-center text-xs">
          <div>
            <p className="border-b border-gray-400 pb-8" />
            <p className="mt-1">ผู้นำฝาก/Depositor</p>
            <p className="text-gray-500">({customer.custId || "-"})</p>
          </div>
          <div>
            <p className="border-b border-gray-400 pb-8" />
            <p className="mt-1">จำนวนเงิน (ตัวอักษร)</p>
          </div>
          <div>
            <p className="border-b border-gray-400 pb-8" />
            <p className="mt-1">เจ้าหน้าที่ธนาคาร/Bank Officer</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        จ่ายโดยเช็คผ่านธนาคาร — เลขที่บัญชี {formatVanNumber(bill.vanNo ?? "")}
      </p>
    </div>
  );
}

/** Cheque Collection Pay-in-Slip UOB — ไม่มี Barcode/QR */
function ChequeUobSlip({
  bill,
  company,
  customer,
}: Omit<PayingBillPrintProps, "method">) {
  const vanDigits = (bill.vanNo ?? "").replace(/\D/g, "");

  return (
    <div>
      <CustomerHeader company={company} bill={bill} customer={customer} />

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">กรุณาชำระเงิน</p>
        <p className="text-4xl font-bold text-red-600">
          {formatAmount(bill.amount)}
        </p>
        <AmountWords amount={bill.amount} />
      </div>

      <div className="mt-5 rounded-lg border border-gray-400">
        <div className="flex items-center gap-3 border-b border-gray-400 px-4 py-3">
          <BankLogo code="UOB" size={40} />
          <div>
            <p className="font-bold">ใบนำฝากเช็ค</p>
            <p className="text-xs text-gray-600">
              CHEQUE COLLECTION PAY-IN-SLIP
            </p>
          </div>
          <p className="ml-auto text-sm">
            วันที่/Date : {formatSlashDate(bill.createDate)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 px-4 py-3 text-sm">
          <p>
            สาขารับฝาก/Deposit Branch :{" "}
            <span className="font-medium">{bill.bankBranch || "-"}</span>
          </p>
          <p>
            ชื่อบัญชี/Account Name :{" "}
            <span className="font-medium">
              {company.payee.ktbAccountName || company.name}
            </span>
          </p>
          <p className="flex items-center gap-3">
            ประเภทบัญชี/Account Type :
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-3.5 w-3.5 border border-gray-500" />
              ออมทรัพย์
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-3.5 w-3.5 border border-gray-500" />
              กระแสรายวัน
            </span>
          </p>
          <p>Pickup Point : ____________</p>
        </div>

        <div className="flex items-center gap-2 border-t border-gray-300 px-4 py-3">
          <span className="text-sm text-gray-600">เลขที่บัญชี A/C No. :</span>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="flex h-9 w-7 items-center justify-center border border-gray-400 text-lg font-semibold"
              >
                {vanDigits[i] ?? ""}
              </span>
            ))}
          </div>
        </div>

        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-y border-gray-400 bg-gray-50 text-center">
              <th className="border-r border-gray-300 px-2 py-1.5">ที่/NO.</th>
              <th className="border-r border-gray-300 px-2 py-1.5">
                เช็คธนาคาร-สาขา
                <br />
                Bank-Branch
              </th>
              <th className="border-r border-gray-300 px-2 py-1.5">
                เลขที่เช็ค
                <br />
                Cheque No.
              </th>
              <th className="border-r border-gray-300 px-2 py-1.5">
                เช็คลงวันที่
                <br />
                Cheque Date
              </th>
              <th className="border-r border-gray-300 px-2 py-1.5">
                จำนวนเงิน
                <br />
                Amount
              </th>
              <th className="px-2 py-1.5">
                รหัสร้านค้า
                <br />
                Merchant Code
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-300 text-center">
                <td className="border-r border-gray-300 px-2 py-2">{i + 1}</td>
                <td className="border-r border-gray-300 px-2 py-2">
                  {i === 0
                    ? `${getBankName(bill.bankType)} ${bill.bankBranch ?? ""}`
                    : ""}
                </td>
                <td className="border-r border-gray-300 px-2 py-2">
                  {i === 0 ? (bill.checkNo ?? "") : ""}
                </td>
                <td className="border-r border-gray-300 px-2 py-2">
                  {i === 0 ? formatSlashDate(bill.billDate) : ""}
                </td>
                <td className="border-r border-gray-300 px-2 py-2 text-right">
                  {i === 0 ? formatAmount(bill.amount) : ""}
                </td>
                <td className="px-2 py-2">
                  {i === 0 ? formatTaxId(customer.custId13) : ""}
                </td>
              </tr>
            ))}
            <tr className="text-sm">
              <td colSpan={4} className="px-2 py-2 text-right font-semibold">
                รวมจำนวน Total Cheque : 1 ฉบับ
              </td>
              <td className="border-l border-gray-300 px-2 py-2 text-right font-bold">
                {formatAmount(bill.amount)}
              </td>
              <td className="px-2 py-2" />
            </tr>
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-gray-400 px-4 py-3 text-sm">
          <p>
            จำนวนเงิน (ตัวอักษร) :{" "}
            <span className="font-medium">{bahttext(bill.amount ?? 0)}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-gray-300 px-4 py-4 text-center text-xs">
          <div>
            <p className="border-b border-gray-400 pb-8" />
            <p className="mt-1">
              ผู้นำฝาก/Depositor ({customer.custId || "-"})
            </p>
          </div>
          <div>
            <p className="border-b border-gray-400 pb-8" />
            <p className="mt-1">สำหรับธนาคาร/For Bank Use Only</p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        จ่ายโดยเช็คผ่านธนาคาร — เลขที่บัญชี {formatVanNumber(bill.vanNo ?? "")}
      </p>
    </div>
  );
}

export default function PayingBillPrint({
  method,
  bill,
  company,
  customer,
}: PayingBillPrintProps) {
  const slipProps = { bill, company, customer };

  return (
    <div className="mx-auto w-[210mm] max-w-full bg-white px-10 py-8 shadow-md print:w-full print:shadow-none">
      {method === "van" && <VanSlip {...slipProps} />}
      {method === "bank" && <BankSlip {...slipProps} />}
      {method === "cheque-ktb" && <ChequeKtbSlip {...slipProps} />}
      {method === "cheque-uob" && <ChequeUobSlip {...slipProps} />}
    </div>
  );
}
