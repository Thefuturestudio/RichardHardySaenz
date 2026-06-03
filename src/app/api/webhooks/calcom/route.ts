import { NextResponse } from "next/server";
import {
  readJsonWebhookPayload,
  verifySharedWebhookSecret,
} from "@/lib/server/webhook-security";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/types/database";

function mergeMetadata(
  current: unknown,
  next: Record<string, unknown>,
): Json {
  if (!current || typeof current !== "object" || Array.isArray(current)) {
    return next as Json;
  }

  return {
    ...current,
    ...next,
  } as Json;
}

const statusMap: Record<
  string,
  "pending" | "draft" | "cancelled" | "confirmed" | "rescheduled" | "completed" | "no_show"
> = {
  "booking.created": "confirmed",
  "booking.confirmed": "confirmed",
  "booking.cancelled": "cancelled",
  "booking.rescheduled": "rescheduled",
  "booking.completed": "completed",
};

export async function POST(request: Request) {
  const verification = verifySharedWebhookSecret(request, "CALCOM_WEBHOOK_SECRET", [
    "x-viva-webhook-secret",
    "x-calcom-webhook-secret",
  ]);

  if (!verification.ok) {
    return NextResponse.json(
      { error: verification.error },
      { status: verification.status },
    );
  }

  const admin = createAdminClient();
  const { payload } = await readJsonWebhookPayload(request);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const eventType =
    typeof payload.event_type === "string"
      ? payload.event_type
      : typeof payload.triggerEvent === "string"
        ? payload.triggerEvent
        : "unknown";

  let tenantId =
    typeof payload.tenant_id === "string" ? payload.tenant_id : null;
  const externalBookingId =
    typeof payload.external_booking_id === "string"
      ? payload.external_booking_id
      : typeof payload.booking_uid === "string"
        ? payload.booking_uid
        : null;

  if (!tenantId && externalBookingId) {
    const { data: booking } = await admin
      .from("booking_records")
      .select("tenant_id")
      .eq("external_booking_id", externalBookingId)
      .limit(1)
      .maybeSingle();

    tenantId = booking?.tenant_id ?? null;
  }

  const { data: eventRecord } = await admin
    .from("webhook_ingest_events")
    .insert({
      tenant_id: tenantId,
      provider: "cal_com",
      event_type: eventType,
      external_conversation_id: null,
      external_message_id: externalBookingId,
      payload,
    })
    .select("id")
    .single();

  if (!tenantId || !externalBookingId) {
    await admin
      .from("webhook_ingest_events")
      .update({
        status: "ignored",
        error_message: "No tenant or booking mapping found.",
        processed_at: new Date().toISOString(),
      })
      .eq("id", eventRecord?.id ?? "");

    return NextResponse.json({ ok: true, status: "ignored" });
  }

  const nextStatus = statusMap[eventType];
  if (nextStatus) {
    const { data: booking } = await admin
      .from("booking_records")
      .select("metadata")
      .eq("tenant_id", tenantId)
      .eq("external_booking_id", externalBookingId)
      .limit(1)
      .maybeSingle();

    await admin
      .from("booking_records")
      .update({
        status: nextStatus,
        metadata: mergeMetadata(booking?.metadata, {
          last_calcom_event: eventType,
          synced_from_webhook: true,
        }),
      })
      .eq("tenant_id", tenantId)
      .eq("external_booking_id", externalBookingId);
  }

  await admin
    .from("webhook_ingest_events")
    .update({
      status: "processed",
      processed_at: new Date().toISOString(),
    })
    .eq("id", eventRecord?.id ?? "");

  return NextResponse.json({ ok: true, status: "processed" });
}
