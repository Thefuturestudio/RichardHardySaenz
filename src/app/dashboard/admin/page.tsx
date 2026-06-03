import { Activity, AlertTriangle, MonitorCheck } from "lucide-react";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { getFoundationsOverview } from "@/lib/data/foundations";
import { getTenantAdminRows } from "@/lib/data/platform-admin";
import { getUser, requireTenantContext } from "@/lib/data/tenant";

export default async function AdminMonitoringPage() {
  const [tenantContext, user] = await Promise.all([
    requireTenantContext(),
    getUser(),
  ]);
  const [overview, tenantAdmin] = await Promise.all([
    getFoundationsOverview(tenantContext.tenant.id),
    getTenantAdminRows(tenantContext.tenant.id, user?.email),
  ]);
  const warningCount = overview.platformEvents.filter(
    (event) => event.severity === "warning" || event.severity === "error",
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 13"
        title="Monitoring"
        description="Foundation dashboard for tenant readiness, provider health placeholders, setup progress, and platform events."
      />

      <FoundationCard
        eyebrow="Admin visibility"
        title="Tenant readiness"
        description="Monitor the staged foundations before activating real providers."
        icon={MonitorCheck}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <StatPill label="Providers" value={String(overview.providerActivations.length)} />
          <StatPill label="Events" value={String(overview.platformEvents.length)} />
          <StatPill label="Warnings" value={String(warningCount)} />
          <StatPill label="Live systems" value="0" />
        </div>
      </FoundationCard>

      <FoundationCard
        eyebrow={tenantAdmin.scope === "platform" ? "Platform owner" : "Tenant owner"}
        title="Tenant management"
        description="See tenant readiness, activity counts, and commercial status from the platform control layer."
        icon={MonitorCheck}
      >
        <div className="grid gap-4">
          {tenantAdmin.rows.map((tenant) => (
            <div
              key={tenant.id}
              className="rounded-2xl border border-viva-line/70 bg-viva-card/60 p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                    {tenant.plan ?? "starter"} / {tenant.status ?? "draft"}
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-black text-viva-ink">
                    {tenant.business_name}
                  </h2>
                  <p className="mt-1 text-sm text-viva-muted">
                    {tenant.city || "No city"}, {tenant.country || "No country"}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-5">
                  <StatPill label="Members" value={String(tenant.member_count)} />
                  <StatPill label="Inbox" value={String(tenant.conversation_count)} />
                  <StatPill label="Orders" value={String(tenant.order_count)} />
                  <StatPill label="Bookings" value={String(tenant.booking_count)} />
                  <StatPill label="Providers" value={String(tenant.provider_count)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </FoundationCard>

      <div className="space-y-4">
        {overview.platformEvents.length ? (
          overview.platformEvents.map((event) => (
            <div key={event.id} className="viva-auth-card rounded-[1.5rem] p-5">
              <div className="flex items-start gap-4">
                <Activity className="mt-1 h-5 w-5 text-viva-primary" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                    {event.severity} · {event.event_type}
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                    {event.source ?? "platform"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-viva-muted">
                    {event.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="viva-auth-card rounded-[2rem] p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 text-viva-warning" />
              <p className="text-sm leading-6 text-viva-muted">
                No platform events yet. Preparing the activation console will add
                the first readiness event.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
