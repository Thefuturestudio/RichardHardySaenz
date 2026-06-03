import { createClient } from "@/lib/supabase/server";
import type { BookingRecord, BookingSyncConfig } from "@/types/database";

export type BookingsOverview = {
  config: BookingSyncConfig | null;
  bookings: BookingRecord[];
};

export type BookingFilters = {
  status?: BookingRecord["status"] | "all";
  query?: string;
  limit?: number;
};

export async function getBookingsOverview(
  tenantId: string,
  filters: BookingFilters = {},
): Promise<BookingsOverview> {
  const supabase = await createClient();
  const queryText = filters.query?.trim();
  const safeLimit = Math.min(Math.max(filters.limit ?? 50, 1), 100);
  let bookingsQuery = supabase
    .from("booking_records")
    .select("*")
    .eq("tenant_id", tenantId);

  if (filters.status && filters.status !== "all") {
    bookingsQuery = bookingsQuery.eq("status", filters.status);
  }

  if (queryText) {
    const escaped = queryText.replaceAll("%", "\\%").replaceAll("_", "\\_");
    bookingsQuery = bookingsQuery.or(
      [
        `customer_display_name.ilike.%${escaped}%`,
        `customer_phone.ilike.%${escaped}%`,
        `customer_email.ilike.%${escaped}%`,
        `service_name.ilike.%${escaped}%`,
      ].join(","),
    );
  }

  const [configResult, bookingsResult] = await Promise.all([
    supabase
      .from("booking_sync_configs")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("provider", "cal_com")
      .limit(1)
      .maybeSingle(),
    bookingsQuery.order("created_at", { ascending: false }).limit(safeLimit),
  ]);

  if (configResult.error) throw new Error(configResult.error.message);
  if (bookingsResult.error) throw new Error(bookingsResult.error.message);

  return {
    config: configResult.data ?? null,
    bookings: bookingsResult.data ?? [],
  };
}
