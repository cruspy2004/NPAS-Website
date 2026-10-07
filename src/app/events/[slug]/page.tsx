import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { events, getEvent } from "@/data/events";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const ev = getEvent(slug);
  return ev ? { title: ev.title, description: ev.summary } : {};
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const ev = getEvent(slug);
  if (!ev) notFound();

  const idx = events.indexOf(ev);
  const next = events[(idx + 1) % events.length];
  const cover = ev.photos[0] ?? "/video/hero-poster.jpg";

  return (
    <>
      <Nav />
      <main>
        <section className="relative flex h-[88svh] min-h-[600px] items-end overflow-hidden">
          <Image src={cover} alt="" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/30 to-bg" />
          <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 sm:px-20 sm:pb-20">
            <Link href="/#events" className="label text-muted transition-colors hover:text-ink">
              ←&nbsp;&nbsp;Back to mission log
            </Link>
            <p className="label animate-rise mt-10 text-accent">
              Event {ev.number}&nbsp;&nbsp;/&nbsp;&nbsp;{ev.tag}
            </p>
            <h1
              className="animate-rise mt-5 font-display text-[clamp(3.25rem,11vw,10rem)] font-bold leading-[0.92] tracking-[-0.045em]"
              style={{ animationDelay: "80ms" }}
            >
              {ev.title}
            </h1>
            <div
              className="animate-rise mt-7 flex flex-wrap gap-2"
              style={{ animationDelay: "160ms" }}
            >
              {[
                ev.date === "TBA" ? "Date TBA" : ev.date,
                ev.venue === "TBA" ? "Venue TBA" : ev.venue,
              ].map((t) => (
                <span key={t} className="rounded-full bg-surface-2 px-4 py-2 text-[13px] text-muted">
                  {t}
                </span>
              ))}
            </div>
            {ev.register.length > 0 && (
              <div
                className="animate-rise mt-8 flex flex-wrap gap-3"
                style={{ animationDelay: "240ms" }}
              >
                <RegisterButtons links={ev.register} />
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-14 px-6 py-24 sm:px-20 md:grid-cols-[1fr_400px] md:gap-24 md:py-32">
          <div>
            <p className="label mb-6 text-muted">About the event</p>
            <div className="space-y-6 text-xl leading-relaxed sm:text-[22px]">
              <p>{ev.summary}</p>
              {ev.description.map((d) => (
                <p key={d} className="text-muted">
                  {d}
                </p>
              ))}
            </div>
            {ev.highlights && (
              <div className="mt-14">
                <p className="label mb-6 text-muted">What&apos;s on</p>
                <ul className="divide-y divide-line border-y border-line">
                  {ev.highlights.map((h, i) => (
                    <li key={h.name} className="flex items-baseline gap-6 py-5">
                      <span className="label text-[11px] text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-xl font-semibold sm:text-2xl">{h.name}</span>
                      {h.note && <span className="label ml-auto text-[11px] text-accent">{h.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside
            id="register"
            className="h-fit scroll-mt-28 space-y-6 rounded-2xl border border-line bg-surface p-8"
          >
            <Detail label="Date" value={ev.date === "TBA" ? "To be announced" : ev.date} />
            <Detail label="Venue" value={ev.venue === "TBA" ? "To be announced" : ev.venue} />
            <Detail label="Format" value={ev.format} />
            {ev.register.length > 0 ? (
              <div className="flex flex-col gap-3">
                <RegisterButtons links={ev.register} block />
              </div>
            ) : (
              <p className="rounded-xl bg-surface-2 px-4 py-3.5 text-center text-sm text-muted">
                Registration opens soon
              </p>
            )}
          </aside>
        </section>

        {ev.photos.length > 1 && (
          <section className="mx-auto max-w-[1440px] px-6 pb-28 sm:px-20">
            <p className="label mb-8 text-muted">From past editions</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {ev.photos.slice(1).map((src, i) => (
                <div
                  key={src}
                  className={`relative aspect-[4/5] overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 aspect-auto" : ""}`}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
              ))}
            </div>
          </section>
        )}

        <Link
          href={`/events/${next.slug}`}
          className="group block bg-surface transition-colors hover:bg-surface-2"
        >
          <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-20">
            <p className="label text-muted">Next event&nbsp;&nbsp;/&nbsp;&nbsp;{next.number}</p>
            <p className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              {next.title}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
            </p>
          </div>
        </Link>
      </main>
      <div className="pt-20">
        <Footer />
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label text-[11px] text-muted">{label}</p>
      <p className="mt-1.5 text-[17px] font-medium">{value}</p>
    </div>
  );
}

function RegisterButtons({
  links,
  block,
}: {
  links: { label: string; href: string }[];
  block?: boolean;
}) {
  return links.map((l) => (
    <Button key={l.href} href={l.href} external className={block ? "w-full justify-center" : ""}>
      {l.label}
    </Button>
  ));
}
