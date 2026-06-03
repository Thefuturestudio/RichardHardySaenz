"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCatalogForTenant } from "@/lib/data/catalog";
import { requireTenantContext, requireUser } from "@/lib/data/tenant";
import {
  appendConversationMessage,
  buildRuleBasedDraftReply,
  createConversationWithInitialMessage,
  toMinorUnits,
  upsertCustomerRecord,
} from "@/lib/server/conversation-runtime";
import {
  getAppUrl,
  hasCalcomConfig,
  hasStripeConfig,
  isLiveStripeCheckoutEnabled,
} from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || null);

const optionalNumber = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  });

const conversationSchema = z.object({
  channel: z.enum(["voice", "whatsapp"]),
  channel_binding_id: optionalText,
  customer_display_name: optionalText,
  customer_phone: optionalText,
  customer_email: optionalText,
  intent: z.enum(["unknown", "booking", "sales", "support", "handoff"]),
  summary: optionalText,
  initial_message: z.string().trim().min(2, "Add a message or transcript note."),
});

const messageSchema = z.object({
  conversation_id: z.string().uuid(),
  sender_type: z.enum(["customer", "assistant", "human", "system"]),
  direction: z.enum(["inbound", "outbound", "internal"]),
  body: z.string().trim().min(2, "Message body is required."),
});

const statusSchema = z.object({
  conversation_id: z.string().uuid(),
  status: z.enum(["open", "pending", "resolved", "archived"]),
});

const conversationIdSchema = z.object({
  conversation_id: z.string().uuid(),
});

const bookingDraftSchema = z.object({
  conversation_id: z.string().uuid(),
  service_name: z.string().trim().min(2, "Service name is required."),
  starts_at: optionalText,
  duration_minutes: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value) return 30;
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
    }),
});

const paymentDraftSchema = z
  .object({
    conversation_id: z.string().uuid(),
    catalog_item_id: optionalText,
    item_name: optionalText,
    amount: optionalNumber,
    currency: z.string().trim().min(3).max(3).default("USD"),
  })
  .superRefine((value, ctx) => {
    const hasCatalogItem = Boolean(value.catalog_item_id);
    const hasManualName = Boolean(value.item_name);
    const hasManualAmount =
      typeof value.amount === "number" &&
      Number.isFinite(value.amount) &&
      value.amount > 0;

    if (!hasCatalogItem && (!hasManualName || !hasManualAmount)) {
      ctx.addIssue({
        code: "custom",
        message:
          "Choose a catalog item or enter a manual item name and amount.",
        path: ["item_name"],
      });
    }
  });

const bookingStatusSchema = z.object({
  booking_id: z.string().uuid(),
  status: z.enum([
    "draft",
    "pending",
    "confirmed",
    "rescheduled",
    "cancelled",
    "completed",
    "no_show",
  ]),
});

const orderStatusSchema = z.object({
  order_id: z.string().uuid(),
  status: z.enum([
    "draft",
    "pending_payment",
    "paid",
    "fulfilled",
    "cancelled",
    "refunded",
  ]),
});

const outboundMessageIdSchema = z.object({
  outbound_message_id: z.string().uuid(),
});

function revalidateOperationsUi() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/ai-tools");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/channels");
  revalidatePath("/dashboard/channels/whatsapp-beta");
  revalidatePath("/dashboard/conversations");
  revalidatePath("/dashboard/customers");
  revalidatePath("/dashboard/orders");
}

export async function createConversation(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const parsed = conversationSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the conversation form.",
    };
  }

  const values = parsed.data;
  const supabase = await createClient();

  try {
    await createConversationWithInitialMessage(supabase, {
      tenantId: tenantContext.tenant.id,
      channel: values.channel,
      channelBindingId: values.channel_binding_id,
      customerDisplayName: values.customer_display_name,
      customerPhone: values.customer_phone,
      customerEmail: values.customer_email,
      intent: values.intent,
      summary: values.summary,
      initialMessage: values.initial_message,
      metadata: {
        source: "manual_dashboard",
      },
    });
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Could not create conversation.",
    };
  }

  revalidateOperationsUi();
  return { success: "Conversation record created." };
}

export async function addMessageRecord(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const parsed = messageSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the message form.",
    };
  }

  const values = parsed.data;
  const supabase = await createClient();

  try {
    await appendConversationMessage(supabase, {
      tenantId: tenantContext.tenant.id,
      conversationId: values.conversation_id,
      senderType: values.sender_type,
      direction: values.direction,
      body: values.body,
      metadata: {
        source: "manual_dashboard",
      },
    });
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Could not add message record.",
    };
  }

  revalidateOperationsUi();
  return { success: "Message record added." };
}

export async function updateConversationStatus(formData: FormData) {
  const tenantContext = await requireTenantContext();
  const parsed = statusSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) return;

  const supabase = await createClient();
  await supabase
    .from("conversations")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.conversation_id)
    .eq("tenant_id", tenantContext.tenant.id);

  revalidateOperationsUi();
}

export async function claimConversation(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const user = await requireUser();
  const parsed = conversationIdSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) return { error: "Missing conversation." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("conversations")
    .update({
      assigned_user_id: user.id,
      status: "pending",
    })
    .eq("id", parsed.data.conversation_id)
    .eq("tenant_id", tenantContext.tenant.id);

  if (error) return { error: error.message };

  try {
    await appendConversationMessage(supabase, {
      tenantId: tenantContext.tenant.id,
      conversationId: parsed.data.conversation_id,
      senderType: "system",
      direction: "internal",
      body: `${user.email ?? "A team member"} claimed this conversation.`,
      metadata: {
        event_type: "claim",
      },
    });
  } catch (appendError) {
    return {
      error:
        appendError instanceof Error
          ? appendError.message
          : "Conversation claimed but note could not be saved.",
    };
  }

  revalidateOperationsUi();
  return { success: "Conversation claimed and moved into pending review." };
}

export async function requestHumanHandoff(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const user = await requireUser();
  const parsed = conversationIdSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) return { error: "Missing conversation." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("conversations")
    .update({
      assigned_user_id: user.id,
      intent: "handoff",
      status: "pending",
    })
    .eq("id", parsed.data.conversation_id)
    .eq("tenant_id", tenantContext.tenant.id);

  if (error) return { error: error.message };

  const fallback = tenantContext.settings?.human_fallback_number
    ? ` Human fallback number: ${tenantContext.settings.human_fallback_number}.`
    : "";

  try {
    await appendConversationMessage(supabase, {
      tenantId: tenantContext.tenant.id,
      conversationId: parsed.data.conversation_id,
      senderType: "system",
      direction: "internal",
      body: `Human handoff requested by ${user.email ?? "a team member"}.${fallback}`,
      metadata: {
        event_type: "handoff_requested",
      },
    });
  } catch (appendError) {
    return {
      error:
        appendError instanceof Error
          ? appendError.message
          : "Handoff requested but note could not be saved.",
    };
  }

  revalidateOperationsUi();
  return { success: "Human handoff flagged for this conversation." };
}

export async function generateConversationDraft(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const parsed = conversationIdSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) return { error: "Missing conversation." };

  const supabase = await createClient();
  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", parsed.data.conversation_id)
    .eq("tenant_id", tenantContext.tenant.id)
    .single();

  if (conversationError || !conversation) {
    return {
      error: conversationError?.message ?? "Conversation not found.",
    };
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("tenant_id", tenantContext.tenant.id)
    .eq("conversation_id", conversation.id)
    .order("occurred_at", { ascending: true });

  if (messagesError) return { error: messagesError.message };

  const latestCustomerMessage =
    [...(messages ?? [])]
      .reverse()
      .find((message) => message.sender_type === "customer")?.body ??
    conversation.summary ??
    "Customer asked for help.";

  const { items } = await getCatalogForTenant(tenantContext.tenant.id);
  const draft = buildRuleBasedDraftReply({
    conversation,
    latestCustomerMessage,
    catalogItems: items,
    context: {
      businessName: tenantContext.tenant.business_name,
      bookingUrl: tenantContext.settings?.booking_url,
      humanFallbackNumber: tenantContext.settings?.human_fallback_number,
      tone: tenantContext.settings?.tone,
    },
  });

  try {
    await appendConversationMessage(supabase, {
      tenantId: tenantContext.tenant.id,
      conversationId: conversation.id,
      senderType: "assistant",
      direction: "internal",
      body: draft.body,
      metadata: {
        draft: true,
        mode: "safe_rule_based",
        matched_catalog_item_ids: draft.matchedItems.map((item) => item.id),
      },
    });
  } catch (appendError) {
    return {
      error:
        appendError instanceof Error
          ? appendError.message
          : "Could not save the draft reply.",
    };
  }

  revalidateOperationsUi();
  return {
    success:
      draft.matchedItems.length > 0
        ? `Draft reply created with ${draft.matchedItems.length} catalog match${
            draft.matchedItems.length === 1 ? "" : "es"
          }.`
        : "Draft reply created.",
  };
}

export async function createBookingDraftFromConversation(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const parsed = bookingDraftSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the booking draft form.",
    };
  }

  const supabase = await createClient();
  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", parsed.data.conversation_id)
    .eq("tenant_id", tenantContext.tenant.id)
    .single();

  if (conversationError || !conversation) {
    return { error: conversationError?.message ?? "Conversation not found." };
  }

  const { data: config, error: configError } = await supabase
    .from("booking_sync_configs")
    .select("*")
    .eq("tenant_id", tenantContext.tenant.id)
    .eq("provider", "cal_com")
    .limit(1)
    .maybeSingle();

  if (configError) return { error: configError.message };

  const startsAt = parsed.data.starts_at
    ? new Date(parsed.data.starts_at).toISOString()
    : null;
  const endsAt = startsAt
    ? new Date(
        new Date(startsAt).getTime() +
          parsed.data.duration_minutes * 60 * 1000,
      ).toISOString()
    : null;

  const { error: insertError } = await supabase.from("booking_records").insert({
    tenant_id: tenantContext.tenant.id,
    booking_sync_config_id: config?.id ?? null,
    conversation_id: conversation.id,
    customer_display_name: conversation.customer_display_name,
    customer_phone: conversation.customer_phone,
    customer_email: conversation.customer_email,
    service_name: parsed.data.service_name,
    status: startsAt ? "pending" : "draft",
    starts_at: startsAt,
    ends_at: endsAt,
    timezone: tenantContext.tenant.timezone,
    metadata: {
      source: "conversation_runtime",
      live_sync_enabled: false,
    },
  });

  if (insertError) return { error: insertError.message };

  await upsertCustomerRecord(supabase, tenantContext.tenant.id, {
    displayName: conversation.customer_display_name,
    phone: conversation.customer_phone,
    email: conversation.customer_email,
    source: "booking_runtime",
  });

  try {
    await appendConversationMessage(supabase, {
      tenantId: tenantContext.tenant.id,
      conversationId: conversation.id,
      senderType: "system",
      direction: "internal",
      body: `Draft booking created for ${parsed.data.service_name}${
        startsAt ? ` on ${new Date(startsAt).toLocaleString()}` : ""
      }.`,
      metadata: {
        event_type: "booking_draft_created",
      },
    });
  } catch (appendError) {
    return {
      error:
        appendError instanceof Error
          ? appendError.message
          : "Booking created but note could not be saved.",
    };
  }

  revalidateOperationsUi();
  return { success: "Booking draft created from the conversation." };
}

export async function createPaymentLinkDraftFromConversation(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const parsed = paymentDraftSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ?? "Check the payment link draft form.",
    };
  }

  const supabase = await createClient();
  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", parsed.data.conversation_id)
    .eq("tenant_id", tenantContext.tenant.id)
    .single();

  if (conversationError || !conversation) {
    return { error: conversationError?.message ?? "Conversation not found." };
  }

  let itemName = parsed.data.item_name ?? "Draft item";
  let currency = parsed.data.currency.toUpperCase();
  let minorAmount = 0;
  let catalogItemId: string | null = null;

  if (parsed.data.catalog_item_id) {
    const { data: catalogItem, error: catalogItemError } = await supabase
      .from("catalog_items")
      .select("*")
      .eq("tenant_id", tenantContext.tenant.id)
      .eq("id", parsed.data.catalog_item_id)
      .single();

    if (catalogItemError || !catalogItem) {
      return {
        error: catalogItemError?.message ?? "Catalog item not found.",
      };
    }

    itemName = catalogItem.name;
    currency = catalogItem.currency;
    minorAmount = toMinorUnits(catalogItem.price_amount ?? 0);
    catalogItemId = catalogItem.id;
  } else {
    const amount = parsed.data.amount;

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return { error: "Manual payment amount must be greater than zero." };
    }

    minorAmount = toMinorUnits(amount);
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      tenant_id: tenantContext.tenant.id,
      conversation_id: conversation.id,
      customer_display_name: conversation.customer_display_name,
      customer_phone: conversation.customer_phone,
      customer_email: conversation.customer_email,
      status: "pending_payment",
      currency,
      subtotal_amount: minorAmount,
      total_amount: minorAmount,
      payment_provider: "stripe_test_preview",
      metadata: {
        live_checkout_enabled: false,
        source: "conversation_runtime",
      },
    })
    .select("*")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Could not create order draft." };
  }

  const { error: itemError } = await supabase.from("order_items").insert({
    tenant_id: tenantContext.tenant.id,
    order_id: order.id,
    catalog_item_id: catalogItemId,
    name: itemName,
    quantity: 1,
    unit_amount: minorAmount,
    total_amount: minorAmount,
    metadata: {
      source: catalogItemId ? "catalog" : "manual",
    },
  });

  if (itemError) return { error: itemError.message };

  const configuredBase = process.env.NEXT_PUBLIC_APP_URL;
  const previewBase =
    configuredBase?.includes("localhost:3000")
      ? configuredBase.replace("localhost:3000", "localhost:3002")
      : configuredBase || "http://localhost:3002";
  const previewUrl = `${previewBase.replace(/\/$/, "")}/dashboard/orders?preview=${order.id}`;

  const { error: linkError } = await supabase
    .from("orders")
    .update({
      payment_link_url: previewUrl,
      metadata: {
        live_checkout_enabled: false,
        checkout_mode: "internal_preview",
        source: "conversation_runtime",
      },
    })
    .eq("id", order.id)
    .eq("tenant_id", tenantContext.tenant.id);

  if (linkError) return { error: linkError.message };

  await upsertCustomerRecord(supabase, tenantContext.tenant.id, {
    displayName: conversation.customer_display_name,
    phone: conversation.customer_phone,
    email: conversation.customer_email,
    source: "order_runtime",
  });

  try {
    await appendConversationMessage(supabase, {
      tenantId: tenantContext.tenant.id,
      conversationId: conversation.id,
      senderType: "system",
      direction: "internal",
      body: `Payment link draft prepared for ${itemName} (${currency} ${(
        minorAmount / 100
      ).toFixed(2)}). Preview URL saved in orders.`,
      metadata: {
        event_type: "payment_link_draft_created",
        order_id: order.id,
      },
    });
  } catch (appendError) {
    return {
      error:
        appendError instanceof Error
          ? appendError.message
          : "Order created but note could not be saved.",
    };
  }

  revalidateOperationsUi();
  return { success: "Payment link draft prepared in test mode." };
}

export async function queueOutboundReviewReply(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const user = await requireUser();
  const parsed = conversationIdSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) return { error: "Missing conversation." };

  const supabase = await createClient();
  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", parsed.data.conversation_id)
    .eq("tenant_id", tenantContext.tenant.id)
    .single();

  if (conversationError || !conversation) {
    return { error: conversationError?.message ?? "Conversation not found." };
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("tenant_id", tenantContext.tenant.id)
    .eq("conversation_id", conversation.id)
    .order("occurred_at", { ascending: false });

  if (messagesError) return { error: messagesError.message };

  const latestDraft = (messages ?? []).find((message) => {
    return (
      message.sender_type === "assistant" &&
      message.direction === "internal" &&
      typeof message.metadata === "object" &&
      !Array.isArray(message.metadata) &&
      message.metadata !== null &&
      "draft" in message.metadata
    );
  });

  if (!latestDraft) {
    return { error: "Create an AI draft first, then queue it for review." };
  }

  let provider: string | null = null;
  if (conversation.channel_binding_id) {
    const { data: binding } = await supabase
      .from("channel_bindings")
      .select("provider")
      .eq("id", conversation.channel_binding_id)
      .eq("tenant_id", tenantContext.tenant.id)
      .limit(1)
      .maybeSingle();
    provider = binding?.provider ?? null;
  }

  const { error: insertError } = await supabase.from("outbound_messages").insert({
    tenant_id: tenantContext.tenant.id,
    conversation_id: conversation.id,
    channel: conversation.channel === "voice" ? "voice" : "whatsapp",
    provider,
    review_status: "draft",
    body: latestDraft.body,
    recipient_phone: conversation.customer_phone,
    recipient_email: conversation.customer_email,
    created_by: user.id,
    metadata: {
      source: "conversation_ai_draft",
      source_message_id: latestDraft.id,
      live_dispatch_enabled: false,
    },
  });

  if (insertError) return { error: insertError.message };

  revalidateOperationsUi();
  return { success: "Draft reply queued for human review." };
}

export async function approveOutboundMessage(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const parsed = outboundMessageIdSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) return { error: "Missing outbound message." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("outbound_messages")
    .update({ review_status: "approved" })
    .eq("id", parsed.data.outbound_message_id)
    .eq("tenant_id", tenantContext.tenant.id);

  if (error) return { error: error.message };

  revalidateOperationsUi();
  return { success: "Outbound reply approved." };
}

export async function recordOutboundMessageSent(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const parsed = outboundMessageIdSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) return { error: "Missing outbound message." };

  const supabase = await createClient();
  const { data: outbound, error: outboundError } = await supabase
    .from("outbound_messages")
    .select("*")
    .eq("id", parsed.data.outbound_message_id)
    .eq("tenant_id", tenantContext.tenant.id)
    .single();

  if (outboundError || !outbound) {
    return { error: outboundError?.message ?? "Outbound message not found." };
  }

  const { error: updateError } = await supabase
    .from("outbound_messages")
    .update({
      review_status: "sent",
      sent_at: new Date().toISOString(),
      metadata: {
        ...(typeof outbound.metadata === "object" &&
        outbound.metadata &&
        !Array.isArray(outbound.metadata)
          ? outbound.metadata
          : {}),
        delivery_mode: "internal_record",
        live_dispatch_enabled: false,
      },
    })
    .eq("id", outbound.id)
    .eq("tenant_id", tenantContext.tenant.id);

  if (updateError) return { error: updateError.message };

  if (outbound.conversation_id) {
    try {
      await appendConversationMessage(supabase, {
        tenantId: tenantContext.tenant.id,
        conversationId: outbound.conversation_id,
        senderType: "human",
        direction: "outbound",
        body: outbound.body,
        metadata: {
          event_type: "outbound_message_recorded",
          outbound_message_id: outbound.id,
        },
      });
    } catch (appendError) {
      return {
        error:
          appendError instanceof Error
            ? appendError.message
            : "Outbound reply recorded, but conversation history was not updated.",
      };
    }
  }

  revalidateOperationsUi();
  return { success: "Outbound reply recorded as sent." };
}

export async function previewBookingAvailability(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const parsed = bookingStatusSchema.pick({ booking_id: true }).safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) return { error: "Missing booking." };

  const supabase = await createClient();
  const { data: booking, error: bookingError } = await supabase
    .from("booking_records")
    .select("*")
    .eq("id", parsed.data.booking_id)
    .eq("tenant_id", tenantContext.tenant.id)
    .single();

  if (bookingError || !booking) {
    return { error: bookingError?.message ?? "Booking not found." };
  }

  if (!booking.starts_at || !booking.ends_at) {
    return { error: "Add a start time before checking availability." };
  }

  const { data: overlaps, error: overlapError } = await supabase
    .from("booking_records")
    .select("id, starts_at, ends_at, service_name, status")
    .eq("tenant_id", tenantContext.tenant.id)
    .neq("id", booking.id)
    .in("status", ["pending", "confirmed", "rescheduled"])
    .lt("starts_at", booking.ends_at)
    .gt("ends_at", booking.starts_at);

  if (overlapError) return { error: overlapError.message };

  const availability = {
    checked_at: new Date().toISOString(),
    available: (overlaps ?? []).length === 0,
    source: hasCalcomConfig() ? "internal_plus_calcom_ready" : "internal_only",
    conflicts: overlaps ?? [],
  };

  const { error: updateError } = await supabase
    .from("booking_records")
    .update({
      metadata: {
        ...(typeof booking.metadata === "object" &&
        booking.metadata &&
        !Array.isArray(booking.metadata)
          ? booking.metadata
          : {}),
        availability_preview: availability,
      },
    })
    .eq("id", booking.id)
    .eq("tenant_id", tenantContext.tenant.id);

  if (updateError) return { error: updateError.message };

  revalidateOperationsUi();
  return {
    success: availability.available
      ? "Availability looks open for this time window."
      : "This time window conflicts with another booking.",
  };
}

export async function previewBookingAvailabilityFormAction(formData: FormData) {
  await previewBookingAvailability({}, formData);
}

export async function prepareStripeCheckout(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const tenantContext = await requireTenantContext();
  const parsed = orderStatusSchema.pick({ order_id: true }).safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) return { error: "Missing order." };

  const supabase = await createClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", parsed.data.order_id)
    .eq("tenant_id", tenantContext.tenant.id)
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Order not found." };
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("tenant_id", tenantContext.tenant.id)
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  if (itemsError) return { error: itemsError.message };
  const firstItem = items?.[0];
  if (!firstItem) return { error: "Add an order item before preparing checkout." };

  let checkoutUrl =
    order.payment_link_url ||
    `${getAppUrl().replace(/\/$/, "")}/dashboard/orders?preview=${order.id}`;
  let paymentProvider = order.payment_provider ?? "stripe_test_preview";
  let externalPaymentId = order.external_payment_id;
  let liveCheckoutEnabled = false;

  if (hasStripeConfig() && isLiveStripeCheckoutEnabled()) {
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set(
      "success_url",
      `${getAppUrl().replace(/\/$/, "")}/dashboard/orders?checkout=success&order=${order.id}`,
    );
    params.set(
      "cancel_url",
      `${getAppUrl().replace(/\/$/, "")}/dashboard/orders?checkout=cancelled&order=${order.id}`,
    );
    params.set("line_items[0][price_data][currency]", order.currency.toLowerCase());
    params.set("line_items[0][price_data][product_data][name]", firstItem.name);
    params.set(
      "line_items[0][price_data][unit_amount]",
      String(firstItem.unit_amount),
    );
    params.set("line_items[0][quantity]", String(firstItem.quantity));
    params.set("metadata[tenant_id]", tenantContext.tenant.id);
    params.set("metadata[order_id]", order.id);

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const responseData = await response.json();
    if (!response.ok) {
      return {
        error:
          responseData?.error?.message ??
          "Stripe checkout session could not be created.",
      };
    }

    checkoutUrl = responseData.url ?? checkoutUrl;
    paymentProvider = "stripe";
    externalPaymentId = responseData.id ?? null;
    liveCheckoutEnabled = true;
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      payment_link_url: checkoutUrl,
      payment_provider: paymentProvider,
      external_payment_id: externalPaymentId,
      metadata: {
        ...(typeof order.metadata === "object" &&
        order.metadata &&
        !Array.isArray(order.metadata)
          ? order.metadata
          : {}),
        checkout_prepared_at: new Date().toISOString(),
        live_checkout_enabled: liveCheckoutEnabled,
      },
    })
    .eq("id", order.id)
    .eq("tenant_id", tenantContext.tenant.id);

  if (updateError) return { error: updateError.message };

  revalidateOperationsUi();
  return {
    success: liveCheckoutEnabled
      ? "Stripe checkout session created."
      : "Stripe live checkout is not enabled yet, so the order stays on the internal preview link.",
  };
}

export async function prepareStripeCheckoutFormAction(formData: FormData) {
  await prepareStripeCheckout({}, formData);
}

export async function updateBookingStatus(formData: FormData) {
  const tenantContext = await requireTenantContext();
  const parsed = bookingStatusSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) return;

  const supabase = await createClient();
  await supabase
    .from("booking_records")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.booking_id)
    .eq("tenant_id", tenantContext.tenant.id);

  revalidateOperationsUi();
}

export async function updateOrderStatus(formData: FormData) {
  const tenantContext = await requireTenantContext();
  const parsed = orderStatusSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) return;

  const supabase = await createClient();
  await supabase
    .from("orders")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.order_id)
    .eq("tenant_id", tenantContext.tenant.id);

  revalidateOperationsUi();
}
