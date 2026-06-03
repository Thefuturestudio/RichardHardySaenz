import { createClient } from "@/lib/supabase/server";
import type { CatalogCategory, CatalogItem } from "@/types/database";

export type CatalogItemWithCategory = CatalogItem & {
  catalog_categories: Pick<CatalogCategory, "id" | "name"> | null;
};

export async function getCatalogForTenant(tenantId: string) {
  const supabase = await createClient();

  const [categoriesResult, itemsResult] = await Promise.all([
    supabase
      .from("catalog_categories")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("catalog_items")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false }),
  ]);

  if (categoriesResult.error) {
    throw new Error(categoriesResult.error.message);
  }

  if (itemsResult.error) {
    throw new Error(itemsResult.error.message);
  }

  const categories = categoriesResult.data ?? [];
  const categoryMap = new Map(
    categories.map((category) => [
      category.id,
      { id: category.id, name: category.name },
    ]),
  );

  return {
    categories,
    items: (itemsResult.data ?? []).map((item) => ({
      ...item,
      catalog_categories: item.category_id
        ? categoryMap.get(item.category_id) ?? null
        : null,
    })),
  };
}
