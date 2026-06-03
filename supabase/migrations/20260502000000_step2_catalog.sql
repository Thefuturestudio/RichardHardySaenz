create table if not exists public.catalog_categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, name)
);

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  category_id uuid references public.catalog_categories(id) on delete set null,
  item_type text not null default 'product' check (item_type in ('product', 'service')),
  name text not null,
  description text,
  price_amount numeric(12, 2),
  currency text not null default 'USD',
  image_url text,
  sku text,
  duration_minutes integer,
  inventory_quantity integer,
  is_active boolean not null default true,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_categories_tenant_id_idx
on public.catalog_categories(tenant_id);

create index if not exists catalog_items_tenant_id_idx
on public.catalog_items(tenant_id);

create index if not exists catalog_items_category_id_idx
on public.catalog_items(category_id);

create index if not exists catalog_items_tenant_active_idx
on public.catalog_items(tenant_id, is_active);

create or replace function public.ensure_catalog_item_category_tenant()
returns trigger
language plpgsql
as $$
begin
  if new.category_id is not null and not exists (
    select 1
    from public.catalog_categories cc
    where cc.id = new.category_id
      and cc.tenant_id = new.tenant_id
  ) then
    raise exception 'Catalog item category must belong to the same tenant'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists catalog_items_category_tenant_check on public.catalog_items;
create trigger catalog_items_category_tenant_check
before insert or update on public.catalog_items
for each row execute function public.ensure_catalog_item_category_tenant();

drop trigger if exists catalog_categories_set_updated_at on public.catalog_categories;
create trigger catalog_categories_set_updated_at
before update on public.catalog_categories
for each row execute function public.set_updated_at();

drop trigger if exists catalog_items_set_updated_at on public.catalog_items;
create trigger catalog_items_set_updated_at
before update on public.catalog_items
for each row execute function public.set_updated_at();

alter table public.catalog_categories enable row level security;
alter table public.catalog_items enable row level security;

drop policy if exists "catalog_categories_select_member" on public.catalog_categories;
create policy "catalog_categories_select_member"
on public.catalog_categories for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "catalog_categories_insert_admin" on public.catalog_categories;
create policy "catalog_categories_insert_admin"
on public.catalog_categories for insert
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "catalog_categories_update_admin" on public.catalog_categories;
create policy "catalog_categories_update_admin"
on public.catalog_categories for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "catalog_categories_delete_admin" on public.catalog_categories;
create policy "catalog_categories_delete_admin"
on public.catalog_categories for delete
using (public.is_tenant_admin(tenant_id));

drop policy if exists "catalog_items_select_member" on public.catalog_items;
create policy "catalog_items_select_member"
on public.catalog_items for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "catalog_items_insert_admin" on public.catalog_items;
create policy "catalog_items_insert_admin"
on public.catalog_items for insert
with check (
  public.is_tenant_admin(tenant_id)
  and (
    category_id is null
    or exists (
      select 1
      from public.catalog_categories cc
      where cc.id = category_id
        and cc.tenant_id = tenant_id
    )
  )
);

drop policy if exists "catalog_items_update_admin" on public.catalog_items;
create policy "catalog_items_update_admin"
on public.catalog_items for update
using (public.is_tenant_admin(tenant_id))
with check (
  public.is_tenant_admin(tenant_id)
  and (
    category_id is null
    or exists (
      select 1
      from public.catalog_categories cc
      where cc.id = category_id
        and cc.tenant_id = tenant_id
    )
  )
);

drop policy if exists "catalog_items_delete_admin" on public.catalog_items;
create policy "catalog_items_delete_admin"
on public.catalog_items for delete
using (public.is_tenant_admin(tenant_id));
