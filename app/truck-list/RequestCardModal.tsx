"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import QRCode from "react-qr-code";
import { Button, Modal, Spin, Steps, Table } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  ExclamationCircleFilled,
  HistoryOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
  SaveOutlined,
  SearchOutlined,
  SwapOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { img } from "@/lib/env";
import { getAuthUser, getCustomerInfo, getSessionCustomerId } from "@/lib/auth";
import { isValidThaiPlate, normalizePlate } from "@/lib/thaiPlate";
import { getCustomerAccountsService } from "@/services/customer/accounts";
import { getCustomerProfileService } from "@/services/customer/profile";
import {
  checkCarService,
  createCardOtuService,
  getRequestProductsService,
} from "@/services/customer/card-otu-request";
import type { CustomerAccountRow } from "@/interfaces/customer";
import type { PendingBillRow } from "@/interfaces/card-temp";
import { resolveCustomerProfile } from "@/app/customer/[customerId]/data";
import type { RequestProductItem } from "./data";

const isStoneProduct = (item: RequestProductItem) => item.name.includes("หิน");

const round2 = (value: number) => Math.round(value * 100) / 100;

const parseQty = (raw: string | undefined) => {
  const value = parseFloat(raw ?? "");
  return Number.isFinite(value) ? value : 0;
};

const formatQty = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

const ModalTitle = () => (
  <span className="flex items-center gap-2.5">
    <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200">
      <Image
        src={img("/images/profile_card.png")}
        alt=""
        width={32}
        height={32}
      />
    </span>
    <span className="text-lg font-semibold text-gray-800">
      ขอบัตรรถรับสินค้าชั่วคราว
    </span>
  </span>
);

const inputUnderlineClass =
  "mt-1 w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-sm outline-none transition placeholder:italic placeholder:text-gray-400 focus:border-blue-500";

const STEP_ITEMS = [
  { title: "ข้อมูล" },
  { title: "กลุ่มสินค้า" },
  { title: "เลือกสินค้า" },
  { title: "ตรวจสอบ" },
  { title: "บัตรชั่วคราว" },
];

const GROUP_STYLES: Record<string, string> = {
  กลุ่มหิน: "bg-slate-200",
  กลุ่มคอนกรีตบล็อก: "bg-blue-100",
  กลุ่มผลิตภัณคอนกรีตผสมเสร็จ: "bg-red-100",
};

const GROUP_ORDER = Object.keys(GROUP_STYLES);

const OTU_BASE_URL = "https://www.ptg.co.th/OTU.html?id=";

const formatThaiDate = (value: string) =>
  value
    ? new Date(value).toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

const formatBillDate = (value: string | null | undefined) =>
  value ? String(value).slice(0, 10) : "-";

const TermsList = () => (
  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
    <li>
      บัตรนี้เป็นบัตรที่ใช้ได้ครั้งเดียว (One Time Use) ไม่สามารถนำใช้ซ้ำได้
    </li>
    <li>จะต้องใช้บัตรนี้ภายใน 72 ชม.</li>
    <li>สงวนสิทธิ์ เฉพาะรถที่มีทะเบียนตรงกับบัตรนี้เท่านั้น</li>
  </ul>
);

const SummaryRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-3 py-2 text-sm">
    <span className="w-44 shrink-0 text-gray-500">{label}</span>
    <span className="min-w-0 flex-1 font-medium text-gray-800">{children}</span>
  </div>
);

export default function RequestCardModal({
  open,
  custId,
  onClose,
}: {
  open: boolean;
  custId: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [cust, setCust] = useState({ id: "", name: "" });
  const [logo, setLogo] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [accounts, setAccounts] = useState<CustomerAccountRow[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  const [productQuery, setProductQuery] = useState("");
  const [products, setProducts] = useState<RequestProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [group, setGroup] = useState("");
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});

  const [qrDirect, setQrDirect] = useState(false);
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [pendingBills, setPendingBills] = useState<PendingBillRow[] | null>(
    null,
  );
  const [pendingCard, setPendingCard] = useState<string | null>(null);
  const [result, setResult] = useState<{
    idCode: string;
    createDate: string;
  } | null>(null);

  const loadProfile = async (id: string) => {
    setProfileLoading(true);
    const res = await getCustomerProfileService(id);
    if (res.status === "success" && res.results.length > 0) {
      const profile = resolveCustomerProfile(
        id,
        res.results[0],
        { goldPoints: 0, silverPoints: 0 },
        res.images,
      );
      setCust({ id, name: profile.name });
      setLogo(res.images?.logo?.src ?? null);
    }
    setProfileLoading(false);
  };

  const resetProducts = async (id: string) => {
    setProductQuery("");
    setGroup("");
    setDraftQty({});
    setProducts([]);
    setProductsError(null);
    if (!id) return;
    setProductsLoading(true);
    const res = await getRequestProductsService(id);
    if (res.status === "success") {
      const items = res.results.map((row) => ({
        key: `${row.OrderNum}-${row.OrderLine}`,
        docNo: row.OrderNum,
        orderLine: String(row.OrderLine),
        itemCode: row.ItemCode,
        name: row.ItemName,
        available: row.NumToUse,
        unit: row.Unit,
        group: row.ProdName,
      }));
      setProducts(items);
      setDraftQty(Object.fromEntries(items.map((item) => [item.key, "0"])));
    } else {
      setProductsError(res.error ?? "ไม่สามารถโหลดรายการสินค้าได้");
    }
    setProductsLoading(false);
  };

  useEffect(() => {
    if (!open) return;

    setStep(0);
    setQrDirect(false);
    setPhone("");
    setPlate("");
    setFormError(null);
    setPendingBills(null);
    setPendingCard(null);
    setResult(null);
    void resetProducts(custId);

    const seeded = resolveCustomerProfile(custId, getCustomerInfo(), {
      goldPoints: 0,
      silverPoints: 0,
    });
    setCust({
      id: custId,
      name: seeded.name || getAuthUser()?.custName || "",
    });
    setLogo(null);
    if (custId) void loadProfile(custId);
  }, [open, custId]);

  const openSwitcher = () => {
    setSwitcherOpen(true);
    setAccountsLoading(true);
    setAccountsError(null);
    const baseId =
      getAuthUser()?.custID?.trim() || custId || getSessionCustomerId();
    if (!baseId) {
      setAccounts([]);
      setAccountsLoading(false);
      return;
    }
    getCustomerAccountsService(baseId).then((res) => {
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
    if (account.CustID === cust.id) return;
    setCust({ id: account.CustID, name: account.Name });
    setLogo(null);
    void resetProducts(account.CustID);
    void loadProfile(account.CustID);
  };

  const setDraftValue = (item: RequestProductItem, raw: string) => {
    if (raw !== "" && !/^\d*\.?\d{0,2}$/.test(raw)) return;
    const value = parseFloat(raw);
    const next =
      Number.isFinite(value) && value > item.available
        ? String(item.available)
        : raw;
    setDraftQty((current) => ({ ...current, [item.key]: next }));
  };

  const stepDraft = (item: RequestProductItem, delta: number) => {
    const next = round2(
      Math.min(
        item.available,
        Math.max(0, parseQty(draftQty[item.key]) + delta),
      ),
    );
    setDraftQty((current) => ({ ...current, [item.key]: String(next) }));
  };

  const normalizeDraft = (item: RequestProductItem) => {
    const raw = draftQty[item.key];
    setDraftQty((current) => ({
      ...current,
      [item.key]: raw ? String(parseQty(raw)) : "0",
    }));
  };

  const groups = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((item) =>
      counts.set(item.group, (counts.get(item.group) ?? 0) + 1),
    );
    return GROUP_ORDER.map((name) => ({
      name,
      qty: counts.get(name) ?? 0,
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    const inGroup = products.filter((item) => item.group === group);
    if (!q) return inGroup;
    return inGroup.filter(
      (item) =>
        item.docNo.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q),
    );
  }, [products, productQuery, group]);

  const stoneSelected = products.find(
    (item) => isStoneProduct(item) && parseQty(draftQty[item.key]) > 0,
  );

  const selectedItems = products
    .filter((item) => parseQty(draftQty[item.key]) > 0)
    .map((item) => ({
      item,
      qty: Math.min(item.available, round2(parseQty(draftQty[item.key]))),
    }));

  const plateNormalized = normalizePlate(plate);
  const phoneValue = qrDirect ? "" : phone.trim();

  const handleStep1Next = async () => {
    if (!cust.id) {
      setFormError("ไม่พบข้อมูลลูกค้า");
      return;
    }
    if (!qrDirect && !/^0\d{9}$/.test(phoneValue)) {
      setFormError("กรุณากรอกหมายเลขเบอร์โทรศัพท์ 10 หลักให้ถูกต้อง");
      return;
    }
    if (!plateNormalized) {
      setFormError("กรุณากรอกหมายเลขทะเบียนรถบรรทุก");
      return;
    }
    if (!isValidThaiPlate(plateNormalized)) {
      setFormError(
        "รูปแบบทะเบียนรถไม่ถูกต้อง (ตัวอย่าง 80-1234, 810684, 83-1193 นศ, 1ขค1228)",
      );
      return;
    }

    setFormError(null);
    setSubmitting(true);
    const res = await checkCarService(plateNormalized, cust.id, phoneValue);
    setSubmitting(false);

    if (res.status !== "success") {
      setFormError(res.error ?? "ไม่สามารถตรวจสอบข้อมูลรถได้");
      return;
    }
    if (res.pendingBills.length > 0) {
      setPendingBills(res.pendingBills);
      return;
    }
    if (res.pendingCard) {
      setPendingCard(res.pendingCard);
      return;
    }
    setStep(1);
  };

  const handleSelectGroup = (name: string) => {
    if (name !== group) {
      setDraftQty(Object.fromEntries(products.map((item) => [item.key, "0"])));
      setProductQuery("");
    }
    setGroup(name);
    setFormError(null);
    setStep(2);
  };

  const handleStep2Next = () => {
    if (selectedItems.length === 0) {
      setFormError("กรุณาเลือกสินค้าอย่างน้อย 1 รายการ");
      return;
    }
    setFormError(null);
    setStep(3);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setFormError(null);
    const res = await createCardOtuService({
      custID: cust.id,
      custName: cust.name,
      car: plateNormalized,
      phone: phoneValue,
      createBy: (getAuthUser()?.username || cust.id).slice(0, 20),
      items: selectedItems.map(({ item, qty }) => ({
        itemCode: item.itemCode,
        orderNum: item.docNo,
        orderLine: item.orderLine,
        numSend: qty,
        unit: item.unit,
        numSend2: qty,
        unit2: item.unit,
      })),
    });
    setSubmitting(false);

    if (res.status !== "success" || !res.idCode) {
      setFormError(res.error ?? "ไม่สามารถบันทึกข้อมูลได้");
      return;
    }
    setResult({
      idCode: res.idCode,
      createDate: res.createDate ?? new Date().toISOString(),
    });
    setStep(4);
  };

  const backToStep = (target: number) => {
    setFormError(null);
    setStep(target);
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        width={760}
        mask={{ closable: step !== 4 }}
        title={
          <div className="flex items-center justify-between gap-3 pr-6">
            <ModalTitle />
            <Link
              href="/truck-list/history"
              onClick={onClose}
              className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600"
            >
              <HistoryOutlined />
              ประวัติการขอบัตรรถ
            </Link>
          </div>
        }
      >
        <div className="pt-2">
          <Steps current={step} size="small" items={STEP_ITEMS} />

          {step === 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-gray-800">
                ข้อมูลลูกค้าที่ต้องการรับสินค้า{" "}
                <span className="text-red-500">*</span>
              </p>
              <div className="mt-2 flex items-center gap-4 rounded-lg border border-gray-200 p-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  <Image
                    src={logo ?? img("/images/avatar-customer.svg")}
                    alt="รูปลูกค้า"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-blue-700">
                    รหัสลูกค้า{cust.id || "-"}
                  </p>
                  <p className="text-gray-700">
                    {profileLoading ? "กำลังโหลด..." : cust.name || "-"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openSwitcher}
                  className="flex w-24 shrink-0 flex-col items-center gap-1.5 rounded-lg border border-gray-200 px-2 py-3 text-center transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-lg text-blue-600">
                    <SwapOutlined />
                  </span>
                  <span className="text-xs leading-tight text-gray-600">
                    เปลี่ยนรหัสลูกค้า
                  </span>
                </button>
              </div>

              {/* <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={qrDirect}
                  onClick={() => {
                    setQrDirect((v) => !v);
                    setFormError(null);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-gray-700 transition hover:bg-red-100"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                      qrDirect ? "border-blue-600" : "border-red-300"
                    }`}
                  >
                    {qrDirect && (
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    )}
                  </span>
                  รับ QR โดยตรง
                </button>
              </div> */}

              {!qrDirect && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-800">
                    หมายเลขเบอร์โทรศัพท์ (คนขับรถบรรทุก){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="กรอกหมายเลขเบอร์โทรศัพท์"
                    inputMode="tel"
                    className={inputUnderlineClass}
                  />
                </div>
              )}

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-800">
                  หมายเลขทะเบียนรถบรรทุก<span className="text-red-500">*</span>
                </label>
                <input
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="กรอกหมายเลขทะเบียนรถ เช่น 80-1234"
                  className={inputUnderlineClass}
                />
              </div>

              {formError && (
                <p className="mt-3 text-center text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="mt-6 flex justify-center">
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  iconPlacement="end"
                  loading={submitting}
                  onClick={handleStep1Next}
                  className="min-w-[260px]"
                >
                  ถัดไป
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="mt-5">
              <h3 className="text-base font-semibold text-gray-800">
                เลือกกลุ่มสินค้า
              </h3>
              {productsLoading ? (
                <div className="py-10 text-center">
                  <Spin />
                </div>
              ) : products.length === 0 && !productsError ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  ไม่พบสินค้าที่สามารถรับได้
                </p>
              ) : (
                <div className="mt-3 grid h-72 grid-cols-2 grid-rows-2 gap-3">
                  {groups.map((g, index) => {
                    const empty = g.qty === 0;
                    return (
                      <button
                        key={g.name}
                        type="button"
                        disabled={empty}
                        onClick={() => handleSelectGroup(g.name)}
                        className={`flex flex-col justify-between rounded-2xl p-5 text-left transition ${
                          GROUP_STYLES[g.name]
                        } ${index === 0 ? "row-span-2" : ""} ${
                          g.name === group
                            ? "ring-2 ring-blue-500"
                            : "ring-1 ring-transparent"
                        } ${
                          empty
                            ? "cursor-not-allowed opacity-40"
                            : "hover:shadow-md"
                        }`}
                      >
                        <span className="text-lg font-semibold text-gray-800">
                          {g.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {g.qty} รายการ
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 flex justify-center gap-3">
                <Button
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => backToStep(0)}
                  className="min-w-[140px]"
                >
                  ย้อนกลับ
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-5">
              <h3 className="text-base font-semibold text-gray-800">
                สินค้าที่ท่านสามารถรับได้ ({group}){" "}
                <span className="mt-3 text-center text-sm font-semibold text-red-600">
                  รับได้ไม่เกินปริมาณที่มี
                </span>
              </h3>
              <p className="mt-1 text-sm text-red-600">
                *หมายเหตุ : หากต้องการบรรทุกสินค้าประเภทหินจะเลือกสินค้าได้ 1
                สินค้าเท่านั้น
              </p>
              <div className="mt-3 flex items-center gap-2">
                <SearchOutlined />
                <input
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="ค้นหาสินค้า"
                  className={inputUnderlineClass}
                />
              </div>
              <div className="mt-3 max-h-[45vh] space-y-3 overflow-y-auto pr-1">
                {productsLoading ? (
                  <div className="py-6 text-center">
                    <Spin />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <p className="py-6 text-center text-sm text-gray-400">
                    {productsError ?? "ไม่พบสินค้าที่ค้นหา"}
                  </p>
                ) : (
                  filteredProducts.map((item) => {
                    const disabled =
                      isStoneProduct(item) &&
                      stoneSelected !== undefined &&
                      stoneSelected.key !== item.key;
                    const qty = parseQty(draftQty[item.key]);
                    return (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3 transition ${
                          disabled ? "opacity-50" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-blue-700">
                            เลขที่ {item.docNo} : {item.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            จำนวน {formatQty(item.available)} {item.unit}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center overflow-hidden rounded-md border border-gray-200">
                          <button
                            type="button"
                            aria-label="ลดจำนวน"
                            disabled={disabled || qty <= 0}
                            onClick={() => stepDraft(item, -1)}
                            className="flex h-9 w-9 items-center justify-center bg-gray-100 text-gray-600 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <MinusOutlined className="text-xs" />
                          </button>
                          <input
                            value={draftQty[item.key] ?? "0"}
                            onChange={(e) =>
                              setDraftValue(item, e.target.value)
                            }
                            onFocus={(e) => e.target.select()}
                            onBlur={() => normalizeDraft(item)}
                            disabled={disabled}
                            inputMode="decimal"
                            aria-label={`จำนวน ${item.name}`}
                            className="h-9 w-16 border-x border-gray-200 text-center text-sm outline-none disabled:bg-gray-50"
                          />
                          <button
                            type="button"
                            aria-label="เพิ่มจำนวน"
                            disabled={disabled || qty >= item.available}
                            onClick={() => stepDraft(item, 1)}
                            className="flex h-9 w-9 items-center justify-center bg-gray-100 text-gray-600 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <PlusOutlined className="text-xs" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {formError && (
                <p className="mt-3 text-center text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="mt-5 flex justify-center gap-3">
                <Button
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => backToStep(1)}
                  className="min-w-[140px]"
                >
                  ย้อนกลับ
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  iconPlacement="end"
                  onClick={handleStep2Next}
                  className="min-w-[140px]"
                >
                  ถัดไป
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-5">
              <h3 className="text-base font-semibold text-gray-800">
                ตรวจสอบข้อมูลก่อนยืนยัน
              </h3>
              <div className="mt-2 divide-y divide-gray-100 rounded-lg border border-gray-200 px-4">
                <SummaryRow label="รหัสลูกค้า">{cust.id}</SummaryRow>
                <SummaryRow label="ชื่อลูกค้า">{cust.name || "-"}</SummaryRow>
                <SummaryRow label="เบอร์โทรศัพท์คนขับ">
                  {qrDirect ? "รับ QR โดยตรง" : phoneValue}
                </SummaryRow>
                <SummaryRow label="ทะเบียนรถบรรทุก">
                  {plateNormalized}
                </SummaryRow>
                <SummaryRow label="รายการสินค้า">
                  <ul className="space-y-1">
                    {selectedItems.map(({ item, qty }) => (
                      <li key={item.key} className="flex justify-between gap-3">
                        <span className="truncate">
                          เลขที่ {item.docNo} : {item.name}
                        </span>
                        <span className="shrink-0 text-blue-700">
                          {formatQty(qty)} {item.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </SummaryRow>
              </div>

              {formError && (
                <p className="mt-3 text-center text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="mt-5 flex justify-center gap-3">
                <Button
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  disabled={submitting}
                  onClick={() => backToStep(2)}
                  className="min-w-[140px]"
                >
                  ย้อนกลับ
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={submitting}
                  onClick={handleConfirm}
                  className="min-w-[200px]"
                >
                  ยืนยันบันทึกข้อมูล
                </Button>
              </div>
            </div>
          )}

          {step === 4 && result && (
            <div className="mt-5">
              <div className="mx-auto max-w-md rounded-2xl border border-gray-200 p-6 shadow-sm">
                <Image
                  src={img("/images/logo_company/logo_PTG.png")}
                  alt="PTG"
                  width={120}
                  height={40}
                  className="h-auto w-28"
                />
                <div className="mt-4 flex justify-center">
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <QRCode
                      value={`${OTU_BASE_URL}${result.idCode}`}
                      size={176}
                    />
                  </div>
                </div>
                <p className="mt-2 text-center text-xs tracking-wider text-gray-500">
                  {result.idCode}
                </p>
                <div className="mt-4 text-center">
                  <p className="font-semibold text-gray-800">
                    {cust.name || "-"} ({cust.id})
                  </p>
                  <p className="mt-1 font-semibold text-gray-800">
                    ทะเบียน {plateNormalized}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    ออกบัตรเมื่อ {formatThaiDate(result.createDate)}
                  </p>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-3">
                  <p className="text-sm font-semibold text-gray-800">
                    เงื่อนไขบัตรรถบรรทุกชั่วคราว (Card One Time Use)
                  </p>
                  <TermsList />
                  <p className="mt-3 text-center text-sm text-gray-700">
                    ท่านสามารถดูวิธีใช้บัตรได้ที่{" "}
                    <a
                      href="https://vimeo.com/642570187"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      https://vimeo.com/642570187
                    </a>
                  </p>
                  <p className="mt-2 text-right text-sm text-gray-700">
                    สอบถามข้อมูลเพิ่มเติม โทร : 1634
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <Button
                  type="primary"
                  size="large"
                  onClick={onClose}
                  className="min-w-[200px]"
                >
                  ปิด
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={pendingBills !== null}
        onCancel={() => setPendingBills(null)}
        footer={
          <Button type="primary" onClick={() => setPendingBills(null)}>
            ตกลง
          </Button>
        }
        centered
        width={640}
        title="พบใบงานค้างอยู่ในระบบ"
      >
        <p className="text-sm text-red-600">
          รถทะเบียน {plateNormalized} มีใบงานค้างอยู่ในระบบ
          กรุณาติดต่อเจ้าหน้าที่หรือพนักงานตลาดทำการเช็คข้อมูล
        </p>
        <Table<PendingBillRow & { _key: number }>
          className="mt-3"
          size="small"
          pagination={false}
          rowKey="_key"
          dataSource={(pendingBills ?? []).map((bill, index) => ({
            ...bill,
            _key: index,
          }))}
          columns={[
            {
              title: "ลำดับที่",
              width: 80,
              render: (_v, _r, i) => i + 1,
            },
            { title: "เลขที่ใบรับสินค้า", dataIndex: "OrderCode" },
            {
              title: "วันที่รับสินค้า",
              dataIndex: "DateSend",
              render: formatBillDate,
            },
            { title: "สถานะ", dataIndex: "TxtStatus" },
          ]}
        />
      </Modal>

      <Modal
        open={pendingCard !== null}
        onCancel={() => setPendingCard(null)}
        footer={
          <Button type="primary" onClick={() => setPendingCard(null)}>
            ตกลง
          </Button>
        }
        centered
        width={500}
      >
        <div className="px-2 py-2 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 text-amber-500 ring-4 ring-amber-100">
            <ExclamationCircleFilled className="text-[5.25rem]" />
          </div>
          <h3 className="mt-3 text-xl font-semibold text-amber-600">
            มีบัตรชั่วคราวค้างอยู่
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            คุณได้ขอบัตรรถบรรทุกชั่วคราวให้กับรถบรรทุกทะเบียน{" "}
            <span className="font-semibold text-blue-700">
              {plateNormalized}
            </span>{" "}
            ไว้แล้ว บัตรชั่วคราวมีอายุ{" "}
            <span className="rounded bg-amber-100 px-1 font-semibold text-amber-700">
              72 ชั่วโมง
            </span>{" "}
            กรุณามารับสินค้าภายในระยะเวลาที่กำหนด
          </p>
          {pendingCard && (
            <p className="mt-3">
              <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1  font-medium text-red-600">
                เลขที่บัตร {pendingCard}
              </span>
            </p>
          )}
        </div>
      </Modal>

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
                เปลี่ยนรหัสลูกค้า
              </span>
              <span className="block text-xs font-normal text-[#8BA2BF]">
                เลือกบัญชีลูกค้าที่ต้องการขอบัตร
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
        ) : accounts.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#8BA2BF]">
            ไม่พบบัญชีอื่นที่เชื่อมโยงกับบัญชีนี้
          </p>
        ) : (
          <div className="max-h-[55vh] overflow-y-auto">
            {accounts.map((account) => {
              const isCurrent = account.CustID === cust.id;
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
    </>
  );
}
