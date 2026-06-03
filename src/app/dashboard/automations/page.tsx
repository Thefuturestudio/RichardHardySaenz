import { Network, ShieldCheck } from "lucide-react";
import { prepareAutomationsFoundation } from "@/app/dashboard/foundation-actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getFoundationsOverview } from "@/lib/data/foundations";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";

export default async function AutomationsPage() {
  const tenantContext = await requireTenantContext();
  const overview = await getFoundationsOverview(tenantContext.tenant.id);
  const canEdit = canManageTenant(tenantContext.role);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 9"
        title="n8n automations"
        description="Prepare automation workflow records for future notifications, booking queues, and digests. No webhook or workflow execution is live yet."
      />

      <FoundationCard
        eyebrow="Workflow registry"
        title="Prepare n8n setup"
        description="Create draft automation definitions that will later map to n8n workflows on Railway."
        icon={Network}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatPill label="Workflows" value={String(overview.automations.length)} />
          <StatPill label="Provider" value="n8n" />
          <StatPill label="Live webhooks" value="disabled" />
        </div>

        <div className="mt-6">
          <FoundationActionButton
            action={prepareAutomationsFoundation}
            label="Prepare automations"
            icon="play"
            disabled={!canEdit}
          />
        </div>
      </FoundationCard>

      <div className="grid gap-4 md:grid-cols-3">
        {overview.automations.map((workflow) => (
          <div key={workflow.id} className="viva-auth-card rounded-[1.5rem] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
              {workflow.status}
            </div>
            <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
              {workflow.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-viva-muted">
              Trigger: {workflow.trigger_type ?? "Not assigned"} · Provider:{" "}
              {workflow.provider}
            </p>
          </div>
        ))}
      </div>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <p className="text-sm leading-6 text-viva-muted">
            Outbound WhatsApp follow-ups remain off. Future follow-ups must
            respect opt-in, approved templates, and the customer-service window.
          </p>
        </div>
      </div>
    </div>
  );
}
