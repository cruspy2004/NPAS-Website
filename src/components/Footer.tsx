import Link from "next/link";
import { site } from "@/lib/site";
import { Button } from "./Button";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-24 pt-32 sm:px-20 sm:pt-40">
      <p className="label mb-8 text-muted">03&nbsp;&nbsp;/&nbsp;&nbsp;Next launch</p>
      <h2 className="font-display text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em]">
        Space Week is coming.
        <br />
        Get your seat.
      </h2>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href={site.registerHref}>Register for Space Week</Button>
        <Button href="/#contact" variant="ghost">
          Contact us
        </Button>
      </div>
    </section>
  );
}

// TODO: the contact section is a placeholder until the new contact page is decided.
export function Footer() {
  return (
    <footer id="contact" className="mx-auto max-w-[1440px] px-6 pb-12 sm:px-20">
      <div className="h-px bg-line" />
      <div className="flex flex-col gap-12 pt-14 md:flex-row md:gap-20">
        <div className="md:flex-1">
          <p className="font-display text-3xl font-bold tracking-[0.15em]">NPAS</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {site.fullName}
            <br />
            {site.location}
          </p>
        </div>
        <FooterCol title="Site">
          <Link href="/#events">Events</Link>
          <Link href="/#about">About</Link>
          <Link href={site.registerHref}>Space Week</Link>
        </FooterCol>
        <FooterCol title="Social">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </FooterCol>
        <FooterCol title="Contact">
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </FooterCol>
      </div>
      <p className="label mt-16 text-[11px] text-faint">
        © {new Date().getFullYear()} NPAS. Made by students who look up.
      </p>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label mb-4 text-[11px] text-muted">{title}</p>
      <div className="flex flex-col gap-3 text-[15px] [&_a]:transition-colors [&_a:hover]:text-accent">
        {children}
      </div>
    </div>
  );
}
