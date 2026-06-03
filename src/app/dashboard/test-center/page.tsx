import { FlaskConical, RadioTower, Receipt, RefreshCw } from "lucide-react";
import {
  simulateCalcomWebhook,
  simulateStripeWebhook,
  simulateUnipileWebhook,
  syncProviderReadiness,
} from "@/app/dashboard/launch-actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { PageHeader } from "@/components/dashboard/page-header";
import { getLaunchReadinessOverview } from "@/lib/data/launch-ops";
import { requireTenantContext } from "@/lib/data/tenant";

export default async function TestCenterPage() {
  const tenantContext = await requireTenantContext();
  const overview = await getLaunchReadinessOverview(tenantContext.tenant.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 26"
        title="Test center"
        description="Run safe provider simulations from one place so we can exercise the live-ready rails without sending real messages, bookings, or charges."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="viva-auth-card rounded-[2rem] p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                Readiness
              </div>
              <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                Sync provider state
              </h2>
              <p className="mt-2 text-sm leading-6 text-viva-muted">
                Refresh activation rows against the environment before running any simulations.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <FoundationActionButton
              action={syncProviderReadiness}
              label="Sync provider state"
              pendingLabel="Syncing..."
              icon="shield"
            />
          </div>
        </div>

        <div className="viva-auth-card rounded-[2rem] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
            Current activity
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-viva-line/70 bg-viva-card/55 p-4">
              <div className="text-xs uppercase tracking-[0.12em] text-viva-subtle">Webhooks</div>
              <div className="mt-2 font-display text-3xl font-black text-viva-ink">
                {overview.webhookEvents.length}
              </div>
            </div>
            <div className="rounded-2xl border border-viva-line/70 bg-viva-card/55 p-4">
              <div className="text-xs uppercase tracking-[0.12em] text-viva-subtle">Outbox</div>
              <div className="mt-2 font-display text-3xl font-black text-viva-ink">
                {overview.outboundQueue.length}
              </div>
            </div>
            <div className="rounded-2xl border border-viva-line/70 bg-viva-card/55 p-4">
              <div className="text-xs uppercase tracking-[0.12em] text-viva-subtle">Readiness</div>
              <div className="mt-2 font-display text-3xl font-black text-viva-ink">
                {overview.readinessScore}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="viva-auth-card rounded-[1.7rem] p-5">
          <div className="flex items-start gap-3">
            <RadioTower className="mt-1 h-5 w-5 text-viva-primary" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                Unipile
              </div>
              <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                Simulate inbound WhatsApp
              </h2>
              <p className="mt-2 text-sm leading-6 text-viva-muted">
                Sends an internal webhook payload through the Unipile route and lands it in conversations.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <FoundationActionButton
              action={simulateUnipileWebhook}
              label="Run Unipile test"
              pendingLabel="Sending..."
              icon="wifi"
            />
          </div>
        </div>

        <div className="viva-auth-card rounded-[1.7rem] p-5">
          <div className="flex items-start gap-3">
            <RefreshCw className="mt-1 h-5 w-5 text-viva-primary" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                Cal.com
              </div>
              <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                Simulate booking confirmation
              </h2>
              <p className="mt-2 text-sm leading-6 text-viva-muted">
                Pushes a confirmation event into the Cal.com webhook route using the latest booking record.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <FoundationActionButton
              action={simulateCalcomWebhook}
              label="Run Cal.com test"
              pendingLabel="Sending..."
              icon="calendar"
            />
          </div>
        </div>

        <div className="viva-auth-card rounded-[1.7rem] p-5">
          <div className="flex items-start gap-3">
            <Receipt className="mt-1 h-5 w-5 text-viva-primary" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                Stripe
              </div>
              <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                Simulate checkout completion
              </h2>
              <p className="mt-2 text-sm leading-6 text-viva-muted">
                Pushes a successful checkout event into the Stripe webhook route using the latest order.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <FoundationActionButton
              action={simulateStripeWebhook}
              label="Run Stripe test"
              pendingLabel="Sending..."
              icon="creditCard"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
