import { FinalCta, Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { EventsJourney } from "@/components/EventsJourney";
import { TextBand } from "@/components/TextBand";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TextBand />
        <EventsJourney />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
