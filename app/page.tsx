import Navbar from "../components/sections/navbar/default";
import Hero from "../components/sections/hero/default";
import Logos from "../components/sections/logos/default";
import Stats from "../components/sections/stats/default";
import HowItWorks from "../components/sections/how-it-works/default";
import Items from "../components/sections/items/default";
import FAQ from "../components/sections/faq/default";
import CTA from "../components/sections/cta/default";
import Footer from "../components/sections/footer/default";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <Navbar />
      <Hero />
      <Stats />
      <Logos />
      <Items />
      <HowItWorks />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
