"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

const bindingSchema = z.object({
  id: z.string().uuid().optional(),
  channel: z.enum(["voice", "whatsapp"]),
  provider: z.string().trim().min(2, "Provider is required."),
  external_id: z.string().trim().min(2, "External ID is required."),
  status: z.enum([
    "pending",
    "draft",
    "pending_credentials",
    "ready_to_connect",
    "test_mode",
    "paused",
  ]),
});

async function requireChannelEditor() {
  const tenantContext = await requireTenantContext();

  if (!canManageTenant(tenantContext.role)) {
    return {
      error: "Only owners and admins can manage channel bindings.",
      tenantContext,
    };
  }

  return { tenantContext };
}

export async function createChannelBinding(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const editor = await requireChannelEditor();
  if (editor.error) return { error: editor.error };

  const parsed = bindingSchema
    .omit({ id: true })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the channel form." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("channel_bindings").insert({
    tenant_id: editor.tenantContext.tenant.id,
    channel: parsed.data.channel,
    provider: parsed.data.provider,
    external_id: parsed.data.external_id,
    status: parsed.data.status,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/channels");
  revalidatePath("/dashboard/conversations");
  return { success: "Channel binding saved." };
}

export async function updateChannelBinding(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const editor = await requireChannelEditor();
  if (editor.error) return { error: editor.error };

  const parsed = bindingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success || !parsed.data.id) {
    return { error: parsed.error?.issues[0]?.message ?? "Missing channel binding." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("channel_bindings")
    .update({
      channel: parsed.data.channel,
      provider: parsed.data.provider,
      external_id: parsed.data.external_id,
      status: parsed.data.status,
    })
    .eq("id", parsed.data.id)
    .eq("tenant_id", editor.tenantContext.tenant.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/channels");
  revalidatePath("/dashboard/conversations");
  return { success: "Channel binding updated." };
}

export async function deleteChannelBinding(formData: FormData) {
  const editor = await requireChannelEditor();
  if (editor.error) return;

  const parsed = z.string().uuid().safeParse(formData.get("id"));
  if (!parsed.success) return;

  const supabase = await createClient();
  await supabase
    .from("channel_bindings")
    .delete()
    .eq("id", parsed.data)
    .eq("tenant_id", editor.tenantContext.tenant.id);

  revalidatePath("/dashboard/channels");
  revalidatePath("/dashboard/conversations");
}
