import Link from "next/link";
import { ArrowRight, Mic2 } from "lucide-react";
import { ChannelBindingsManager } from "@/components/channels/channel-bindings-manager";
import { PageHeader } from "@/components/dashboard/page-header";
import { getChannelBindingsForTenant } from "@/lib/data/channels";
import {
  canManageTenant,
  requireTenantContext,
} from "@/lib/data/tenant";

export default async function ChannelsPage() {
  const tenantContext = await requireTenantContext();
  const bindings = await getChannelBindingsForTenant(tenantContext.tenant.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 4"
        title="Channels"
        description="Manage provider-agnostic channel binding records for WhatsApp and voice lanes. Live messaging and provider calls stay controlled."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/channels/voice"
              className="viva-button-ghost h-11 px-4 text-sm font-bold"
            >
              Voice
              <Mic2 className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/channels/whatsapp-beta"
              className="viva-button-primary h-11 px-4 text-sm font-bold"
            >
              WhatsApp beta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        }
      />

      <ChannelBindingsManager
        bindings={bindings}
        canEdit={canManageTenant(tenantContext.role)}
      />
    </div>
  );
}
