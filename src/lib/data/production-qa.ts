import {
  hasCalcomConfig,
  hasN8nConfig,
  hasOpenAiConfig,
  hasStripeConfig,
  hasUnipileConfig,
  hasVapiConfig,
  isLiveStripeCheckoutEnabled,
  isMedicalPrivacyModeEnabled,
} from "@/lib/env";
import type { LaunchReadinessOverview } from "@/lib/data/launch-ops";

export type ProductionQaItem = {
  label: string;
  status: "pass" | "warning" | "blocked";
  detail: string;
};

export function getProductionQaItems(
  overview: LaunchReadinessOverview,
): ProductionQaItem[] {
  const anyCredentials =
    hasUnipileConfig() ||
    hasVapiConfig() ||
    hasOpenAiConfig() ||
    hasStripeConfig() ||
    hasN8nConfig() ||
    hasCalcomConfig();

  return [
    {
      label: "Medical privacy mode",
      status: isMedicalPrivacyModeEnabled() ? "pass" : "blocked",
      detail: isMedicalPrivacyModeEnabled()
        ? "Medical privacy mode is enabled for launch."
        : "Set MEDICAL_PRIVACY_MODE=true before medical clients process sensitive data.",
    },
    {
      label: "Safe mode",
      status: overview.providerStates.some((provider) => provider.live_enabled)
        ? "blocked"
        : "pass",
      detail: "No provider should be live-enabled before the first supervised pilot.",
    },
    {
      label: "Stripe live gate",
      status: hasStripeConfig() && isLiveStripeCheckoutEnabled() ? "warning" : "pass",
      detail:
        hasStripeConfig() && isLiveStripeCheckoutEnabled()
          ? "Live checkout is enabled; confirm payment metadata contains no PHI before use."
          : "Live checkout is still gated off.",
    },
    {
      label: "Medical approvals",
      status: overview.blockers.some((blocker) =>
        blocker.includes("Medical privacy approvals"),
      )
        ? "blocked"
        : "pass",
      detail: "Medical launch approvals should be completed in Privacy ops.",
    },
    {
      label: "Provider credentials",
      status: anyCredentials ? "warning" : "blocked",
      detail: anyCredentials
        ? "At least one provider has credentials present; sync readiness before live tests."
        : "No paid/live provider credentials are present yet.",
    },
    {
      label: "Webhook activity",
      status: overview.webhookEvents.length > 0 ? "pass" : "warning",
      detail: "Use Test Center to exercise Unipile, Cal.com, and Stripe webhook rails.",
    },
    {
      label: "Human review outbox",
      status: overview.outboundQueue.some((message) => message.review_status === "draft")
        ? "warning"
        : "pass",
      detail: "Outbound records should be reviewed or cleared before demos.",
    },
    {
      label: "Go-live blockers",
      status: overview.blockers.length > 0 ? "warning" : "pass",
      detail:
        overview.blockers.length > 0
          ? overview.blockers.join(" ")
          : "No internal readiness blockers detected.",
    },
  ];
}
