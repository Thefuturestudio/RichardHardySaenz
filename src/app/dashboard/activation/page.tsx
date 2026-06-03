import { Power, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { updateProviderActivationStatus } from "@/app/dashboard/control-actions";
import { prepareActivationConsoleFoundation } from "@/app/dashboard/foundation-actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getFoundationsOverview } from "@/lib/data/foundations";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";

export default async function ActivationPage() {
  const tenantContext = await requireTenantContext();
  const overview = await getFoundationsOverview(tenantContext.tenant.id);
  const canEdit = canManageTenant(tenantContext.role);
  const activeCount = overview.providerActivations.filter((p) => p.live_enabled).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 16"
        title="Provider activation console"
        description="A controlled go-live surface for Unipile, official WhatsApp, Vapi, OpenAI, Stripe, n8n, and Cal.com. Everything is disabled until deliberately activated."
      />

      <FoundationCard
        eyebrow="Go-live control"
        title="Prepare activation console"
        description="Create provider activation rows with checklists, review requirements, and live switches set to off."
        icon={SlidersHorizontal}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatPill label="Providers tracked" value={String(overview.providerActivations.length)} />
          <StatPill label="Live enabled" value={String(activeCount)} />
          <StatPill label="Default state" value="blocked" />
        </div>

        <div className="mt-6">
          <FoundationActionButton
            action={prepareActivationConsoleFoundation}
            label="Prepare activation console"
            icon="sliders"
            disabled={!canEdit}
          />
        </div>
      </FoundationCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overview.providerActivations.map((provider) => (
          <div key={provider.id} className="viva-auth-card rounded-[1.5rem] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                  {provider.category}
                </div>
                <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                  {provider.provider_name}
                </h2>
                <p className="mt-2 text-sm capitalize text-viva-muted">
                  {provider.status.replaceAll("_", " ")}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-viva-gradient-soft text-viva-primary">
                <Power className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-viva-line/70 bg-viva-card/50 px-3 py-2 text-xs font-semibold text-viva-muted">
              Live enabled: {provider.live_enabled ? "Yes" : "No"}
            </div>
            <form action={updateProviderActivationStatus} className="mt-4 flex items-center gap-2">
              <input type="hidden" name="provider_id" value={provider.id} />
              <select
                name="status"
                defaultValue={provider.status}
                disabled={!canEdit}
                className="viva-field h-10 px-3 text-sm"
              >
                <option value="not_configured">Not configured</option>
                <option value="pending_credentials">Pending credentials</option>
                <option value="ready">Ready</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="failed">Failed</option>
              </select>
              <button
                type="submit"
                disabled={!canEdit}
                className="viva-button-ghost h-10 px-3 text-sm font-bold"
              >
                Save
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <p className="text-sm leading-6 text-viva-muted">
            This page is where real activation controls will live later. For now,
            every provider remains off and review-gated.
          </p>
        </div>
      </div>
    </div>
  );
}
