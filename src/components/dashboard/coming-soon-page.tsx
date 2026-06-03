import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";

type ComingSoonPageProps = {
  title: string;
  description: string;
};

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Not yet implemented"
        title={title}
        description={description}
      />

      <section className="viva-auth-card rounded-[2rem] p-8 text-center">
        <div className="mx-auto max-w-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="font-display text-3xl font-black text-viva-ink">
            Coming soon
          </h2>
          <p className="mt-2 text-sm leading-6 text-viva-muted">
            This section is intentionally disabled in Step 1. The tenant
            foundation is ready, but provider workflows and business modules are
            added in later phases.
          </p>
          <Link
            href="/dashboard"
            className="viva-button-ghost mt-6 h-10 px-4 text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to overview
          </Link>
        </div>
      </section>
    </div>
  );
}
