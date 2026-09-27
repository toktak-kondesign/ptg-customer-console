"use client";

import Image from "next/image";
import {
  CameraFilled,
  CrownFilled,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { img } from "@/lib/env";
import type { CustomerProfile } from "./data";

export default function CustomerHero({
  customer,
}: {
  customer: CustomerProfile;
}) {
  return (
    <section className="relative rounded-2xl bg-[linear-gradient(105deg,#EBF4FE_0%,#DCEDFE_55%,#CFE5FB_100%)]">
      {/* decorative wave */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <svg
          className="absolute inset-y-0 right-0 h-full w-[46%]"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M150 -10 C 240 60 270 140 410 210 L410 -10 Z"
            fill="#C9E0F8"
            opacity="0.55"
          />
          <path
            d="M230 -10 C 300 50 330 120 410 165 L410 -10 Z"
            fill="#B7D7F5"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="relative flex flex-col items-center gap-5 px-5 py-6 sm:flex-row sm:items-center sm:gap-9 sm:px-9 sm:py-0 sm:min-h-[192px]">
        {/* avatar */}
        <div className="relative shrink-0 sm:self-center">
          <div className="relative h-[116px] w-[116px] overflow-hidden rounded-full border-4 border-white shadow-md sm:h-[182px] sm:w-[182px] sm:border-[5px] sm:translate-y-3">
            <Image
              src={img("/images/avatar-customer.svg")}
              alt="รูปโปรไฟล์ลูกค้า"
              fill
              sizes="(min-width: 640px) 182px, 116px"
              className="object-cover"
            />
          </div>
          <button
            type="button"
            aria-label="เปลี่ยนรูปโปรไฟล์"
            onClick={() => console.log("change avatar")}
            className="absolute bottom-0 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#16224E] text-white ring-2 ring-white transition hover:bg-[#25336b] sm:bottom-3 sm:right-3 sm:h-10 sm:w-10"
          >
            <CameraFilled className="text-sm sm:text-base" />
          </button>
        </div>

        {/* identity */}
        <div className="min-w-0 flex-1 text-center sm:text-left sm:pb-2">
          <p className="text-[15px] text-[#5E7DA3]">รหัสลูกค้า</p>
          <p className="mt-0.5 flex items-center justify-center gap-2.5 sm:justify-start">
            <CrownFilled className="text-[26px] text-[#F5B50E] sm:text-[30px]" />
            <span className="text-[34px] font-semibold leading-tight tracking-wide text-[#2475D6] sm:text-[54px]">
              {customer.id}
            </span>
          </p>
          <p className="mt-1 text-[15px] text-[#5E7DA3]">
            ประเภทลูกค้า : {customer.type}
          </p>
        </div>

        {/* switch account */}
        <button
          type="button"
          onClick={() => console.log("switch account")}
          className="group flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-left shadow-[0_2px_10px_rgba(23,58,107,0.10)] transition hover:shadow-[0_4px_16px_rgba(23,58,107,0.16)] sm:w-auto sm:self-start sm:mt-9 sm:min-w-[235px]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2E7FE0] text-white">
            <UserOutlined className="text-lg" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-[#1B3A6E]">
              สลับบัญชี
            </span>
            <span className="block text-xs text-[#8BA2BF]">Change Account</span>
          </span>
          <RightOutlined className="text-xs text-[#8BA2BF] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  );
}
