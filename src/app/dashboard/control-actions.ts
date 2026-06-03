"use server";

import { revalidatePath } from "next/cache";
import { canManageTenant, requireTenantContext, requireUser } from "@/lib/data/tenant";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

async function requireControlManager(feature: string) {
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

export async function updateComplianceReviewStatus(
  formData: FormData,
): Promise<void> {
  const manager = await requireControlManager("compliance reviews");
  if (manager.error) return;

  const reviewId = String(formData.get("review_id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!reviewId || !["pending", "approved", "blocked", "needs_review"].includes(status)) {
    return;
  }

  const supabase = await createClient();
  await supabase
    .from("compliance_reviews")
    .update({
      status: status as "pending" | "approved" | "blocked" | "needs_review",
      reviewed_by: manager.user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", reviewId)
    .eq("tenant_id", manager.tenantContext.tenant.id);

  revalidatePath("/dashboard/compliance");
  revalidatePath("/dashboard/go-live");
}

export async function updateProviderActivationStatus(
  formData: FormData,
): Promise<void> {
  const manager = await requireControlManager("provider activation");
  if (manager.error) return;

  const providerId = String(formData.get("provider_id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (
    !providerId ||
    !["not_configured", "pending_credentials", "ready", "active", "paused", "failed"].includes(status)
  ) {
    return;
  }

  const supabase = await createClient();
  await supabase
    .from("provider_activation_states")
    .update({
      status: status as
        | "not_configured"
        | "pending_credentials"
        | "ready"
        | "active"
        | "paused"
        | "failed",
      live_enabled: false,
      metadata: {
        manually_set_at: new Date().toISOString(),
        manually_set_by: manager.user.id,
        live_enabled_forced_off: true,
      },
    })
    .eq("id", providerId)
    .eq("tenant_id", manager.tenantContext.tenant.id);

  revalidatePath("/dashboard/activation");
  revalidatePath("/dashboard/go-live");
  revalidatePath("/dashboard/provider-credentials");
}

export async function archiveTestData(): Promise<ActionState> {
  const manager = await requireControlManager("test data");
  if (manager.error) return { error: manager.error };

  const supabase = await createClient();
  const tenantId = manager.tenantContext.tenant.id;
  const archivedAt = new Date().toISOString();

  const [conversations, bookings, orders, outboundMessages] = await Promise.all([
    supabase
      .from("conversations")
      .update({
        status: "archived",
        summary: `Archived test record on ${archivedAt}`,
      })
      .eq("tenant_id", tenantId)
      .or(
        "customer_display_name.ilike.%Test%,customer_display_name.ilike.%Demo%,summary.ilike.%test%,summary.ilike.%Launch%",
      ),
    supabase
      .from("booking_records")
      .update({ status: "cancelled" })
      .eq("tenant_id", tenantId)
      .or("customer_display_name.ilike.%Test%,customer_display_name.ilike.%Demo%,service_name.ilike.%Demo%"),
    supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("tenant_id", tenantId)
      .or("customer_display_name.ilike.%Test%,customer_display_name.ilike.%Demo%,payment_provider.ilike.%test%"),
    supabase
      .from("outbound_messages")
      .update({ review_status: "cancelled" })
      .eq("tenant_id", tenantId)
      .in("review_status", ["draft", "approved", "failed"]),
  ]);

  const failed = [conversations, bookings, orders, outboundMessages].find(
    (result) => result.error,
  );
  if (failed?.error) return { error: failed.error.message };

  await supabase.from("platform_events").insert({
    tenant_id: tenantId,
    event_type: "test_data_archived",
    severity: "info",
    source: "test_data_manager",
    message: "Test/demo records were archived or cancelled without deleting tenant data.",
    metadata: { archived_at: archivedAt },
  });

  revalidatePath("/dashboard/test-data");
  revalidatePath("/dashboard/conversations");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/outbox");
  revalidatePath("/dashboard/admin");

  return {
    success:
      "Test/demo records were archived or cancelled. Nothing was permanently deleted.",
  };
}

export async function recordProductionQaReview(): Promise<ActionState> {
  const manager = await requireControlManager("production QA");
  if (manager.error) return { error: manager.error };

  const supabase = await createClient();
  const { error } = await supabase.from("platform_events").insert({
    tenant_id: manager.tenantContext.tenant.id,
    event_type: "production_qa_reviewed",
    severity: "info",
    source: "production_qa",
    message: "Production QA checklist reviewed in safe mode.",
    metadata: {
      reviewed_by: manager.user.id,
      reviewed_at: new Date().toISOString(),
      live_activation_enabled: false,
    },
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/production-qa");
  revalidatePath("/dashboard/admin");
  return { success: "Production QA review recorded. Live activation remains off." };
}
