"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { MEDICAL_GO_LIVE_REVIEWS } from "@/lib/data/privacy-ops";
import { canManageTenant, requireTenantContext, requireUser } from "@/lib/data/tenant";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

const requestSchema = z.object({
  request_type: z.enum([
    "access",
    "export",
    "correction",
    "deletion",
    "restriction",
    "retention_review",
    "incident",
  ]),
  subject_display_name: z.string().trim().max(120).optional(),
  subject_contact: z.string().trim().max(160).optional(),
  notes: z.string().trim().max(1200).optional(),
});

const statusSchema = z.object({
  request_id: z.string().uuid(),
  status: z.enum(["open", "in_review", "fulfilled", "rejected", "cancelled"]),
  resolution_notes: z.string().trim().max(1200).optional(),
});

async function requirePrivacyManager(feature: string) {
  const tenantContext = await requireTenantContext();
  const user = await requireUser();

  if (!canManageTenant(tenantContext.role)) {
    return {
      error: `Only owners and admins can manage ${feature}.`,
      tenantContext,
      user,
    };
  }

  return { tenantContext, user };
}

function revalidatePrivacyUi() {
  revalidatePath("/dashboard/privacy");
  revalidatePath("/dashboard/compliance");
  revalidatePath("/dashboard/go-live");
  revalidatePath("/dashboard/admin");
}

export async function prepareMedicalPrivacyLaunchChecks(): Promise<ActionState> {
  const manager = await requirePrivacyManager("medical privacy launch checks");
  if (manager.error) return { error: manager.error };

  const supabase = await createClient();
  const tenantId = manager.tenantContext.tenant.id;
  const reviewTypes = MEDICAL_GO_LIVE_REVIEWS.map((review) => review.reviewType);

  const { data: existing, error: selectError } = await supabase
    .from("compliance_reviews")
    .select("id,review_type")
    .eq("tenant_id", tenantId)
    .in("review_type", reviewTypes);

  if (selectError) return { error: selectError.message };

  const existingByType = new Map(
    (existing ?? []).map((review) => [review.review_type, review.id]),
  );

  const results = await Promise.all(
    MEDICAL_GO_LIVE_REVIEWS.map((review) => {
      const existingId = existingByType.get(review.reviewType);
      const payload = {
        tenant_id: tenantId,
        review_type: review.reviewType,
        status: "needs_review" as const,
        restricted_category: "medical",
        notes: review.notes,
        metadata: {
          title: review.title,
          medical_privacy_required: true,
          prepared_by: manager.user.id,
          prepared_at: new Date().toISOString(),
        },
      };

      if (existingId) {
        return supabase
          .from("compliance_reviews")
          .update(payload)
          .eq("id", existingId)
          .eq("tenant_id", tenantId);
      }

      return supabase.from("compliance_reviews").insert(payload);
    }),
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) return { error: failed.error.message };

  await supabase.from("platform_events").insert({
    tenant_id: tenantId,
    event_type: "medical_privacy_launch_checks_prepared",
    severity: "info",
    source: "privacy_operations",
    message: "Medical privacy go-live approval records were prepared.",
    metadata: {
      prepared_by: manager.user.id,
      review_types: reviewTypes,
    },
  });

  revalidatePrivacyUi();
  return { success: "Medical privacy launch checks are ready for owner review." };
}

export async function createPrivacyRequest(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const manager = await requirePrivacyManager("privacy requests");
  if (manager.error) return { error: manager.error };

  const parsed = requestSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the request form." };
  }

  const values = parsed.data;
  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + 30);

  const supabase = await createClient();
  const { error } = await supabase.from("data_privacy_requests").insert({
    tenant_id: manager.tenantContext.tenant.id,
    request_type: values.request_type,
    subject_display_name: values.subject_display_name || null,
    subject_contact: values.subject_contact || null,
    notes: values.notes || null,
    due_at: dueAt.toISOString(),
    created_by: manager.user.id,
    metadata: {
      medical_privacy_mode: true,
      source: "privacy_operations_page",
    },
  });

  if (error) return { error: error.message };

  await supabase.from("platform_events").insert({
    tenant_id: manager.tenantContext.tenant.id,
    event_type: "privacy_request_created",
    severity: values.request_type === "incident" ? "warning" : "info",
    source: "privacy_operations",
    message: `Privacy request created: ${values.request_type}.`,
    metadata: {
      request_type: values.request_type,
      created_by: manager.user.id,
    },
  });

  revalidatePrivacyUi();
  return { success: "Privacy request recorded." };
}

export async function updatePrivacyRequestStatus(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const manager = await requirePrivacyManager("privacy request status");
  if (manager.error) return { error: manager.error };

  const parsed = statusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the status update." };
  }

  const values = parsed.data;
  const completed = ["fulfilled", "rejected", "cancelled"].includes(values.status);
  const supabase = await createClient();

  const { error } = await supabase
    .from("data_privacy_requests")
    .update({
      status: values.status,
      resolution_notes: values.resolution_notes || null,
      completed_at: completed ? new Date().toISOString() : null,
      completed_by: completed ? manager.user.id : null,
    })
    .eq("id", values.request_id)
    .eq("tenant_id", manager.tenantContext.tenant.id);

  if (error) return { error: error.message };

  await supabase.from("platform_events").insert({
    tenant_id: manager.tenantContext.tenant.id,
    event_type: "privacy_request_status_updated",
    severity: "info",
    source: "privacy_operations",
    message: `Privacy request marked ${values.status}.`,
    metadata: {
      request_id: values.request_id,
      status: values.status,
      updated_by: manager.user.id,
    },
  });

  revalidatePrivacyUi();
  return { success: "Privacy request updated." };
}

export async function recordRetentionReview(): Promise<ActionState> {
  const manager = await requirePrivacyManager("retention reviews");
  if (manager.error) return { error: manager.error };

  const supabase = await createClient();
  const { error } = await supabase.from("data_privacy_requests").insert({
    tenant_id: manager.tenantContext.tenant.id,
    request_type: "retention_review",
    status: "open",
    subject_display_name: "Tenant retention review",
    notes:
      "Review raw webhooks, message bodies, bookings, orders, consent records, and audit logs against medical retention targets.",
    due_at: new Date().toISOString(),
    created_by: manager.user.id,
    metadata: {
      raw_webhook_target_days: 90,
      medical_message_target_days: 90,
      source: "retention_review_button",
    },
  });

  if (error) return { error: error.message };

  revalidatePrivacyUi();
  return { success: "Retention review queued." };
}

export async function recordIncidentDrill(): Promise<ActionState> {
  const manager = await requirePrivacyManager("incident drills");
  if (manager.error) return { error: manager.error };

  const supabase = await createClient();
  const { error } = await supabase.from("platform_events").insert({
    tenant_id: manager.tenantContext.tenant.id,
    event_type: "incident_response_drill_recorded",
    severity: "info",
    source: "privacy_operations",
    message: "Incident response tabletop drill recorded for medical launch readiness.",
    metadata: {
      recorded_by: manager.user.id,
      runbook: "docs/INCIDENT_RESPONSE_RUNBOOK.md",
    },
  });

  if (error) return { error: error.message };

  revalidatePrivacyUi();
  return { success: "Incident drill recorded." };
}
