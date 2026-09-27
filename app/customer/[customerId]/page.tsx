"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RightOutlined } from "@ant-design/icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getAuthUser,
  getCustomerInfo,
  CUSTOMER_SESSION_CHANGED_EVENT,
} from "@/lib/auth";
import { useCustomerPoints } from "@/lib/CustomerPointsContext";
import { mockCustomer, resolveCustomerProfile } from "./data";
import CustomerHero from "./CustomerHero";
import CustomerInfoCard from "./CustomerInfoCard";
import CustomerSidebar from "./CustomerSidebar";

export default function CustomerPage() {
  const params = useParams<{ customerId: string }>();
  const customerId = decodeURIComponent(params?.customerId ?? "");
  const [info, setInfo] = useState<Record<string, unknown> | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const { goldPoints, silverPoints } = useCustomerPoints();

  useEffect(() => {
    const load = () => {
      setInfo(getCustomerInfo());
      setHasSession(Boolean(getAuthUser()));
    };
    load();
    window.addEventListener(CUSTOMER_SESSION_CHANGED_EVENT, load);
    return () =>
      window.removeEventListener(CUSTOMER_SESSION_CHANGED_EVENT, load);
  }, []);

  const customer = resolveCustomerProfile(
    customerId,
    info,
    hasSession
      ? { goldPoints, silverPoints }
      : {
          goldPoints: mockCustomer.goldPoints,
          silverPoints: mockCustomer.silverPoints,
        },
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-[#EFF5FC]">
      <Header />
      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav
            aria-label="breadcrumb"
            className="mb-5 flex items-center gap-2 text-sm"
          >
            <Link
              href="/"
              className="text-[#7B93B0] transition hover:text-[#2475D6]"
            >
              หน้าหลัก
            </Link>
            <RightOutlined className="text-[10px] text-[#A9BED4]" />
            <span className="font-medium text-[#2475D6]">ข้อมูลลูกค้า</span>
          </nav>

          <CustomerHero customer={customer} />

          <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,330px)]">
            <CustomerInfoCard customer={customer} />
            <CustomerSidebar customer={customer} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
