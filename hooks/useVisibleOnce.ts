"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns [ref, visible]. `visible` flips to true the first time the element
 * enters the viewport and stays true. Use it to defer non-critical data
 * fetches until the section scrolls into view — keeps the initial request
 * burst from saturating the browser's per-origin connection limit.
 */
export function useVisibleOnce<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return [ref, visible] as const;
}
