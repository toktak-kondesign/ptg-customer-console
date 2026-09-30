"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal, Spin } from "antd";
import {
  CameraFilled,
  CheckOutlined,
  CrownFilled,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { img } from "@/lib/env";
import {
  getAuthUser,
  getSessionCustomerId,
  setViewedCustomerId,
} from "@/lib/auth";
import { getCustomerAccountsService } from "@/services/customer/accounts";
import type { CustomerAccountRow } from "@/interfaces/customer";
import type { CustomerProfile } from "./data";

export default function CustomerHero({
  customer,
}: {
  customer: CustomerProfile;
}) {
  const router = useRouter();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [accounts, setAccounts] = useState<CustomerAccountRow[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  // Query รายการบัญชีด้วย custID ของ user ที่ login อยู่เสมอ เพื่อให้ได้
  // บัญชีในกลุ่มครบทุกครั้งแม้กำลังดูบัญชีย่อยอยู่ (ไม่มี session ค่อย fallback
  // ไปที่บัญชีที่แสดงอยู่)
  const openSwitcher = () => {
    setSwitcherOpen(true);
    setAccountsLoading(true);
    setAccountsError(null);
    const custId =
      getAuthUser()?.custID?.trim() || getSessionCustomerId() || customer.id;
    if (!custId) {
      setAccounts([]);
      setAccountsLoading(false);
      return;
    }
    getCustomerAccountsService(custId).then((res) => {
      if (res.status === "success") {
        setAccounts(res.results);
      } else {
        setAccounts([]);
        setAccountsError(res.error ?? "ไม่สามารถโหลดรายการบัญชีได้");
      }
      setAccountsLoading(false);
    });
  };

  const handleSelectAccount = (account: CustomerAccountRow) => {
    setSwitcherOpen(false);
    if (account.CustID === customer.id) return;
    // เลือกบัญชีตัวเอง = เคลียร์ override กลับไปใช้ session ปกติ
    const ownCustId = getAuthUser()?.custID?.trim();
    setViewedCustomerId(account.CustID === ownCustId ? null : account.CustID);
    router.push(`/customer/${encodeURIComponent(account.CustID)}`);
  };

  const hasOtherAccounts = accounts.some(
    (account) => account.CustID !== customer.id,
  );

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
              src={
                customer.images.logo?.src ?? img("/images/avatar-customer.svg")
              }
              alt={customer.images.logo?.name ?? "รูปโปรไฟล์ลูกค้า"}
              fill
              sizes="(min-width: 640px) 182px, 116px"
              className="object-cover"
            />
          </div>
          {/* <button
            type="button"
            aria-label="เปลี่ยนรูปโปรไฟล์"
            onClick={() => console.log("change avatar")}
            className="absolute bottom-0 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#16224E] text-white ring-2 ring-white transition hover:bg-[#25336b] sm:bottom-3 sm:right-3 sm:h-10 sm:w-10"
          >
            <CameraFilled className="text-sm sm:text-base" />
          </button> */}
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
          onClick={openSwitcher}
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

      <Modal
        open={switcherOpen}
        onCancel={() => setSwitcherOpen(false)}
        footer={null}
        centered
        width={440}
        title={
          <span className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2E7FE0] text-white">
              <UserOutlined />
            </span>
            <span>
              <span className="block text-base font-semibold text-[#1B3A6E]">
                สลับบัญชี
              </span>
              <span className="block text-xs font-normal text-[#8BA2BF]">
                Change Account — เลือกบัญชีที่ต้องการ
              </span>
            </span>
          </span>
        }
      >
        {accountsLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : accountsError ? (
          <p className="py-6 text-center text-sm text-[#8BA2BF]">
            {accountsError}
          </p>
        ) : !hasOtherAccounts ? (
          <p className="py-6 text-center text-sm text-[#8BA2BF]">
            ไม่พบบัญชีอื่นที่เชื่อมโยงกับบัญชีนี้
          </p>
        ) : (
          <div className="max-h-[55vh] overflow-y-auto">
            {accounts.map((account) => {
              const isCurrent = account.CustID === customer.id;
              return (
                <button
                  key={account.CustID}
                  type="button"
                  onClick={() => handleSelectAccount(account)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    isCurrent ? "bg-[#EBF4FE]" : "hover:bg-[#F4F9FF]"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isCurrent
                        ? "bg-[#2E7FE0] text-white"
                        : "bg-[#E8F1FC] text-[#2E7FE0]"
                    }`}
                  >
                    <UserOutlined className="text-lg" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-[#1B3A6E]">
                      {account.CustID}
                      {isCurrent && (
                        <span className="ml-2 text-xs font-normal text-[#2E7FE0]">
                          บัญชีปัจจุบัน
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-sm text-[#5E7DA3]">
                      {account.Name}
                    </span>
                    {account.xFullName_c && (
                      <span className="block truncate text-xs text-[#8BA2BF]">
                        {account.xFullName_c}
                      </span>
                    )}
                  </span>
                  {isCurrent ? (
                    <CheckOutlined className="shrink-0 text-[#2E7FE0]" />
                  ) : (
                    <RightOutlined className="shrink-0 text-xs text-[#8BA2BF] transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </Modal>
    </section>
  );
}
