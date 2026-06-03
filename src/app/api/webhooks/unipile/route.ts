import { NextResponse } from "next/server";
import {
  appendConversationMessage,
  createConversationWithInitialMessage,
  inferConversationIntent,
} from "@/lib/server/conversation-runtime";
import {
  readJsonWebhookPayload,
  verifySharedWebhookSecret,
} from "@/lib/server/webhook-security";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const verification = verifySharedWebhookSecret(request, "UNIPILE_WEBHOOK_SECRET", [
    "x-viva-webhook-secret",
    "x-unipile-webhook-secret",
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
      : typeof payload.type === "string"
        ? payload.type
        : "unknown";

  const externalAccountId =
    typeof payload.external_account_id === "string"
      ? payload.external_account_id
      : typeof payload.account_id === "string"
        ? payload.account_id
        : null;

  const externalConversationId =
    typeof payload.external_conversation_id === "string"
      ? payload.external_conversation_id
      : typeof payload.chat_id === "string"
        ? payload.chat_id
        : null;

  const externalMessageId =
    typeof payload.external_message_id === "string"
      ? payload.external_message_id
      : typeof payload.message_id === "string"
        ? payload.message_id
        : null;

  let tenantId =
    typeof payload.tenant_id === "string" ? payload.tenant_id : null;
  let channelBindingId: string | null = null;

  if (externalAccountId) {
    const { data: session } = await admin
      .from("whatsapp_beta_sessions")
      .select("tenant_id, channel_binding_id")
      .eq("external_account_id", externalAccountId)
      .limit(1)
      .maybeSingle();

    if (session) {
      tenantId = session.tenant_id;
      channelBindingId = session.channel_binding_id;
    }
  }

  if (!channelBindingId && tenantId) {
    const { data: binding } = await admin
      .from("channel_bindings")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("channel", "whatsapp")
      .eq("provider", "unipile_beta")
      .limit(1)
      .maybeSingle();

    channelBindingId = binding?.id ?? null;
  }

  const { data: eventRecord } = await admin
    .from("webhook_ingest_events")
    .insert({
      tenant_id: tenantId,
      provider: "unipile",
      event_type: eventType,
      external_account_id: externalAccountId,
      external_conversation_id: externalConversationId,
      external_message_id: externalMessageId,
      payload,
    })
    .select("id")
    .single();

  if (!tenantId || !channelBindingId) {
    await admin
      .from("webhook_ingest_events")
      .update({
        status: "ignored",
        error_message: "No tenant mapping found for this webhook event.",
        processed_at: new Date().toISOString(),
      })
      .eq("id", eventRecord?.id ?? "");

    return NextResponse.json({ ok: true, status: "ignored" });
  }

  const body =
    typeof payload.body === "string"
      ? payload.body
      : typeof payload.text === "string"
        ? payload.text
        : null;
  const direction =
    typeof payload.direction === "string" ? payload.direction : "inbound";

  if (!body || direction !== "inbound") {
    await admin
      .from("webhook_ingest_events")
      .update({
        status: "processed",
        processed_at: new Date().toISOString(),
      })
      .eq("id", eventRecord?.id ?? "");

    return NextResponse.json({ ok: true, status: "processed" });
  }

  const customerName =
    typeof payload.customer_display_name === "string"
      ? payload.customer_display_name
      : typeof payload.from_name === "string"
        ? payload.from_name
        : null;
  const customerPhone =
    typeof payload.customer_phone === "string"
      ? payload.customer_phone
      : typeof payload.from_phone === "string"
        ? payload.from_phone
        : null;
  const customerEmail =
    typeof payload.customer_email === "string"
      ? payload.customer_email
      : typeof payload.from_email === "string"
        ? payload.from_email
        : null;
  const summary =
    typeof payload.summary === "string" ? payload.summary : null;
  const intent = inferConversationIntent(
    `${summary ?? ""} ${body}`,
    typeof payload.intent === "string" &&
      ["unknown", "booking", "sales", "support", "handoff"].includes(
        payload.intent,
      )
      ? payload.intent
      : "unknown",
  );

  const { data: existingConversation } = externalConversationId
    ? await admin
        .from("conversations")
        .select("id")
        .eq("tenant_id", tenantId)
        .eq("external_conversation_id", externalConversationId)
        .limit(1)
        .maybeSingle()
    : { data: null };

  if (existingConversation) {
    await appendConversationMessage(admin, {
      tenantId,
      conversationId: existingConversation.id,
      senderType: "customer",
      direction: "inbound",
      body,
      metadata: {
        provider: "unipile",
        external_message_id: externalMessageId,
        webhook_event_id: eventRecord?.id ?? null,
      },
    });
  } else {
    await createConversationWithInitialMessage(admin, {
      tenantId,
      channel: "whatsapp",
      channelBindingId,
      externalConversationId,
      customerDisplayName: customerName,
      customerPhone,
      customerEmail,
      intent,
      summary,
      initialMessage: body,
      metadata: {
        provider: "unipile",
        external_message_id: externalMessageId,
        webhook_event_id: eventRecord?.id ?? null,
      },
    });
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
