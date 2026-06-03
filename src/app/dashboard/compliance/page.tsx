import { ClipboardCheck, ShieldAlert, ShieldCheck } from "lucide-react";
import { updateComplianceReviewStatus } from "@/app/dashboard/control-actions";
import { prepareComplianceFoundation } from "@/app/dashboard/foundation-actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getFoundationsOverview } from "@/lib/data/foundations";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";

export default async function CompliancePage() {
  const tenantContext = await requireTenantContext();
  const overview = await getFoundationsOverview(tenantContext.tenant.id);
  const canEdit = canManageTenant(tenantContext.role);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 15"
        title="Consent and compliance"
        description="Track activation review, consent posture, restricted category checks, and human fallback readiness before any live provider is turned on."
      />

      <FoundationCard
        eyebrow="Activation review"
        title="Prepare compliance checks"
        description="Create the review record that blocks live activation until the business category, outbound rules, and fallback path are confirmed."
        icon={ShieldAlert}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatPill label="Reviews" value={String(overview.complianceReviews.length)} />
          <StatPill label="Consent rows" value={String(overview.consentRecords.length)} />
          <StatPill label="Live activation" value="blocked" />
        </div>

        <div className="mt-6">
          <FoundationActionButton
            action={prepareComplianceFoundation}
            label="Prepare compliance"
            icon="shield"
            disabled={!canEdit}
          />
        </div>
      </FoundationCard>

      <div className="grid gap-4 md:grid-cols-2">
        {overview.complianceReviews.map((review) => (
          <div key={review.id} className="viva-auth-card rounded-[1.5rem] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <ClipboardCheck className="mt-1 h-5 w-5 text-viva-primary" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                    {review.status}
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                    {review.review_type}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-viva-muted">
                    {review.notes ?? "No notes saved yet."}
                  </p>
                </div>
              </div>
              <form action={updateComplianceReviewStatus} className="flex items-center gap-2">
                <input type="hidden" name="review_id" value={review.id} />
                <select
                  name="status"
                  defaultValue={review.status}
                  disabled={!canEdit}
                  className="viva-field h-10 px-3 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="needs_review">Needs review</option>
                  <option value="approved">Approved</option>
                  <option value="blocked">Blocked</option>
                </select>
                <button
                  type="submit"
                  disabled={!canEdit}
                  className="viva-button-ghost h-10 px-3 text-sm font-bold"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <p className="text-sm leading-6 text-viva-muted">
            Compliance is not decoration here. It controls whether provider
            activation is allowed, especially for WhatsApp templates, restricted
            categories, and regulated industries.
          </p>
        </div>
      </div>
    </div>
  );
}
