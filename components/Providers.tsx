"use client";

import { CustomerPointsProvider } from "@/lib/CustomerPointsContext";
import { SessionTimeoutProvider } from "@/components/providers/SessionTimeoutProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CustomerPointsProvider>
      <SessionTimeoutProvider />
      {children}
    </CustomerPointsProvider>
  );
}
