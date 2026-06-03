import { Landmark, ShieldCheck } from "lucide-react";
import { prepareBillingFoundation } from "@/app/dashboard/foundation-actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getFoundationsOverview } from "@/lib/data/foundations";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";

export default async function BillingPage() {
  const tenantContext = await requireTenantContext();
  const overview = await getFoundationsOverview(tenantContext.tenant.id);
  const canEdit = canManageTenant(tenantContext.role);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 10"
        title="Stripe billing"
        description="Prepare tenant billing state for future subscriptions and usage plans. No Stripe customer, subscription, checkout, or charge is created yet."
      />

      <FoundationCard
        eyebrow="Billing foundation"
        title="Prepare Stripe setup"
        description="Create the billing account placeholder Viva will use later when subscriptions and customer billing are activated."
        icon={Landmark}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatPill
            label="Billing account"
            value={overview.billingAccount?.status ?? "not created"}
          />
          <StatPill label="Provider" value="Stripe" />
          <StatPill label="Live billing" value="disabled" />
        </div>

        <div className="mt-6">
          <FoundationActionButton
            action={prepareBillingFoundation}
            label="Prepare billing"
            icon="creditCard"
            disabled={!canEdit}
          />
        </div>
      </FoundationCard>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <p className="text-sm leading-6 text-viva-muted">
            Later, Stripe billing is for customers paying you to use Viva. It is
            separate from end-customer checkout links, merchant payouts, and any
            platform commission model.
          </p>
        </div>
      </div>
    </div>
  );
}
