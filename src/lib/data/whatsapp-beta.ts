import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/lib/env";
import type { ChannelBinding, WhatsappBetaSession } from "@/types/database";

export type WhatsappBetaSetup = {
  binding: ChannelBinding | null;
  session: WhatsappBetaSession | null;
  hasUnipileCredentials: boolean;
  hasWebhookSecret: boolean;
  webhookUrl: string;
};

export async function getWhatsappBetaSetup(
  tenantId: string,
): Promise<WhatsappBetaSetup> {
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

  if (bindingError) {
    throw new Error(bindingError.message);
  }

  const { data: session, error: sessionError } = binding
    ? await supabase
        .from("whatsapp_beta_sessions")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("channel_binding_id", binding.id)
        .maybeSingle()
    : { data: null, error: null };

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  return {
    binding,
    session,
    hasUnipileCredentials: Boolean(
      process.env.UNIPILE_API_KEY && process.env.UNIPILE_DSN,
    ),
    hasWebhookSecret: Boolean(process.env.UNIPILE_WEBHOOK_SECRET),
    webhookUrl: `${getAppUrl().replace(/\/$/, "")}/api/webhooks/unipile`,
  };
}
