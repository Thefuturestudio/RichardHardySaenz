"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateSettings } from "@/app/dashboard/settings/actions";
import { BUSINESS_TYPES, LANGUAGES, TIMEZONES, TONES } from "@/lib/constants";
import type { ActionState } from "@/types";
import type { Tenant, TenantSettings } from "@/types/database";

type SettingsFormProps = {
  tenant: Tenant;
  settings: TenantSettings | null;
  canEdit: boolean;
};

const initialState: ActionState = {};

export function SettingsForm({ tenant, settings, canEdit }: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(updateSettings, initialState);
  const language = settings?.languages?.[0] ?? "es";

  return (
    <form action={formAction} className="space-y-8">
      <fieldset disabled={!canEdit || isPending} className="space-y-8 disabled:opacity-70">
        <section className="viva-glass rounded-3xl p-6">
          <div>
            <h2 className="font-display text-xl font-bold text-viva-ink">
              Business profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-viva-muted">
              This identifies the tenant workspace across the Viva dashboard.
            </p>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-viva-ink">Business name</span>
              <input
                name="business_name"
                required
                defaultValue={tenant.business_name}
                className="viva-field mt-2 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-viva-ink">Business type</span>
              <select
                name="business_type"
                required
                defaultValue={tenant.business_type}
                className="viva-field mt-2 px-4 py-3"
              >
                {BUSINESS_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-viva-ink">Timezone</span>
              <select
                name="timezone"
                defaultValue={tenant.timezone ?? "America/Panama"}
                className="viva-field mt-2 px-4 py-3"
              >
                {TIMEZONES.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-viva-ink">City</span>
              <input
                name="city"
                defaultValue={tenant.city ?? ""}
                className="viva-field mt-2 px-4 py-3"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-viva-ink">Country</span>
              <input
                name="country"
                defaultValue={tenant.country ?? ""}
                className="viva-field mt-2 px-4 py-3"
              />
            </label>
          </div>
        </section>

        <section className="viva-glow-card rounded-3xl p-6">
          <div>
            <h2 className="font-display text-xl font-bold text-viva-ink">
              Runtime settings
            </h2>
            <p className="mt-1 text-sm leading-6 text-viva-muted">
              Future channel and agent workflows will read these tenant values at runtime.
            </p>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-viva-ink">Language</span>
              <select
                name="language"
                defaultValue={language}
                className="viva-field mt-2 px-4 py-3"
              >
                {LANGUAGES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-viva-ink">Tone</span>
              <select
                name="tone"
                defaultValue={settings?.tone ?? "friendly"}
                className="viva-field mt-2 px-4 py-3"
              >
                {TONES.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-viva-ink">
                Human fallback number
              </span>
              <input
                name="human_fallback_number"
                type="tel"
                defaultValue={settings?.human_fallback_number ?? ""}
                className="viva-field mt-2 px-4 py-3"
                placeholder="+507..."
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-viva-ink">Booking URL</span>
              <input
                name="booking_url"
                type="url"
                defaultValue={settings?.booking_url ?? ""}
                className="viva-field mt-2 px-4 py-3"
                placeholder="https://..."
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-viva-ink">Greeting</span>
              <textarea
                name="greeting"
                rows={4}
                defaultValue={settings?.greeting ?? ""}
                className="viva-field mt-2 px-4 py-3"
                placeholder="Gracias por contactar a nuestro negocio. Como puedo ayudarle?"
              />
            </label>
          </div>
        </section>
      </fieldset>

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

      <div className="flex items-center justify-end gap-3">
        {!canEdit ? (
          <span className="text-sm text-viva-muted">
            Staff members can view settings but cannot edit them.
          </span>
        ) : null}
        <button
          type="submit"
          disabled={!canEdit || isPending}
          className="viva-button-primary h-12 px-5 text-sm font-bold"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}
