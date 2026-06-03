import { WhatsappBetaManager } from "@/components/channels/whatsapp-beta-manager";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  canManageTenant,
  requireTenantContext,
} from "@/lib/data/tenant";
import { getWhatsappBetaSetup } from "@/lib/data/whatsapp-beta";

export default async function WhatsappBetaPage() {
  const tenantContext = await requireTenantContext();
  const setup = await getWhatsappBetaSetup(tenantContext.tenant.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 5"
        title="WhatsApp beta"
        description="Run the tenant-safe WhatsApp beta lane in test mode: prepare the connection record, simulate inbound demand, and route everything into the live inbox workflow without paid provider activity."
      />

      <WhatsappBetaManager
        setup={setup}
        canEdit={canManageTenant(tenantContext.role)}
      />
    </div>
  );
}
