"use client";

import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { SessionTimeoutModal } from "@/components/SessionTimeoutModal";

export function SessionTimeoutProvider() {
  const { warningShown, secondsLeft, extendSession, logout, isExtending } =
    useSessionTimeout({
      timeoutMinutes: 15, //กำหนดเวลาการหมดอายุเซสชันเป็น 15 นาที
      warnBeforeSeconds: 30, //แสดงหน้าต่างเตือนก่อนหมดเวลา 30 วินาที
      activityThrottleSeconds: 10, //กรองการเคลื่อนไหวของเมาส์/คีย์บอร์ด ทุก 10 วินาที
    });

  return (
    <SessionTimeoutModal
      open={warningShown}
      secondsLeft={secondsLeft}
      onExtend={extendSession}
      onLogout={logout}
      extending={isExtending}
    />
  );
}
