"use client";

import { useActionState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  KeyRound,
  MessageCircle,
  PauseCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import {
  pauseWhatsappBetaLane,
  prepareWhatsappBetaLane,
  simulateWhatsappInbound,
} from "@/app/dashboard/channels/whatsapp-beta/actions";
import type { ActionState } from "@/types";
import type { WhatsappBetaSetup } from "@/lib/data/whatsapp-beta";

type WhatsappBetaManagerProps = {
  setup: WhatsappBetaSetup;
  canEdit: boolean;
};

const initialState: ActionState = {};

function BetaActionButton({
  action,
  label,
  pendingLabel,
  disabled,
  variant = "primary",
}: {
  action: () => Promise<ActionState>;
  label: string;
  pendingLabel: string;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <button
        type="submit"
        disabled={disabled || isPending}
        className={
          variant === "primary"
            ? "viva-button-primary h-12 px-5 text-sm font-bold"
            : "viva-button-ghost h-12 px-5 text-sm font-bold"
        }
      >
        {variant === "primary" ? (
          <QrCode className="h-4 w-4" />
        ) : (
          <PauseCircle className="h-4 w-4" />
        )}
        {isPending ? pendingLabel : label}
      </button>

      {state.error ? (
        <div className="rounded-xl border border-viva-error/30 bg-viva-error/10 px-4 py-3 text-sm text-viva-error">
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="rounded-xl border border-viva-success/30 bg-viva-success/10 px-4 py-3 text-sm text-viva-success">
          {state.success}
        </div>
      ) : null}
    </form>
  );
}

function StatusCard({
  title,
  value,
  icon: Icon,
  tone = "primary",
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning";
}) {
  const color =
    tone === "success"
      ? "text-viva-success"
      : tone === "warning"
        ? "text-viva-warning"
        : "text-viva-primary";

  return (
    <div className="viva-glass rounded-2xl p-5">
      <Icon className={`h-5 w-5 ${color}`} />
      <div className="mt-3 text-sm text-viva-muted">{title}</div>
      <div className="mt-1 font-display text-2xl font-black text-viva-ink">
        {value}
      </div>
    </div>
  );
}

function InboundSimulatorForm({ canEdit }: { canEdit: boolean }) {
  const [state, formAction, isPending] = useActionState(
    simulateWhatsappInbound,
    initialState,
  );

  return (
    <form action={formAction} className="viva-auth-card rounded-[2rem] p-6">
      <h3 className="font-display text-2xl font-black text-viva-ink">
        Test inbound capture
      </h3>
      <p className="mt-2 text-sm leading-6 text-viva-muted">
        This simulates a customer sending a WhatsApp message through the beta
        lane. It creates a customer record if needed and writes straight into
        the real tenant inbox tables.
      </p>

      <fieldset
        disabled={!canEdit || isPending}
        className="mt-5 grid gap-4 sm:grid-cols-2 disabled:opacity-60"
      >
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Customer name</span>
          <input
            name="customer_display_name"
            className="viva-field mt-2 px-4 py-3"
            placeholder="Alex Morgan"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Phone</span>
          <input
            name="customer_phone"
            required
            className="viva-field mt-2 px-4 py-3"
            placeholder="+507..."
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Email</span>
          <input
            name="customer_email"
            type="email"
            className="viva-field mt-2 px-4 py-3"
            placeholder="customer@example.com"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Intent</span>
          <select
            name="intent"
            defaultValue="unknown"
            className="viva-field mt-2 px-4 py-3"
          >
            <option value="unknown">Unknown</option>
            <option value="booking">Booking</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="handoff">Human handoff</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-viva-ink">Summary</span>
          <input
            name="summary"
            className="viva-field mt-2 px-4 py-3"
            placeholder="Customer wants pricing, availability, or a checkout link."
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-viva-ink">Incoming message</span>
          <textarea
            name="body"
            rows={4}
            required
            className="viva-field mt-2 px-4 py-3"
            placeholder="Hi, do you have anything available on Friday afternoon?"
          />
        </label>
      </fieldset>

      {state.error ? (
        <div className="mt-4 rounded-xl border border-viva-error/30 bg-viva-error/10 px-4 py-3 text-sm text-viva-error">
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="mt-4 rounded-xl border border-viva-success/30 bg-viva-success/10 px-4 py-3 text-sm text-viva-success">
          {state.success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canEdit || isPending}
        className="viva-button-primary mt-5 h-12 px-5 text-sm font-bold"
      >
        <MessageCircle className="h-4 w-4" />
        {isPending ? "Capturing..." : "Simulate inbound message"}
      </button>
    </form>
  );
}

export function WhatsappBetaManager({
  setup,
  canEdit,
}: WhatsappBetaManagerProps) {
  const bindingStatus = setup.binding?.status ?? "not created";
  const isPrepared = Boolean(setup.binding && setup.session);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <StatusCard
          title="Beta lane"
          value={isPrepared ? "Prepared" : "Not ready"}
          icon={ShieldCheck}
          tone={isPrepared ? "success" : "warning"}
        />
        <StatusCard
          title="Provider"
          value="Unipile"
          icon={Wifi}
        />
        <StatusCard
          title="Credentials"
          value={setup.hasUnipileCredentials ? "Present" : "Missing"}
          icon={KeyRound}
          tone={setup.hasUnipileCredentials ? "success" : "warning"}
        />
        <StatusCard
          title="Webhook"
          value={setup.hasWebhookSecret ? "Ready" : "Missing"}
          icon={Smartphone}
          tone={setup.hasWebhookSecret ? "success" : "warning"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="viva-glow-card rounded-[2rem] p-6 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-viva-primary">
                Unipile beta lane
              </div>
              <h2 className="mt-2 font-display text-3xl font-black text-viva-ink">
                Prepare WhatsApp beta
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-viva-muted">
                This creates the tenant-safe records we need for QR or hosted
                auth later. It does not call Unipile, scan a QR code, send
                messages, or connect a real WhatsApp account yet.
              </p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
              <QrCode className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-viva-line/70 bg-viva-card/55 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-viva-subtle">
                Binding
              </div>
              <div className="mt-2 font-display text-xl font-black text-viva-ink">
                {setup.binding?.external_id ?? "Not created"}
              </div>
              <p className="mt-1 text-sm text-viva-muted">
                Status: {bindingStatus.replaceAll("_", " ")}
              </p>
            </div>
            <div className="rounded-2xl border border-viva-line/70 bg-viva-card/55 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-viva-subtle">
                Auth link
              </div>
              <div className="mt-2 font-display text-xl font-black text-viva-ink">
                {setup.session?.hosted_auth_url ? "Ready" : "Not generated"}
              </div>
              <p className="mt-1 text-sm text-viva-muted">
                Credentials and paid/provider access are required later.
              </p>
            </div>
            <div className="rounded-2xl border border-viva-line/70 bg-viva-card/55 p-4 sm:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-viva-subtle">
                Webhook endpoint
              </div>
              <div className="mt-2 break-all text-sm font-semibold text-viva-ink">
                {setup.webhookUrl}
              </div>
              <p className="mt-1 text-sm text-viva-muted">
                Ready for a future Unipile bridge. Right now this stays dormant
                until credentials and a shared secret are configured.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <BetaActionButton
              action={prepareWhatsappBetaLane}
              label={isPrepared ? "Refresh beta setup" : "Prepare beta setup"}
              pendingLabel="Preparing..."
              disabled={!canEdit}
            />
            <BetaActionButton
              action={pauseWhatsappBetaLane}
              label="Pause beta lane"
              pendingLabel="Pausing..."
              disabled={!canEdit || !isPrepared}
              variant="ghost"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="viva-auth-card rounded-[2rem] p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-viva-warning" />
              <div>
                <h3 className="font-display text-2xl font-black text-viva-ink">
                  Beta rules
                </h3>
                <div className="mt-4 space-y-3 text-sm leading-6 text-viva-muted">
                  <p>Use this for pilots and early customers only.</p>
                  <p>Do not sell this as the official WhatsApp API.</p>
                  <p>Outbound follow-ups and template flows are not built yet.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="viva-auth-card rounded-[2rem] p-6">
            <h3 className="font-display text-2xl font-black text-viva-ink">
              Later activation path
            </h3>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-viva-muted">
              <li>1. Add Unipile credentials to Vercel/local env.</li>
              <li>2. Generate a tenant-specific hosted auth or QR link.</li>
              <li>3. Customer pairs their WhatsApp Business app.</li>
              <li>4. Store Unipile account ID on this session.</li>
              <li>5. Replace simulator traffic with real inbound webhooks.</li>
            </ol>
          </div>

          <InboundSimulatorForm canEdit={canEdit} />

          <a
            href="https://developer.unipile.com/"
            target="_blank"
            rel="noreferrer"
            className="viva-button-ghost h-11 px-4 text-sm font-bold"
          >
            Unipile docs
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
