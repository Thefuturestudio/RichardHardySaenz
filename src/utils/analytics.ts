export type AnalyticsEventName =
  | "booking_cta_click"
  | "whatsapp_click"
  | "assistant_open"
  | "assistant_concern_selected"
  | "assistant_chat_submit"
  | "assistant_intake_submit"
  | "booking_form_submit"
  | "language_toggle"
  | "specialty_page_cta_click"
  | "sticky_bar_cta_click"
  | "second_opinion_cta_click";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  // TODO: Connect to GA4, Meta Pixel, Plausible, PostHog, or server-side analytics.
  if (import.meta.env.DEV) {
    console.info("[analytics]", name, payload);
  }

  window.dispatchEvent(
    new CustomEvent("uropanama:analytics", {
      detail: { name, payload, timestamp: new Date().toISOString() },
    }),
  );
}
