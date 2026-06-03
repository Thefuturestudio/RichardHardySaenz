import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, CircleDashed, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";

type SafeFoundationStatus = "ready" | "blocked" | "doctor_review" | "pending";

type SafeFoundationItem = {
  label: string;
  status: SafeFoundationStatus;
  detail: string;
};

type SafeFoundationLink = {
  href: string;
  label: string;
  detail: string;
};

type SafeFoundationPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: SafeFoundationItem[];
  links?: SafeFoundationLink[];
};

const statusCopy: Record<SafeFoundationStatus, string> = {
  ready: "Ready",
  blocked: "Blocked",
  doctor_review: "Doctor review",
  pending: "Pending",
};

function StatusIcon({ status }: { status: SafeFoundationStatus }) {
  if (status === "ready") return <CheckCircle2 className="h-5 w-5 text-viva-success" />;
  if (status === "blocked") return <AlertTriangle className="h-5 w-5 text-viva-warning" />;
  return <CircleDashed className="h-5 w-5 text-viva-primary" />;
}

export function SafeFoundationPage({
  eyebrow,
  title,
  description,
  items,
  links = [],
}: SafeFoundationPageProps) {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <section className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <div>
            <h2 className="font-display text-2xl font-black text-viva-ink">
              Safe foundation status
            </h2>
            <p className="mt-2 text-sm leading-6 text-viva-muted">
              This page exposes internal workflow readiness only. Live provider
              writes, patient messaging, billing, and PHI-capable automations
              stay disabled until owner approval and provider/legal checks are complete.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.label} className="viva-auth-card rounded-[1.5rem] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                  {statusCopy[item.status]}
                </div>
                <h2 className="mt-2 font-display text-xl font-black text-viva-ink">
                  {item.label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-viva-muted">
                  {item.detail}
                </p>
              </div>
              <StatusIcon status={item.status} />
            </div>
          </article>
        ))}
      </section>

      {links.length > 0 ? (
        <section className="viva-auth-card rounded-[2rem] p-6">
          <h2 className="font-display text-2xl font-black text-viva-ink">
            Related areas
          </h2>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-viva-line/70 bg-viva-elevated/50 p-4 transition hover:border-viva-primary/40 hover:bg-viva-card"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-viva-ink">{link.label}</span>
                  <ArrowRight className="h-4 w-4 text-viva-primary" />
                </div>
                <p className="mt-2 text-sm leading-6 text-viva-muted">{link.detail}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
