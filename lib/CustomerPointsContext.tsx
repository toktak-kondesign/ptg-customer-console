"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CustomerPointsData } from "@/interfaces/point";
import { getAuthUser } from "@/lib/auth";
import { floorPointToOneDecimal } from "@/lib/pointPrecision";
import { getCustomerPointsService } from "@/services/shop/points";

export const CUSTOMER_SESSION_CHANGED_EVENT = "ptg-customer-session-changed";

interface CustomerPointsContextValue {
  goldPoints: number;
  silverPoints: number;
  waitpaypointGold: number;
  waitpaypointSilver: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const CustomerPointsContext = createContext<CustomerPointsContextValue | null>(
  null,
);

function toPoint(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value)
    ? floorPointToOneDecimal(value)
    : 0;
}

export function CustomerPointsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [points, setPoints] = useState<CustomerPointsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTargetCustId = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem("ptg_staff_cid") ??
      getAuthUser()?.custID ??
      null
    );
  }, []);

  const refresh = useCallback(async () => {
    const custId = getTargetCustId();
    if (!custId) {
      setPoints(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const result = await getCustomerPointsService({ custId });
    if (result.success && result.data) {
      setPoints(result.data);
      setError(null);
    } else {
      setPoints(null);
      setError(result.error ?? "ไม่สามารถโหลดข้อมูลคะแนนได้");
    }
    setIsLoading(false);
  }, [getTargetCustId]);

  useEffect(() => {
    const initialLoadTimeout = window.setTimeout(() => {
      void refresh();
    }, 0);
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === "ptg-auth-user" ||
        event.key === "ptg-customer-user" ||
        event.key === "ptg_staff_cid"
      ) {
        void refresh();
      }
    };
    const handleCustomerSessionChanged = () => {
      void refresh();
    };
    const handleWindowFocus = () => {
      void refresh();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      CUSTOMER_SESSION_CHANGED_EVENT,
      handleCustomerSessionChanged,
    );
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearTimeout(initialLoadTimeout);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        CUSTOMER_SESSION_CHANGED_EVENT,
        handleCustomerSessionChanged,
      );
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refresh]);

  const value = useMemo<CustomerPointsContextValue>(
    () => ({
      goldPoints: toPoint(points?.gold?.currentPoint),
      silverPoints: toPoint(points?.silver?.currentPoint),
      waitpaypointGold: toPoint(points?.waitpaypointGold),
      waitpaypointSilver: toPoint(points?.waitpaypointSilver),
      isLoading,
      error,
      refresh,
    }),
    [error, isLoading, points, refresh],
  );

  return (
    <CustomerPointsContext.Provider value={value}>
      {children}
    </CustomerPointsContext.Provider>
  );
}

export function useCustomerPoints(): CustomerPointsContextValue {
  const context = useContext(CustomerPointsContext);
  if (!context) {
    throw new Error(
      "useCustomerPoints must be used within CustomerPointsProvider",
    );
  }
  return context;
}
