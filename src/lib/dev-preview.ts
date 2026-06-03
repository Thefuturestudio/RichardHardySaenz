import type { User } from "@supabase/supabase-js";
import type { TenantContext } from "@/types";

export const DEV_PREVIEW_COOKIE = "viva_preview_session";
export const DEV_PREVIEW_USER_ID = "00000000-0000-4000-8000-000000000001";
export const DEV_PREVIEW_TENANT_ID = "00000000-0000-4000-8000-000000000101";

const previewTimestamp = "2026-06-02T00:00:00.000Z";

export function isDevPreviewEnabled() {
  return process.env.NODE_ENV !== "production";
}

export function getDevPreviewUser(): User {
  return {
    id: DEV_PREVIEW_USER_ID,
    aud: "authenticated",
    role: "authenticated",
    email: "viva.preview@local.test",
    email_confirmed_at: previewTimestamp,
    phone: "",
    confirmed_at: previewTimestamp,
    last_sign_in_at: previewTimestamp,
    app_metadata: {
      provider: "email",
      providers: ["email"],
    },
    user_metadata: {
      full_name: "Viva Preview",
    },
    identities: [],
    created_at: previewTimestamp,
    updated_at: previewTimestamp,
    is_anonymous: false,
  } as User;
}

export function getDevPreviewTenantContext(): TenantContext {
  return {
    role: "owner",
    tenant: {
      id: DEV_PREVIEW_TENANT_ID,
      business_name: "Viva Preview Clinic",
      business_type: "medical_clinic",
      city: "Panama City",
      country: "Panama",
      timezone: "America/Panama",
      status: "draft",
      plan: "starter",
      owner_user_id: DEV_PREVIEW_USER_ID,
      created_at: previewTimestamp,
      updated_at: previewTimestamp,
    },
    settings: {
      tenant_id: DEV_PREVIEW_TENANT_ID,
      languages: ["es"],
      whatsapp_number: null,
      vapi_phone_number_id: null,
      human_fallback_number: "+507 6000-0000",
      booking_url: null,
      tone: "friendly",
      greeting: null,
      hours: {},
      services: [],
      created_at: previewTimestamp,
      updated_at: previewTimestamp,
    },
  };
}
