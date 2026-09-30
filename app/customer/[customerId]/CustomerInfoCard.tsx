"use client";

import LocalImage from "next/image";
import { Image as PreviewImage } from "antd";
import {
  AimOutlined,
  AppstoreOutlined,
  BankOutlined,
  EditFilled,
  EnvironmentOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  StarFilled,
  UserOutlined,
} from "@ant-design/icons";
import { img } from "@/lib/env";
import MapPreview from "./MapPreview";
import type { CustomerImage } from "@/interfaces/customer";
import type { CustomerProfile } from "./data";

const ICON_TILE =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3FE] text-[#2E7FE0]";

const ICON_TILE_LG =
  "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-[#EAF3FE] text-[#2E7FE0]";

const chevronClass =
  "ml-auto shrink-0 text-xs text-[#8BA2BF] transition-transform group-hover:translate-x-0.5";

function ForkliftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17V10l3-4.5h5L13 10v7" />
      <path d="M2.5 13.5H13" />
      <circle cx="5.8" cy="18.4" r="1.8" />
      <circle cx="11" cy="18.4" r="1.8" />
      <path d="M16.2 3.5v17" />
      <path d="M16.2 18.8h5.3" />
    </svg>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2E7FE0] text-white">
        <UserOutlined className="text-base" />
      </span>
      <h2 className="flex-1 text-[17px] font-bold text-[#1B3A6E]">{title}</h2>
      {action}
    </div>
  );
}

function RelatedCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3.5 rounded-xl border border-[#DCE8F5] bg-white px-4 py-4 text-left transition hover:border-[#AECDEF] hover:bg-[#F7FBFF] hover:shadow-[0_4px_14px_rgba(21,93,255,0.08)]"
    >
      <span className={ICON_TILE_LG}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[#1B3A6E]">
          {title}
        </span>
        {subtitle}
      </span>
      <RightOutlined className={chevronClass} />
    </button>
  );
}

function ImageGallery({
  images,
  emptyText,
}: {
  images: CustomerImage[];
  emptyText: string;
}) {
  if (images.length === 0) {
    return <p className="mt-4 text-sm text-[#8BA2BF]">{emptyText}</p>;
  }

  return (
    <PreviewImage.PreviewGroup>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <PreviewImage
            key={image.id}
            src={image.src}
            alt={image.name}
            className="h-32 w-full rounded-xl object-cover sm:h-36"
          />
        ))}
      </div>
    </PreviewImage.PreviewGroup>
  );
}

export default function CustomerInfoCard({
  customer,
}: {
  customer: CustomerProfile;
}) {
  return (
    <section className="rounded-2xl border border-[#DCE8F5] bg-white shadow-[0_2px_10px_rgba(21,93,255,0.05)]">
      {/* ── ข้อมูลลูกค้า ─────────────────────────────── */}
      <div className="px-5 pt-5 sm:px-7 sm:pt-6">
        <SectionHeader
          title="ข้อมูลลูกค้า"
          // action={
          //   <button
          //     type="button"
          //     onClick={() => console.log("edit customer info")}
          //     className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#EAF3FF] px-3 py-1.5 text-[13px] font-medium text-[#2475D6] transition hover:bg-[#DBEBFF]"
          //   >
          //     <EditFilled className="text-xs" />
          //     แก้ไขข้อมูล
          //   </button>
          // }
        />
      </div>
      <div className="mt-4 border-t border-[#E4EEF9] sm:mt-5" />

      {/* ── ข้อมูลพื้นฐาน ─────────────────────────────── */}
      <div className="flex gap-4 px-5 py-5 sm:px-7">
        {/* <BankOutlined className="mt-0.5 shrink-0 text-[30px] text-[#2E7FE0]" /> */}
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[#1B3A6E]">ชื่อ</p>
          <p className="mt-1 text-sm leading-relaxed text-[#54677E]">
            {customer.name}
          </p>
          <p className="mt-1 text-sm text-[#54677E]">
            เลขประจำตัวผู้เสียภาษี : {customer.taxId}
          </p>
        </div>
      </div>

      {/* ── ที่อยู่ / พิกัด ─────────────────────────────── */}
      <div className="px-5 pb-5 sm:px-7">
        <div className="grid grid-cols-1 divide-y divide-[#E4EEF9] rounded-xl border border-[#DCE8F5] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:divide-x md:divide-y-0">
          <button
            type="button"
            onClick={() => console.log("open address")}
            className="group flex items-center gap-3.5 p-4 text-left transition hover:bg-[#F7FBFF] md:rounded-l-xl"
          >
            <LocalImage
              src="images/home-address.png"
              alt="map"
              width={48}
              height={48}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-[#1B3A6E]">
                ที่อยู่
              </span>
              <span className="mt-0.5 block text-[13px] leading-relaxed text-[#54677E]">
                {customer.addressLine1}
                {customer.addressLine2 && (
                  <>
                    <br />
                    {customer.addressLine2}
                  </>
                )}
              </span>
            </span>
            <RightOutlined className={chevronClass} />
          </button>

          <button
            type="button"
            onClick={() =>
              window.open(
                `https://www.google.com/maps?q=${customer.lat},${customer.lng}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="group flex items-center gap-3.5 p-4 text-left transition hover:bg-[#F7FBFF] md:rounded-r-xl"
          >
            <LocalImage
              src="images/icon-map1.png"
              alt="map"
              width={48}
              height={48}
            />

            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-[#1B3A6E]">
                พิกัดตำแหน่งที่อยู่
              </span>
              <span className="mt-0.5 block text-[13px] text-[#54677E]">
                Lat : {customer.lat}
                <br />
                Long : {customer.lng}
              </span>
            </span>
            <RightOutlined className={chevronClass} />
            <span className="hidden h-[88px] w-[150px] shrink-0 overflow-hidden rounded-lg border border-[#DCE8F5] xl:block">
              <MapPreview />
            </span>
          </button>
        </div>
      </div>

      {/* ── รูปภาพภายในร้าน ─────────────────────────────── */}
      <div className="px-5 pb-6 sm:px-7 sm:pb-7">
        <div className="flex items-center gap-3">
          <LocalImage
            src="images/image-gallery.png"
            alt="map"
            width={32}
            height={32}
          />
          <h3 className="text-[16px] font-bold text-[#1B3A6E]">
            รูปภาพภายในร้าน
          </h3>
          <div className="h-px flex-1 bg-[#E4EEF9]" />
        </div>
        <ImageGallery
          images={customer.images.interior}
          emptyText="ไม่พบรูปภาพภายในร้าน"
        />
      </div>

      {/* ── รูปภาพภายนอกร้าน ─────────────────────────────── */}
      <div className="px-5 pb-6 sm:px-7 sm:pb-7">
        <div className="flex items-center gap-3">
          <LocalImage
            src="images/image-gallery.png"
            alt="map"
            width={32}
            height={32}
          />
          <h3 className="text-[16px] font-bold text-[#1B3A6E]">
            รูปภาพภายนอกร้าน
          </h3>
          <div className="h-px flex-1 bg-[#E4EEF9]" />
        </div>
        <ImageGallery
          images={customer.images.exterior}
          emptyText="ไม่พบรูปภาพภายนอกร้าน"
        />
      </div>
      {/* ── รายการที่เกี่ยวข้อง ─────────────────────────────── */}
      {/* <div className="px-5 pb-6 sm:px-7 sm:pb-7">
        <div className="flex items-center gap-3">
          <AppstoreOutlined className="text-[24px] text-[#2E7FE0]" />
          <h3 className="text-[16px] font-bold text-[#1B3A6E]">
            รายการที่เกี่ยวข้อง
          </h3>
          <div className="h-px flex-1 bg-[#E4EEF9]" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          <RelatedCard
            icon={<StarFilled className="text-xl text-[#1B3A6E]" />}
            title={
              <span className="text-[13px] font-medium text-[#54677E]">
                โครงการที่กำลังดำเนินการอยู่
              </span>
            }
            subtitle={
              <span className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-[26px] font-bold leading-none text-[#2475D6]">
                  {customer.ongoingProjects}
                </span>
                <span className="text-xs text-[#54677E]">รายการ</span>
              </span>
            }
            onClick={() => console.log("open projects")}
          />
          <RelatedCard
            icon={<ShoppingCartOutlined className="text-xl" />}
            title="ผลิตภัณฑ์ที่ใช้"
            subtitle={
              <span className="mt-0.5 block text-xs text-[#8BA2BF]">
                (Product For Use)
              </span>
            }
            onClick={() => console.log("open products")}
          />
          <RelatedCard
            icon={<ForkliftIcon className="h-6 w-6" />}
            title="ยานพาหนะ / อุปกรณ์สนับสนุน"
            subtitle={
              <span className="mt-0.5 block text-xs text-[#8BA2BF]">
                (Hardware Support)
              </span>
            }
            onClick={() => console.log("open hardware support")}
          />
        </div>
      </div> */}
    </section>
  );
}
