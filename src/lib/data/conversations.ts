import { createClient } from "@/lib/supabase/server";
import type {
  ChannelBinding,
  Conversation,
  Message,
  OutboundMessage,
} from "@/types/database";

export type ConversationWithMessages = Conversation & {
  channel_binding: Pick<ChannelBinding, "id" | "provider" | "external_id" | "status"> | null;
  messages: Message[];
  outbound_messages: OutboundMessage[];
};

export type ConversationFilters = {
  status?: Conversation["status"] | "all";
  intent?: Conversation["intent"] | "all";
  query?: string;
  limit?: number;
};

export async function getConversationsForTenant(
  tenantId: string,
  filters: ConversationFilters = {},
) {
  const supabase = await createClient();
  const queryText = filters.query?.trim();
  const safeLimit = Math.min(Math.max(filters.limit ?? 50, 1), 100);

  let conversationsQuery = supabase
    .from("conversations")
    .select("*")
    .eq("tenant_id", tenantId);

  if (filters.status && filters.status !== "all") {
    conversationsQuery = conversationsQuery.eq("status", filters.status);
  }

  if (filters.intent && filters.intent !== "all") {
    conversationsQuery = conversationsQuery.eq("intent", filters.intent);
  }

  if (queryText) {
    const escaped = queryText.replaceAll("%", "\\%").replaceAll("_", "\\_");
    conversationsQuery = conversationsQuery.or(
      [
        `customer_display_name.ilike.%${escaped}%`,
        `customer_phone.ilike.%${escaped}%`,
        `customer_email.ilike.%${escaped}%`,
        `summary.ilike.%${escaped}%`,
      ].join(","),
    );
  }

  const [conversationsResult, bindingsResult, messagesResult, outboundResult] = await Promise.all([
    conversationsQuery
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(safeLimit),
    supabase
      .from("channel_bindings")
      .select("id, provider, external_id, status")
      .eq("tenant_id", tenantId),
    supabase
      .from("messages")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("occurred_at", { ascending: true }),
    supabase
      .from("outbound_messages")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false }),
  ]);

  if (conversationsResult.error) {
    throw new Error(conversationsResult.error.message);
  }

  if (bindingsResult.error) {
    throw new Error(bindingsResult.error.message);
  }

  if (messagesResult.error) {
    throw new Error(messagesResult.error.message);
  }

  if (outboundResult.error) {
    throw new Error(outboundResult.error.message);
  }

  const bindingMap = new Map(
    (bindingsResult.data ?? []).map((binding) => [binding.id, binding]),
  );
  const messagesByConversation = new Map<string, Message[]>();
  const outboundByConversation = new Map<string, OutboundMessage[]>();

  for (const message of messagesResult.data ?? []) {
    const existing = messagesByConversation.get(message.conversation_id) ?? [];
    existing.push(message);
    messagesByConversation.set(message.conversation_id, existing);
  }

  for (const outbound of outboundResult.data ?? []) {
    if (!outbound.conversation_id) continue;
    const existing = outboundByConversation.get(outbound.conversation_id) ?? [];
    existing.push(outbound);
    outboundByConversation.set(outbound.conversation_id, existing);
  }

  return (conversationsResult.data ?? []).map((conversation) => ({
    ...conversation,
    channel_binding: conversation.channel_binding_id
      ? bindingMap.get(conversation.channel_binding_id) ?? null
      : null,
    messages: messagesByConversation.get(conversation.id) ?? [],
    outbound_messages: outboundByConversation.get(conversation.id) ?? [],
  }));
}
