import { createClient } from "@/lib/supabase/server";

export async function getChannelBindingsForTenant(tenantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("channel_bindings")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
