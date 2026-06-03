create table if not exists public.booking_sync_configs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  provider text not null default 'cal_com',
  status text not null default 'pending_credentials'
    check (status in ('pending_credentials','ready','connected','paused','failed')),
  external_user_id text,
  external_event_type_id text,
  booking_url text,
  webhook_url text,
  default_duration_minutes integer default 30 check (default_duration_minutes > 0),
  timezone text default 'America/Panama',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, provider)
);

create table if not exists public.booking_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  booking_sync_config_id uuid references public.booking_sync_configs(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  customer_display_name text,
  customer_phone text,
  customer_email text,
  service_name text,
  status text not null default 'draft'
    check (status in ('draft','pending','confirmed','rescheduled','cancelled','completed','no_show')),
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text default 'America/Panama',
  external_booking_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists booking_sync_configs_tenant_id_idx on public.booking_sync_configs(tenant_id);
create index if not exists booking_records_tenant_id_idx on public.booking_records(tenant_id);
create index if not exists booking_records_status_idx on public.booking_records(status);
create index if not exists booking_records_starts_at_idx on public.booking_records(starts_at);

drop trigger if exists booking_sync_configs_set_updated_at on public.booking_sync_configs;
create trigger booking_sync_configs_set_updated_at
before update on public.booking_sync_configs
for each row execute function public.set_updated_at();

drop trigger if exists booking_records_set_updated_at on public.booking_records;
create trigger booking_records_set_updated_at
before update on public.booking_records
for each row execute function public.set_updated_at();

alter table public.booking_sync_configs enable row level security;
alter table public.booking_records enable row level security;

drop policy if exists "booking_sync_configs_select_member" on public.booking_sync_configs;
create policy "booking_sync_configs_select_member"
on public.booking_sync_configs for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "booking_sync_configs_insert_admin" on public.booking_sync_configs;
create policy "booking_sync_configs_insert_admin"
on public.booking_sync_configs for insert
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "booking_sync_configs_update_admin" on public.booking_sync_configs;
create policy "booking_sync_configs_update_admin"
on public.booking_sync_configs for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "booking_sync_configs_delete_admin" on public.booking_sync_configs;
create policy "booking_sync_configs_delete_admin"
on public.booking_sync_configs for delete
using (public.is_tenant_admin(tenant_id));

drop policy if exists "booking_records_select_member" on public.booking_records;
create policy "booking_records_select_member"
on public.booking_records for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "booking_records_insert_admin" on public.booking_records;
create policy "booking_records_insert_admin"
on public.booking_records for insert
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "booking_records_update_admin" on public.booking_records;
create policy "booking_records_update_admin"
on public.booking_records for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "booking_records_delete_admin" on public.booking_records;
create policy "booking_records_delete_admin"
on public.booking_records for delete
using (public.is_tenant_admin(tenant_id));
