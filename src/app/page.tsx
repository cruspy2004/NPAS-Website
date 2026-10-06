import { FinalCta, Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { RocketScroll } from "@/components/RocketScroll";
import { TextBand } from "@/components/TextBand";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TextBand />
        <RocketScroll />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
