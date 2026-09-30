"use client";

import Image from "next/image";
import {
  MailFilled,
  MessageFilled,
  PhoneFilled,
  RedEnvelopeFilled,
  RightOutlined,
  StarFilled,
  UserOutlined,
} from "@ant-design/icons";
import { formatPointValue, type CustomerProfile } from "./data";
import { img } from "@/lib/env";

const chevronClass =
  "ml-auto shrink-0 text-xs text-[#8BA2BF] transition-transform group-hover:translate-x-0.5";

function SidebarHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2E7FE0] text-white">
        <UserOutlined className="text-base" />
      </span>
      <h3 className="flex-1 text-[16px] font-bold text-[#1B3A6E]">{title}</h3>
      <RightOutlined className={chevronClass} />
    </div>
  );
}

function AccountCard({ customer }: { customer: CustomerProfile }) {
  return (
    <section className="rounded-2xl border border-[#DCE8F5] bg-white p-5 shadow-[0_2px_10px_rgba(21,93,255,0.05)]">
      <button
        type="button"
        onClick={() => console.log("open account info")}
        className="group w-full"
      >
        <SidebarHeader title="ข้อมูลบัญชี" />
      </button>

      <div className="mt-4 grid grid-cols-2 divide-x divide-[#DCE8F5] rounded-xl border border-[#E4EEF9] bg-[linear-gradient(135deg,#F4F9FF_0%,#EAF3FD_100%)]">
        <div className="flex items-center gap-3 px-4 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5B50E] text-white">
            <RedEnvelopeFilled className="text-lg" />
          </span>
          <span>
            <span className="block text-xs text-[#6B87A8]">แต้มสะสม</span>
            <span className="block text-[26px] font-bold leading-tight text-[#1B3A6E]">
              {formatPointValue(customer.goldPoints)}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9AA9BC] text-white">
            <StarFilled className="text-lg" />
          </span>
          <span>
            <span className="block text-xs text-[#6B87A8]">Silver</span>
            <span className="block text-[26px] font-bold leading-tight text-[#1B3A6E]">
              {formatPointValue(customer.silverPoints)}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  value,
  onClick,
  iconClassName = "bg-[#EAF3FE] text-[#2E7FE0]",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 px-1 py-3.5 text-left"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[#8BA2BF]">{label}</span>
        <span className="block truncate text-sm font-medium text-[#2475D6]">
          {value}
        </span>
      </span>
      <RightOutlined className={chevronClass} />
    </button>
  );
}

function ContactCard({ customer }: { customer: CustomerProfile }) {
  return (
    <section className="rounded-2xl border border-[#DCE8F5] bg-white px-5 py-5 shadow-[0_2px_10px_rgba(21,93,255,0.05)]">
      <SidebarHeader title="ข้อมูลติดต่อ" />
      <div className="mt-4 divide-y divide-[#EDF3FA] border-t border-[#E4EEF9]">
        <ContactItem
          icon={<PhoneFilled className="text-base" />}
          label="เบอร์โทรศัพท์"
          value={customer.phone}
          onClick={() => console.log("call", customer.phone)}
        />
        <ContactItem
          icon={<MailFilled className="text-base" />}
          label="อีเมล"
          value={customer.email}
          onClick={() => console.log("mail", customer.email)}
        />
        <ContactItem
          icon={<MessageFilled className="text-base" />}
          iconClassName="bg-[#06C755] text-white"
          label="Line"
          value={customer.line}
          onClick={() => console.log("open line", customer.line)}
        />
      </div>
    </section>
  );
}
{
  /* ---------- ผู้ดูแล ---------------*/
}
function StaffCard({ customer }: { customer: CustomerProfile }) {
  return (
    <div className="mt-3.5 sm:max-w-[360px]">
      <button
        type="button"
        onClick={() => console.log("open caretaker")}
        className="group flex w-full items-center gap-4 rounded-xl border border-[#DCE8F5] bg-white px-4 py-3.5 text-left transition hover:border-[#AECDEF] hover:bg-[#F7FBFF] hover:shadow-[0_4px_14px_rgba(21,93,255,0.08)]"
      >
        <span className="relative h-[56px] w-[56px] shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
          <Image
            src={
              customer.caretakerCode
                ? `https://wn2013.ptg.co.th/Upload/Employee/${customer.caretakerCode}.jpg`
                : img("/images/avatar-caretaker.svg")
            }
            alt={customer.caretakerName}
            width={56}
            height={56}
            sizes="56px"
            className="object-cover"
            style={{ width: "100%", height: "auto" }}
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-[#8BA2BF]">ผู้ดูแล</span>
          <span className="mt-0.5 block truncate text-sm font-semibold text-[#1B3A6E]">
            {customer.caretakerName}
          </span>
          <span className="block text-[13px] text-[#54677E]">
            {customer.caretakerPhone}
          </span>
        </span>
        <RightOutlined className={chevronClass} />
      </button>
    </div>
  );
}

export default function CustomerSidebar({
  customer,
}: {
  customer: CustomerProfile;
}) {
  return (
    <aside className="flex flex-col gap-5">
      <AccountCard customer={customer} />
      <ContactCard customer={customer} />
      <StaffCard customer={customer} />
    </aside>
  );
}
