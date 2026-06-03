import { createClient } from "@/lib/supabase/server";
import {
  getWebhookUrls,
  hasCalcomConfig,
  hasN8nConfig,
  hasOfficialWhatsappConfig,
  hasOpenAiConfig,
  hasStripeConfig,
  hasUnipileConfig,
  hasVapiConfig,
  isLiveStripeCheckoutEnabled,
  isMedicalPrivacyModeEnabled,
} from "@/lib/env";
import { MEDICAL_GO_LIVE_REVIEWS } from "@/lib/data/privacy-ops";
import type {
  OutboundMessage,
  ProviderActivationState,
  WebhookIngestEvent,
} from "@/types/database";

export type ProviderCredentialSnapshot = {
  providerKey: string;
  providerName: string;
  ready: boolean;
  webhookUrl?: string;
  missing: string[];
};

export type LaunchReadinessOverview = {
  providerStates: ProviderActivationState[];
  outboundQueue: OutboundMessage[];
  webhookEvents: WebhookIngestEvent[];
  credentialSnapshots: ProviderCredentialSnapshot[];
  readinessScore: number;
  blockers: string[];
};

function getCredentialSnapshots(): ProviderCredentialSnapshot[] {
  const webhookUrls = getWebhookUrls();

  return [
    {
      providerKey: "unipile",
      providerName: "Unipile WhatsApp beta",
      ready: hasUnipileConfig(),
      webhookUrl: webhookUrls.unipile,
      missing: [
        !process.env.UNIPILE_API_KEY ? "UNIPILE_API_KEY" : null,
        !process.env.UNIPILE_DSN ? "UNIPILE_DSN" : null,
        !process.env.UNIPILE_WEBHOOK_SECRET ? "UNIPILE_WEBHOOK_SECRET" : null,
      ].filter(Boolean) as string[],
    },
    {
      providerKey: "official_whatsapp",
      providerName: "Official WhatsApp",
      ready: hasOfficialWhatsappConfig(),
      missing: [
        !process.env.DIALOG_API_KEY &&
        !(
          process.env.WHATSAPP_CLOUD_API_TOKEN &&
          process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
        )
          ? "DIALOG_API_KEY or WhatsApp Cloud API credentials"
          : null,
      ].filter(Boolean) as string[],
    },
    {
      providerKey: "vapi",
      providerName: "Vapi voice",
      ready: hasVapiConfig(),
      missing: [!process.env.VAPI_API_KEY ? "VAPI_API_KEY" : null].filter(Boolean) as string[],
    },
    {
      providerKey: "openai",
      providerName: "OpenAI runtime",
      ready: hasOpenAiConfig(),
      missing: [!process.env.OPENAI_API_KEY ? "OPENAI_API_KEY" : null].filter(Boolean) as string[],
    },
    {
      providerKey: "stripe_checkout",
      providerName: "Stripe checkout",
      ready: hasStripeConfig(),
      webhookUrl: webhookUrls.stripe,
      missing: [
        !process.env.STRIPE_SECRET_KEY ? "STRIPE_SECRET_KEY" : null,
        !process.env.STRIPE_WEBHOOK_SECRET ? "STRIPE_WEBHOOK_SECRET" : null,
      ].filter(Boolean) as string[],
    },
    {
      providerKey: "stripe_billing",
      providerName: "Stripe billing",
      ready: hasStripeConfig(),
      missing: [
        !process.env.STRIPE_SECRET_KEY ? "STRIPE_SECRET_KEY" : null,
        !process.env.STRIPE_WEBHOOK_SECRET ? "STRIPE_WEBHOOK_SECRET" : null,
      ].filter(Boolean) as string[],
    },
    {
      providerKey: "n8n",
      providerName: "n8n automations",
      ready: hasN8nConfig(),
      missing: [!process.env.N8N_WEBHOOK_URL ? "N8N_WEBHOOK_URL" : null].filter(Boolean) as string[],
    },
    {
      providerKey: "calcom",
      providerName: "Cal.com booking sync",
      ready: hasCalcomConfig(),
      webhookUrl: webhookUrls.calcom,
      missing: [
        !process.env.CALCOM_API_KEY ? "CALCOM_API_KEY" : null,
        !process.env.CALCOM_WEBHOOK_SECRET ? "CALCOM_WEBHOOK_SECRET" : null,
      ].filter(Boolean) as string[],
    },
  ];
}

export async function getLaunchReadinessOverview(
  tenantId: string,
): Promise<LaunchReadinessOverview> {
  const supabase = await createClient();

  const [providerStates, outboundQueue, webhookEvents, medicalReviews] = await Promise.all([
    supabase
      .from("provider_activation_states")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("provider_key", { ascending: true }),
    supabase
      .from("outbound_messages")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("webhook_ingest_events")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("compliance_reviews")
      .select("review_type,status")
      .eq("tenant_id", tenantId)
      .in(
        "review_type",
        MEDICAL_GO_LIVE_REVIEWS.map((review) => review.reviewType),
      ),
  ]);

  for (const result of [providerStates, outboundQueue, webhookEvents, medicalReviews]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const credentialSnapshots = getCredentialSnapshots();
  const providerData = providerStates.data ?? [];
  const blockers: string[] = [];

  if (!credentialSnapshots.some((snapshot) => snapshot.ready)) {
    blockers.push("No live provider credentials are configured yet.");
  }

  if (!isMedicalPrivacyModeEnabled()) {
    blockers.push("Medical privacy mode is not enabled.");
  }

  if (hasStripeConfig() && !isLiveStripeCheckoutEnabled()) {
    blockers.push("Stripe credentials are present, but live checkout is still gated off.");
  }

  const approvedMedicalReviewTypes = new Set(
    (medicalReviews.data ?? [])
      .filter((review) => review.status === "approved")
      .map((review) => review.review_type),
  );
  const missingMedicalReviews = MEDICAL_GO_LIVE_REVIEWS.filter(
    (review) => !approvedMedicalReviewTypes.has(review.reviewType),
  );

  if (missingMedicalReviews.length > 0) {
    blockers.push("Medical privacy approvals are incomplete.");
  }

  if ((outboundQueue.data ?? []).some((message) => message.review_status === "draft")) {
    blockers.push("There are reviewed outbound replies still waiting for approval.");
  }

  if ((webhookEvents.data ?? []).length === 0) {
    blockers.push("No webhook activity has been recorded yet.");
  }

  if (providerData.some((provider) => provider.requires_review && !provider.live_enabled)) {
    blockers.push("Provider activation remains review-gated for every live surface.");
  }

  const readinessChecks = [
    credentialSnapshots.some((snapshot) => snapshot.ready),
    (webhookEvents.data ?? []).length > 0,
    !(outboundQueue.data ?? []).some((message) => message.review_status === "draft"),
    providerData.length > 0,
    isMedicalPrivacyModeEnabled(),
    missingMedicalReviews.length === 0,
  ];

  const readinessScore = Math.round(
    (readinessChecks.filter(Boolean).length / readinessChecks.length) * 100,
  );

  return {
    providerStates: providerData,
    outboundQueue: outboundQueue.data ?? [],
    webhookEvents: webhookEvents.data ?? [],
    credentialSnapshots,
    readinessScore,
    blockers,
  };
}
