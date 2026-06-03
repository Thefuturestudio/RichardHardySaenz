"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || null);

const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name is required."),
  description: optionalText,
});

const itemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Item name is required."),
  item_type: z.enum(["product", "service"]),
  category_id: optionalText,
  description: optionalText,
  price_amount: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value) return null;
      const number = Number(value);
      return Number.isFinite(number) ? number : Number.NaN;
    })
    .refine((value) => value === null || !Number.isNaN(value), {
      message: "Price must be a valid number.",
    }),
  currency: z.string().trim().min(3).max(3).default("USD"),
  image_url: optionalText,
  sku: optionalText,
  duration_minutes: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value) return null;
      const number = Number(value);
      return Number.isInteger(number) && number >= 0 ? number : Number.NaN;
    })
    .refine((value) => value === null || !Number.isNaN(value), {
      message: "Duration must be a whole number.",
    }),
  inventory_quantity: z
    .string()
    .trim()
    .optional()
    .transform((value) => {
      if (!value) return null;
      const number = Number(value);
      return Number.isInteger(number) && number >= 0 ? number : Number.NaN;
    })
    .refine((value) => value === null || !Number.isNaN(value), {
      message: "Inventory must be a whole number.",
    }),
  is_active: z
    .string()
    .optional()
    .transform((value) => value === "on"),
});

async function requireCatalogEditor() {
  const tenantContext = await requireTenantContext();

  if (!canManageTenant(tenantContext.role)) {
    return {
      error: "Only owners and admins can manage the catalog.",
      tenantContext,
    };
  }

  return { tenantContext };
}

export async function createCategory(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const editor = await requireCatalogEditor();
  if (editor.error) return { error: editor.error };

  const parsed = categorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the category form." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("catalog_categories").insert({
    tenant_id: editor.tenantContext.tenant.id,
    name: parsed.data.name,
    description: parsed.data.description,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/catalog");
  return { success: "Category added." };
}

export async function createCatalogItem(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const editor = await requireCatalogEditor();
  if (editor.error) return { error: editor.error };

  const parsed = itemSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the item form." };
  }

  const values = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("catalog_items").insert({
    tenant_id: editor.tenantContext.tenant.id,
    name: values.name,
    item_type: values.item_type,
    category_id: values.category_id,
    description: values.description,
    price_amount: values.price_amount,
    currency: values.currency.toUpperCase(),
    image_url: values.image_url,
    sku: values.sku,
    duration_minutes: values.duration_minutes,
    inventory_quantity: values.inventory_quantity,
    is_active: values.is_active,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/catalog");
  return { success: "Catalog item added." };
}

export async function updateCatalogItem(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const editor = await requireCatalogEditor();
  if (editor.error) return { error: editor.error };

  const parsed = itemSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success || !parsed.data.id) {
    return { error: parsed.error?.issues[0]?.message ?? "Missing catalog item." };
  }

  const values = parsed.data;
  const itemId = values.id;
  if (!itemId) {
    return { error: "Missing catalog item." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("catalog_items")
    .update({
      name: values.name,
      item_type: values.item_type,
      category_id: values.category_id,
      description: values.description,
      price_amount: values.price_amount,
      currency: values.currency.toUpperCase(),
      image_url: values.image_url,
      sku: values.sku,
      duration_minutes: values.duration_minutes,
      inventory_quantity: values.inventory_quantity,
      is_active: values.is_active,
    })
    .eq("id", itemId)
    .eq("tenant_id", editor.tenantContext.tenant.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/catalog");
  return { success: "Catalog item updated." };
}

export async function deleteCatalogItem(formData: FormData) {
  const editor = await requireCatalogEditor();
  if (editor.error) return;

  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;

  const supabase = await createClient();
  await supabase
    .from("catalog_items")
    .delete()
    .eq("id", id.data)
    .eq("tenant_id", editor.tenantContext.tenant.id);

  revalidatePath("/dashboard/catalog");
}
