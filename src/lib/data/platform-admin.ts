import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Tenant } from "@/types/database";

export type TenantAdminRow = Tenant & {
  member_count: number;
  conversation_count: number;
  order_count: number;
  booking_count: number;
  provider_count: number;
};

export async function getTenantAdminRows(
  currentTenantId: string,
  userEmail?: string | null,
): Promise<{
  scope: "platform" | "tenant";
  rows: TenantAdminRow[];
}> {
  const platformOwnerEmail = process.env.PLATFORM_OWNER_EMAIL;
  const isPlatformOwner =
    Boolean(platformOwnerEmail) &&
    Boolean(userEmail) &&
    platformOwnerEmail?.toLowerCase() === userEmail?.toLowerCase();

  const supabase = isPlatformOwner ? createAdminClient() : await createClient();
  const tenantQuery = supabase
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false });

  if (!isPlatformOwner) {
    tenantQuery.eq("id", currentTenantId);
  }

  const { data: tenants, error } = await tenantQuery;
  if (error) throw new Error(error.message);

  const rows = await Promise.all(
    (tenants ?? []).map(async (tenant) => {
      const [
        members,
        conversations,
        orders,
        bookings,
        providers,
      ] = await Promise.all([
        supabase
          .from("tenant_memberships")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", tenant.id),
        supabase
          .from("conversations")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", tenant.id),
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", tenant.id),
        supabase
          .from("booking_records")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", tenant.id),
        supabase
          .from("provider_activation_states")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", tenant.id),
      ]);

      for (const result of [members, conversations, orders, bookings, providers]) {
        if (result.error) throw new Error(result.error.message);
      }

      return {
        ...tenant,
        member_count: members.count ?? 0,
        conversation_count: conversations.count ?? 0,
        order_count: orders.count ?? 0,
        booking_count: bookings.count ?? 0,
        provider_count: providers.count ?? 0,
      };
    }),
  );

  return {
    scope: isPlatformOwner ? "platform" : "tenant",
    rows,
  };
}
