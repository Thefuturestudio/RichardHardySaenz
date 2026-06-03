create table if not exists public.data_privacy_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  request_type text not null
    check (request_type in ('access','export','correction','deletion','restriction','retention_review','incident')),
  status text not null default 'open'
    check (status in ('open','in_review','fulfilled','rejected','cancelled')),
  customer_id uuid references public.customers(id) on delete set null,
  subject_contact text,
  subject_display_name text,
  due_at timestamptz,
  completed_at timestamptz,
  completed_by uuid references auth.users(id),
  notes text,
  resolution_notes text,
  metadata jsonb not null default '{}',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists data_privacy_requests_tenant_id_idx
  on public.data_privacy_requests(tenant_id, created_at desc);
create index if not exists data_privacy_requests_status_idx
  on public.data_privacy_requests(tenant_id, status);
create index if not exists data_privacy_requests_customer_id_idx
  on public.data_privacy_requests(customer_id);

drop trigger if exists data_privacy_requests_set_updated_at on public.data_privacy_requests;
create trigger data_privacy_requests_set_updated_at
before update on public.data_privacy_requests
for each row execute function public.set_updated_at();

alter table public.data_privacy_requests enable row level security;

drop policy if exists "data_privacy_requests_select_member" on public.data_privacy_requests;
create policy "data_privacy_requests_select_member"
on public.data_privacy_requests for select
using (public.is_tenant_member(tenant_id));

drop policy if exists "data_privacy_requests_insert_member" on public.data_privacy_requests;
create policy "data_privacy_requests_insert_member"
on public.data_privacy_requests for insert
with check (
  public.is_tenant_member(tenant_id)
  and (
    created_by is null
    or created_by = auth.uid()
  )
);

drop policy if exists "data_privacy_requests_update_admin" on public.data_privacy_requests;
create policy "data_privacy_requests_update_admin"
on public.data_privacy_requests for update
using (public.is_tenant_admin(tenant_id))
with check (public.is_tenant_admin(tenant_id));

drop policy if exists "data_privacy_requests_delete_admin" on public.data_privacy_requests;
create policy "data_privacy_requests_delete_admin"
on public.data_privacy_requests for delete
using (public.is_tenant_admin(tenant_id));
