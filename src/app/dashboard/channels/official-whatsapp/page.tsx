import { BadgeCheck, MessageCircle, ShieldCheck } from "lucide-react";
import { prepareOfficialWhatsappFoundation } from "@/app/dashboard/foundation-actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getFoundationsOverview } from "@/lib/data/foundations";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";

export default async function OfficialWhatsappPage() {
  const tenantContext = await requireTenantContext();
  const overview = await getFoundationsOverview(tenantContext.tenant.id);
  const canEdit = canManageTenant(tenantContext.role);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 12"
        title="Official WhatsApp API"
        description="Prepare the official WhatsApp / 360dialog lane for larger or verified customers. No Meta onboarding, WABA connection, or paid API call is made yet."
      />

      <FoundationCard
        eyebrow="Official lane"
        title="Prepare 360dialog setup"
        description="Create the official WhatsApp binding and provider config that can later hold WABA IDs, phone IDs, verification state, and webhook URLs."
        icon={MessageCircle}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatPill
            label="Binding"
            value={overview.officialWhatsappBinding?.status ?? "not created"}
          />
          <StatPill
            label="Config"
            value={overview.officialWhatsappConfig?.status ?? "not prepared"}
          />
          <StatPill label="Live API" value="disabled" />
        </div>

        <div className="mt-6">
          <FoundationActionButton
            action={prepareOfficialWhatsappFoundation}
            label="Prepare official WhatsApp"
            icon="wifi"
            disabled={!canEdit}
          />
        </div>
      </FoundationCard>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <div>
            <h2 className="font-display text-2xl font-black text-viva-ink">
              What this unlocks later
            </h2>
            <p className="mt-2 text-sm leading-6 text-viva-muted">
              Official WhatsApp is the more formal production lane for verified
              customers, approved templates, higher reliability, and stronger
              compliance posture. It remains off until you explicitly activate it.
            </p>
          </div>
          <BadgeCheck className="ml-auto hidden h-8 w-8 text-viva-blue sm:block" />
        </div>
      </div>
    </div>
  );
}
