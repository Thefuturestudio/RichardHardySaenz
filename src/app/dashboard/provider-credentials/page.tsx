import { KeyRound, Link2, ShieldCheck } from "lucide-react";
import { syncProviderReadiness } from "@/app/dashboard/launch-actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { PageHeader } from "@/components/dashboard/page-header";
import { getLaunchReadinessOverview } from "@/lib/data/launch-ops";
import { requireTenantContext } from "@/lib/data/tenant";

export default async function ProviderCredentialsPage() {
  const tenantContext = await requireTenantContext();
  const overview = await getLaunchReadinessOverview(tenantContext.tenant.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 22"
        title="Provider credentials"
        description="See which providers are credential-ready, which secrets are still missing, and which webhook URLs are already reserved in the app."
      />

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
              Readiness sync
            </div>
            <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
              Refresh provider status
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-viva-muted">
              This checks the current environment configuration and updates each
              provider activation row without enabling anything live.
            </p>
          </div>
          <FoundationActionButton
            action={syncProviderReadiness}
            label="Sync readiness"
            pendingLabel="Syncing..."
            icon="shield"
          />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {overview.credentialSnapshots.map((snapshot) => (
          <article key={snapshot.providerKey} className="viva-auth-card rounded-[1.7rem] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-viva-gradient-soft text-viva-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                  {snapshot.providerKey.replaceAll("_", " ")}
                </div>
                <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                  {snapshot.providerName}
                </h2>
                <p className="mt-2 text-sm text-viva-muted">
                  Credentials ready: {snapshot.ready ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-viva-line/70 bg-viva-card/55 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-viva-subtle">
                  Setup instructions
                </div>
                <p className="mt-2 text-sm leading-6 text-viva-muted">
                  Add the missing variables in Vercel and local `.env.local`,
                  redeploy, then run Sync readiness. This screen never shows
                  secret values.
                </p>
              </div>
              {snapshot.webhookUrl ? (
                <div className="rounded-2xl border border-viva-line/70 bg-viva-card/55 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-viva-subtle">
                    <Link2 className="h-3.5 w-3.5" />
                    Webhook URL
                  </div>
                  <div className="mt-2 break-all text-sm font-medium text-viva-ink">
                    {snapshot.webhookUrl}
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/35 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-viva-subtle">
                  Missing items
                </div>
                <div className="mt-3 space-y-2">
                  {snapshot.missing.length > 0 ? (
                    snapshot.missing.map((item) => (
                      <div key={item} className="text-sm text-viva-muted">
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm font-semibold text-viva-success">
                      Everything needed for credentials is present.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <p className="text-sm leading-6 text-viva-muted">
            This page never displays secret values. It only reports whether the
            required environment configuration exists and which endpoints the app
            has already reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
