create table if not exists public.webhook_ingest_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  provider text not null,
  event_type text not null,
  status text not null default 'received',
  external_account_id text,
  external_conversation_id text,
  external_message_id text,
  payload jsonb not null default '{}'::jsonb,
  error_message text,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.outbound_messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  channel text not null check (channel in ('whatsapp', 'voice', 'email', 'sms')),
  provider text,
  review_status text not null default 'draft'
    check (review_status in ('draft', 'approved', 'sent', 'failed', 'cancelled')),
  body text not null,
  recipient_phone text,
  recipient_email text,
  external_message_id text,
  created_by uuid references auth.users(id) on delete set null,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists webhook_ingest_events_tenant_id_idx
  on public.webhook_ingest_events(tenant_id);
create index if not exists webhook_ingest_events_provider_idx
  on public.webhook_ingest_events(provider, created_at desc);
create index if not exists outbound_messages_tenant_id_idx
  on public.outbound_messages(tenant_id, created_at desc);
create index if not exists outbound_messages_conversation_id_idx
  on public.outbound_messages(conversation_id);
create index if not exists outbound_messages_review_status_idx
  on public.outbound_messages(tenant_id, review_status);

drop trigger if exists outbound_messages_set_updated_at on public.outbound_messages;
create trigger outbound_messages_set_updated_at
before update on public.outbound_messages
for each row execute function public.set_updated_at();

alter table public.webhook_ingest_events enable row level security;
alter table public.outbound_messages enable row level security;

drop policy if exists "webhook_ingest_events_select_member" on public.webhook_ingest_events;
create policy "webhook_ingest_events_select_member"
on public.webhook_ingest_events for select
using (
  tenant_id is null
  or public.is_tenant_member(tenant_id)
);

drop policy if exists "outbound_messages_select_member" on public.outbound_messages;
create policy "outbound_messages_select_member"
on public.outbound_messages for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "outbound_messages_insert_member" on public.outbound_messages;
create policy "outbound_messages_insert_member"
on public.outbound_messages for insert
with check (
  public.is_tenant_member(tenant_id)
  and (
    created_by is null
    or created_by = auth.uid()
  )
);

drop policy if exists "outbound_messages_update_admin" on public.outbound_messages;
create policy "outbound_messages_update_admin"
on public.outbound_messages for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "outbound_messages_delete_admin" on public.outbound_messages;
create policy "outbound_messages_delete_admin"
on public.outbound_messages for delete
using (public.is_tenant_admin(tenant_id));
