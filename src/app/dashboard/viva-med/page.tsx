import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CalendarCheck2,
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  CreditCard,
  KeyRound,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getPrivacyOperationsOverview } from "@/lib/data/privacy-ops";
import { requireTenantContext } from "@/lib/data/tenant";

type MedStatus = "ready" | "gated" | "blocked";

const workflowCards = [
  {
    title: "Appointment intake",
    status: "ready",
    detail:
      "Collect appointment intent and route it to internal review before any external calendar write.",
    icon: CalendarCheck2,
  },
  {
    title: "Patient messaging",
    status: "gated",
    detail:
      "Use generic administrative templates only until the exact messaging provider is approved for medical data.",
    icon: MessageSquare,
  },
  {
    title: "AI assistant",
    status: "blocked",
    detail:
      "No medical advice, diagnosis, treatment guidance, or PHI processing is enabled.",
    icon: Bot,
  },
  {
    title: "Payments",
    status: "gated",
    detail:
      "Checkout drafts must use opaque IDs and generic labels, not procedures, diagnoses, or appointment reasons.",
    icon: CreditCard,
  },
] satisfies Array<{
  title: string;
  status: MedStatus;
  detail: string;
  icon: typeof CalendarCheck2;
}>;

const relatedAreas = [
  {
    href: "/dashboard/bookings",
    label: "Bookings",
    detail: "Review appointment request and clinic agenda foundations.",
    icon: CalendarCheck2,
  },
  {
    href: "/dashboard/privacy",
    label: "Privacy ops",
    detail: "Prepare BAAs, retention checks, privacy requests, and incident drills.",
    icon: ShieldCheck,
  },
  {
    href: "/dashboard/compliance",
    label: "Compliance",
    detail: "Track tenant activation reviews and restricted-category approval.",
    icon: ClipboardCheck,
  },
  {
    href: "/dashboard/provider-credentials",
    label: "Credentials",
    detail: "Confirm provider readiness without exposing secret values.",
    icon: KeyRound,
  },
  {
    href: "/dashboard/go-live",
    label: "Go live",
    detail: "See blockers before any real medical pilot starts.",
    icon: Rocket,
  },
] as const;

function statusTone(status: MedStatus) {
  if (status === "ready") return "text-viva-success";
  if (status === "gated") return "text-viva-warning";
  return "text-viva-error";
}

function statusIcon(status: MedStatus) {
  if (status === "ready") return <CheckCircle2 className="h-5 w-5 text-viva-success" />;
  if (status === "gated") return <CircleDashed className="h-5 w-5 text-viva-warning" />;
  return <AlertTriangle className="h-5 w-5 text-viva-error" />;
}

export default async function VivaMedPage() {
  const tenantContext = await requireTenantContext();
  const overview = await getPrivacyOperationsOverview(
    tenantContext.tenant.id,
    tenantContext.settings,
  );
  const passedChecks = overview.checks.filter((check) => check.status === "pass").length;
  const pendingChecks = overview.checks.length - passedChecks;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Medical vertical"
        title="Viva Med"
        description="Coordinate the medical version of Viva across appointment intake, patient handoff, privacy operations, and launch gating. Medical clients can onboard, but PHI-capable workflows stay blocked until the required approvals are complete."
      />

      <FoundationCard
        eyebrow="Medical operating model"
        title="One platform, medical-grade gates"
        description="Viva Med uses the same tenant, dashboard, and data foundation as Reserva Viva and Venta Viva. The difference is the launch posture: every PHI-capable provider path remains approval-gated."
        icon={Stethoscope}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <StatPill label="Checks" value={String(overview.checks.length)} />
          <StatPill label="Passed" value={String(passedChecks)} />
          <StatPill label="Pending" value={String(pendingChecks)} />
          <StatPill label="PHI workflows" value="blocked" />
        </div>
      </FoundationCard>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workflowCards.map((workflow) => {
          const Icon = workflow.icon;

          return (
            <article key={workflow.title} className="viva-auth-card rounded-[1.5rem] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-viva-gradient-soft text-viva-primary">
                  <Icon className="h-5 w-5" />
                </div>
                {statusIcon(workflow.status)}
              </div>
              <div className={`mt-5 text-xs font-semibold uppercase tracking-[0.16em] ${statusTone(workflow.status)}`}>
                {workflow.status}
              </div>
              <h2 className="mt-2 font-display text-xl font-black text-viva-ink">
                {workflow.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-viva-muted">
                {workflow.detail}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr,1.1fr]">
        <div className="viva-auth-card rounded-[2rem] p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
            <div>
              <h2 className="font-display text-2xl font-black text-viva-ink">
                Current medical launch posture
              </h2>
              <p className="mt-2 text-sm leading-6 text-viva-muted">
                The app can support medical tenants in safe mode today. Before
                real patient content flows through providers, the owner must
                approve legal, BAA, MFA, provider, retention, and incident
                response gates.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {overview.checks.slice(0, 5).map((check) => (
              <div
                key={check.key}
                className="rounded-2xl border border-viva-line/70 bg-viva-elevated/45 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-viva-ink">
                    {check.label}
                  </span>
                  <span
                    className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                      check.status === "pass"
                        ? "text-viva-success"
                        : check.status === "warning"
                          ? "text-viva-warning"
                          : "text-viva-error"
                    }`}
                  >
                    {check.status}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-viva-muted">
                  {check.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="viva-auth-card rounded-[2rem] p-6">
          <h2 className="font-display text-2xl font-black text-viva-ink">
            Continue the medical setup
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {relatedAreas.map((area) => {
              const Icon = area.icon;

              return (
                <Link
                  key={area.href}
                  href={area.href}
                  className="group rounded-2xl border border-viva-line/70 bg-viva-card/50 p-4 transition hover:border-viva-primary/40 hover:bg-viva-elevated"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-viva-gradient-soft text-viva-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="font-semibold text-viva-ink">{area.label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-viva-primary transition group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-viva-muted">
                    {area.detail}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
