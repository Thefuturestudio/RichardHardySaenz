"use server";

import { revalidatePath } from "next/cache";
import {
  getAppUrl,
  hasCalcomConfig,
  hasN8nConfig,
  hasOfficialWhatsappConfig,
  hasOpenAiConfig,
  hasStripeConfig,
  hasUnipileConfig,
  hasVapiConfig,
  isLiveStripeCheckoutEnabled,
} from "@/lib/env";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

async function requireLaunchManager() {
  const tenantContext = await requireTenantContext();

  if (!canManageTenant(tenantContext.role)) {
    return {
      error: "Only owners and admins can manage launch readiness.",
      tenantContext,
    };
  }

  return { tenantContext };
}

function revalidateLaunchUi() {
  revalidatePath("/dashboard/provider-credentials");
  revalidatePath("/dashboard/webhooks");
  revalidatePath("/dashboard/outbox");
  revalidatePath("/dashboard/go-live");
  revalidatePath("/dashboard/test-center");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/activation");
}

function getWebhookSimulationHeaders(envName: string) {
  const secret = process.env[envName]?.trim();

  if (!secret) return null;

  return {
    "content-type": "application/json",
    "x-viva-webhook-secret": secret,
  };
}

export async function syncProviderReadiness(): Promise<ActionState> {
  const manager = await requireLaunchManager();
  if (manager.error) return { error: manager.error };

  const supabase = await createClient();
  const tenantId = manager.tenantContext.tenant.id;
  const readinessMap = {
    unipile: hasUnipileConfig(),
    official_whatsapp: hasOfficialWhatsappConfig(),
    vapi: hasVapiConfig(),
    openai: hasOpenAiConfig(),
    stripe_checkout: hasStripeConfig() && isLiveStripeCheckoutEnabled(),
    stripe_billing: hasStripeConfig(),
    n8n: hasN8nConfig(),
    calcom: hasCalcomConfig(),
  } as const;

  const { error } = await Promise.all(
    Object.entries(readinessMap).map(([providerKey, ready]) =>
      supabase
        .from("provider_activation_states")
        .update({
          status: ready ? "ready" : "pending_credentials",
          metadata: {
            last_synced_at: new Date().toISOString(),
            credentials_ready: ready,
            foundation_only: true,
          },
        })
        .eq("tenant_id", tenantId)
        .eq("provider_key", providerKey),
    ),
  ).then((results) => ({
    error: results.find((result) => result.error)?.error ?? null,
  }));

  if (error) return { error: error.message };

  await supabase.from("platform_events").insert({
    tenant_id: tenantId,
    event_type: "provider_readiness_synced",
    severity: "info",
    source: "launch_console",
    message: "Provider readiness synced against current environment configuration.",
    metadata: readinessMap,
  });

  revalidateLaunchUi();
  return { success: "Provider readiness synced." };
}

export async function simulateUnipileWebhook(): Promise<ActionState> {
  const manager = await requireLaunchManager();
  if (manager.error) return { error: manager.error };

  const headers = getWebhookSimulationHeaders("UNIPILE_WEBHOOK_SECRET");
  if (!headers) {
    return {
      error: "Configure UNIPILE_WEBHOOK_SECRET before running the Unipile webhook test.",
    };
  }

  const response = await fetch(`${getAppUrl()}/api/webhooks/unipile`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      event_type: "message.received",
      tenant_id: manager.tenantContext.tenant.id,
      external_conversation_id: `launch-test-${Date.now()}`,
      external_message_id: `launch-message-${Date.now()}`,
      direction: "inbound",
      from_name: "Launch Test Customer",
      from_phone: "+50769990000",
      text: "Testing the live-ready Unipile webhook route.",
      summary: "Launch console webhook test",
      intent: "sales",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return { error: `Unipile webhook test failed with status ${response.status}.` };
  }

  revalidateLaunchUi();
  revalidatePath("/dashboard/conversations");
  return { success: "Unipile webhook test delivered into the inbox." };
}

export async function simulateCalcomWebhook(): Promise<ActionState> {
  const manager = await requireLaunchManager();
  if (manager.error) return { error: manager.error };

  const headers = getWebhookSimulationHeaders("CALCOM_WEBHOOK_SECRET");
  if (!headers) {
    return {
      error: "Configure CALCOM_WEBHOOK_SECRET before running the Cal.com webhook test.",
    };
  }

  const supabase = await createClient();
  const tenantId = manager.tenantContext.tenant.id;
  const { data: booking, error: bookingError } = await supabase
    .from("booking_records")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (bookingError || !booking) {
    return { error: bookingError?.message ?? "No booking record is available to test." };
  }

  const externalBookingId = booking.external_booking_id ?? `launch-cal-${Date.now()}`;

  const { error: updateError } = await supabase
    .from("booking_records")
    .update({ external_booking_id: externalBookingId })
    .eq("id", booking.id)
    .eq("tenant_id", tenantId);

  if (updateError) return { error: updateError.message };

  const response = await fetch(`${getAppUrl()}/api/webhooks/calcom`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      event_type: "booking.confirmed",
      tenant_id: tenantId,
      external_booking_id: externalBookingId,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return { error: `Cal.com webhook test failed with status ${response.status}.` };
  }

  revalidateLaunchUi();
  revalidatePath("/dashboard/bookings");
  return { success: "Cal.com webhook test synced a booking confirmation." };
}

export async function simulateStripeWebhook(): Promise<ActionState> {
  const manager = await requireLaunchManager();
  if (manager.error) return { error: manager.error };

  const headers = getWebhookSimulationHeaders("STRIPE_WEBHOOK_SECRET");
  if (!headers) {
    return {
      error: "Configure STRIPE_WEBHOOK_SECRET before running the Stripe webhook test.",
    };
  }

  const supabase = await createClient();
  const tenantId = manager.tenantContext.tenant.id;
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError || !order) {
    return { error: orderError?.message ?? "No order is available to test." };
  }

  const response = await fetch(`${getAppUrl()}/api/webhooks/stripe`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      type: "checkout.session.completed",
      data: {
        object: {
          id: `launch-checkout-${Date.now()}`,
          metadata: {
            tenant_id: tenantId,
            order_id: order.id,
          },
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return { error: `Stripe webhook test failed with status ${response.status}.` };
  }

  revalidateLaunchUi();
  revalidatePath("/dashboard/orders");
  return { success: "Stripe webhook test marked the latest order as paid." };
}
