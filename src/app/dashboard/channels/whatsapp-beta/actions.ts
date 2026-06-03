"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";
import { createConversationWithInitialMessage } from "@/lib/server/conversation-runtime";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

const simulatorSchema = z.object({
  customer_display_name: z.string().trim().optional().transform((value) => value || null),
  customer_phone: z.string().trim().min(5, "Phone is required for the WhatsApp simulator."),
  customer_email: z.string().trim().optional().transform((value) => value || null),
  intent: z
    .enum(["unknown", "booking", "sales", "support", "handoff"])
    .default("unknown"),
  summary: z.string().trim().optional().transform((value) => value || null),
  body: z.string().trim().min(2, "Message is required."),
});

async function requireWhatsappBetaEditor() {
  const tenantContext = await requireTenantContext();

  if (!canManageTenant(tenantContext.role)) {
    return {
      error: "Only owners and admins can prepare WhatsApp beta connections.",
      tenantContext,
    };
  }

  return { tenantContext };
}

export async function prepareWhatsappBetaLane(
  _previousState?: ActionState,
  _formData?: FormData,
): Promise<ActionState> {
  void _previousState;
  void _formData;

  const editor = await requireWhatsappBetaEditor();
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const externalId = `unipile-beta-${tenantId}`;
  const supabase = await createClient();

  const { data: existingBinding, error: existingError } = await supabase
    .from("channel_bindings")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("channel", "whatsapp")
    .eq("provider", "unipile_beta")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    return { error: existingError.message };
  }

  const bindingResult = existingBinding
    ? { data: existingBinding, error: null }
    : await supabase
        .from("channel_bindings")
        .insert({
          tenant_id: tenantId,
          channel: "whatsapp",
          provider: "unipile_beta",
          external_id: externalId,
          status: "pending_credentials",
        })
        .select("*")
        .single();

  if (bindingResult.error || !bindingResult.data) {
    return {
      error: bindingResult.error?.message ?? "Could not create beta binding.",
    };
  }

  const hasCredentials = Boolean(
    process.env.UNIPILE_API_KEY && process.env.UNIPILE_DSN,
  );

  const { error: sessionError } = await supabase
    .from("whatsapp_beta_sessions")
    .upsert(
      {
        tenant_id: tenantId,
        channel_binding_id: bindingResult.data.id,
        provider: "unipile",
        connection_method: "hosted_auth",
        status: hasCredentials ? "ready_to_connect" : "pending_credentials",
        metadata: {
          note: "Unipile beta lane prepared. Live auth link generation is disabled until credentials are configured.",
        },
      },
      { onConflict: "channel_binding_id" },
    );

  if (sessionError) {
    return { error: sessionError.message };
  }

  revalidatePath("/dashboard/channels");
  revalidatePath("/dashboard/channels/whatsapp-beta");

  return {
    success: hasCredentials
      ? "WhatsApp beta lane prepared. Credentials are present, but live auth generation is still intentionally off."
      : "WhatsApp beta lane prepared. Add Unipile credentials later to generate a connection link.",
  };
}

export async function pauseWhatsappBetaLane(
  _previousState?: ActionState,
  _formData?: FormData,
): Promise<ActionState> {
  void _previousState;
  void _formData;

  const editor = await requireWhatsappBetaEditor();
  if (editor.error) return { error: editor.error };

  const tenantId = editor.tenantContext.tenant.id;
  const supabase = await createClient();
  const { error } = await supabase
    .from("whatsapp_beta_sessions")
    .update({ status: "paused" })
    .eq("tenant_id", tenantId);

  if (error) return { error: error.message };

  await supabase
    .from("channel_bindings")
    .update({ status: "paused" })
    .eq("tenant_id", tenantId)
    .eq("provider", "unipile_beta")
    .eq("channel", "whatsapp");

  revalidatePath("/dashboard/channels");
  revalidatePath("/dashboard/channels/whatsapp-beta");
  return { success: "WhatsApp beta lane paused." };
}

export async function simulateWhatsappInbound(
  _previousState?: ActionState,
  formData?: FormData,
): Promise<ActionState> {
  void _previousState;

  const editor = await requireWhatsappBetaEditor();
  if (editor.error) return { error: editor.error };

  if (!formData) return { error: "Missing simulator form." };

  const parsed = simulatorSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the inbound simulator.",
    };
  }

  const tenantId = editor.tenantContext.tenant.id;
  const supabase = await createClient();
  const { data: binding, error: bindingError } = await supabase
    .from("channel_bindings")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("channel", "whatsapp")
    .eq("provider", "unipile_beta")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (bindingError) return { error: bindingError.message };
  if (!binding) {
    return {
      error: "Prepare the WhatsApp beta lane first, then simulate inbound messages.",
    };
  }

  try {
    await createConversationWithInitialMessage(supabase, {
      tenantId,
      channel: "whatsapp",
      channelBindingId: binding.id,
      customerDisplayName: parsed.data.customer_display_name,
      customerPhone: parsed.data.customer_phone,
      customerEmail: parsed.data.customer_email,
      intent: parsed.data.intent,
      summary: parsed.data.summary,
      initialMessage: parsed.data.body,
      metadata: {
        source: "whatsapp_beta_simulator",
        provider: "unipile_beta",
      },
    });
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not simulate inbound WhatsApp message.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/channels");
  revalidatePath("/dashboard/channels/whatsapp-beta");
  revalidatePath("/dashboard/conversations");
  revalidatePath("/dashboard/customers");
  return { success: "Inbound WhatsApp test message captured in the inbox." };
}
