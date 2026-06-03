import { ShieldCheck, UserPlus, Users } from "lucide-react";
import { prepareCustomersFoundation } from "@/app/dashboard/foundation-actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getFoundationsOverview } from "@/lib/data/foundations";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";

export default async function CustomersPage() {
  const tenantContext = await requireTenantContext();
  const overview = await getFoundationsOverview(tenantContext.tenant.id);
  const canEdit = canManageTenant(tenantContext.role);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 14"
        title="Customers"
        description="Create the shared customer layer that future WhatsApp, voice, bookings, orders, and conversations will connect to."
      />

      <FoundationCard
        eyebrow="Customer foundation"
        title="Prepare customer records"
        description="Create a demo customer and consent placeholder so the platform has a safe identity layer before live channels begin writing data."
        icon={Users}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatPill label="Customers" value={String(overview.customers.length)} />
          <StatPill label="Consent records" value={String(overview.consentRecords.length)} />
          <StatPill label="Live import" value="disabled" />
        </div>

        <div className="mt-6">
          <FoundationActionButton
            action={prepareCustomersFoundation}
            label="Prepare customers"
            icon="users"
            disabled={!canEdit}
          />
        </div>
      </FoundationCard>

      <div className="grid gap-4 md:grid-cols-2">
        {overview.customers.map((customer) => (
          <div key={customer.id} className="viva-auth-card rounded-[1.5rem] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-viva-gradient-soft text-viva-primary">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                  {customer.status}
                </div>
                <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                  {customer.display_name ?? "Unnamed customer"}
                </h2>
                <p className="mt-1 text-sm text-viva-muted">
                  {customer.phone ?? "No phone"} · {customer.email ?? "No email"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <p className="text-sm leading-6 text-viva-muted">
            Customer records are tenant-scoped. Message data is not used to train
            shared models, and outbound messaging still requires consent rules.
          </p>
        </div>
      </div>
    </div>
  );
}
