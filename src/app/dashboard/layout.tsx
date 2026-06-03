import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireTenantContext } from "@/lib/data/tenant";
import { getUser } from "@/lib/data/tenant";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tenantContext, user] = await Promise.all([
    requireTenantContext(),
    getUser(),
  ]);

  return (
    <DashboardShell
      tenantName={tenantContext.tenant.business_name}
      userEmail={user?.email}
      role={tenantContext.role}
    >
      {children}
    </DashboardShell>
  );
}
