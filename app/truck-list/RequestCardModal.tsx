"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Modal, Spin } from "antd";
import {
  CheckOutlined,
  HistoryOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
  SaveOutlined,
  SwapOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { img } from "@/lib/env";
import { getAuthUser, getCustomerInfo, getSessionCustomerId } from "@/lib/auth";
import { getCustomerAccountsService } from "@/services/customer/accounts";
import { getCustomerProfileService } from "@/services/customer/profile";
import type { CustomerAccountRow } from "@/interfaces/customer";
import { resolveCustomerProfile } from "@/app/customer/[customerId]/data";
import { mockRequestProducts, type RequestProductItem } from "./data";

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

export default function RequestCardModal({
  open,
  custId,
  onClose,
}: {
  open: boolean;
  custId: string;
  onClose: () => void;
}) {
  const [cust, setCust] = useState({ id: "", name: "" });
  const [logo, setLogo] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [accounts, setAccounts] = useState<CustomerAccountRow[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  const [productOpen, setProductOpen] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});
  const [selectedItems, setSelectedItems] = useState<
    { item: RequestProductItem; qty: number }[]
  >([]);

  const [qrDirect, setQrDirect] = useState(false);
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!open) return;

    setQrDirect(false);
    setPhone("");
    setPlate("");
    setFormError(null);
    setSelectedItems([]);
    setDraftQty({});

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
    void loadProfile(account.CustID);
  };

  const openProductModal = () => {
    setProductQuery("");
    setDraftQty(
      Object.fromEntries(
        mockRequestProducts.map((item) => [
          item.docNo,
          String(
            selectedItems.find((s) => s.item.docNo === item.docNo)?.qty ?? 0,
          ),
        ]),
      ),
    );
    setProductOpen(true);
  };

  const setDraftValue = (item: RequestProductItem, raw: string) => {
    if (raw !== "" && !/^\d*\.?\d{0,2}$/.test(raw)) return;
    const value = parseFloat(raw);
    const next =
      Number.isFinite(value) && value > item.available
        ? String(item.available)
        : raw;
    setDraftQty((current) => ({ ...current, [item.docNo]: next }));
  };

  const stepDraft = (item: RequestProductItem, delta: number) => {
    const next = round2(
      Math.min(
        item.available,
        Math.max(0, parseQty(draftQty[item.docNo]) + delta),
      ),
    );
    setDraftQty((current) => ({ ...current, [item.docNo]: String(next) }));
  };

  const normalizeDraft = (item: RequestProductItem) => {
    const raw = draftQty[item.docNo];
    setDraftQty((current) => ({
      ...current,
      [item.docNo]: raw ? String(parseQty(raw)) : "0",
    }));
  };

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    if (!q) return mockRequestProducts;
    return mockRequestProducts.filter(
      (item) =>
        item.docNo.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q),
    );
  }, [productQuery]);

  const stoneSelected = mockRequestProducts.find(
    (item) => isStoneProduct(item) && parseQty(draftQty[item.docNo]) > 0,
  );

  const commitProducts = () => {
    setSelectedItems(
      mockRequestProducts
        .filter((item) => parseQty(draftQty[item.docNo]) > 0)
        .map((item) => ({
          item,
          qty: Math.min(item.available, round2(parseQty(draftQty[item.docNo]))),
        })),
    );
    setProductOpen(false);
  };

  const handleSave = () => {
    if (!qrDirect && !phone.trim()) {
      setFormError("กรุณากรอกหมายเลขเบอร์โทรศัพท์");
      return;
    }
    if (!plate.trim()) {
      setFormError("กรุณากรอกหมายเลขทะเบียนรถบรรทุก");
      return;
    }
    // mockup: ยังไม่ผูก API — รวบรวม payload แล้วปิด dialog
    console.log("request-temp-card", {
      custId: cust.id,
      phone: qrDirect ? "" : phone.trim(),
      plate: plate.trim(),
      qrDirect,
      items: selectedItems.map((s) => ({
        docNo: s.item.docNo,
        qty: s.qty,
      })),
    });
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        width={720}
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

          <button
            type="button"
            onClick={openProductModal}
            className="mt-4 w-full rounded-lg bg-[#5B6470] py-3 text-sm font-medium text-white transition hover:bg-[#4B545F]"
          >
            + เลือกรายการสินค้าที่ต้องการ
          </button>

          {selectedItems.length > 0 && (
            <ul className="mt-2 space-y-1">
              {selectedItems.map(({ item, qty }) => (
                <li
                  key={item.docNo}
                  className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-3 py-1.5 text-sm"
                >
                  <span className="truncate text-gray-700">
                    เลขที่ {item.docNo} : {item.name}
                  </span>
                  <span className="shrink-0 font-medium text-blue-700">
                    {formatQty(qty)} {item.unit}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              role="checkbox"
              aria-checked={qrDirect}
              onClick={() => {
                setQrDirect((v) => !v);
                setFormError(null);
              }}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${
                  qrDirect ? "border-blue-600" : "border-gray-400"
                }`}
              >
                {qrDirect && (
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                )}
              </span>
              รับ QR โดยตรง
            </button>
          </div>

          {!qrDirect && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-800">
                หมายเลขเบอร์โทรศัพท์ (คนขับรถบรรทุก){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              placeholder="กรอกหมายเลขทะเบียนรถ"
              className={inputUnderlineClass}
            />
          </div>

          {formError && (
            <p className="mt-3 text-center text-sm text-red-600">{formError}</p>
          )}

          <div className="mt-6 flex justify-center">
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              onClick={handleSave}
              className="min-w-[260px]"
            >
              บันทึกข้อมูล
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={productOpen}
        onCancel={() => setProductOpen(false)}
        footer={null}
        centered
        width={720}
        title={<ModalTitle />}
      >
        <div className="pt-2">
          <h3 className="text-base font-semibold text-gray-800">
            สินค้าที่ท่านสามารถรับได้
          </h3>
          <p className="mt-1 text-sm text-red-600">
            *หมายเหตุ : หากต้องการบรรทุกสินค้าประเภทหินจะเลือกสินค้าได้ 1
            สินค้าเท่านั้น
          </p>
          <input
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            placeholder="ค้นหาสินค้า"
            className={inputUnderlineClass}
          />
          <p className="mt-3 text-center text-sm font-semibold text-red-600">
            ทศนิยม 2 หลัก รับได้ไม่เกินปริมาณที่มี
          </p>

          <div className="mt-3 max-h-[50vh] space-y-3 overflow-y-auto pr-1">
            {filteredProducts.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                ไม่พบสินค้าที่ค้นหา
              </p>
            ) : (
              filteredProducts.map((item) => {
                const disabled =
                  isStoneProduct(item) &&
                  stoneSelected !== undefined &&
                  stoneSelected.docNo !== item.docNo;
                const qty = parseQty(draftQty[item.docNo]);
                return (
                  <div
                    key={item.docNo}
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
                        value={draftQty[item.docNo] ?? "0"}
                        onChange={(e) => setDraftValue(item, e.target.value)}
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

          <div className="mt-5 flex justify-center">
            <Button
              type="primary"
              onClick={commitProducts}
              className="min-w-[180px]"
            >
              บันทึก
            </Button>
          </div>
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
