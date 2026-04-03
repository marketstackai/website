import type { Metadata } from "next";
import Navbar from "@/components/sections/navbar/default";

export const metadata: Metadata = { title: "Privacy Policy" };
import Footer from "@/components/sections/footer/default";
import { Section } from "@/components/ui/section";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <Navbar />
      <Section className="py-24 max-w-3xl mx-auto px-4 flex-grow">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <p className="text-muted-foreground mb-8">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p className="text-muted-foreground mb-4">
          When you use Market Stack&apos;s services, or book an audit, we may collect information such as your name, email address, company name, and details about your business operations. This information is solely used to provide you with relevant automation strategies and services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="text-muted-foreground mb-4">
          We use the information we collect to understand your operational bottlenecks, design custom solutions, communicate with you regarding your audit, and improve our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Sharing and Protection</h2>
        <p className="text-muted-foreground mb-4">
          We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. Your data is stored securely and is only accessible by authorized personnel for the purpose of fulfilling service requests.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Contact Us</h2>
        <p className="text-muted-foreground mb-4">
          If you have any questions about this Privacy Policy, please contact us at our email provided on our site.
        </p>
      </Section>
      <Footer />
    </main>
  );
}
