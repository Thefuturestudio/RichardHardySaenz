"use client";

import { useActionState } from "react";
import {
  Activity,
  Cable,
  PhoneCall,
  Save,
  ShieldAlert,
  Trash2,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import {
  createChannelBinding,
  deleteChannelBinding,
  updateChannelBinding,
} from "@/app/dashboard/channels/actions";
import type { ActionState } from "@/types";
import type { ChannelBinding } from "@/types/database";

type ChannelBindingsManagerProps = {
  bindings: ChannelBinding[];
  canEdit: boolean;
};

const initialState: ActionState = {};

const providerOptions = [
  { value: "manual_whatsapp", label: "Manual WhatsApp placeholder" },
  { value: "manual_voice", label: "Manual voice placeholder" },
  { value: "unipile_beta", label: "Unipile beta lane" },
  { value: "vapi", label: "Vapi voice lane" },
  { value: "whatsapp_cloud", label: "WhatsApp Cloud API" },
  { value: "360dialog", label: "360dialog official lane" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "draft", label: "Draft" },
  { value: "pending_credentials", label: "Pending credentials" },
  { value: "ready_to_connect", label: "Ready to connect" },
  { value: "test_mode", label: "Test mode" },
  { value: "paused", label: "Paused" },
];

function channelLabel(channel: ChannelBinding["channel"]) {
  if (channel === "voice") return "Voice";
  if (channel === "whatsapp") return "WhatsApp";
  return "Unknown";
}

function statusTone(status: string | null) {
  if (status === "test_mode") return "text-viva-success";
  if (status === "paused") return "text-viva-warning";
  if (status === "pending_credentials") return "text-viva-warning";
  if (status === "ready_to_connect") return "text-viva-success";
  if (status === "draft") return "text-viva-subtle";
  return "text-viva-primary";
}

function ChannelCreateForm({ canEdit }: { canEdit: boolean }) {
  const [state, formAction, isPending] = useActionState(
    createChannelBinding,
    initialState,
  );

  return (
    <form action={formAction} className="viva-glow-card rounded-[2rem] p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
          <Cable className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-viva-primary">
            Step 4 bindings
          </div>
          <h2 className="mt-2 font-display text-3xl font-black text-viva-ink">
            Add channel binding
          </h2>
          <p className="mt-2 text-sm leading-6 text-viva-muted">
            Save the provider record Viva will use later. This does not connect
            WhatsApp, Vapi, Unipile, or any live API yet.
          </p>
        </div>
      </div>

      <fieldset disabled={!canEdit || isPending} className="mt-6 grid gap-5 sm:grid-cols-2 disabled:opacity-60">
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Channel</span>
          <select name="channel" defaultValue="whatsapp" className="viva-field mt-2 px-4 py-3">
            <option value="whatsapp">WhatsApp</option>
            <option value="voice">Voice</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Provider</span>
          <select name="provider" defaultValue="manual_whatsapp" className="viva-field mt-2 px-4 py-3">
            {providerOptions.map((provider) => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">External ID</span>
          <input
            name="external_id"
            required
            className="viva-field mt-2 px-4 py-3"
            placeholder="manual-whatsapp-primary"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Status</span>
          <select name="status" defaultValue="draft" className="viva-field mt-2 px-4 py-3">
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      {state.error ? (
        <div className="mt-5 rounded-xl border border-viva-error/30 bg-viva-error/10 px-4 py-3 text-sm text-viva-error">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="mt-5 rounded-xl border border-viva-success/30 bg-viva-success/10 px-4 py-3 text-sm text-viva-success">
          {state.success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canEdit || isPending}
        className="viva-button-primary mt-6 h-12 px-5 text-sm font-bold"
      >
        <Save className="h-4 w-4" />
        {isPending ? "Saving..." : "Save binding"}
      </button>
    </form>
  );
}

function BindingCard({
  binding,
  canEdit,
}: {
  binding: ChannelBinding;
  canEdit: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    updateChannelBinding,
    initialState,
  );
  const Icon = binding.channel === "voice" ? PhoneCall : Wifi;

  return (
    <article className="viva-auth-card rounded-[1.8rem] p-5">
      <form action={formAction}>
        <input type="hidden" name="id" value={binding.id} />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-viva-gradient-soft text-viva-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-viva-line bg-viva-elevated/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-viva-muted">
                  {channelLabel(binding.channel)}
                </span>
                <span className={`text-xs font-semibold ${statusTone(binding.status)}`}>
                  {binding.status ?? "pending"}
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-black text-viva-ink">
                {binding.provider ?? "Provider not set"}
              </h3>
              <p className="mt-1 text-sm text-viva-muted">
                {binding.external_id ?? "No external ID"}
              </p>
            </div>
          </div>
        </div>

        <fieldset disabled={!canEdit || isPending} className="mt-5 grid gap-4 sm:grid-cols-2 disabled:opacity-60">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">Channel</span>
            <select name="channel" defaultValue={binding.channel ?? "whatsapp"} className="viva-field mt-2 px-3 py-2.5 text-sm">
              <option value="whatsapp">WhatsApp</option>
              <option value="voice">Voice</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">Provider</span>
            <select name="provider" defaultValue={binding.provider ?? "manual_whatsapp"} className="viva-field mt-2 px-3 py-2.5 text-sm">
              {providerOptions.map((provider) => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">External ID</span>
            <input
              name="external_id"
              required
              defaultValue={binding.external_id ?? ""}
              className="viva-field mt-2 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">Status</span>
            <select name="status" defaultValue={binding.status ?? "pending"} className="viva-field mt-2 px-3 py-2.5 text-sm">
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
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
          className="viva-button-primary mt-5 h-10 px-4 text-sm font-bold"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </form>

      <form action={deleteChannelBinding} className="mt-3 flex justify-end">
        <input type="hidden" name="id" value={binding.id} />
        <button
          type="submit"
          disabled={!canEdit}
          className="viva-button-ghost h-9 px-3 text-sm font-semibold text-viva-error"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </form>
    </article>
  );
}

export function ChannelBindingsManager({
  bindings,
  canEdit,
}: ChannelBindingsManagerProps) {
  const whatsappCount = bindings.filter((binding) => binding.channel === "whatsapp").length;
  const voiceCount = bindings.filter((binding) => binding.channel === "voice").length;
  const testModeCount = bindings.filter((binding) => binding.status === "test_mode").length;
  const statCards: Array<{
    label: string;
    value: number;
    icon: LucideIcon;
  }> = [
    { label: "Total bindings", value: bindings.length, icon: Cable },
    { label: "WhatsApp", value: whatsappCount, icon: Wifi },
    { label: "Voice", value: voiceCount, icon: PhoneCall },
    { label: "Test mode", value: testModeCount, icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="viva-glass rounded-2xl p-5">
            <Icon className="h-5 w-5 text-viva-primary" />
            <div className="mt-3 text-sm text-viva-muted">{label}</div>
            <div className="mt-1 font-display text-3xl font-black text-viva-ink">
              {value}
            </div>
          </div>
        ))}
      </section>

      {!canEdit ? (
        <div className="rounded-2xl border border-viva-warning/30 bg-viva-warning/10 px-4 py-3 text-sm text-viva-ink">
          Staff members can view channel bindings but cannot change provider records.
        </div>
      ) : null}

      <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/45 p-4 text-sm leading-6 text-viva-muted">
        <div className="flex gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-viva-primary" />
          <p>
            These are configuration records only. Public WhatsApp onboarding,
            QR pairing, Vapi numbers, templates, and outbound automation remain
            future phases.
          </p>
        </div>
      </div>

      <ChannelCreateForm canEdit={canEdit} />

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-3xl font-black text-viva-ink">
            Binding library
          </h2>
          <p className="mt-1 text-sm text-viva-muted">
            Provider-agnostic records that future lanes can safely attach to.
          </p>
        </div>

        {bindings.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {bindings.map((binding) => (
              <BindingCard key={binding.id} binding={binding} canEdit={canEdit} />
            ))}
          </div>
        ) : (
          <div className="viva-auth-card rounded-[2rem] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
              <Cable className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-3xl font-black text-viva-ink">
              No channel bindings yet
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-viva-muted">
              Add a draft binding for the future WhatsApp or voice lane. Nothing
              external is connected from this screen yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
