import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CatalogItem,
  Conversation,
  Customer,
  Database,
  Json,
  Message,
} from "@/types/database";

type ContactInput = {
  displayName?: string | null;
  phone?: string | null;
  email?: string | null;
  source?: string | null;
};

type ConversationInsertInput = {
  tenantId: string;
  channel: "voice" | "whatsapp";
  channelBindingId?: string | null;
  externalConversationId?: string | null;
  customerDisplayName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  status?: Conversation["status"];
  intent?: Conversation["intent"];
  summary?: string | null;
  initialMessage: string;
  metadata?: Record<string, unknown>;
};

type DraftContext = {
  businessName: string;
  bookingUrl?: string | null;
  humanFallbackNumber?: string | null;
  tone?: string | null;
};

export type DraftReplyResult = {
  body: string;
  matchedItems: CatalogItem[];
};

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

export function normalizePhone(value?: string | null) {
  if (!value) return null;
  const normalized = value.replace(/[^\d+]/g, "");
  return normalized.length > 0 ? normalized : null;
}

export function inferConversationIntent(
  value: string,
  fallback: Conversation["intent"] = "unknown",
): Conversation["intent"] {
  const message = value.toLowerCase();

  if (
    /(book|booking|reserve|reservation|available|availability|appointment|calendar|schedule)/.test(
      message,
    )
  ) {
    return "booking";
  }

  if (
    /(buy|price|pricing|product|catalog|cost|pay|payment|checkout|quote|order)/.test(
      message,
    )
  ) {
    return "sales";
  }

  if (/(help|issue|problem|support|broken|refund|cancel)/.test(message)) {
    return "support";
  }

  if (/(human|person|call me|agent|speak to)/.test(message)) {
    return "handoff";
  }

  return fallback;
}

function scoreCatalogItem(item: CatalogItem, tokens: string[]) {
  const haystack = `${item.name} ${item.description ?? ""}`.toLowerCase();
  return tokens.reduce((score, token) => {
    return haystack.includes(token) ? score + 1 : score;
  }, 0);
}

function formatCatalogPrice(item: CatalogItem) {
  if (item.price_amount === null) return "price available on request";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: item.currency,
  }).format(item.price_amount);
}

export function buildRuleBasedDraftReply(args: {
  conversation: Conversation;
  latestCustomerMessage: string;
  catalogItems: CatalogItem[];
  context: DraftContext;
}): DraftReplyResult {
  const { conversation, latestCustomerMessage, catalogItems, context } = args;
  const tokens = tokenize(
    `${latestCustomerMessage} ${conversation.summary ?? ""} ${
      conversation.customer_display_name ?? ""
    }`,
  );

  const matchedItems = [...catalogItems]
    .map((item) => ({ item, score: scoreCatalogItem(item, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((entry) => entry.item);

  const customerName = conversation.customer_display_name || "there";
  const greeting = `Hi ${customerName}, thanks for reaching out to ${context.businessName}.`;
  const toneLine =
    context.tone === "friendly"
      ? "Happy to help."
      : "I can help with that.";

  if (conversation.intent === "booking") {
    const bookingCallout = context.bookingUrl
      ? `We can help you lock this in and also share our booking link here if needed: ${context.bookingUrl}`
      : "We can help you lock this in and confirm the best time slot for you.";

    return {
      matchedItems,
      body: [
        greeting,
        toneLine,
        bookingCallout,
        "Please let us know your preferred day, approximate time, and the service you want so we can confirm availability.",
        "Review before sending.",
      ].join(" "),
    };
  }

  if (conversation.intent === "sales") {
    const offerLine =
      matchedItems.length > 0
        ? `Based on the request, the closest matches are ${matchedItems
            .slice(0, 2)
            .map((item) => `${item.name} (${formatCatalogPrice(item)})`)
            .join(" and ")}.`
        : "We can recommend the right product or service once we know what the customer needs most.";

    return {
      matchedItems,
      body: [
        greeting,
        toneLine,
        offerLine,
        "If they want to move forward, we can prepare a payment link or quote in the dashboard.",
        "Review before sending.",
      ].join(" "),
    };
  }

  if (conversation.intent === "support" || conversation.intent === "handoff") {
    const fallbackLine = context.humanFallbackNumber
      ? `If this needs a person immediately, the business fallback number is ${context.humanFallbackNumber}.`
      : "If this needs a person immediately, route it to the human fallback contact.";

    return {
      matchedItems,
      body: [
        greeting,
        "We’ve logged the request and a team member can step in if needed.",
        fallbackLine,
        "Review before sending.",
      ].join(" "),
    };
  }

  return {
    matchedItems,
    body: [
      greeting,
      toneLine,
      "We can help with availability, recommendations, pricing, or next steps.",
      "Ask one focused follow-up question so the team can move the conversation forward cleanly.",
      "Review before sending.",
    ].join(" "),
  };
}

export async function upsertCustomerRecord(
  supabase: SupabaseClient<Database>,
  tenantId: string,
  contact: ContactInput,
) {
  const phone = normalizePhone(contact.phone);
  const email = contact.email?.trim().toLowerCase() || null;

  let existingCustomer: Customer | null = null;

  if (phone) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("phone", phone)
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    existingCustomer = data;
  }

  if (!existingCustomer && email) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    existingCustomer = data;
  }

  if (existingCustomer) {
    const { data, error } = await supabase
      .from("customers")
      .update({
        display_name: contact.displayName || existingCustomer.display_name,
        phone: phone || existingCustomer.phone,
        email: email || existingCustomer.email,
        metadata: {
          ...(typeof existingCustomer.metadata === "object" &&
          !Array.isArray(existingCustomer.metadata) &&
          existingCustomer.metadata !== null
            ? existingCustomer.metadata
            : {}),
          last_source: contact.source ?? "conversation_runtime",
        },
      })
      .eq("id", existingCustomer.id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  const { data, error } = await supabase
    .from("customers")
    .insert({
      tenant_id: tenantId,
      display_name: contact.displayName ?? null,
      phone,
      email,
      source: contact.source ?? "conversation_runtime",
      status: "active",
      metadata: {
        created_by_runtime: true,
      },
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createConversationWithInitialMessage(
  supabase: SupabaseClient<Database>,
  input: ConversationInsertInput,
) {
  const intent = inferConversationIntent(
    `${input.summary ?? ""} ${input.initialMessage}`,
    input.intent ?? "unknown",
  );

  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .insert({
      tenant_id: input.tenantId,
      channel: input.channel,
      channel_binding_id: input.channelBindingId ?? null,
      external_conversation_id: input.externalConversationId ?? null,
      customer_display_name: input.customerDisplayName ?? null,
      customer_phone: normalizePhone(input.customerPhone),
      customer_email: input.customerEmail?.trim().toLowerCase() ?? null,
      status: input.status ?? "open",
      intent,
      summary: input.summary ?? null,
      last_message_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (conversationError || !conversation) {
    throw new Error(conversationError?.message ?? "Could not create conversation.");
  }

  const { error: messageError } = await supabase.from("messages").insert({
    tenant_id: input.tenantId,
    conversation_id: conversation.id,
    sender_type: "customer",
    direction: "inbound",
    body: input.initialMessage,
    metadata: (input.metadata ?? {}) as Json,
  });

  if (messageError) {
    throw new Error(messageError.message);
  }

  if (input.customerDisplayName || input.customerPhone || input.customerEmail) {
    await upsertCustomerRecord(supabase, input.tenantId, {
      displayName: input.customerDisplayName,
      phone: input.customerPhone,
      email: input.customerEmail,
      source: input.channel === "whatsapp" ? "whatsapp_runtime" : "voice_runtime",
    });
  }

  return conversation;
}

export async function appendConversationMessage(
  supabase: SupabaseClient<Database>,
  args: {
    tenantId: string;
    conversationId: string;
    senderType: Message["sender_type"];
    direction: Message["direction"];
    body: string;
    metadata?: Record<string, unknown>;
  },
) {
  const { error } = await supabase.from("messages").insert({
    tenant_id: args.tenantId,
    conversation_id: args.conversationId,
    sender_type: args.senderType,
    direction: args.direction,
    body: args.body,
    metadata: (args.metadata ?? {}) as Json,
  });

  if (error) throw new Error(error.message);

  const { error: updateError } = await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", args.conversationId)
    .eq("tenant_id", args.tenantId);

  if (updateError) throw new Error(updateError.message);
}

export function toMinorUnits(value: number) {
  return Math.round(value * 100);
}
