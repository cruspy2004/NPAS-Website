"use client";

import { useEffect, useRef, useState } from "react";
import { events } from "@/data/events";
import { site } from "@/lib/site";
import { JUMP_MS, Starfield } from "@/lib/starfield";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { Arrow, Button } from "./Button";
import { useWarp } from "./Warp";

// Pinned section. Each event owns a slice of the scroll. Crossing into the
// next slice fires a hyperspace jump: the stars streak past, the current
// event flies by, and the next one arrives out of the distance. Scrolling
// back up jumps backwards.

const SCROLL_PER_EVENT_VH = 80;

export function EventsJourney() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const nebula = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLSpanElement>(null);
  const field = useRef<Starfield | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const warp = useWarp();

  useEffect(() => {
    const c = canvas.current;
    const sec = section.current;
    if (!c || !sec) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sf = new Starfield(c, reduced);
    field.current = sf;
    sf.onFrame = (speed) => {
      const a = Math.abs(speed);
      if (nebula.current) nebula.current.style.transform = `scale(${1.05 + a * 0.06})`;
      if (hud.current) hud.current.textContent = `VEL ${(a * 120).toFixed(1)} KM/S`;
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? sf.start() : sf.stop()));
    io.observe(sec);
    const onResize = () => sf.resize();
    window.addEventListener("resize", onResize);
    return () => {
      sf.stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useScrollProgress(section, (p) => {
    const idx = Math.min(events.length - 1, Math.floor(p * events.length));
    if (idx === activeRef.current) return;
    field.current?.jump(idx > activeRef.current ? 1 : -1);
    activeRef.current = idx;
    setActive(idx);
  });

  const go = (i: number) => warp(`/events/${events[i].slug}`, events[i].title);

  return (
    <section
      id="events"
      ref={section}
      className="relative"
      style={{ height: `${events.length * SCROLL_PER_EVENT_VH + 100}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          ref={nebula}
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(/video/hero-poster.jpg)", transform: "scale(1.05)" }}
        />
        <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-bg)_100%)]" />
        <div className="absolute inset-y-0 left-0 hidden w-[520px] bg-gradient-to-r from-bg/90 to-transparent md:block" />

        {/* HUD */}
        <div className="label absolute right-6 top-24 flex gap-6 text-[11px] text-muted sm:right-16">
          <span>
            Event {events[active].number} / {String(events.length).padStart(2, "0")}
          </span>
          <span ref={hud} className="hidden sm:inline">
            VEL 6.0 KM/S
          </span>
        </div>

        <div className="relative mx-auto h-full max-w-[1440px] px-6 sm:px-16">
          {/* Event index (left) */}
          <div className="absolute left-6 top-24 hidden w-[380px] md:block lg:left-16 lg:top-32">
            <p className="label mb-3 pl-4 text-muted">02&nbsp;&nbsp;/&nbsp;&nbsp;Mission log</p>
            <h2 className="mb-6 pl-4 font-display text-4xl font-bold tracking-tight lg:text-5xl">
              Our events
            </h2>
            <ul className="space-y-1">
              {events.map((e, i) => {
                const on = i === active;
                return (
                  <li key={e.slug}>
                    <button
                      onClick={() => go(i)}
                      className={`group relative flex w-full items-center gap-4 rounded-xl px-4 py-2.5 text-left transition-colors ${
                        on ? "bg-surface-2/70" : "hover:bg-surface-2/40"
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded bg-accent transition-opacity ${
                          on ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span className={`label text-[11px] ${on ? "text-accent" : "text-faint"}`}>
                        {e.number}
                      </span>
                      <span
                        className={`font-display font-semibold transition-colors ${
                          on ? "text-lg text-ink" : "text-base text-muted group-hover:text-ink"
                        }`}
                      >
                        {e.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* The events themselves, stacked. Only the active one is visible. */}
          <p className="label absolute left-6 top-24 text-muted md:hidden">
            02&nbsp;&nbsp;/&nbsp;&nbsp;Our events
          </p>
          <div className="absolute inset-x-6 bottom-0 top-0 md:left-[440px] md:right-16 lg:left-[520px]">
            {events.map((e, i) => {
              const state = i === active ? "here" : i < active ? "passed" : "ahead";
              return (
                <article
                  key={e.slug}
                  aria-hidden={state !== "here"}
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{
                    opacity: state === "here" ? 1 : 0,
                    transform:
                      state === "here" ? "scale(1)" : state === "passed" ? "scale(1.7)" : "scale(0.45)",
                    filter: state === "here" ? "blur(0px)" : "blur(14px)",
                    transition:
                      state === "here"
                        ? `opacity 700ms ease-out ${JUMP_MS * 0.45}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${JUMP_MS * 0.45}ms, filter 700ms ease-out ${JUMP_MS * 0.45}ms`
                        : "opacity 380ms ease-in, transform 450ms ease-in, filter 380ms ease-in",
                    pointerEvents: state === "here" ? "auto" : "none",
                  }}
                >
                  <p className="label text-accent">
                    Event {e.number}&nbsp;&nbsp;/&nbsp;&nbsp;{e.tag}
                  </p>
                  <h3 className="mt-5 font-display text-[clamp(2rem,8.2vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.04em]">
                    {e.title}
                  </h3>
                  <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-muted">{e.summary}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {e.flagship && <Button href={site.registerHref}>Register for Space Week</Button>}
                    <button
                      tabIndex={state === "here" ? 0 : -1}
                      onClick={() => go(i)}
                      className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-bg/40 px-6 py-3.5 text-[15px] font-medium backdrop-blur transition-colors hover:border-muted"
                    >
                      Enter event
                      <span className="transition-transform group-hover:translate-x-0.5">
                        <Arrow />
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <p
            className={`label absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] text-muted transition-opacity duration-500 ${
              active === events.length - 1 ? "opacity-0" : "opacity-100"
            }`}
          >
            Scroll to jump&nbsp;&nbsp;↓
          </p>
        </div>
      </div>
    </section>
  );
}
