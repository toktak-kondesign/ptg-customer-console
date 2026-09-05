import { Suspense } from "react";
import AuthHandler from "@/components/AuthHandler";

export default function HomeAuthPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7FA]">
      <Suspense fallback={null}>
        <AuthHandler />
      </Suspense>
      <div className="text-center text-gray-500">
        <p className="text-lg font-medium">กำลังตรวจสอบสิทธิ์ผู้ใช้งาน</p>
        <p className="text-sm mt-1">โปรดรอสักครู่...</p>
      </div>
    </main>
  );
}
