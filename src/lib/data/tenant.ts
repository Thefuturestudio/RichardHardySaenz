import { redirect } from "next/navigation";
import { getDevPreviewTenantContext, getDevPreviewUser } from "@/lib/dev-preview";
import { hasDevPreviewSession } from "@/lib/dev-preview-session";
import { createClient } from "@/lib/supabase/server";
import type { TenantContext } from "@/types";
import type { Tenant, TenantRole, TenantSettings } from "@/types/database";

type MembershipTenantRow = {
  role: TenantRole | null;
  tenants:
    | (Tenant & {
        tenant_settings?: TenantSettings[] | TenantSettings | null;
      })
    | (Tenant & {
        tenant_settings?: TenantSettings[] | TenantSettings | null;
      })[]
    | null;
};

function normalizeTenantContext(row: MembershipTenantRow | null): TenantContext | null {
  if (!row || !row.tenants || !row.role) return null;

  const tenant = Array.isArray(row.tenants) ? row.tenants[0] : row.tenants;
  if (!tenant) return null;

  const settingsRaw = tenant.tenant_settings;
  const settings = Array.isArray(settingsRaw) ? settingsRaw[0] ?? null : settingsRaw ?? null;
  const tenantOnly = { ...tenant } as Tenant & {
    tenant_settings?: TenantSettings[] | TenantSettings | null;
  };
  delete tenantOnly.tenant_settings;

  return {
    tenant: tenantOnly as Tenant,
    settings,
    role: row.role,
  };
}

export async function getUser() {
  if (await hasDevPreviewSession()) {
    return getDevPreviewUser();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export async function getTenantContext(): Promise<TenantContext | null> {
  if (await hasDevPreviewSession()) {
    return getDevPreviewTenantContext();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("tenant_memberships")
    .select("role, tenants(*, tenant_settings(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return normalizeTenantContext(data as MembershipTenantRow | null);
}

export async function requireTenantContext(): Promise<TenantContext> {
  await requireUser();
  const context = await getTenantContext();

  if (!context) {
    redirect("/onboarding");
  }

  return context;
}

export function canManageTenant(role: TenantRole) {
  return role === "owner" || role === "admin";
}
