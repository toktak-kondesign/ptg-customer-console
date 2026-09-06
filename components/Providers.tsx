"use client";

import { CustomerPointsProvider } from "@/lib/CustomerPointsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CustomerPointsProvider>{children}</CustomerPointsProvider>;
}
