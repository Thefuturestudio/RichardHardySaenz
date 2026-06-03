create table if not exists public.official_whatsapp_configs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  channel_binding_id uuid not null references public.channel_bindings(id) on delete cascade unique,
  provider text not null default '360dialog',
  status text not null default 'pending_review'
    check (status in ('pending_review','pending_credentials','ready','connected','paused','failed')),
  waba_id text,
  phone_number_id text,
  display_phone_number text,
  business_verification_status text,
  messaging_limit_tier text,
  webhook_url text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  display_name text,
  phone text,
  email text,
  source text default 'manual',
  status text not null default 'active'
    check (status in ('active','blocked','archived')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, phone),
  unique (tenant_id, email)
);

create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  channel text not null check (channel in ('whatsapp','voice','email','sms')),
  consent_type text not null default 'customer_service',
  status text not null default 'unknown'
    check (status in ('unknown','opted_in','opted_out','revoked')),
  source text,
  captured_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.compliance_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  review_type text not null default 'activation',
  status text not null default 'pending'
    check (status in ('pending','approved','blocked','needs_review')),
  restricted_category text,
  notes text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.provider_activation_states (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  provider_key text not null,
  provider_name text not null,
  category text not null default 'integration',
  status text not null default 'not_configured'
    check (status in ('not_configured','pending_credentials','ready','active','paused','failed')),
  live_enabled boolean not null default false,
  requires_review boolean not null default true,
  checklist jsonb not null default '[]',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, provider_key)
);

create table if not exists public.platform_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  event_type text not null,
  severity text not null default 'info'
    check (severity in ('debug','info','warning','error','critical')),
  source text,
  message text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists official_whatsapp_configs_tenant_id_idx on public.official_whatsapp_configs(tenant_id);
create index if not exists customers_tenant_id_idx on public.customers(tenant_id);
create index if not exists customers_phone_idx on public.customers(phone);
create index if not exists customers_email_idx on public.customers(email);
create index if not exists consent_records_tenant_id_idx on public.consent_records(tenant_id);
create index if not exists compliance_reviews_tenant_id_idx on public.compliance_reviews(tenant_id);
create index if not exists provider_activation_states_tenant_id_idx on public.provider_activation_states(tenant_id);
create index if not exists platform_events_tenant_id_idx on public.platform_events(tenant_id);
create index if not exists platform_events_created_at_idx on public.platform_events(created_at);

drop trigger if exists official_whatsapp_configs_set_updated_at on public.official_whatsapp_configs;
create trigger official_whatsapp_configs_set_updated_at
before update on public.official_whatsapp_configs
for each row execute function public.set_updated_at();

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists consent_records_set_updated_at on public.consent_records;
create trigger consent_records_set_updated_at
before update on public.consent_records
for each row execute function public.set_updated_at();

drop trigger if exists compliance_reviews_set_updated_at on public.compliance_reviews;
create trigger compliance_reviews_set_updated_at
before update on public.compliance_reviews
for each row execute function public.set_updated_at();

drop trigger if exists provider_activation_states_set_updated_at on public.provider_activation_states;
create trigger provider_activation_states_set_updated_at
before update on public.provider_activation_states
for each row execute function public.set_updated_at();

create or replace function public.ensure_official_whatsapp_binding()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.channel_bindings cb
    where cb.id = new.channel_binding_id
      and cb.tenant_id = new.tenant_id
      and cb.channel = 'whatsapp'
      and cb.provider in ('360dialog_foundation','whatsapp_cloud_foundation')
  ) then
    raise exception 'official WhatsApp config must reference an official WhatsApp binding for the same tenant';
  end if;
  return new;
end;
$$;

drop trigger if exists official_whatsapp_configs_validate_binding on public.official_whatsapp_configs;
create trigger official_whatsapp_configs_validate_binding
before insert or update on public.official_whatsapp_configs
for each row execute function public.ensure_official_whatsapp_binding();

alter table public.official_whatsapp_configs enable row level security;
alter table public.customers enable row level security;
alter table public.consent_records enable row level security;
alter table public.compliance_reviews enable row level security;
alter table public.provider_activation_states enable row level security;
alter table public.platform_events enable row level security;

drop policy if exists "official_whatsapp_configs_select_member" on public.official_whatsapp_configs;
create policy "official_whatsapp_configs_select_member" on public.official_whatsapp_configs for select using (public.is_tenant_member(tenant_id));
drop policy if exists "official_whatsapp_configs_insert_admin" on public.official_whatsapp_configs;
create policy "official_whatsapp_configs_insert_admin" on public.official_whatsapp_configs for insert with check (public.is_tenant_admin(tenant_id));
drop policy if exists "official_whatsapp_configs_update_admin" on public.official_whatsapp_configs;
create policy "official_whatsapp_configs_update_admin" on public.official_whatsapp_configs for update using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));
drop policy if exists "official_whatsapp_configs_delete_admin" on public.official_whatsapp_configs;
create policy "official_whatsapp_configs_delete_admin" on public.official_whatsapp_configs for delete using (public.is_tenant_admin(tenant_id));

drop policy if exists "customers_select_member" on public.customers;
create policy "customers_select_member" on public.customers for select using (public.is_tenant_member(tenant_id));
drop policy if exists "customers_insert_admin" on public.customers;
create policy "customers_insert_admin" on public.customers for insert with check (public.is_tenant_admin(tenant_id));
drop policy if exists "customers_update_admin" on public.customers;
create policy "customers_update_admin" on public.customers for update using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));
drop policy if exists "customers_delete_admin" on public.customers;
create policy "customers_delete_admin" on public.customers for delete using (public.is_tenant_admin(tenant_id));

drop policy if exists "consent_records_select_member" on public.consent_records;
create policy "consent_records_select_member" on public.consent_records for select using (public.is_tenant_member(tenant_id));
drop policy if exists "consent_records_insert_admin" on public.consent_records;
create policy "consent_records_insert_admin" on public.consent_records for insert with check (public.is_tenant_admin(tenant_id));
drop policy if exists "consent_records_update_admin" on public.consent_records;
create policy "consent_records_update_admin" on public.consent_records for update using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));
drop policy if exists "consent_records_delete_admin" on public.consent_records;
create policy "consent_records_delete_admin" on public.consent_records for delete using (public.is_tenant_admin(tenant_id));

drop policy if exists "compliance_reviews_select_member" on public.compliance_reviews;
create policy "compliance_reviews_select_member" on public.compliance_reviews for select using (public.is_tenant_member(tenant_id));
drop policy if exists "compliance_reviews_insert_admin" on public.compliance_reviews;
create policy "compliance_reviews_insert_admin" on public.compliance_reviews for insert with check (public.is_tenant_admin(tenant_id));
drop policy if exists "compliance_reviews_update_admin" on public.compliance_reviews;
create policy "compliance_reviews_update_admin" on public.compliance_reviews for update using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));
drop policy if exists "compliance_reviews_delete_admin" on public.compliance_reviews;
create policy "compliance_reviews_delete_admin" on public.compliance_reviews for delete using (public.is_tenant_admin(tenant_id));

drop policy if exists "provider_activation_states_select_member" on public.provider_activation_states;
create policy "provider_activation_states_select_member" on public.provider_activation_states for select using (public.is_tenant_member(tenant_id));
drop policy if exists "provider_activation_states_insert_admin" on public.provider_activation_states;
create policy "provider_activation_states_insert_admin" on public.provider_activation_states for insert with check (public.is_tenant_admin(tenant_id));
drop policy if exists "provider_activation_states_update_admin" on public.provider_activation_states;
create policy "provider_activation_states_update_admin" on public.provider_activation_states for update using (public.is_tenant_admin(tenant_id)) with check (public.is_tenant_admin(tenant_id));
drop policy if exists "provider_activation_states_delete_admin" on public.provider_activation_states;
create policy "provider_activation_states_delete_admin" on public.provider_activation_states for delete using (public.is_tenant_admin(tenant_id));

drop policy if exists "platform_events_select_member" on public.platform_events;
create policy "platform_events_select_member" on public.platform_events for select using (tenant_id is null or public.is_tenant_member(tenant_id));
drop policy if exists "platform_events_insert_admin" on public.platform_events;
create policy "platform_events_insert_admin" on public.platform_events for insert with check (tenant_id is null or public.is_tenant_admin(tenant_id));
