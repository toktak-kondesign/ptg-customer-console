"use client";

import { useEffect, useRef } from "react";
import { Modal, Button } from "antd";

const RING_CIRCUMFERENCE = 289; // 2 * PI * 46
const WARN_WINDOW_SECONDS = 30;

interface SessionTimeoutModalProps {
  open: boolean;
  secondsLeft: number;
  onExtend: () => void;
  onLogout: () => void;
  extending?: boolean;
}

export function SessionTimeoutModal({
  open,
  secondsLeft,
  onExtend,
  onLogout,
  extending = false,
}: SessionTimeoutModalProps) {
  const ringRef = useRef<SVGCircleElement>(null);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  useEffect(() => {
    if (!ringRef.current || !open) return;

    const fraction = Math.max(
      0,
      Math.min(1, secondsLeft / WARN_WINDOW_SECONDS),
    );
    const offset = RING_CIRCUMFERENCE * (1 - fraction);
    ringRef.current.style.strokeDashoffset = String(-offset);
  }, [secondsLeft, open]);

  return (
    <Modal
      open={open}
      closable={false}
      mask={{ closable: false }}
      centered
      footer={null}
      width={360}
    >
      <div className="flex flex-col items-center text-center py-2">
        <div className="relative w-[108px] h-[108px] mb-5">
          <svg
            width="108"
            height="108"
            viewBox="0 0 108 108"
            className="rotate-[-90deg]"
          >
            <circle
              cx="54"
              cy="54"
              r="46"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              ref={ringRef}
              cx="54"
              cy="54"
              r="46"
              fill="none"
              stroke="#0B132B"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={0}
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-semibold text-gray-800">
              {display}
            </span>
            <span className="text-[11px] text-gray-500">เวลาที่เหลือ</span>
          </div>
        </div>

        <h3 className="text-base font-medium text-gray-900 mb-1.5">
          เซสชันของคุณกำลังจะหมดอายุ
        </h3>
        <p className="text-[13px] text-gray-600 leading-relaxed mb-5">
          ไม่มีการใช้งานเป็นเวลานาน ระบบจะออกจากระบบอัตโนมัติเมื่อเวลาหมด
        </p>

        <div className="flex flex-col gap-2 w-full">
          <Button
            type="primary"
            size="large"
            loading={extending}
            onClick={onExtend}
            className="w-full font-semibold"
          >
            ต่ออายุ session
          </Button>
          <Button size="large" onClick={onLogout} className="w-full">
            ออกจากระบบ
          </Button>
        </div>
      </div>
    </Modal>
  );
}
