export function getAppUrl() {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3002";
  }

  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
}

export function hasUnipileConfig() {
  return Boolean(
    process.env.UNIPILE_API_KEY &&
      process.env.UNIPILE_DSN &&
      process.env.UNIPILE_WEBHOOK_SECRET,
  );
}

export function hasOfficialWhatsappConfig() {
  return Boolean(
    process.env.DIALOG_API_KEY ||
      (process.env.WHATSAPP_CLOUD_API_TOKEN &&
        process.env.WHATSAPP_BUSINESS_ACCOUNT_ID),
  );
}

export function hasCalcomConfig() {
  return Boolean(
    process.env.CALCOM_API_KEY && process.env.CALCOM_WEBHOOK_SECRET,
  );
}

export function hasStripeConfig() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET,
  );
}

export function isLiveStripeCheckoutEnabled() {
  return process.env.ENABLE_LIVE_STRIPE_CHECKOUT === "true";
}

export function isMedicalPrivacyModeEnabled() {
  return process.env.MEDICAL_PRIVACY_MODE !== "false";
}

export function hasVapiConfig() {
  return Boolean(process.env.VAPI_API_KEY);
}

export function hasOpenAiConfig() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function hasN8nConfig() {
  return Boolean(process.env.N8N_WEBHOOK_URL);
}

export function getWebhookUrls() {
  const appUrl = getAppUrl();

  return {
    unipile: `${appUrl}/api/webhooks/unipile`,
    calcom: `${appUrl}/api/webhooks/calcom`,
    stripe: `${appUrl}/api/webhooks/stripe`,
  };
}
