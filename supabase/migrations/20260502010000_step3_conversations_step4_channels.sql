create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  channel_binding_id uuid references public.channel_bindings(id) on delete set null,
  channel text not null check (channel in ('voice','whatsapp')),
  external_conversation_id text,
  customer_display_name text,
  customer_phone text,
  customer_email text,
  status text not null default 'open' check (status in ('open','pending','resolved','archived')),
  intent text not null default 'unknown' check (intent in ('unknown','booking','sales','support','handoff')),
  assigned_user_id uuid references auth.users(id) on delete set null,
  summary text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, channel, external_conversation_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('customer','assistant','human','system')),
  direction text not null check (direction in ('inbound','outbound','internal')),
  body text not null,
  metadata jsonb not null default '{}',
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists conversations_tenant_id_idx on public.conversations(tenant_id);
create index if not exists conversations_tenant_status_idx on public.conversations(tenant_id, status);
create index if not exists conversations_last_message_at_idx on public.conversations(tenant_id, last_message_at desc);
create index if not exists conversations_channel_binding_id_idx on public.conversations(channel_binding_id);
create index if not exists messages_tenant_id_idx on public.messages(tenant_id);
create index if not exists messages_conversation_id_idx on public.messages(conversation_id);
create index if not exists messages_occurred_at_idx on public.messages(conversation_id, occurred_at asc);

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

create or replace function public.ensure_conversation_binding_tenant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.channel_binding_id is not null and not exists (
    select 1
    from public.channel_bindings cb
    where cb.id = new.channel_binding_id
      and cb.tenant_id = new.tenant_id
      and cb.channel = new.channel
  ) then
    raise exception 'channel binding must belong to the same tenant and channel';
  end if;

  return new;
end;
$$;

drop trigger if exists conversations_binding_tenant_check on public.conversations;
create trigger conversations_binding_tenant_check
before insert or update on public.conversations
for each row execute function public.ensure_conversation_binding_tenant();

create or replace function public.ensure_message_conversation_tenant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.conversations c
    where c.id = new.conversation_id
      and c.tenant_id = new.tenant_id
  ) then
    raise exception 'message conversation must belong to the same tenant';
  end if;

  update public.conversations
  set last_message_at = greatest(coalesce(last_message_at, new.occurred_at), new.occurred_at)
  where id = new.conversation_id
    and tenant_id = new.tenant_id;

  return new;
end;
$$;

drop trigger if exists messages_conversation_tenant_check on public.messages;
create trigger messages_conversation_tenant_check
before insert on public.messages
for each row execute function public.ensure_message_conversation_tenant();

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists "conversations_select_member" on public.conversations;
create policy "conversations_select_member"
on public.conversations for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "conversations_insert_member" on public.conversations;
create policy "conversations_insert_member"
on public.conversations for insert
with check (public.is_tenant_member(tenant_id));

drop policy if exists "conversations_update_member" on public.conversations;
create policy "conversations_update_member"
on public.conversations for update
using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

drop policy if exists "conversations_delete_admin" on public.conversations;
create policy "conversations_delete_admin"
on public.conversations for delete
using (public.is_tenant_admin(tenant_id));

drop policy if exists "messages_select_member" on public.messages;
create policy "messages_select_member"
on public.messages for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "messages_insert_member" on public.messages;
create policy "messages_insert_member"
on public.messages for insert
with check (public.is_tenant_member(tenant_id));

drop policy if exists "messages_update_admin" on public.messages;
create policy "messages_update_admin"
on public.messages for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "messages_delete_admin" on public.messages;
create policy "messages_delete_admin"
on public.messages for delete
using (public.is_tenant_admin(tenant_id));
