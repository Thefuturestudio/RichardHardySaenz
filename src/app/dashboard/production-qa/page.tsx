import { CheckCircle2, ClipboardCheck, ShieldAlert } from "lucide-react";
import { recordProductionQaReview } from "@/app/dashboard/control-actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getLaunchReadinessOverview } from "@/lib/data/launch-ops";
import { getProductionQaItems } from "@/lib/data/production-qa";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";

function toneClass(status: "pass" | "warning" | "blocked") {
  if (status === "pass") return "text-viva-success";
  if (status === "warning") return "text-viva-warning";
  return "text-viva-error";
}

export default async function ProductionQaPage() {
  const tenantContext = await requireTenantContext();
  const overview = await getLaunchReadinessOverview(tenantContext.tenant.id);
  const items = getProductionQaItems(overview);
  const canEdit = canManageTenant(tenantContext.role);
  const passCount = items.filter((item) => item.status === "pass").length;
  const blockedCount = items.filter((item) => item.status === "blocked").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Control"
        title="Production QA"
        description="A deployment and launch checklist for local QA, Vercel, Supabase auth URLs, provider credentials, and safe-mode activation."
      />

      <FoundationCard
        eyebrow="Release gate"
        title="Pre-flight status"
        description="Record that a human reviewed the current readiness state. This never enables live providers or starts paid usage."
        icon={ClipboardCheck}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <StatPill label="Readiness" value={`${overview.readinessScore}%`} />
          <StatPill label="Pass" value={String(passCount)} />
          <StatPill label="Blocked" value={String(blockedCount)} />
          <StatPill label="Live providers" value="0" />
        </div>
        <div className="mt-6">
          <FoundationActionButton
            action={recordProductionQaReview}
            label="Record QA review"
            pendingLabel="Recording..."
            icon="check"
            disabled={!canEdit}
          />
        </div>
      </FoundationCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <article key={item.label} className="viva-auth-card rounded-[1.5rem] p-5">
            <div className="flex items-start gap-3">
              {item.status === "pass" ? (
                <CheckCircle2 className="mt-1 h-5 w-5 text-viva-success" />
              ) : (
                <ShieldAlert className={`mt-1 h-5 w-5 ${toneClass(item.status)}`} />
              )}
              <div>
                <div className={`text-xs font-semibold uppercase tracking-[0.16em] ${toneClass(item.status)}`}>
                  {item.status}
                </div>
                <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                  {item.label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-viva-muted">
                  {item.detail}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
          Manual deployment checklist
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            "Run local typecheck, lint, build, and E2E tests.",
            "Push to GitHub and redeploy Vercel.",
            "Confirm NEXT_PUBLIC_APP_URL matches the live Vercel URL.",
            "Confirm Supabase Site URL and Redirect URLs are correct.",
            "Run live signup/login/onboarding test.",
            "Keep live providers disabled until a tenant pilot is approved.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-viva-line/70 bg-viva-elevated/40 px-4 py-3 text-sm text-viva-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
