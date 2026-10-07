"use client";

import { useEffect, useRef, useState } from "react";
import { events } from "@/data/events";
import { site } from "@/lib/site";
import { JUMP_MS, Starfield } from "@/lib/starfield";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { Arrow, Button } from "./Button";
import { useWarp, WarpLink } from "./Warp";

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
        {/* Cockpit window: corner brackets and side ticks frame the view. */}
        <div aria-hidden className="pointer-events-none absolute inset-4 sm:inset-8">
          {[
            "left-0 top-0 border-l border-t rounded-tl-2xl",
            "right-0 top-0 border-r border-t rounded-tr-2xl",
            "bottom-0 left-0 border-b border-l rounded-bl-2xl",
            "bottom-0 right-0 border-b border-r rounded-br-2xl",
          ].map((c) => (
            <span key={c} className={`absolute h-10 w-10 border-ink/30 sm:h-16 sm:w-16 ${c}`} />
          ))}
          <span className="absolute left-0 top-1/2 hidden h-px w-10 -translate-y-1/2 bg-ink/25 sm:block" />
          <span className="absolute right-0 top-1/2 hidden h-px w-10 -translate-y-1/2 bg-ink/25 sm:block" />
        </div>

        <div className="relative mx-auto h-full max-w-[1440px] px-6 sm:px-16">
          {/* The nav hides while this section is pinned, so these sit at the very top. */}
          <h2 className="absolute left-8 top-9 font-display text-2xl font-bold tracking-tight sm:left-16 sm:top-10 sm:text-3xl">
            Our events
          </h2>
          <div className="label absolute right-6 top-10 flex gap-6 text-[11px] text-muted sm:right-16 sm:top-12">
            <span>
              {events[active].number} / {String(events.length).padStart(2, "0")}
            </span>
            <span ref={hud} className="hidden sm:inline">
              VEL 6.0 KM/S
            </span>
          </div>

          {/* The events themselves, stacked. Only the active one is visible. */}
          <div className="absolute inset-x-6 bottom-0 top-0 sm:inset-x-16">
            {events.map((e, i) => {
              const state = i === active ? "here" : i < active ? "passed" : "ahead";
              return (
                <article
                  key={e.slug}
                  aria-hidden={state !== "here"}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
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
                  <WarpLink href={`/events/${e.slug}`} className="transition-opacity hover:opacity-80">
                    <h3 className="mt-5 max-w-[760px] font-display text-[clamp(2rem,4.6vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.035em]">
                      {e.title}
                    </h3>
                  </WarpLink>
                  <p className="mt-5 max-w-[480px] text-base leading-relaxed text-muted sm:text-lg">{e.summary}</p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
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
