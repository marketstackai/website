import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar/default";

export const metadata: Metadata = { title: "Terms of Service" };
import Footer from "@/components/sections/footer/default";
import { Section } from "@/components/ui/section";

export default function TermsOfService() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <Navbar />
      <Section className="py-24 max-w-3xl mx-auto px-4 flex-grow">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <p className="text-muted-foreground mb-8">
          Last Updated: April 3, 2026
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground mb-4">
          By accessing or using the Market Stack website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you must discontinue use of our services immediately.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Services</h2>
        <p className="text-muted-foreground mb-4">
          Market Stack provides AI automation consulting, process mapping, and custom software systems designed for workflow optimization. Our services are tailored to individual business needs and delivered &quot;as is.&quot;
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Intellectual Property</h2>
        <p className="text-muted-foreground mb-4">
          All original content, features, and functionality on this website are exclusively owned by Market Stack. You may not reproduce, distribute, or create derivative works without our written authorization.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Limitation of Liability</h2>
        <p className="text-muted-foreground mb-4">
          In no event shall Market Stack be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use our services and software solutions.
        </p>
      </Section>
      <Footer />
    </main>
  );
}
