import { createClient } from "@/lib/supabase/server";
import { hasDevPreviewSession } from "@/lib/dev-preview-session";
import { isMedicalPrivacyModeEnabled } from "@/lib/env";
import type {
  ComplianceReview,
  DataPrivacyRequest,
  ProviderActivationState,
  TenantSettings,
} from "@/types/database";

export const MEDICAL_GO_LIVE_REVIEWS = [
  {
    reviewType: "baa_stack",
    title: "BAA and legal packet",
    notes:
      "Customer contract, BAA, subprocessor list, privacy policy, and terms are reviewed before PHI flows.",
  },
  {
    reviewType: "supabase_hipaa_project",
    title: "Supabase HIPAA project",
    notes:
      "Supabase BAA, HIPAA project setup, MFA, PITR, SSL, network controls, and storage rules are approved.",
  },
  {
    reviewType: "hosting_hipaa_review",
    title: "Hosting and deployment review",
    notes:
      "Production hosting, logs, deployment access, and BAA/shared-responsibility controls are approved.",
  },
  {
    reviewType: "provider_baa_matrix",
    title: "Provider BAA matrix",
    notes:
      "Every PHI-touching provider has a reviewed agreement, data category, region, retention, and logging posture.",
  },
  {
    reviewType: "mfa_enforcement",
    title: "MFA enforcement",
    notes:
      "MFA is enforced for platform owner, Supabase, deployment, payment, AI, messaging, booking, and support consoles.",
  },
  {
    reviewType: "privacy_request_workflow",
    title: "Retention, export, and delete workflow",
    notes:
      "Privacy request tracking, retention review, export handling, and safe deletion/de-identification process are ready.",
  },
  {
    reviewType: "incident_response",
    title: "Incident response",
    notes:
      "Incident owner, first-hour process, evidence capture, notification review, and tabletop drill are recorded.",
  },
] as const;

export type MedicalGoLiveCheck = {
  key: string;
  label: string;
  status: "pass" | "blocked" | "warning";
  detail: string;
};

export type PrivacyOperationsOverview = {
  privacyRequests: DataPrivacyRequest[];
  complianceReviews: ComplianceReview[];
  providerActivations: ProviderActivationState[];
  checks: MedicalGoLiveCheck[];
  blockedCount: number;
};

function reviewByType(reviews: ComplianceReview[], reviewType: string) {
  return reviews.find((review) => review.review_type === reviewType);
}

function buildChecks(
  reviews: ComplianceReview[],
  providerActivations: ProviderActivationState[],
  settings: TenantSettings | null,
): MedicalGoLiveCheck[] {
  const checks: MedicalGoLiveCheck[] = [
    {
      key: "medical_privacy_mode",
      label: "Medical privacy mode",
      status: isMedicalPrivacyModeEnabled() ? "pass" : "blocked",
      detail: isMedicalPrivacyModeEnabled()
        ? "Medical privacy mode is enabled by default."
        : "Set MEDICAL_PRIVACY_MODE=true before medical launch.",
    },
    {
      key: "human_fallback",
      label: "Human fallback",
      status: settings?.human_fallback_number ? "pass" : "blocked",
      detail: settings?.human_fallback_number
        ? "A human fallback number is configured."
        : "Add a human fallback number before any medical workflow is live.",
    },
    {
      key: "provider_live_state",
      label: "Provider live state",
      status: providerActivations.some((provider) => provider.live_enabled)
        ? "blocked"
        : "pass",
      detail: providerActivations.some((provider) => provider.live_enabled)
        ? "A provider is live-enabled before the medical checklist is complete."
        : "No provider is live-enabled.",
    },
  ];

  for (const reviewDefinition of MEDICAL_GO_LIVE_REVIEWS) {
    const review = reviewByType(reviews, reviewDefinition.reviewType);

    checks.push({
      key: reviewDefinition.reviewType,
      label: reviewDefinition.title,
      status:
        review?.status === "approved"
          ? "pass"
          : review
            ? "blocked"
            : "warning",
      detail:
        review?.status === "approved"
          ? "Approved."
          : review?.notes ?? "Prepare this approval record before PHI go-live.",
    });
  }

  return checks;
}

export async function getPrivacyOperationsOverview(
  tenantId: string,
  settings: TenantSettings | null,
): Promise<PrivacyOperationsOverview> {
  if (await hasDevPreviewSession()) {
    const checks = buildChecks([], [], settings);

    return {
      privacyRequests: [],
      complianceReviews: [],
      providerActivations: [],
      checks,
      blockedCount: checks.filter((check) => check.status === "blocked").length,
    };
  }

  const supabase = await createClient();
  const reviewTypes = MEDICAL_GO_LIVE_REVIEWS.map((review) => review.reviewType);

  const [privacyRequests, complianceReviews, providerActivations] =
    await Promise.all([
      supabase
        .from("data_privacy_requests")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("compliance_reviews")
        .select("*")
        .eq("tenant_id", tenantId)
        .in("review_type", reviewTypes),
      supabase
        .from("provider_activation_states")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("provider_key", { ascending: true }),
    ]);

  for (const result of [privacyRequests, complianceReviews, providerActivations]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const reviews = complianceReviews.data ?? [];
  const providers = providerActivations.data ?? [];
  const checks = buildChecks(reviews, providers, settings);

  return {
    privacyRequests: privacyRequests.data ?? [],
    complianceReviews: reviews,
    providerActivations: providers,
    checks,
    blockedCount: checks.filter((check) => check.status === "blocked").length,
  };
}
