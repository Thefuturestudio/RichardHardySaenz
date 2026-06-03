import { NextResponse } from "next/server";
import {
  readJsonWebhookPayload,
  verifyStripeWebhookSignature,
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

const orderStatusByEvent: Record<
  string,
  "draft" | "pending_payment" | "paid" | "fulfilled" | "cancelled" | "refunded"
> = {
  "checkout.session.completed": "paid",
  "payment_intent.payment_failed": "pending_payment",
  "charge.refunded": "refunded",
};

export async function POST(request: Request) {
  const { rawBody, payload } = await readJsonWebhookPayload(request);
  const verification = verifyStripeWebhookSignature(request, rawBody);

  if (!verification.ok) {
    return NextResponse.json(
      { error: verification.error },
      { status: verification.status },
    );
  }

  const admin = createAdminClient();
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const eventType =
    typeof payload.type === "string" ? payload.type : "unknown";
  const object =
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data) &&
    payload.data.object &&
    typeof payload.data.object === "object" &&
    !Array.isArray(payload.data.object)
      ? payload.data.object
      : null;

  const metadata =
    object &&
    "metadata" in object &&
    object.metadata &&
    typeof object.metadata === "object" &&
    !Array.isArray(object.metadata)
      ? object.metadata
      : {};

  const tenantId =
    typeof metadata.tenant_id === "string" ? metadata.tenant_id : null;
  const orderId =
    typeof metadata.order_id === "string" ? metadata.order_id : null;
  const externalPaymentId =
    object && "id" in object && typeof object.id === "string" ? object.id : null;

  const { data: eventRecord } = await admin
    .from("webhook_ingest_events")
    .insert({
      tenant_id: tenantId,
      provider: "stripe",
      event_type: eventType,
      external_message_id: externalPaymentId,
      payload,
    })
    .select("id")
    .single();

  if (!tenantId || !orderId) {
    await admin
      .from("webhook_ingest_events")
      .update({
        status: "ignored",
        error_message: "No tenant or order mapping found.",
        processed_at: new Date().toISOString(),
      })
      .eq("id", eventRecord?.id ?? "");

    return NextResponse.json({ ok: true, status: "ignored" });
  }

  const nextStatus = orderStatusByEvent[eventType];
  if (nextStatus) {
    const { data: order } = await admin
      .from("orders")
      .select("metadata")
      .eq("tenant_id", tenantId)
      .eq("id", orderId)
      .limit(1)
      .maybeSingle();

    await admin
      .from("orders")
      .update({
        status: nextStatus,
        external_payment_id: externalPaymentId,
        metadata: mergeMetadata(order?.metadata, {
          last_stripe_event: eventType,
          synced_from_webhook: true,
        }),
      })
      .eq("tenant_id", tenantId)
      .eq("id", orderId);
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
