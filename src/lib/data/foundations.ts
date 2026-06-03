import { createClient } from "@/lib/supabase/server";
import type {
  AiToolConfig,
  AutomationWorkflow,
  BillingAccount,
  BookingRecord,
  BookingSyncConfig,
  ChannelBinding,
  ComplianceReview,
  ConsentRecord,
  Customer,
  OfficialWhatsappConfig,
  Order,
  PlatformEvent,
  ProviderActivationState,
  VoiceBetaSession,
} from "@/types/database";

export type VoiceFoundationSetup = {
  binding: ChannelBinding | null;
  session: VoiceBetaSession | null;
  hasVapiCredentials: boolean;
};

export type FoundationsOverview = {
  aiTools: AiToolConfig[];
  automations: AutomationWorkflow[];
  billingAccount: BillingAccount | null;
  orders: Order[];
  bookingConfig: BookingSyncConfig | null;
  bookings: BookingRecord[];
  officialWhatsappConfig: OfficialWhatsappConfig | null;
  officialWhatsappBinding: ChannelBinding | null;
  customers: Customer[];
  consentRecords: ConsentRecord[];
  complianceReviews: ComplianceReview[];
  providerActivations: ProviderActivationState[];
  platformEvents: PlatformEvent[];
};

export async function getVoiceFoundationSetup(
  tenantId: string,
): Promise<VoiceFoundationSetup> {
  const supabase = await createClient();

  const { data: binding, error: bindingError } = await supabase
    .from("channel_bindings")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("channel", "voice")
    .eq("provider", "vapi_foundation")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (bindingError) throw new Error(bindingError.message);

  const { data: session, error: sessionError } = binding
    ? await supabase
        .from("voice_beta_sessions")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("channel_binding_id", binding.id)
        .maybeSingle()
    : { data: null, error: null };

  if (sessionError) throw new Error(sessionError.message);

  return {
    binding,
    session,
    hasVapiCredentials: Boolean(process.env.VAPI_API_KEY),
  };
}

export async function getFoundationsOverview(
  tenantId: string,
): Promise<FoundationsOverview> {
  const supabase = await createClient();

  const [
    aiTools,
    automations,
    billingAccount,
    orders,
    bookingConfig,
    bookings,
    officialWhatsappBinding,
    customers,
    consentRecords,
    complianceReviews,
    providerActivations,
    platformEvents,
  ] = await Promise.all([
    supabase
      .from("ai_tool_configs")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: true }),
    supabase
      .from("automation_workflows")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: true }),
    supabase
      .from("billing_accounts")
      .select("*")
      .eq("tenant_id", tenantId)
      .maybeSingle(),
      supabase
        .from("orders")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("booking_sync_configs")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("provider", "cal_com")
        .maybeSingle(),
      supabase
        .from("booking_records")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("channel_bindings")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("channel", "whatsapp")
        .eq("provider", "360dialog_foundation")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("customers")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(12),
      supabase
        .from("consent_records")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(12),
      supabase
        .from("compliance_reviews")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(12),
      supabase
        .from("provider_activation_states")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("provider_key", { ascending: true }),
      supabase
        .from("platform_events")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const officialWhatsappConfig = officialWhatsappBinding.data
    ? await supabase
        .from("official_whatsapp_configs")
        .select("*")
        .eq("tenant_id", tenantId)
        .eq("channel_binding_id", officialWhatsappBinding.data.id)
        .maybeSingle()
    : { data: null, error: null };

  for (const result of [
    aiTools,
    automations,
    billingAccount,
    orders,
    bookingConfig,
    bookings,
    officialWhatsappBinding,
    officialWhatsappConfig,
    customers,
    consentRecords,
    complianceReviews,
    providerActivations,
    platformEvents,
  ]) {
    if (result.error) throw new Error(result.error.message);
  }

  return {
    aiTools: aiTools.data ?? [],
    automations: automations.data ?? [],
    billingAccount: billingAccount.data ?? null,
    orders: orders.data ?? [],
    bookingConfig: bookingConfig.data ?? null,
    bookings: bookings.data ?? [],
    officialWhatsappBinding: officialWhatsappBinding.data ?? null,
    officialWhatsappConfig: officialWhatsappConfig.data ?? null,
    customers: customers.data ?? [],
    consentRecords: consentRecords.data ?? [],
    complianceReviews: complianceReviews.data ?? [],
    providerActivations: providerActivations.data ?? [],
    platformEvents: platformEvents.data ?? [],
  };
}
