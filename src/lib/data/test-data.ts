import { createClient } from "@/lib/supabase/server";

export type TestDataOverview = {
  conversations: number;
  bookings: number;
  orders: number;
  outboundMessages: number;
  webhookEvents: number;
};

export async function getTestDataOverview(tenantId: string): Promise<TestDataOverview> {
  const supabase = await createClient();
  const [conversations, bookings, orders, outboundMessages, webhookEvents] =
    await Promise.all([
      supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .or(
          "customer_display_name.ilike.%Test%,customer_display_name.ilike.%Demo%,summary.ilike.%test%,summary.ilike.%Launch%",
        ),
      supabase
        .from("booking_records")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .or("customer_display_name.ilike.%Test%,customer_display_name.ilike.%Demo%,service_name.ilike.%Demo%"),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId)
        .or("customer_display_name.ilike.%Test%,customer_display_name.ilike.%Demo%,payment_provider.ilike.%test%"),
      supabase
        .from("outbound_messages")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId),
      supabase
        .from("webhook_ingest_events")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", tenantId),
    ]);

  for (const result of [conversations, bookings, orders, outboundMessages, webhookEvents]) {
    if (result.error) throw new Error(result.error.message);
  }

  return {
    conversations: conversations.count ?? 0,
    bookings: bookings.count ?? 0,
    orders: orders.count ?? 0,
    outboundMessages: outboundMessages.count ?? 0,
    webhookEvents: webhookEvents.count ?? 0,
  };
}
