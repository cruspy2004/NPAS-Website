import { site } from "@/lib/site";
import { Button } from "./Button";

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster="/video/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      >
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/40 to-bg" />

      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-6 pb-24 sm:px-20 sm:pb-28">
        <p className="label animate-rise mb-7 text-accent">{site.fullName}</p>
        <h1
          className="animate-rise font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-[-0.04em]"
          style={{ animationDelay: "80ms" }}
        >
          Where curiosity
          <br />
          meets the cosmos.
        </h1>
        <p
          className="animate-rise mt-7 max-w-[560px] text-lg leading-relaxed text-muted"
          style={{ animationDelay: "160ms" }}
        >
          Talks, stargazing nights, workshops and the biggest space event at NUST. Built by students
          who look up.
        </p>
        <div
          className="animate-rise mt-8 flex flex-wrap gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <Button href={site.registerHref}>Register for Space Week</Button>
          <Button href="/#events" variant="ghost">
            Explore events
          </Button>
        </div>
      </div>

      <p className="label absolute bottom-8 right-6 hidden text-muted sm:right-20 sm:block">
        Scroll to launch&nbsp;&nbsp;↓
      </p>
    </section>
  );
}
