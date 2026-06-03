import { Mic2, ShieldCheck } from "lucide-react";
import { prepareVoiceFoundation } from "@/app/dashboard/foundation-actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getVoiceFoundationSetup } from "@/lib/data/foundations";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";

export default async function VoiceChannelPage() {
  const tenantContext = await requireTenantContext();
  const setup = await getVoiceFoundationSetup(tenantContext.tenant.id);
  const canEdit = canManageTenant(tenantContext.role);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 6"
        title="Vapi voice lane"
        description="Prepare tenant-safe Vapi records for future voice reception. This does not create an assistant, buy a phone number, or place calls."
      />

      <FoundationCard
        eyebrow="Voice foundation"
        title="Prepare Vapi setup"
        description="This creates the voice channel binding and Vapi session placeholder Viva will use later when you choose to activate live voice."
        icon={Mic2}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatPill label="Binding" value={setup.binding?.status ?? "not created"} />
          <StatPill label="Session" value={setup.session?.status ?? "not prepared"} />
          <StatPill
            label="Credentials"
            value={setup.hasVapiCredentials ? "present" : "missing"}
          />
        </div>

        <div className="mt-6">
          <FoundationActionButton
            action={prepareVoiceFoundation}
            label={setup.session ? "Refresh voice setup" : "Prepare voice setup"}
            icon="radio"
            disabled={!canEdit}
          />
        </div>
      </FoundationCard>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <div>
            <h2 className="font-display text-2xl font-black text-viva-ink">
              What stays off
            </h2>
            <p className="mt-2 text-sm leading-6 text-viva-muted">
              No Vapi assistant, phone number provisioning, outbound calls,
              recordings, transcription, AI behavior, or billing is enabled in
              this step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
