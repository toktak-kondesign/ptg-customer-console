import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { img } from "@/lib/env";
import OrderPickerContent from "./OrderPickerContent";

export const metadata: Metadata = { title: "รายการ Order สินค้า | PTG Family" };

export default function OrderPickerPage() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex-1 bg-gradient-to-br from-[#f3f6fc] via-[#edf4ff] to-[#dceaff] px-3 py-6 text-[#18345c] sm:px-6 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="เส้นทางนำทาง"
            className="mb-4 flex items-center gap-2 px-2 text-xs sm:text-sm"
          >
            <Link
              href="/"
              className="rounded text-slate-600 hover:text-blue-700 focus-visible:outline-blue-600"
            >
              หน้าหลัก
            </Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page" className="font-bold text-[#0754b8]">
              รายการ Order สินค้า
            </span>
          </nav>
          <section
            aria-labelledby="order-page-title"
            className="relative isolate overflow-hidden rounded-3xl border border-white bg-blue-50 px-5 py-8 shadow-lg shadow-blue-900/10 sm:min-h-40 sm:px-8 sm:py-10"
          >
            <Image
              src={img("/images/header_banner_backgr.png")}
              alt=""
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="-z-10 object-cover object-right opacity-30 sm:opacity-100"
            />
            <div className="flex items-center gap-4 sm:max-w-[65%]">
              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-300 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 text-white shadow-lg shadow-blue-700/30"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="m12 3 9 4.5v9L12 21l-9-4.5v-9L12 3Zm0 9v9M3 7.5 12 12l9-4.5M7.5 5.25l9 4.5v5" />
                </svg>
              </div>
              <div>
                <h1
                  id="order-page-title"
                  className="text-xl font-bold tracking-tight text-[#12366b] sm:text-3xl"
                >
                  รายการ Order สินค้า
                </h1>
                <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                  ตรวจสอบรายละเอียดสินค้าและจำนวนคงเหลือ
                </p>
              </div>
            </div>
          </section>
          <OrderPickerContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
