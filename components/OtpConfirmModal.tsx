"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import {
  requestOtpService,
  resendOtpService,
  verifyOtpService,
} from "@/services/customer/otp";
import type {
  RequestOtpData,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/interfaces/otp";

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN_SECONDS = 60;

const LockIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 1 1 8 0v3" strokeLinecap="round" />
  </svg>
);

export interface OtpConfirmModalProps {
  open: boolean;
  custId: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onCancel: () => void;
  onVerified: () => void;
  onVerify?: (payload: VerifyOtpPayload) => Promise<VerifyOtpResponse>;
}

export default function OtpConfirmModal({
  open,
  custId,
  title,
  description,
  onCancel,
  onVerified,
  onVerify = verifyOtpService,
}: OtpConfirmModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpSession, setOtpSession] = useState<RequestOtpData | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputError, setInputError] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;

    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpSession(null);
    setErrorMessage(null);
    setInputError(false);
    setCountdown(0);

    if (!custId) {
      setErrorMessage("ไม่พบรหัสลูกค้า กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    let cancelled = false;
    const send = async () => {
      setRequestLoading(true);
      const result = await requestOtpService({
        custId,
        callbackData: `web-customer:${custId}`,
      });
      if (cancelled) return;
      setRequestLoading(false);
      if (!result.success || !result.data) {
        setErrorMessage(result.error ?? "ไม่สามารถส่ง OTP ได้ กรุณาลองใหม่");
        return;
      }
      setOtpSession(result.data);
      setCountdown(RESEND_COUNTDOWN_SECONDS);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    };
    void send();

    return () => {
      cancelled = true;
    };
  }, [open, custId]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(
      () => setCountdown((current) => current - 1),
      1000,
    );
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (requestLoading || countdown > 0 || !custId) return;

    setRequestLoading(true);
    setErrorMessage(null);
    setInputError(false);
    setOtp(Array(OTP_LENGTH).fill(""));

    const result = await resendOtpService({ custId });
    setRequestLoading(false);

    if (!result.success || !result.data) {
      setErrorMessage(result.error ?? "ไม่สามารถส่ง OTP ซ้ำได้ กรุณาลองใหม่");
      return;
    }

    setOtpSession(result.data);
    setCountdown(RESEND_COUNTDOWN_SECONDS);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);
    setInputError(false);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (verifyLoading) return;

    if (!otpSession?.otpId) {
      setErrorMessage("ไม่พบข้อมูล OTP กรุณากดส่ง OTP อีกครั้ง");
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length < OTP_LENGTH) {
      setInputError(true);
      return;
    }

    setVerifyLoading(true);
    setErrorMessage(null);

    const result = await onVerify({
      otpId: otpSession.otpId,
      referenceCode: otpSession.referenceCode,
      otpCode,
    });

    setVerifyLoading(false);

    if (!result.success || !result.data) {
      setInputError(true);
      setErrorMessage(result.error ?? "ไม่สามารถยืนยัน OTP ได้ กรุณาลองใหม่");
      return;
    }

    if (!result.data.result) {
      setInputError(true);
      if (result.data.isExprCode) {
        setErrorMessage("รหัส OTP หมดอายุ กรุณากดส่ง OTP อีกครั้ง");
      } else if (result.data.isErrorCount) {
        setErrorMessage(
          "กรอกรหัส OTP ผิดเกินจำนวนครั้งที่กำหนด กรุณากดส่ง OTP อีกครั้ง",
        );
      } else {
        setErrorMessage("รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่");
      }
      return;
    }

    onVerified();
  };

  return (
    <Modal open={open} onCancel={onCancel} footer={null} centered width={480}>
      <div className="px-2 py-2 text-center">
        <div className="flex items-center justify-center gap-2 text-blue-700">
          <LockIcon className="h-10 w-10" />
          <h3 className="text-xl font-semibold">
            {title ?? "ยืนยันตัวตนด้วย OTP"}
          </h3>
        </div>
        {description && <div className="mt-4">{description}</div>}

        <div className="mt-6">
          {requestLoading && !otpSession ? (
            <p className="text-sm text-gray-500">กำลังส่งรหัส OTP...</p>
          ) : otpSession ? (
            <>
              <p className="text-sm text-gray-600">
                กรอกรหัส OTP 6 หลักที่ส่งไปยังเบอร์โทรของคุณ
                {otpSession.referenceCode && (
                  <>
                    <br />
                    <span className="text-xs text-gray-400">
                      Ref: {otpSession.referenceCode}
                    </span>
                  </>
                )}
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpRefs.current[index] = element;
                    }}
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    className={`h-12 w-11 rounded-lg border text-center text-xl font-bold outline-none transition ${
                      inputError
                        ? "border-red-400 bg-red-50 text-red-600"
                        : digit
                          ? "border-blue-500 bg-blue-50 text-gray-900"
                          : "border-gray-300 bg-gray-50 text-gray-900"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            !requestLoading && (
              <p className="text-sm text-gray-500">
                ไม่สามารถส่งรหัส OTP ได้ในขณะนี้
              </p>
            )
          )}

          {errorMessage && (
            <p className="mx-auto mt-4 max-w-sm rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            onClick={handleVerify}
            disabled={
              !otpSession || otp.join("").length < OTP_LENGTH || verifyLoading
            }
            className="mt-5 h-11 w-full rounded-xl bg-blue-700 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {verifyLoading ? "กำลังยืนยัน OTP..." : "ยืนยัน OTP"}
          </button>

          <p className="mt-3 text-sm text-gray-500">
            {countdown > 0 ? (
              <>
                ส่งซ้ำได้ใน{" "}
                <strong className="text-gray-800">{countdown}</strong> วินาที
              </>
            ) : (
              <>
                ไม่ได้รับ OTP?{" "}
                <button
                  type="button"
                  disabled={requestLoading || !custId}
                  onClick={handleResend}
                  className="font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  {requestLoading ? "กำลังส่ง..." : "ส่งอีกครั้ง"}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </Modal>
  );
}
