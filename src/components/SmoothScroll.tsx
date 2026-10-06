"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: true });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Start every new page at the top (or at its #hash target).
  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;
    if (hash) {
      lenis.scrollTo(hash, { immediate: true });
    } else {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}
