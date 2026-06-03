create table if not exists public.whatsapp_beta_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  channel_binding_id uuid not null references public.channel_bindings(id) on delete cascade,
  provider text not null default 'unipile',
  connection_method text not null default 'hosted_auth' check (connection_method in ('hosted_auth','qr_pairing')),
  status text not null default 'pending_credentials' check (
    status in (
      'pending_credentials',
      'ready_to_connect',
      'auth_link_ready',
      'connected',
      'disconnected',
      'failed',
      'paused'
    )
  ),
  hosted_auth_url text,
  external_account_id text,
  phone_number text,
  expires_at timestamptz,
  last_checked_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (channel_binding_id)
);

create index if not exists whatsapp_beta_sessions_tenant_id_idx
  on public.whatsapp_beta_sessions(tenant_id);

create index if not exists whatsapp_beta_sessions_status_idx
  on public.whatsapp_beta_sessions(tenant_id, status);

drop trigger if exists whatsapp_beta_sessions_set_updated_at on public.whatsapp_beta_sessions;
create trigger whatsapp_beta_sessions_set_updated_at
before update on public.whatsapp_beta_sessions
for each row execute function public.set_updated_at();

create or replace function public.ensure_whatsapp_beta_binding()
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
      and cb.channel = 'whatsapp'
      and cb.provider = 'unipile_beta'
  ) then
    raise exception 'WhatsApp beta session must use a Unipile beta WhatsApp binding for the same tenant';
  end if;

  return new;
end;
$$;

drop trigger if exists whatsapp_beta_sessions_binding_check on public.whatsapp_beta_sessions;
create trigger whatsapp_beta_sessions_binding_check
before insert or update on public.whatsapp_beta_sessions
for each row execute function public.ensure_whatsapp_beta_binding();

alter table public.whatsapp_beta_sessions enable row level security;

drop policy if exists "whatsapp_beta_sessions_select_member" on public.whatsapp_beta_sessions;
create policy "whatsapp_beta_sessions_select_member"
on public.whatsapp_beta_sessions for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "whatsapp_beta_sessions_insert_admin" on public.whatsapp_beta_sessions;
create policy "whatsapp_beta_sessions_insert_admin"
on public.whatsapp_beta_sessions for insert
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "whatsapp_beta_sessions_update_admin" on public.whatsapp_beta_sessions;
create policy "whatsapp_beta_sessions_update_admin"
on public.whatsapp_beta_sessions for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "whatsapp_beta_sessions_delete_admin" on public.whatsapp_beta_sessions;
create policy "whatsapp_beta_sessions_delete_admin"
on public.whatsapp_beta_sessions for delete
using (public.is_tenant_admin(tenant_id));
