"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `onProgress` with 0..1 while a tall section scrolls past its sticky
 * child: 0 when the section top hits the viewport top, 1 when its bottom
 * reaches the viewport bottom. Runs on rAF only while the section is near view,
 * so it stays in sync with Lenis smooth scrolling.
 */
export function useScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
) {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let last = -1;
    let running = false;

    const tick = () => {
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
      if (Math.abs(p - last) > 0.0001) {
        last = p;
        cb.current(p);
      }
      if (running) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
          tick(); // settle on the final 0 or 1
        }
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(el);
    tick();
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [ref]);
}
