"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

const onboardingSchema = z.object({
  business_name: z.string().trim().min(2, "Business name is required."),
  business_type: z.string().trim().min(1, "Business type is required."),
  product_motion: z
    .enum(["reserva", "venta", "viva_med", "combined"])
    .default("combined"),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  timezone: z.string().trim().default("America/Panama"),
  language: z.string().trim().default("es"),
  human_fallback_number: z.string().trim().optional(),
  pilot_goal: z.string().trim().max(240).optional(),
  compliance_acknowledgement: z.literal("on", {
    message: "Confirm the compliance and human fallback requirements.",
  }),
});

export async function completeOnboarding(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = onboardingSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to finish onboarding." };
  }

  const values = parsed.data;

  const { data: tenantId, error } = await supabase.rpc("create_tenant_with_owner", {
    p_business_name: values.business_name,
    p_business_type: values.business_type,
    p_city: values.city || null,
    p_country: values.country || null,
    p_timezone: values.timezone,
    p_language: values.language,
    p_human_fallback_number: values.human_fallback_number || null,
  });

  if (error) {
    return { error: error.message };
  }

  if (tenantId) {
    const restrictedBusinessTypes = new Set([
      "clinic",
      "dental",
      "mental_health",
      "med_spa",
      "home_health",
      "pharmacy",
      "beauty",
      "legal",
      "insurance",
    ]);
    const needsReview = restrictedBusinessTypes.has(values.business_type);

    await Promise.all([
      supabase.from("platform_events").insert({
        tenant_id: tenantId,
        event_type: "customer_onboarding_completed",
        severity: "info",
        source: "onboarding",
        message: "Tenant completed customer-facing onboarding in safe mode.",
        metadata: {
          product_motion: values.product_motion,
          pilot_goal: values.pilot_goal || null,
          compliance_acknowledged: true,
          live_activation_enabled: false,
        },
      }),
      supabase.from("compliance_reviews").insert({
        tenant_id: tenantId,
        review_type: "tenant_activation",
        status: needsReview ? "needs_review" : "pending",
        restricted_category: needsReview ? values.business_type : null,
        notes: needsReview
          ? "Business category requires human review before any live AI, WhatsApp, voice, booking, or payment automation."
          : "Customer acknowledged compliance requirements during onboarding. Human review still required before live activation.",
        metadata: {
          product_motion: values.product_motion,
          compliance_acknowledged: true,
          pilot_goal: values.pilot_goal || null,
        },
      }),
      supabase.from("provider_activation_states").upsert(
        [
          {
            tenant_id: tenantId,
            provider_key: "stripe_checkout",
            provider_name: "Stripe checkout",
            category: "payments",
            status: "not_configured",
            live_enabled: false,
            requires_review: true,
            checklist: [
              "Use Stripe test mode first.",
              "Create checkout/payment draft only.",
              "Do not route live funds until platform payout policy is approved.",
            ],
            metadata: { recommended_first_lane: values.product_motion !== "reserva" },
          },
          {
            tenant_id: tenantId,
            provider_key: "calcom",
            provider_name: "Cal.com booking sync",
            category: "booking",
            status: "not_configured",
            live_enabled: false,
            requires_review: true,
            checklist: [
              "Use test/sandbox booking records first.",
              "Confirm services, timezone, and human fallback.",
              "Do not write live calendar events until reviewed.",
            ],
            metadata: { recommended_first_lane: values.product_motion !== "venta" },
          },
        ],
        { onConflict: "tenant_id,provider_key" },
      ),
    ]);
  }

  redirect("/dashboard");
}
