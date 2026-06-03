"use server";

import { revalidatePath } from "next/cache";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

async function requireFoundationEditor(feature: string) {
  const tenantContext = await requireTenantContext();

  if (!canManageTenant(tenantContext.role)) {
    return {
      error: `Only owners and admins can prepare ${feature}.`,
      tenantContext,
    };
  }

  return { tenantContext };
}

export async function prepareVoiceFoundation(): Promise<ActionState> {
  const editor = await requireFoundationEditor("voice connections");
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const supabase = await createClient();
  const externalId = `vapi-foundation-${tenantId}`;

  const { data: binding, error: bindingError } = await supabase
    .from("channel_bindings")
    .upsert(
      {
        tenant_id: tenantId,
        channel: "voice",
        provider: "vapi_foundation",
        external_id: externalId,
        status: "pending_credentials",
      },
      { onConflict: "channel,provider,external_id" },
    )
    .select("*")
    .single();

  if (bindingError || !binding) {
    return { error: bindingError?.message ?? "Could not prepare voice binding." };
  }

  const hasCredentials = Boolean(process.env.VAPI_API_KEY);
  const { error: sessionError } = await supabase
    .from("voice_beta_sessions")
    .upsert(
      {
        tenant_id: tenantId,
        channel_binding_id: binding.id,
        provider: "vapi",
        status: hasCredentials ? "ready_to_connect" : "pending_credentials",
        metadata: {
          live_api_enabled: false,
          note: "Vapi foundation prepared. No live assistant, phone number, or call flow is enabled.",
        },
      },
      { onConflict: "channel_binding_id" },
    );

  if (sessionError) return { error: sessionError.message };

  revalidatePath("/dashboard/channels");
  revalidatePath("/dashboard/channels/voice");
  return {
    success: "Vapi voice foundation prepared. No live calls or paid phone provisioning were activated.",
  };
}

export async function prepareAiToolsFoundation(): Promise<ActionState> {
  const editor = await requireFoundationEditor("AI tools");
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const supabase = await createClient();
  const toolRows = [
    {
      tool_key: "catalog_search",
      name: "Catalog search",
      description: "Future tool for answering product and service questions from tenant catalog data.",
    },
    {
      tool_key: "handoff_request",
      name: "Human handoff",
      description: "Future tool for escalating conversations to the business fallback contact.",
    },
    {
      tool_key: "order_draft",
      name: "Order draft",
      description: "Future tool for building carts before payment links are generated.",
    },
  ].map((tool) => ({
    ...tool,
    tenant_id: tenantId,
    status: "draft" as const,
    config: { live_api_enabled: false },
  }));

  const { error } = await supabase
    .from("ai_tool_configs")
    .upsert(toolRows, { onConflict: "tenant_id,tool_key" });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/ai-tools");
  return {
    success: "AI tool foundations prepared. No OpenAI calls or autonomous tools were enabled.",
  };
}

export async function prepareOrdersPaymentsFoundation(): Promise<ActionState> {
  const editor = await requireFoundationEditor("orders and payment links");
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const supabase = await createClient();

  const { error } = await supabase.from("orders").insert({
    tenant_id: tenantId,
    customer_display_name: "Demo customer",
    customer_phone: editor.tenantContext.settings?.human_fallback_number ?? null,
    status: "draft",
    currency: "USD",
    subtotal_amount: 0,
    total_amount: 0,
    payment_provider: "stripe",
    metadata: {
      demo: true,
      live_api_enabled: false,
      note: "Draft order foundation only. No payment link was created.",
    },
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/orders");
  return {
    success: "Order and Stripe payment-link foundation prepared. No Stripe payment link or charge was created.",
  };
}

export async function prepareAutomationsFoundation(): Promise<ActionState> {
  const editor = await requireFoundationEditor("automations");
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const supabase = await createClient();
  const workflows = [
    {
      workflow_key: "owner_notification",
      name: "Owner notification",
      trigger_type: "payment_or_handoff",
      config: { live_webhook_enabled: false },
    },
    {
      workflow_key: "booking_followup_queue",
      name: "Booking follow-up queue",
      trigger_type: "conversation_intent",
      config: { live_webhook_enabled: false, requires_opt_in: true },
    },
    {
      workflow_key: "daily_digest",
      name: "Daily business digest",
      trigger_type: "schedule",
      config: { live_webhook_enabled: false },
    },
  ].map((workflow) => ({
    ...workflow,
    tenant_id: tenantId,
    provider: "n8n",
    status: "draft" as const,
  }));

  const { error } = await supabase
    .from("automation_workflows")
    .upsert(workflows, { onConflict: "tenant_id,workflow_key" });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/automations");
  return {
    success: "n8n automation foundations prepared. No workflows or webhooks were activated.",
  };
}

export async function prepareBillingFoundation(): Promise<ActionState> {
  const editor = await requireFoundationEditor("billing");
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const supabase = await createClient();
  const hasCredentials = Boolean(process.env.STRIPE_SECRET_KEY);

  const { error } = await supabase.from("billing_accounts").upsert(
    {
      tenant_id: tenantId,
      provider: "stripe",
      status: hasCredentials ? "ready" : "pending_credentials",
      plan: editor.tenantContext.tenant.plan ?? "starter",
      metadata: {
        live_api_enabled: false,
        note: "Stripe billing foundation only. No customer, subscription, checkout session, or charge was created.",
      },
    },
    { onConflict: "tenant_id" },
  );

  if (error) return { error: error.message };

  revalidatePath("/dashboard/billing");
  return {
    success: "Stripe billing foundation prepared. No live Stripe customer, subscription, or charge was created.",
  };
}

export async function prepareBookingFoundation(): Promise<ActionState> {
  const editor = await requireFoundationEditor("booking sync");
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const timezone =
    editor.tenantContext.settings?.tenant_id && editor.tenantContext.tenant.timezone
      ? editor.tenantContext.tenant.timezone
      : "America/Panama";
  const supabase = await createClient();
  const hasCredentials = Boolean(process.env.CALCOM_API_KEY);

  const { data: config, error: configError } = await supabase
    .from("booking_sync_configs")
    .upsert(
      {
        tenant_id: tenantId,
        provider: "cal_com",
        status: hasCredentials ? "ready" : "pending_credentials",
        booking_url: editor.tenantContext.settings?.booking_url ?? null,
        default_duration_minutes: 30,
        timezone,
        metadata: {
          live_api_enabled: false,
          note: "Cal.com booking foundation only. No event type, webhook, or booking sync is active.",
        },
      },
      { onConflict: "tenant_id,provider" },
    )
    .select("*")
    .single();

  if (configError || !config) {
    return { error: configError?.message ?? "Could not prepare booking sync." };
  }

  const { count, error: countError } = await supabase
    .from("booking_records")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("metadata->>demo", "true");

  if (countError) return { error: countError.message };

  if (!count) {
    const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);

    const { error: bookingError } = await supabase
      .from("booking_records")
      .insert({
        tenant_id: tenantId,
        booking_sync_config_id: config.id,
        customer_display_name: "Demo booking customer",
        customer_phone: editor.tenantContext.settings?.human_fallback_number ?? null,
        service_name: "Demo consultation",
        status: "draft",
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        timezone,
        metadata: {
          demo: true,
          live_api_enabled: false,
          note: "Draft booking record only. Not synced to Cal.com.",
        },
      });

    if (bookingError) return { error: bookingError.message };
  }

  revalidatePath("/dashboard/bookings");
  return {
    success: "Cal.com booking foundation prepared. No live calendar sync, webhook, or booking was created.",
  };
}

export async function prepareOfficialWhatsappFoundation(): Promise<ActionState> {
  const editor = await requireFoundationEditor("official WhatsApp");
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const supabase = await createClient();
  const externalId = `official-whatsapp-${tenantId}`;

  const { data: binding, error: bindingError } = await supabase
    .from("channel_bindings")
    .upsert(
      {
        tenant_id: tenantId,
        channel: "whatsapp",
        provider: "360dialog_foundation",
        external_id: externalId,
        status: "pending_review",
      },
      { onConflict: "channel,provider,external_id" },
    )
    .select("*")
    .single();

  if (bindingError || !binding) {
    return {
      error: bindingError?.message ?? "Could not prepare official WhatsApp.",
    };
  }

  const { error } = await supabase.from("official_whatsapp_configs").upsert(
    {
      tenant_id: tenantId,
      channel_binding_id: binding.id,
      provider: "360dialog",
      status: "pending_review",
      metadata: {
        live_api_enabled: false,
        note: "Official WhatsApp foundation only. No Meta or 360dialog onboarding is active.",
      },
    },
    { onConflict: "channel_binding_id" },
  );

  if (error) return { error: error.message };

  revalidatePath("/dashboard/channels/official-whatsapp");
  revalidatePath("/dashboard/channels");
  return {
    success: "Official WhatsApp foundation prepared. No Meta, Cloud API, or 360dialog connection was activated.",
  };
}

export async function prepareCustomersFoundation(): Promise<ActionState> {
  const editor = await requireFoundationEditor("customers");
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const supabase = await createClient();

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert(
      {
        tenant_id: tenantId,
        display_name: "Demo customer",
        phone: editor.tenantContext.settings?.human_fallback_number ?? "+5070000000",
        source: "foundation_seed",
        status: "active",
        metadata: { demo: true, live_api_enabled: false },
      },
      { onConflict: "tenant_id,phone" },
    )
    .select("*")
    .single();

  if (customerError || !customer) {
    return { error: customerError?.message ?? "Could not prepare customer." };
  }

  const { error: consentError } = await supabase.from("consent_records").upsert(
    {
      tenant_id: tenantId,
      customer_id: customer.id,
      channel: "whatsapp",
      consent_type: "customer_service",
      status: "unknown",
      source: "foundation_seed",
      metadata: {
        demo: true,
        note: "Consent is unknown until captured explicitly.",
      },
    },
    { onConflict: "id" },
  );

  if (consentError) return { error: consentError.message };

  revalidatePath("/dashboard/customers");
  return {
    success: "Customer foundation prepared with consent tracking placeholder.",
  };
}

export async function prepareComplianceFoundation(): Promise<ActionState> {
  const editor = await requireFoundationEditor("compliance");
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const supabase = await createClient();

  const { error } = await supabase.from("compliance_reviews").insert({
    tenant_id: tenantId,
    review_type: "activation",
    status: "pending",
    notes:
      "Foundation review only. Medical clients are allowed, but PHI-capable workflows require BAA, MFA, provider, retention, and incident response approval before live activation.",
    metadata: {
      live_activation_allowed: false,
      restricted_categories_reviewed: false,
      medical_categories_allowed: true,
      phi_capable_workflows_review_required: true,
    },
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/compliance");
  return {
    success: "Compliance foundation prepared. Live activation remains blocked until review is approved.",
  };
}

export async function prepareActivationConsoleFoundation(): Promise<ActionState> {
  const editor = await requireFoundationEditor("provider activation");
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const supabase = await createClient();
  const providers = [
    ["unipile", "Unipile WhatsApp beta", "messaging"],
    ["official_whatsapp", "Official WhatsApp / 360dialog", "messaging"],
    ["vapi", "Vapi voice", "voice"],
    ["openai", "OpenAI agent runtime", "ai"],
    ["stripe_checkout", "Stripe payment links", "payments"],
    ["stripe_billing", "Stripe billing", "billing"],
    ["n8n", "n8n automations", "automation"],
    ["calcom", "Cal.com booking sync", "booking"],
  ].map(([provider_key, provider_name, category]) => ({
    tenant_id: tenantId,
    provider_key,
    provider_name,
    category,
    status: "pending_credentials" as const,
    live_enabled: false,
    requires_review: true,
    checklist: [
      "Credentials added",
      "BAA/HIPAA posture approved where PHI may flow",
      "MFA and provider console access reviewed",
      "Compliance and human fallback approved",
      "Payload fields avoid PHI unless the provider path is approved",
      "Test mode passed",
      "Owner approved activation",
    ],
    metadata: {
      foundation_only: true,
      live_enabled_default: false,
      medical_privacy_review_required: true,
    },
  }));

  const { error } = await supabase
    .from("provider_activation_states")
    .upsert(providers, { onConflict: "tenant_id,provider_key" });

  if (error) return { error: error.message };

  await supabase.from("platform_events").insert({
    tenant_id: tenantId,
    event_type: "activation_console_prepared",
    severity: "info",
    source: "codex_foundation",
    message: "Provider activation console foundations prepared with live activation disabled.",
    metadata: { live_enabled: false },
  });

  revalidatePath("/dashboard/activation");
  revalidatePath("/dashboard/admin");
  return {
    success: "Activation console prepared. All providers remain disabled until explicitly activated.",
  };
}
