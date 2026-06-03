import { AlertTriangle, Rocket, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { getLaunchReadinessOverview } from "@/lib/data/launch-ops";
import { requireTenantContext } from "@/lib/data/tenant";

export default async function GoLivePage() {
  const tenantContext = await requireTenantContext();
  const overview = await getLaunchReadinessOverview(tenantContext.tenant.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 25"
        title="Go-live checklist"
        description="See the current readiness score, the blockers still standing in the way, and the provider states that need to turn green before a real pilot starts."
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="viva-auth-card rounded-[2rem] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                Readiness score
              </div>
              <div className="mt-2 font-display text-6xl font-black text-viva-ink">
                {overview.readinessScore}%
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-viva-muted">
                This score combines credential readiness, webhook activity, outbound review
                state, and provider activation coverage. It is meant to help us stage a
                pilot safely, not to auto-enable anything.
              </p>
            </div>
          </div>
        </div>

        <div className="viva-auth-card rounded-[2rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
            Current blockers
          </div>
          <div className="mt-4 space-y-3">
            {overview.blockers.length > 0 ? (
              overview.blockers.map((blocker) => (
                <div
                  key={blocker}
                  className="rounded-2xl border border-viva-warning/25 bg-viva-warning/8 px-4 py-3 text-sm text-viva-muted"
                >
                  {blocker}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-viva-success/25 bg-viva-success/10 px-4 py-3 text-sm font-semibold text-viva-success">
                No blockers are currently detected in the internal readiness model.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.providerStates.map((provider) => (
          <div key={provider.id} className="viva-auth-card rounded-[1.5rem] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
              {provider.category}
            </div>
            <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
              {provider.provider_name}
            </h2>
            <p className="mt-2 text-sm capitalize text-viva-muted">
              {provider.status.replaceAll("_", " ")}
            </p>
            <div className="mt-4 text-xs text-viva-subtle">
              Live enabled: {provider.live_enabled ? "Yes" : "No"}
            </div>
          </div>
        ))}
      </div>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          {overview.blockers.length > 0 ? (
            <AlertTriangle className="mt-1 h-5 w-5 text-viva-warning" />
          ) : (
            <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          )}
          <p className="text-sm leading-6 text-viva-muted">
            This checklist is intentionally conservative. The app can be structurally ready
            before we decide a tenant should be operationally live.
          </p>
        </div>
      </div>
    </div>
  );
}
