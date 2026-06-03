"use client";

import { useActionState } from "react";
import {
  Archive,
  Boxes,
  Clock,
  ImageIcon,
  PackagePlus,
  Save,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import {
  createCatalogItem,
  createCategory,
  deleteCatalogItem,
  updateCatalogItem,
} from "@/app/dashboard/catalog/actions";
import type { CatalogItemWithCategory } from "@/lib/data/catalog";
import type { ActionState } from "@/types";
import type { CatalogCategory } from "@/types/database";

type CatalogManagerProps = {
  categories: CatalogCategory[];
  items: CatalogItemWithCategory[];
  canEdit: boolean;
};

const initialState: ActionState = {};

function formatMoney(value: number | null, currency: string) {
  if (value === null) return "Price not set";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

function CategoryForm({ canEdit }: { canEdit: boolean }) {
  const [state, formAction, isPending] = useActionState(
    createCategory,
    initialState,
  );

  return (
    <form action={formAction} className="viva-auth-card rounded-[1.7rem] p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-viva-gradient-soft text-viva-primary">
          <Tag className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-black text-viva-ink">
            Add category
          </h2>
          <p className="mt-1 text-sm leading-6 text-viva-muted">
            Group products or services for future AI recommendations.
          </p>
        </div>
      </div>

      <fieldset disabled={!canEdit || isPending} className="mt-5 space-y-4 disabled:opacity-60">
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Name</span>
          <input
            name="name"
            required
            className="viva-field mt-2 px-4 py-3"
            placeholder="Featured products"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Description</span>
          <textarea
            name="description"
            rows={3}
            className="viva-field mt-2 px-4 py-3"
            placeholder="Best sellers, core services, or seasonal offers."
          />
        </label>
      </fieldset>

      {state.error ? (
        <div className="mt-4 rounded-xl border border-viva-error/30 bg-viva-error/10 px-4 py-3 text-sm text-viva-error">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="mt-4 rounded-xl border border-viva-success/30 bg-viva-success/10 px-4 py-3 text-sm text-viva-success">
          {state.success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canEdit || isPending}
        className="viva-button-ghost mt-5 h-11 w-full px-4 text-sm font-bold"
      >
        <PackagePlus className="h-4 w-4" />
        {isPending ? "Adding..." : "Add category"}
      </button>
    </form>
  );
}

function ItemCreateForm({
  categories,
  canEdit,
}: {
  categories: CatalogCategory[];
  canEdit: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    createCatalogItem,
    initialState,
  );

  return (
    <form action={formAction} className="viva-glow-card rounded-[2rem] p-6 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-viva-primary">
            Catalog item
          </div>
          <h2 className="font-display text-3xl font-black text-viva-ink">
            Add product or service
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-viva-muted">
            Step 2 stores the offer catalog only. Checkout, carts, payments, and
            AI selling tools are still future phases.
          </p>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
          <Sparkles className="h-6 w-6" />
        </div>
      </div>

      <fieldset disabled={!canEdit || isPending} className="mt-6 grid gap-5 sm:grid-cols-2 disabled:opacity-60">
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Name</span>
          <input
            name="name"
            required
            className="viva-field mt-2 px-4 py-3"
            placeholder="Teeth whitening session"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Type</span>
          <select name="item_type" defaultValue="product" className="viva-field mt-2 px-4 py-3">
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Category</span>
          <select name="category_id" defaultValue="" className="viva-field mt-2 px-4 py-3">
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-[1fr_6rem] gap-3">
          <label className="block">
            <span className="text-sm font-medium text-viva-ink">Price</span>
            <input
              name="price_amount"
              inputMode="decimal"
              className="viva-field mt-2 px-4 py-3"
              placeholder="49.00"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-viva-ink">Currency</span>
            <input
              name="currency"
              defaultValue="USD"
              maxLength={3}
              className="viva-field mt-2 px-4 py-3 uppercase"
            />
          </label>
        </div>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-viva-ink">Description</span>
          <textarea
            name="description"
            rows={3}
            className="viva-field mt-2 px-4 py-3"
            placeholder="Short description the future agent can use when answering questions."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Image URL</span>
          <input
            name="image_url"
            type="url"
            className="viva-field mt-2 px-4 py-3"
            placeholder="https://..."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">SKU</span>
          <input
            name="sku"
            className="viva-field mt-2 px-4 py-3"
            placeholder="SKU-001"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Duration minutes</span>
          <input
            name="duration_minutes"
            inputMode="numeric"
            className="viva-field mt-2 px-4 py-3"
            placeholder="60"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Inventory</span>
          <input
            name="inventory_quantity"
            inputMode="numeric"
            className="viva-field mt-2 px-4 py-3"
            placeholder="25"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-viva-line/70 bg-viva-card/55 px-4 py-3 sm:col-span-2">
          <input name="is_active" type="checkbox" defaultChecked className="rounded border-viva-line text-viva-primary focus:ring-viva-primary" />
          <span className="text-sm font-medium text-viva-ink">Active in catalog</span>
        </label>
      </fieldset>

      {state.error ? (
        <div className="mt-5 rounded-xl border border-viva-error/30 bg-viva-error/10 px-4 py-3 text-sm text-viva-error">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="mt-5 rounded-xl border border-viva-success/30 bg-viva-success/10 px-4 py-3 text-sm text-viva-success">
          {state.success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canEdit || isPending}
        className="viva-button-primary mt-6 h-12 px-5 text-sm font-bold"
      >
        <PackagePlus className="h-4 w-4" />
        {isPending ? "Adding..." : "Add catalog item"}
      </button>
    </form>
  );
}

function ItemCard({
  item,
  categories,
  canEdit,
}: {
  item: CatalogItemWithCategory;
  categories: CatalogCategory[];
  canEdit: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    updateCatalogItem,
    initialState,
  );

  return (
    <article className="viva-auth-card rounded-[1.7rem] p-5">
      <form action={formAction}>
        <input type="hidden" name="id" value={item.id} />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-viva-gradient-soft text-viva-primary">
              {item.image_url ? <ImageIcon className="h-5 w-5" /> : <Boxes className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-viva-line bg-viva-elevated/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-viva-muted">
                  {item.item_type}
                </span>
                <span className={item.is_active ? "text-xs font-semibold text-viva-success" : "text-xs font-semibold text-viva-subtle"}>
                  {item.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-black text-viva-ink">
                {item.name}
              </h3>
              <p className="mt-1 text-sm text-viva-muted">
                {item.catalog_categories?.name ?? "Uncategorized"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-xl font-black text-viva-ink">
              {formatMoney(item.price_amount, item.currency)}
            </div>
            {item.sku ? (
              <div className="mt-1 text-xs text-viva-subtle">{item.sku}</div>
            ) : null}
          </div>
        </div>

        <fieldset disabled={!canEdit || isPending} className="mt-5 grid gap-4 sm:grid-cols-2 disabled:opacity-60">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">Name</span>
            <input name="name" required defaultValue={item.name} className="viva-field mt-2 px-3 py-2.5 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">Type</span>
            <select name="item_type" defaultValue={item.item_type} className="viva-field mt-2 px-3 py-2.5 text-sm">
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">Category</span>
            <select name="category_id" defaultValue={item.category_id ?? ""} className="viva-field mt-2 px-3 py-2.5 text-sm">
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-[1fr_5rem] gap-2">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">Price</span>
              <input name="price_amount" defaultValue={item.price_amount ?? ""} className="viva-field mt-2 px-3 py-2.5 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">CCY</span>
              <input name="currency" defaultValue={item.currency} maxLength={3} className="viva-field mt-2 px-3 py-2.5 text-sm uppercase" />
            </label>
          </div>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">Description</span>
            <textarea name="description" rows={3} defaultValue={item.description ?? ""} className="viva-field mt-2 px-3 py-2.5 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">Image URL</span>
            <input name="image_url" type="url" defaultValue={item.image_url ?? ""} className="viva-field mt-2 px-3 py-2.5 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">SKU</span>
            <input name="sku" defaultValue={item.sku ?? ""} className="viva-field mt-2 px-3 py-2.5 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">Duration</span>
            <input name="duration_minutes" defaultValue={item.duration_minutes ?? ""} className="viva-field mt-2 px-3 py-2.5 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">Inventory</span>
            <input name="inventory_quantity" defaultValue={item.inventory_quantity ?? ""} className="viva-field mt-2 px-3 py-2.5 text-sm" />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-viva-line/70 bg-viva-card/55 px-4 py-3 sm:col-span-2">
            <input name="is_active" type="checkbox" defaultChecked={item.is_active} className="rounded border-viva-line text-viva-primary focus:ring-viva-primary" />
            <span className="text-sm font-medium text-viva-ink">Active in catalog</span>
          </label>
        </fieldset>

        {state.error ? (
          <div className="mt-4 rounded-xl border border-viva-error/30 bg-viva-error/10 px-4 py-3 text-sm text-viva-error">
            {state.error}
          </div>
        ) : null}

        {state.success ? (
          <div className="mt-4 rounded-xl border border-viva-success/30 bg-viva-success/10 px-4 py-3 text-sm text-viva-success">
            {state.success}
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 border-t border-viva-line/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3 text-xs text-viva-muted">
            {item.duration_minutes ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {item.duration_minutes} min
              </span>
            ) : null}
            {item.inventory_quantity !== null ? (
              <span className="inline-flex items-center gap-1">
                <Archive className="h-3.5 w-3.5" />
                {item.inventory_quantity} in stock
              </span>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!canEdit || isPending}
              className="viva-button-primary h-10 px-4 text-sm font-bold"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>

      <form action={deleteCatalogItem} className="mt-3 flex justify-end">
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          disabled={!canEdit}
          className="viva-button-ghost h-9 px-3 text-sm font-semibold text-viva-error"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </form>
    </article>
  );
}

export function CatalogManager({
  categories,
  items,
  canEdit,
}: CatalogManagerProps) {
  const activeItems = items.filter((item) => item.is_active).length;
  const services = items.filter((item) => item.item_type === "service").length;
  const products = items.filter((item) => item.item_type === "product").length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Total items", items.length],
          ["Active", activeItems],
          ["Products", products],
          ["Services", services],
        ].map(([label, value]) => (
          <div key={label} className="viva-glass rounded-2xl p-5">
            <div className="text-sm text-viva-muted">{label}</div>
            <div className="mt-1 font-display text-3xl font-black text-viva-ink">
              {value}
            </div>
          </div>
        ))}
      </section>

      {!canEdit ? (
        <div className="rounded-2xl border border-viva-warning/30 bg-viva-warning/10 px-4 py-3 text-sm text-viva-ink">
          Staff members can view the catalog but cannot change products or services.
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <ItemCreateForm categories={categories} canEdit={canEdit} />
        <CategoryForm canEdit={canEdit} />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-black text-viva-ink">
              Catalog library
            </h2>
            <p className="mt-1 text-sm text-viva-muted">
              These records are tenant-scoped and ready for later AI, checkout,
              and booking tools.
            </p>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                categories={categories}
                canEdit={canEdit}
              />
            ))}
          </div>
        ) : (
          <div className="viva-auth-card rounded-[2rem] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
              <PackagePlus className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-3xl font-black text-viva-ink">
              No catalog items yet
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-viva-muted">
              Add the first product or service. Later, Venta Viva will use this
              catalog to answer questions, recommend items, and build carts.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
