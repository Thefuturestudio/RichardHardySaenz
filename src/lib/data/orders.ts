import { createClient } from "@/lib/supabase/server";
import type { Order, OrderItem } from "@/types/database";

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export type OrderFilters = {
  status?: Order["status"] | "all";
  query?: string;
  limit?: number;
};

export async function getOrdersForTenant(
  tenantId: string,
  filters: OrderFilters = {},
) {
  const supabase = await createClient();
  const queryText = filters.query?.trim();
  const safeLimit = Math.min(Math.max(filters.limit ?? 50, 1), 100);
  let ordersQuery = supabase
    .from("orders")
    .select("*")
    .eq("tenant_id", tenantId);

  if (filters.status && filters.status !== "all") {
    ordersQuery = ordersQuery.eq("status", filters.status);
  }

  if (queryText) {
    const escaped = queryText.replaceAll("%", "\\%").replaceAll("_", "\\_");
    ordersQuery = ordersQuery.or(
      [
        `customer_display_name.ilike.%${escaped}%`,
        `customer_phone.ilike.%${escaped}%`,
        `customer_email.ilike.%${escaped}%`,
        `payment_provider.ilike.%${escaped}%`,
      ].join(","),
    );
  }

  const [ordersResult, itemsResult] = await Promise.all([
    ordersQuery.order("created_at", { ascending: false }).limit(safeLimit),
    supabase
      .from("order_items")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: true }),
  ]);

  if (ordersResult.error) throw new Error(ordersResult.error.message);
  if (itemsResult.error) throw new Error(itemsResult.error.message);

  const itemsByOrder = new Map<string, OrderItem[]>();
  for (const item of itemsResult.data ?? []) {
    const existing = itemsByOrder.get(item.order_id) ?? [];
    existing.push(item);
    itemsByOrder.set(item.order_id, existing);
  }

  return (ordersResult.data ?? []).map((order) => ({
    ...order,
    items: itemsByOrder.get(order.id) ?? [],
  }));
}
