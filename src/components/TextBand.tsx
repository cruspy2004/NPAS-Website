"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

const LINE = "NUST Physics and Astronomy Society  ✦  Where curiosity meets the cosmos  ✦  ";

// Characters left of SOLID_AT (fraction of viewport width) are fully lit,
// right of FAINT_AT they are faint, and they blend in between. This gives the
// "inaFusion Where Hu" look from the reference: solid, gradient, then ghosted.
const SOLID_AT = 0.4;
const FAINT_AT = 0.75;
// Banner speed in viewport widths per second.
const SPEED = 0.07;

export function TextBand() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    const sec = section.current;
    if (!el || !sec) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The track holds the line twice. Once the first copy has fully slid out,
    // jump back by one copy width so the loop is seamless.
    let centers: number[] = [];
    let copyWidth = 0;
    const measure = () => {
      const spans = el.querySelectorAll("span");
      centers = Array.from(spans, (s) => s.offsetLeft + s.offsetWidth / 2);
      copyWidth = (el.firstElementChild as HTMLElement).offsetWidth;
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);

    let x = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;
    const spans = el.querySelectorAll("span");

    const frame = (now: number) => {
      const vw = window.innerWidth;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) x -= SPEED * vw * dt;
      if (copyWidth && x <= -copyWidth) x += copyWidth;
      el.style.transform = `translate3d(${x}px,0,0)`;
      for (let i = 0; i < spans.length; i++) {
        const screenX = x + centers[i];
        const t = Math.min(1, Math.max(0, (FAINT_AT * vw - screenX) / ((FAINT_AT - SOLID_AT) * vw)));
        spans[i].style.color = `rgba(242,243,247,${0.1 + 0.9 * t})`;
      }
      if (running) raf = requestAnimationFrame(frame);
    };

    // Only animate while the banner is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(sec);
    frame(performance.now());

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section id="about" ref={section} className="overflow-hidden py-28 sm:py-40">
      <p className="label mx-auto mb-8 w-full max-w-[1440px] px-6 text-muted sm:px-20">
        01&nbsp;&nbsp;/&nbsp;&nbsp;Who we are
      </p>

      <h2 className="sr-only">{site.fullName}. {site.tagline}</h2>
      <div
        ref={track}
        aria-hidden
        className="relative flex w-max whitespace-pre font-display text-[clamp(5rem,14vw,13rem)] font-bold leading-[1.1] tracking-[-0.04em] will-change-transform"
        style={{ color: "rgba(242,243,247,0.1)" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy}>
            {Array.from(LINE).map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 grid w-full max-w-[1440px] gap-10 px-6 sm:px-20 md:grid-cols-2 md:items-end">
        <p className="max-w-[520px] text-lg leading-relaxed text-muted sm:text-xl">
          We are a student society at NUST for anyone who wants to understand the universe: from the
          physics in a lab to the galaxies over the night sky.
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
    </section>
  );
}
