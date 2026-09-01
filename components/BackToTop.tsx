"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="กลับขึ้นบน"
      className={`fixed bottom-8 right-8 w-11 h-11 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold hover:bg-primary-900 transition ${
        showBackToTop ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      ↑
    </button>
  );
}
