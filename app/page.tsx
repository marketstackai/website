import Navbar from "../components/sections/navbar/default";
import Hero from "../components/sections/hero/default";
import Logos from "../components/sections/logos/default";
import Focus from "../components/sections/focus/default";
import Items from "../components/sections/items/default";
import FAQ from "../components/sections/faq/default";
import CTA from "../components/sections/cta/default";
import Footer from "../components/sections/footer/default";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <Navbar />
      <Hero />
      <Logos />
      <Focus />
      <Items />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
