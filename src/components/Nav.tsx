"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { events } from "@/data/events";
import { site } from "@/lib/site";
import { Arrow } from "./Button";
import { getLenis } from "./SmoothScroll";
import { useWarp } from "./Warp";

const links = [
  { label: "Events", href: "/#events" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="NPAS home">
      {/* TODO: replace with the real NPAS logo */}
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle cx="16" cy="16" r="5" fill="#F2F3F7" />
        <ellipse
          cx="16"
          cy="16"
          rx="14"
          ry="6"
          transform="rotate(-25 16 16)"
          stroke="#9B8CFF"
          strokeWidth="1.5"
        />
      </svg>
      <span className="font-display text-lg font-bold tracking-[0.2em]">NPAS</span>
    </Link>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const warp = useWarp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled && !open ? "bg-bg/70 backdrop-blur-md" : ""
        }`}
      >
        <nav className="mx-auto flex h-20 items-center gap-3 px-4 sm:px-10">
          <Logo />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="ml-2 inline-flex items-center gap-2.5 rounded-full bg-ink py-2.5 pl-2.5 pr-5 text-sm font-medium text-bg sm:ml-6"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-bg text-ink">
              <span
                className={`block h-1.5 w-1.5 rounded-full bg-ink transition-transform ${open ? "scale-150" : ""}`}
              />
            </span>
            {open ? "Close" : "Menu"}
          </button>
          <div className="hidden items-center gap-1 rounded-full bg-surface-2/60 p-1 backdrop-blur md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-[13px] text-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Link
            href={site.registerHref}
            className="group ml-auto inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-white sm:px-5"
          >
            <span className="sm:hidden">Register</span>
            <span className="hidden sm:inline">Register for Space Week</span>
            <Arrow />
          </Link>
        </nav>
      </header>

      <div
        id="site-menu"
        className={`fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="mx-auto grid h-full max-w-7xl content-center gap-16 px-6 pt-20 sm:px-10 md:grid-cols-2">
          <div>
            <p className="label mb-6 text-muted">Navigate</p>
            <ul className="space-y-2">
              {[{ label: "Home", href: "/" }, ...links].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className="font-display text-5xl font-bold tracking-tight text-ink transition-colors hover:text-accent sm:text-6xl"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-6 text-muted">Mission log</p>
            <ul className="space-y-3">
              {events.map((e) => (
                <li key={e.slug}>
                  <button
                    tabIndex={open ? 0 : -1}
                    onClick={() => {
                      setOpen(false);
                      warp(`/events/${e.slug}`, e.title);
                    }}
                    className="flex items-baseline gap-4 text-left text-xl text-muted transition-colors hover:text-ink"
                  >
                    <span className="label text-faint">{e.number}</span>
                    {e.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
