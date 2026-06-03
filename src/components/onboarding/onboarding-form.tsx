"use client";

import { useActionState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  CalendarCheck2,
  MessageSquare,
  Stethoscope,
} from "lucide-react";
import { completeOnboarding } from "@/app/onboarding/actions";
import { BUSINESS_TYPES, LANGUAGES, TIMEZONES } from "@/lib/constants";
import type { ActionState } from "@/types";

const initialState: ActionState = {};

export function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <div className="text-sm font-medium text-viva-ink">First pilot motion</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              value: "combined",
              title: "Viva platform",
              description: "Bookings plus sales drafts for one all-in-one pilot.",
              icon: MessageSquare,
            },
            {
              value: "reserva",
              title: "Reserva Viva",
              description: "Reception, booking recovery, and calendar-ready flows.",
              icon: CalendarCheck2,
            },
            {
              value: "venta",
              title: "Venta Viva",
              description: "Catalog, sales conversations, and payment-link drafts.",
              icon: CreditCard,
            },
            {
              value: "viva_med",
              title: "Viva Med",
              description: "Medical appointments, safe handoff, and privacy gates.",
              icon: Stethoscope,
            },
          ].map((motion) => {
            const Icon = motion.icon;

            return (
              <label
                key={motion.value}
                className="group relative cursor-pointer rounded-2xl border border-viva-line/80 bg-viva-card/60 p-4 shadow-card transition hover:border-transparent hover:bg-viva-elevated hover:shadow-glow"
              >
                <input
                  type="radio"
                  name="product_motion"
                  value={motion.value}
                  defaultChecked={motion.value === "combined"}
                  className="peer sr-only"
                />
                <span className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-viva-cyan/0 via-viva-primary/0 to-viva-pink/0 opacity-0 transition peer-checked:border-viva-cyan peer-checked:opacity-100 group-hover:opacity-70" />
                <span className="relative flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-viva-gradient-soft text-viva-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-black text-viva-ink">
                      {motion.title}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-viva-muted">
                      {motion.description}
                    </span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-viva-ink">Business name</span>
          <input
            name="business_name"
            required
            className="viva-field mt-2 px-4 py-3"
            placeholder="Viva Dental Studio"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Business type</span>
          <select
            name="business_type"
            required
            className="viva-field mt-2 px-4 py-3"
            defaultValue=""
          >
            <option value="" disabled>
              Select a type
            </option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Language</span>
          <select
            name="language"
            className="viva-field mt-2 px-4 py-3"
            defaultValue="es"
          >
            {LANGUAGES.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">City</span>
          <input
            name="city"
            className="viva-field mt-2 px-4 py-3"
            placeholder="Panama City"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Country</span>
          <input
            name="country"
            className="viva-field mt-2 px-4 py-3"
            placeholder="Panama"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Timezone</span>
          <select
            name="timezone"
            className="viva-field mt-2 px-4 py-3"
            defaultValue="America/Panama"
          >
            {TIMEZONES.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
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
            className="viva-field mt-2 px-4 py-3"
            placeholder="+507..."
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-viva-ink">
            First pilot goal
          </span>
          <textarea
            name="pilot_goal"
            className="viva-field mt-2 min-h-24 px-4 py-3"
            placeholder="Example: capture missed booking requests, create payment drafts, and notify the owner before anything goes live."
          />
        </label>
      </div>

      <label className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-viva-line/80 bg-viva-card/60 p-4 shadow-card transition hover:border-transparent hover:bg-viva-elevated hover:shadow-glow">
        <input
          type="checkbox"
          name="compliance_acknowledgement"
          required
          className="mt-1 h-5 w-5 rounded border-viva-line text-viva-primary focus:ring-viva-primary"
        />
        <span>
          <span className="flex items-center gap-2 text-sm font-bold text-viva-ink">
            <CheckCircle2 className="h-4 w-4 text-viva-primary" />
            I understand this tenant starts in test mode.
          </span>
          <span className="mt-1 block text-sm leading-6 text-viva-muted">
            Viva will not send live WhatsApp messages, make calls, create charges,
            or write live calendar events until credentials, compliance review, human
            fallback, and owner approval are complete.
          </span>
        </span>
      </label>

      {state.error ? (
        <div className="rounded-xl border border-viva-error/30 bg-viva-error/10 px-4 py-3 text-sm text-viva-error">
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-viva-line/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-viva-muted">
          This creates the tenant foundation and pilot checklist only. Stripe,
          Cal.com, WhatsApp, voice, AI, and automations stay in safe test mode.
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="viva-button-primary h-12 px-5 text-sm font-bold"
        >
          {isPending ? "Creating..." : "Create tenant"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
