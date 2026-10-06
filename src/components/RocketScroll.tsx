"use client";

import { useEffect, useRef, useState } from "react";
import { events } from "@/data/events";
import { site } from "@/lib/site";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { Arrow, Button } from "./Button";
import { useWarp } from "./Warp";

// The space video, exported as 240 still frames (10s at 24fps) so scrolling can
// scrub it smoothly in both directions. Burst of speed is frames ~105 to ~148.
const FRAME_COUNT = 240;
const frameSrc = (i: number) => `/sequence/f_${String(i).padStart(3, "0")}.webp`;
const BURST_START = 105 / FRAME_COUNT;
const BURST_END = 148 / FRAME_COUNT;

const STAGES = ["Deep space", "Orbit", "Stratosphere", "Launch"];

export function RocketScroll() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const current = useRef(0);
  const drawn = useRef(-1);
  const fill = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);
  const warp = useWarp();

  const draw = (target: number) => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    // nearest frame that has finished loading
    let img: HTMLImageElement | null = null;
    let idx = -1;
    for (let d = 0; d < FRAME_COUNT; d++) {
      const a = frames.current[target - d];
      if (a) { img = a; idx = target - d; break; }
      const b = frames.current[target + d];
      if (b) { img = b; idx = target + d; break; }
    }
    if (!img || idx === drawn.current) return;
    drawn.current = idx;
    const scale = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
  };

  // Size the canvas to the screen and load the frames, first frame first.
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      drawn.current = -1;
      draw(current.current);
    };
    resize();
    window.addEventListener("resize", resize);

    let cancelled = false;
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) {
            frames.current[i] = img;
            if (Math.abs(i - current.current) < 3 || drawn.current === -1) {
              drawn.current = -1;
              draw(current.current);
            }
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameSrc(i);
      });

    // Coarse pass (every 8th frame) so scrubbing works early, then fill in.
    const order: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i += 8) order.push(i);
    for (let i = 0; i < FRAME_COUNT; i++) if (i % 8) order.push(i);
    let next = 0;
    const worker = async () => {
      while (!cancelled && next < order.length) await load(order[next++]);
    };
    load(0).then(() => {
      for (let k = 0; k < 6; k++) worker();
    });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
    };
  }, []);

  useScrollProgress(section, (p) => {
    const f = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
    current.current = f;
    draw(f);
    setActive(Math.min(events.length - 1, Math.floor(p * events.length)));
    if (fill.current) fill.current.style.transform = `scaleY(${p})`;
    if (hud.current) {
      const alt = Math.round(Math.pow(p, 2.2) * 384400);
      const mid = (BURST_START + BURST_END) / 2;
      const burst = Math.exp(-Math.pow((p - mid) / ((BURST_END - BURST_START) / 3), 2));
      const vel = (0.4 + p * 11 + burst * 290).toFixed(1);
      hud.current.textContent = `ALT ${alt.toLocaleString("en-US")} KM  /  VEL ${vel} KM/S`;
    }
  });

  const ev = events[active];
  const stage = STAGES[STAGES.length - 1 - Math.min(3, Math.floor((active / events.length) * 4))];

  return (
    <section
      id="events"
      ref={section}
      className="relative"
      style={{ height: `${(events.length + 1) * 90}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg/80 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col px-4 pb-6 pt-24 sm:px-16 md:pt-32">
          {/* Event list */}
          <div className="w-full max-w-[420px]">
            <p className="label mb-3 pl-4 text-muted">02&nbsp;&nbsp;/&nbsp;&nbsp;Mission log</p>
            <h2 className="mb-4 pl-4 font-display text-3xl font-bold tracking-tight md:mb-6 md:text-5xl">
              Our events
            </h2>
            <ul className="space-y-0.5 md:space-y-1">
              {events.map((e, i) => {
                const on = i === active;
                return (
                  <li key={e.slug}>
                    <button
                      onClick={() => warp(`/events/${e.slug}`, e.title)}
                      className={`group relative flex w-full items-center gap-4 rounded-xl px-4 py-2 text-left transition-colors md:py-3 ${
                        on ? "bg-surface-2/70" : "hover:bg-surface-2/40"
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded bg-accent transition-opacity ${
                          on ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span className={`label text-[11px] ${on ? "text-accent" : "text-faint"}`}>
                        {e.number}
                      </span>
                      <span className="flex flex-col">
                        <span
                          className={`font-display font-semibold transition-all ${
                            on
                              ? "text-lg text-ink md:text-[22px]"
                              : "text-base text-muted group-hover:text-ink md:text-lg"
                          }`}
                        >
                          {e.title}
                        </span>
                        {on && (
                          <span className="label mt-0.5 hidden text-[11px] text-muted md:block">
                            {e.date === "TBA" ? "Date TBA" : e.date}&nbsp;&nbsp;/&nbsp;&nbsp;{e.tag}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Active event card */}
          <div
            key={ev.slug}
            className="animate-rise mt-auto w-full rounded-2xl border border-line bg-surface/60 p-5 backdrop-blur-xl sm:p-7 md:ml-auto md:max-w-[460px] lg:absolute lg:bottom-8 lg:right-16 lg:mt-0 lg:w-[460px]"
          >
            <p className="label text-[11px] text-accent">
              Event {ev.number}&nbsp;&nbsp;/&nbsp;&nbsp;{ev.tag}
            </p>
            <h3 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              {ev.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">{ev.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {ev.flagship && <Button href={site.registerHref}>Register</Button>}
              <button
                onClick={() => warp(`/events/${ev.slug}`, ev.title)}
                className="group inline-flex items-center gap-2.5 rounded-full border border-line px-6 py-3.5 text-[15px] font-medium transition-colors hover:border-muted"
              >
                Enter event
                <span className="transition-transform group-hover:translate-x-0.5">
                  <Arrow />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Altitude bar */}
        <div className="absolute right-6 top-24 hidden md:block lg:right-16">
          <p ref={hud} className="label mb-8 text-right text-[11px] text-muted">
            ALT 0 KM&nbsp;&nbsp;/&nbsp;&nbsp;VEL 0.4 KM/S
          </p>
          <div className="flex justify-end gap-4">
            <ul className="flex h-[min(30vh,340px)] flex-col justify-between text-right">
              {STAGES.map((s) => (
                <li
                  key={s}
                  className={`label text-[10px] transition-colors ${s === stage ? "text-ink" : "text-faint"}`}
                >
                  {s}
                </li>
              ))}
            </ul>
            <div className="relative h-[min(30vh,340px)] w-[2px] bg-line">
              <div
                ref={fill}
                className="absolute inset-0 origin-bottom bg-accent"
                style={{ transform: "scaleY(0)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
