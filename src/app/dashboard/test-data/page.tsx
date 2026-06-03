import { Archive, Database, ShieldCheck } from "lucide-react";
import { archiveTestData } from "@/app/dashboard/control-actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getTestDataOverview } from "@/lib/data/test-data";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";

export default async function TestDataPage() {
  const tenantContext = await requireTenantContext();
  const overview = await getTestDataOverview(tenantContext.tenant.id);
  const canEdit = canManageTenant(tenantContext.role);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Control"
        title="Test data management"
        description="Archive noisy demo and test records without permanently deleting tenant data. This keeps the workspace usable during build and QA."
      />

      <FoundationCard
        eyebrow="Safe cleanup"
        title="Archive test-mode records"
        description="This archives conversations and cancels demo bookings, orders, and queued outbound records that look like generated test data. It does not delete rows."
        icon={Archive}
      >
        <div className="grid gap-4 md:grid-cols-5">
          <StatPill label="Conversations" value={String(overview.conversations)} />
          <StatPill label="Bookings" value={String(overview.bookings)} />
          <StatPill label="Orders" value={String(overview.orders)} />
          <StatPill label="Outbox" value={String(overview.outboundMessages)} />
          <StatPill label="Webhooks" value={String(overview.webhookEvents)} />
        </div>

        <div className="mt-6">
          <FoundationActionButton
            action={archiveTestData}
            label="Archive test data"
            pendingLabel="Archiving..."
            icon="archive"
            disabled={!canEdit}
          />
        </div>
      </FoundationCard>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <p className="text-sm leading-6 text-viva-muted">
            This is deliberately conservative. Webhook logs are counted for
            visibility but not deleted, because they are useful for debugging
            launch readiness.
          </p>
        </div>
      </div>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <Database className="mt-1 h-5 w-5 text-viva-primary" />
          <p className="text-sm leading-6 text-viva-muted">
            For production, this page becomes a retention and export surface:
            archive old transcripts, remove unnecessary PII, and keep only the
            operational records the tenant needs.
          </p>
        </div>
      </div>
    </div>
  );
}
