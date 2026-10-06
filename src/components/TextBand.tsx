"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import { useScrollProgress } from "@/lib/useScrollProgress";

const LINE = "NUST Physics and Astronomy Society  ✦  Where curiosity meets the cosmos";

// Characters left of SOLID_AT (fraction of viewport width) are fully lit,
// right of FAINT_AT they are faint, and they blend in between. This gives the
// "inaFusion Where Hu" look from the reference: solid, gradient, then ghosted.
const SOLID_AT = 0.4;
const FAINT_AT = 0.75;

export function TextBand() {
  const section = useRef<HTMLElement>(null);
  const line = useRef<HTMLHeadingElement>(null);
  const centers = useRef<number[]>([]);
  const lineWidth = useRef(0);

  useEffect(() => {
    const el = line.current;
    if (!el) return;
    const measure = () => {
      const spans = Array.from(el.children) as HTMLElement[];
      centers.current = spans.map((s) => s.offsetLeft + s.offsetWidth / 2);
      lineWidth.current = el.scrollWidth;
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useScrollProgress(section, (p) => {
    const el = line.current;
    if (!el) return;
    const vw = window.innerWidth;
    const start = vw * 0.06;
    const end = -(lineWidth.current - vw * 0.94);
    const x = start + (end - start) * p;
    el.style.transform = `translate3d(${x}px,0,0)`;
    const spans = el.children;
    for (let i = 0; i < spans.length; i++) {
      const screenX = x + centers.current[i];
      const t = Math.min(1, Math.max(0, (FAINT_AT * vw - screenX) / ((FAINT_AT - SOLID_AT) * vw)));
      (spans[i] as HTMLElement).style.color = `rgba(242,243,247,${0.1 + 0.9 * t})`;
    }
  });

  return (
    <section id="about" ref={section} className="relative h-[320vh] scroll-mt-0">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <p className="label mx-auto mb-8 w-full max-w-[1440px] px-6 text-muted sm:px-20">
          01&nbsp;&nbsp;/&nbsp;&nbsp;Who we are
        </p>

        <h2
          ref={line}
          aria-label={LINE}
          className="w-max whitespace-pre font-display text-[clamp(5rem,14vw,13rem)] font-bold leading-none tracking-[-0.04em] will-change-transform"
          style={{ color: "rgba(242,243,247,0.1)" }}
        >
          {Array.from(LINE).map((ch, i) => (
            <span key={i} aria-hidden>
              {ch}
            </span>
          ))}
        </h2>

        <div className="mx-auto mt-14 grid w-full max-w-[1440px] gap-10 px-6 sm:px-20 md:grid-cols-2 md:items-end">
          <p className="max-w-[520px] text-lg leading-relaxed text-muted sm:text-xl">
            We are a student society at NUST for anyone who wants to understand the universe: from
            the physics in a lab to the galaxies over the night sky.
          </p>
          <dl className="flex gap-10 sm:gap-16 md:justify-end">
            {site.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                  {s.value}
                </dd>
                <dd className="label mt-1.5 text-[11px] text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
