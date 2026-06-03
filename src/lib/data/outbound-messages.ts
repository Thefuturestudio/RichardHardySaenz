import { createClient } from "@/lib/supabase/server";
import type { OutboundMessage } from "@/types/database";

export async function getOutboundMessagesForTenant(
  tenantId: string,
): Promise<OutboundMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("outbound_messages")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
