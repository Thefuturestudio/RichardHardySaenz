create table if not exists public.voice_beta_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  channel_binding_id uuid not null references public.channel_bindings(id) on delete cascade unique,
  provider text not null default 'vapi',
  status text not null default 'pending_credentials'
    check (status in ('pending_credentials','ready_to_connect','connected','failed','paused')),
  assistant_external_id text,
  phone_number_id text,
  phone_number text,
  webhook_url text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_tool_configs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  tool_key text not null,
  name text not null,
  status text not null default 'draft'
    check (status in ('draft','ready','active','paused')),
  description text,
  config jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, tool_key)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  customer_display_name text,
  customer_phone text,
  customer_email text,
  status text not null default 'draft'
    check (status in ('draft','pending_payment','paid','fulfilled','cancelled','refunded')),
  currency text not null default 'USD',
  subtotal_amount integer not null default 0,
  total_amount integer not null default 0,
  payment_provider text,
  payment_link_url text,
  external_payment_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  catalog_item_id uuid references public.catalog_items(id) on delete set null,
  name text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_amount integer not null default 0,
  total_amount integer not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.automation_workflows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  workflow_key text not null,
  name text not null,
  provider text not null default 'n8n',
  status text not null default 'draft'
    check (status in ('draft','ready','active','paused','failed')),
  trigger_type text,
  external_workflow_id text,
  webhook_url text,
  config jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, workflow_key)
);

create table if not exists public.billing_accounts (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  provider text not null default 'stripe',
  status text not null default 'draft'
    check (status in ('draft','pending_credentials','ready','active','paused','cancelled')),
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'starter',
  billing_email text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists voice_beta_sessions_tenant_id_idx on public.voice_beta_sessions(tenant_id);
create index if not exists ai_tool_configs_tenant_id_idx on public.ai_tool_configs(tenant_id);
create index if not exists orders_tenant_id_idx on public.orders(tenant_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists order_items_tenant_id_idx on public.order_items(tenant_id);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists automation_workflows_tenant_id_idx on public.automation_workflows(tenant_id);

drop trigger if exists voice_beta_sessions_set_updated_at on public.voice_beta_sessions;
create trigger voice_beta_sessions_set_updated_at
before update on public.voice_beta_sessions
for each row execute function public.set_updated_at();

drop trigger if exists ai_tool_configs_set_updated_at on public.ai_tool_configs;
create trigger ai_tool_configs_set_updated_at
before update on public.ai_tool_configs
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists automation_workflows_set_updated_at on public.automation_workflows;
create trigger automation_workflows_set_updated_at
before update on public.automation_workflows
for each row execute function public.set_updated_at();

drop trigger if exists billing_accounts_set_updated_at on public.billing_accounts;
create trigger billing_accounts_set_updated_at
before update on public.billing_accounts
for each row execute function public.set_updated_at();

create or replace function public.ensure_voice_beta_binding()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.channel_bindings cb
    where cb.id = new.channel_binding_id
      and cb.tenant_id = new.tenant_id
      and cb.channel = 'voice'
      and cb.provider = 'vapi_foundation'
  ) then
    raise exception 'voice beta session must reference a Vapi voice binding for the same tenant';
  end if;

  return new;
end;
$$;

drop trigger if exists voice_beta_sessions_validate_binding on public.voice_beta_sessions;
create trigger voice_beta_sessions_validate_binding
before insert or update on public.voice_beta_sessions
for each row execute function public.ensure_voice_beta_binding();

alter table public.voice_beta_sessions enable row level security;
alter table public.ai_tool_configs enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.automation_workflows enable row level security;
alter table public.billing_accounts enable row level security;

drop policy if exists "voice_beta_sessions_select_member" on public.voice_beta_sessions;
create policy "voice_beta_sessions_select_member"
on public.voice_beta_sessions for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "voice_beta_sessions_insert_admin" on public.voice_beta_sessions;
create policy "voice_beta_sessions_insert_admin"
on public.voice_beta_sessions for insert
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "voice_beta_sessions_update_admin" on public.voice_beta_sessions;
create policy "voice_beta_sessions_update_admin"
on public.voice_beta_sessions for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "voice_beta_sessions_delete_admin" on public.voice_beta_sessions;
create policy "voice_beta_sessions_delete_admin"
on public.voice_beta_sessions for delete
using (public.is_tenant_admin(tenant_id));

drop policy if exists "ai_tool_configs_select_member" on public.ai_tool_configs;
create policy "ai_tool_configs_select_member"
on public.ai_tool_configs for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "ai_tool_configs_insert_admin" on public.ai_tool_configs;
create policy "ai_tool_configs_insert_admin"
on public.ai_tool_configs for insert
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "ai_tool_configs_update_admin" on public.ai_tool_configs;
create policy "ai_tool_configs_update_admin"
on public.ai_tool_configs for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "ai_tool_configs_delete_admin" on public.ai_tool_configs;
create policy "ai_tool_configs_delete_admin"
on public.ai_tool_configs for delete
using (public.is_tenant_admin(tenant_id));

drop policy if exists "orders_select_member" on public.orders;
create policy "orders_select_member"
on public.orders for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "orders_insert_admin" on public.orders;
create policy "orders_insert_admin"
on public.orders for insert
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin"
on public.orders for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "orders_delete_admin" on public.orders;
create policy "orders_delete_admin"
on public.orders for delete
using (public.is_tenant_admin(tenant_id));

drop policy if exists "order_items_select_member" on public.order_items;
create policy "order_items_select_member"
on public.order_items for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "order_items_insert_admin" on public.order_items;
create policy "order_items_insert_admin"
on public.order_items for insert
with check (
  public.is_tenant_admin(tenant_id)
  and exists (
    select 1 from public.orders o
    where o.id = order_id
      and o.tenant_id = tenant_id
  )
);

drop policy if exists "order_items_update_admin" on public.order_items;
create policy "order_items_update_admin"
on public.order_items for update
using (public.is_tenant_admin(tenant_id))
with check (
  public.is_tenant_admin(tenant_id)
  and exists (
    select 1 from public.orders o
    where o.id = order_id
      and o.tenant_id = tenant_id
  )
);

drop policy if exists "order_items_delete_admin" on public.order_items;
create policy "order_items_delete_admin"
on public.order_items for delete
using (public.is_tenant_admin(tenant_id));

drop policy if exists "automation_workflows_select_member" on public.automation_workflows;
create policy "automation_workflows_select_member"
on public.automation_workflows for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "automation_workflows_insert_admin" on public.automation_workflows;
create policy "automation_workflows_insert_admin"
on public.automation_workflows for insert
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "automation_workflows_update_admin" on public.automation_workflows;
create policy "automation_workflows_update_admin"
on public.automation_workflows for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "automation_workflows_delete_admin" on public.automation_workflows;
create policy "automation_workflows_delete_admin"
on public.automation_workflows for delete
using (public.is_tenant_admin(tenant_id));

drop policy if exists "billing_accounts_select_member" on public.billing_accounts;
create policy "billing_accounts_select_member"
on public.billing_accounts for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "billing_accounts_insert_admin" on public.billing_accounts;
create policy "billing_accounts_insert_admin"
on public.billing_accounts for insert
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "billing_accounts_update_admin" on public.billing_accounts;
create policy "billing_accounts_update_admin"
on public.billing_accounts for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));
