export const paymentStatuses = [
  {
    key: "not-due",
    label: "ยังไม่เกินกำหนดชำระ",
    color: "bg-gray-400",
    hex: "#9CA3AF",
    textClass: "text-gray-500 font-medium",
  },
  {
    key: "overdue-1-15",
    label: "เกินกำหนดน้อยกว่า 15 วัน",
    color: "bg-[#8BC53F]",
    hex: "#8BC53F",
    textClass: "text-[#5A8A2A] font-semibold text-lg",
  },
  {
    key: "overdue-16-30",
    label: "เกินกำหนด 16–30 วัน",
    color: "bg-[#FFD400]",
    hex: "#FFD400",
    textClass: "text-[#B8860B] font-semibold text-lg",
  },
  {
    key: "overdue-30",
    label: "เกินกำหนดมากกว่า 30 วัน",
    color: "bg-[#ED1C24]",
    hex: "#ED1C24",
    textClass: "text-[#ED1C24] font-bold text-xl",
  },
] as const;

export type PaymentStatusKey = (typeof paymentStatuses)[number]["key"];
export type ViewMode = "table" | "pie" | "column";

export type AccountSlot = {
  no: number;
  accountNo?: string;
  creditType?: string;
  creditLimit?: string;
  used?: number;
  remaining?: string;
  status?: string;
};

export type Company = {
  slug: string;
  name: string;
  nameEn: string;
  shortName: string;
  logo: string;
  rows: { status: PaymentStatusKey; count: number; amount: number }[];
  accounts: AccountSlot[];
};

const emptySlots = (count: number, filled?: Partial<AccountSlot>[]): AccountSlot[] =>
  Array.from({ length: count }, (_, i) => {
    const overrides = filled?.find((f) => f.no === i + 1);
    return { no: i + 1, ...overrides };
  });

export const companies: Company[] = [
  {
    slug: "ptg",
    name: "บริษัท ผาทองทุ่งสง จำกัด",
    nameEn: "PHATHONG THUNGSONG Co.,Ltd",
    shortName: "ผาทองทุ่งสง",
    logo: "/images/logo_company/logo_PTG_active.png",
    rows: [{ status: "not-due", count: 8, amount: 301587.35 }],
    accounts: emptySlots(6, [
      {
        no: 5,
        accountNo: "4570-1-0200-2",
        creditType: "วงเงินหมุนเวียน",
        creditLimit: "-",
        used: 301587.35,
        remaining: "-",
        status: "ปกติ",
      },
    ]),
  },
  {
    slug: "ptg24",
    name: "บริษัท ผาทอง24 จำกัด",
    nameEn: "PHATHONG24 Co.,Ltd",
    shortName: "ผาทอง24",
    logo: "/images/logo_company/logo_PTG24_active.png",
    rows: [
      { status: "overdue-30", count: 59, amount: 720762.12 },
      { status: "overdue-16-30", count: 14, amount: 80627.5 },
      { status: "overdue-1-15", count: 29, amount: 393413.21 },
      { status: "not-due", count: 86, amount: 4656669.84 },
    ],
    accounts: emptySlots(6, [
      {
        no: 5,
        accountNo: "4571-1-0300-5",
        creditType: "วงเงินหมุนเวียน",
        creditLimit: "-",
        used: 5851472.67,
        remaining: "-",
        status: "ปกติ",
      },
    ]),
  },
  {
    slug: "ake",
    name: "บริษัท เอกทรานสปอร์ต 2016 จำกัด",
    nameEn: "Ake Transport Co,Ltd",
    shortName: "เอกทรานสปอร์ต",
    logo: "/images/logo_company/logo_ake_active.png",
    rows: [],
    accounts: emptySlots(6),
  },
  {
    slug: "mono",
    name: "บริษัท โมโนเซเปียน จำกัด",
    nameEn: "Monosapian Co,Ltd",
    shortName: "โมโนเซเปียน",
    logo: "/images/logo_company/logo_mono_active.png",
    rows: [],
    accounts: emptySlots(6),
  },
];

export const getCompanyBySlug = (slug: string) =>
  companies.find((company) => company.slug === slug);

export const formatAmount = (amount: number) =>
  new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

export const formatCompact = (amount: number) => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return `${amount}`;
};
