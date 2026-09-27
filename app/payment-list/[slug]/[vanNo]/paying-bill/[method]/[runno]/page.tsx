"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { getCompanyBySlug } from "@/app/payment-list/data";
import { getCustomerInfo, CUSTOMER_SESSION_CHANGED_EVENT } from "@/lib/auth";
import { getPayingBillService } from "@/services/customer/paying-bill";
import {
  isPaymentMethodKey,
  type PayingBillRow,
} from "@/interfaces/paying-bill";
import PayingBillPrint from "./PayingBillPrint";

export interface SlipCustomer {
  custId: string;
  custId13: string;
  name: string;
  address: string;
  phone: string;
}

function getCustomerField(
  info: Record<string, unknown> | null,
  names: string[],
): string {
  if (!info) return "";
  const keys = Object.keys(info);
  for (const name of names) {
    const key = keys.find((item) => item.toLowerCase() === name.toLowerCase());
    if (key && info[key] !== null && info[key] !== undefined) {
      return String(info[key]).trim();
    }
  }
  return "";
}

export default function PayingBillPrintPage() {
  const params = useParams<{
    slug: string;
    vanNo: string;
    method: string;
    runno: string;
  }>();
  const company = getCompanyBySlug(params.slug);
  const method = isPaymentMethodKey(params.method) ? params.method : null;
  const runno = decodeURIComponent(params.runno || "");

  const [sessionInfo, setSessionInfo] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [bill, setBill] = useState<PayingBillRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSessionInfo(getCustomerInfo());
    const handleChanged = () => setSessionInfo(getCustomerInfo());
    window.addEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
    return () =>
      window.removeEventListener(CUSTOMER_SESSION_CHANGED_EVENT, handleChanged);
  }, []);

  useEffect(() => {
    if (!runno) return;
    let cancelled = false;
    getPayingBillService(runno).then((result) => {
      if (cancelled) return;
      if (result.success && result.data) {
        setBill(result.data);
        setError(null);
      } else {
        setError(result.error ?? "ไม่พบใบนำจ่าย");
      }
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [runno]);

  if (!company || !method) return notFound();

  const customer: SlipCustomer = {
    custId:
      bill?.custId ??
      getCustomerField(sessionInfo, ["CustID", "CUSTID", "custID"]),
    custId13:
      bill?.custId13 ??
      getCustomerField(sessionInfo, [
        "ResaleID",
        "resaleID",
        "NumCardID",
        "Custid13",
        "TaxID",
        "TaxNo",
      ]),
    name: getCustomerField(sessionInfo, ["CusName", "customerName", "Name"]),
    address: [
      getCustomerField(sessionInfo, ["Address1", "address1"]),
      getCustomerField(sessionInfo, ["Address2", "address2"]),
      getCustomerField(sessionInfo, ["Address3", "address3"]),
      getCustomerField(sessionInfo, ["City", "city"]),
      getCustomerField(sessionInfo, ["State", "state"]),
      getCustomerField(sessionInfo, ["Zip", "zip", "ZipCode", "zipCode"]),
    ]
      .filter(Boolean)
      .join(" "),
    phone: getCustomerField(sessionInfo, [
      "PhoneNum",
      "phoneNum",
      "Phone",
      "phone",
      "Tel",
    ]),
  };

  return (
    <div className="min-h-screen bg-gray-200 py-6 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[210mm] items-center justify-between px-4 print:hidden">
        <Link
          href={`/payment-list/${params.slug}/${encodeURIComponent(params.vanNo)}/`}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          &larr; กลับหน้ารายละเอียดบัญชี
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          disabled={!bill}
          className="rounded-lg bg-[#0B132B] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1a2744] disabled:bg-gray-300"
        >
          พิมพ์ใบนำจ่าย
        </button>
      </div>

      {isLoading && (
        <p className="text-center text-sm text-gray-500">
          กำลังโหลดใบนำจ่าย...
        </p>
      )}
      {error && (
        <p className="mx-auto max-w-[210mm] rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {bill && (
        <PayingBillPrint
          method={method}
          bill={bill}
          company={company}
          customer={customer}
        />
      )}
    </div>
  );
}
