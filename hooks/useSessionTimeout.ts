"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAuthToken, getAuthUser, clearAuth } from "@/lib/auth";
import { BASE_PATH } from "@/lib/env";

const STORAGE_KEYS = {
  expiresAt: "ptg-session-expires-at",
  lastActivity: "ptg-session-last-activity",
  loggedOut: "ptg-session-logged-out",
} as const;

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number;
  warnBeforeSeconds?: number;
  activityThrottleSeconds?: number;
  enabled?: boolean;
}

function readNumber(key: string): number {
  if (typeof window === "undefined") return 0;
  const value = localStorage.getItem(key);
  return value ? Number(value) : 0;
}

export function useSessionTimeout({
  timeoutMinutes = 15,
  warnBeforeSeconds = 30,
  activityThrottleSeconds = 10,
  enabled = true,
}: UseSessionTimeoutOptions) {
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const throttleMs = activityThrottleSeconds * 1000;

  const [expiresAtMs, setExpiresAtMs] = useState<number>(0);
  const [warningShown, setWarningShown] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [initialized, setInitialized] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const tickHandleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const extendInFlightRef = useRef(false);

  const logout = useCallback(
    (broadcast = true) => {
      if (loggedOut) return;
      setLoggedOut(true);

      if (tickHandleRef.current) {
        clearInterval(tickHandleRef.current);
        tickHandleRef.current = null;
      }

      setWarningShown(false);

      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.expiresAt);
        localStorage.removeItem(STORAGE_KEYS.lastActivity);

        if (broadcast) {
          localStorage.setItem(STORAGE_KEYS.loggedOut, String(Date.now()));
        }
      }

      clearAuth();
      window.location.href = `${BASE_PATH}/`;
    },
    [loggedOut]
  );

  const updateLastActivity = useCallback((timestamp: number) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.lastActivity, String(timestamp));
  }, []);

  const updateExpiresAt = useCallback(
    (timestamp: number) => {
      const newExpiresAt = timestamp + timeoutMs;
      setExpiresAtMs(newExpiresAt);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.expiresAt, String(newExpiresAt));
      }
    },
    [timeoutMs]
  );

  const hideWarning = useCallback(() => {
    setWarningShown(false);
    setSecondsLeft(0);
  }, []);

  const extendSession = useCallback(async () => {
    if (extendInFlightRef.current || typeof window === "undefined") return;

    const token = getAuthToken();
    if (!token) {
      console.warn("[useSessionTimeout] No auth token found for keep-alive");
      logout(true);
      return;
    }

    extendInFlightRef.current = true;
    setIsExtending(true);

    try {
      const response = await fetch(
        `${BASE_PATH}/api/auth/validate/?token=${token}`,
        { cache: "no-store" }
      );
      const data = await response.json();

      if (data.response_code !== 200 || data.isExpire) {
        console.warn("[useSessionTimeout] keep-alive failed: token expired");
        logout(true);
        return;
      }

      const now = Date.now();
      updateLastActivity(now);
      updateExpiresAt(now);
      hideWarning();
    } catch (error) {
      console.error("[useSessionTimeout] keep-alive error:", error);
      logout(true);
    } finally {
      extendInFlightRef.current = false;
      setIsExtending(false);
    }
  }, [logout, updateLastActivity, updateExpiresAt, hideWarning]);

  const onActivity = useCallback(() => {
    if (!initialized || loggedOut) return;

    const now = Date.now();
    const lastActivity = readNumber(STORAGE_KEYS.lastActivity);

    if (now - lastActivity < throttleMs) return;
    if (warningShown) return;

    updateLastActivity(now);
    updateExpiresAt(now);
  }, [
    initialized,
    loggedOut,
    warningShown,
    throttleMs,
    updateLastActivity,
    updateExpiresAt,
  ]);

  // Initialize session timeout state
  useEffect(() => {
    if (!enabled) return;

    const user = getAuthUser();
    if (!user) return;

    const sharedExpiresAt = readNumber(STORAGE_KEYS.expiresAt);
    if (sharedExpiresAt && sharedExpiresAt > Date.now()) {
      setExpiresAtMs(sharedExpiresAt);
      setInitialized(true);
      return;
    }

    const now = Date.now();
    const lastActivity = readNumber(STORAGE_KEYS.lastActivity) || now;
    updateLastActivity(lastActivity);
    updateExpiresAt(lastActivity);
    setInitialized(true);
  }, [enabled, updateExpiresAt, updateLastActivity]);

  // Countdown tick
  useEffect(() => {
    if (!enabled || !initialized) return;

    const tick = () => {
      const remaining = Math.round((expiresAtMs - Date.now()) / 1000);
      setSecondsLeft(Math.max(0, remaining));

      if (remaining <= 0) {
        logout(true);
        return;
      }

      if (!warningShown && remaining <= warnBeforeSeconds) {
        setWarningShown(true);
      }
    };

    tick();
    tickHandleRef.current = setInterval(tick, 1000);

    return () => {
      if (tickHandleRef.current) {
        clearInterval(tickHandleRef.current);
        tickHandleRef.current = null;
      }
    };
  }, [enabled, initialized, expiresAtMs, warningShown, warnBeforeSeconds, logout]);

  // Activity listeners
  useEffect(() => {
    if (!enabled) return;

    const handler = () => {
      onActivity();
    };

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handler, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handler);
      });
    };
  }, [enabled, onActivity]);

  // Cross-tab sync
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.expiresAt && e.newValue) {
        const value = Number(e.newValue);
        if (!Number.isNaN(value)) {
          setExpiresAtMs(value);
          setWarningShown(false);
          setSecondsLeft(0);
        }
      } else if (e.key === STORAGE_KEYS.loggedOut && e.newValue) {
        logout(false);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [logout]);

  return {
    warningShown,
    secondsLeft,
    extendSession,
    logout,
    isExtending,
  };
}
