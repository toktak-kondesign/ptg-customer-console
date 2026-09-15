"use client";

import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { SessionTimeoutModal } from "@/components/SessionTimeoutModal";

export function SessionTimeoutProvider() {
  const { warningShown, secondsLeft, extendSession, logout, isExtending } =
    useSessionTimeout({
      timeoutMinutes: 15,
      warnBeforeSeconds: 30,
      activityThrottleSeconds: 10,
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
