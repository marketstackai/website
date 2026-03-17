import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function AuditPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <Section className="flex min-h-screen items-center justify-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
          <h1 className="from-foreground to-foreground dark:to-muted-foreground inline-block bg-linear-to-r bg-clip-text text-4xl font-semibold text-transparent sm:text-6xl">
            Operations Audit
          </h1>
          <p className="text-muted-foreground text-lg font-medium text-balance sm:text-xl">
            Coming soon — we&apos;re building something transformative.
          </p>
          <Button variant="glow" size="lg" asChild>
            <Link href="/">
              <ArrowLeftIcon className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </Section>
    </main>
  );
}
