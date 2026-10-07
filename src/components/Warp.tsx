"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { events } from "@/data/events";
import { getLenis } from "./SmoothScroll";

// The fast "burst" part of the space video (4.0s to 6.5s) plays as a
// hyperspace jump, then we navigate to the event page underneath it.

type WarpFn = (href: string, label: string) => void;

const WarpContext = createContext<WarpFn>(() => {});

export function useWarp() {
  return useContext(WarpContext);
}

/**
 * Link that plays the warp when it leads to an event page. Any other link (or
 * a link to the page you are already on, or a ctrl/cmd click) behaves normally.
 */
export function WarpLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const warp = useWarp();
  const pathname = usePathname();
  const path = href.split("#")[0];
  const ev = events.find((e) => `/events/${e.slug}` === path);
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (!ev || path === pathname) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        warp(href, label ?? ev.title);
      }}
    >
      {children}
    </Link>
  );
}

const NAVIGATE_AT_MS = 1300;

type Phase = "idle" | "jumping" | "arriving";

export function WarpProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const target = useRef<string | null>(null);

  const warp = useCallback<WarpFn>(
    (href, text) => {
      if (phase !== "idle") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      router.prefetch(href);
      target.current = href;
      setLabel(text);
      setPhase("jumping");
      getLenis()?.stop();
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
      window.setTimeout(() => router.push(href), NAVIGATE_AT_MS);
      // Safety net: never leave the overlay up if navigation stalls.
      window.setTimeout(() => {
        setPhase((p) => (p === "jumping" ? "idle" : p));
        getLenis()?.start();
      }, NAVIGATE_AT_MS + 4000);
    },
    [phase, router],
  );

  // Once the new route is mounted, start fading the overlay out.
  useEffect(() => {
    if (phase !== "jumping" || !target.current) return;
    if (target.current.split("#")[0] !== pathname) return;
    target.current = null;
    getLenis()?.start();
    const t = window.setTimeout(() => setPhase("arriving"), 50);
    return () => window.clearTimeout(t);
  }, [pathname, phase]);

  // Finish the fade on its own timer so a phase change can't cancel it
  // (that bug left the invisible overlay blocking every click).
  useEffect(() => {
    if (phase !== "arriving") return;
    const t = window.setTimeout(() => setPhase("idle"), 950);
    return () => window.clearTimeout(t);
  }, [phase]);

  const active = phase !== "idle";

  return (
    <WarpContext.Provider value={warp}>
      {children}
      <div
        aria-hidden={!active}
        className={`fixed inset-0 z-[100] overflow-hidden bg-bg transition-opacity duration-[900ms] ${
          phase === "jumping" ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover transition-transform ease-in ${
            phase === "jumping" ? "scale-[1.35] duration-[1400ms]" : "scale-100 duration-0"
          }`}
        >
          <source src="/video/warp.webm" type="video/webm" />
          <source src="/video/warp.mp4" type="video/mp4" />
        </video>
        {/* center flash that blooms right before the page switches */}
        <div
          className={`absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ease-in ${
            phase === "jumping"
              ? "scale-100 opacity-100 delay-[700ms] duration-[600ms]"
              : "scale-0 opacity-0 duration-300"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(155,140,255,0.45) 30%, rgba(155,140,255,0) 65%)",
          }}
        />
        <p className="label absolute bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-ink">
          Entering&nbsp;&nbsp;/&nbsp;&nbsp;{label}
        </p>
      </div>
    </WarpContext.Provider>
  );
}
