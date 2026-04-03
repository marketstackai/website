"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/sections/navbar/default";
import Footer from "@/components/sections/footer/default";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen flex flex-col w-full bg-background text-foreground">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-32">
        <h2 className="text-8xl font-bold tracking-tight mb-4 text-primary">404</h2>
        <h3 className="text-2xl font-semibold mb-6">Page not found</h3>
        <p className="text-muted-foreground mb-8 max-w-md">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4">
          <Button onClick={handleBack} variant="outline" size="lg">
            Go Back
          </Button>
          <Button size="lg" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
