import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  MessageSquare,
  Package,
  ShieldCheck,
  TestTube2,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { getBookingsOverview } from "@/lib/data/bookings";
import { getCatalogForTenant } from "@/lib/data/catalog";
import { getConversationsForTenant } from "@/lib/data/conversations";
import { getLaunchReadinessOverview } from "@/lib/data/launch-ops";
import { getOrdersForTenant } from "@/lib/data/orders";
import { requireTenantContext } from "@/lib/data/tenant";

const pilotSteps = [
  {
    title: "Confirm tenant setup",
    description: "Business settings, language, timezone, and fallback number are present.",
    href: "/dashboard/settings",
    icon: CheckCircle2,
  },
  {
    title: "Add pilot catalog or services",
    description: "Create a few real offerings so sales and booking drafts have context.",
    href: "/dashboard/catalog",
    icon: Package,
  },
  {
    title: "Simulate inbound demand",
    description: "Use the safe WhatsApp beta simulator. No real customer message is sent.",
    href: "/dashboard/channels/whatsapp-beta",
    icon: MessageSquare,
  },
  {
    title: "Work the conversation",
    description: "Claim the thread, review the draft, and decide booking or payment intent.",
    href: "/dashboard/conversations",
    icon: TestTube2,
  },
  {
    title: "Create booking or payment draft",
    description: "Stage the result in test mode before activating Cal.com or Stripe.",
    href: "/dashboard/test-center",
    icon: CreditCard,
  },
  {
    title: "Review compliance and go-live blockers",
    description: "Keep live activation gated until category, owner approval, and fallback are ready.",
    href: "/dashboard/compliance",
    icon: ShieldCheck,
  },
];

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="viva-gradient-border rounded-[1.5rem] bg-viva-card/70 p-5 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-subtle">
        {label}
      </div>
      <div className="mt-2 font-display text-4xl font-black text-viva-ink">{value}</div>
      <p className="mt-2 text-sm leading-5 text-viva-muted">{detail}</p>
    </div>
  );
}

export default async function PilotWorkflowPage() {
  const tenantContext = await requireTenantContext();
  const tenantId = tenantContext.tenant.id;

  const [catalog, conversations, bookings, orders, readiness] = await Promise.all([
    getCatalogForTenant(tenantId),
    getConversationsForTenant(tenantId, { limit: 10 }),
    getBookingsOverview(tenantId, { limit: 10 }),
    getOrdersForTenant(tenantId, { limit: 10 }),
    getLaunchReadinessOverview(tenantId),
  ]);

  const stripeState = readiness.providerStates.find(
    (provider) => provider.provider_key === "stripe_checkout",
  );
  const calcomState = readiness.providerStates.find(
    (provider) => provider.provider_key === "calcom",
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Pilot workflow"
        title="First sellable pilot"
        description="A safe customer journey for the first real tenant: collect enough business data, simulate demand, create booking or payment drafts, and keep every live provider gated until review."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Catalog items"
          value={catalog.items.length}
          detail="Offerings ready for sales, service, or booking context."
        />
        <StatCard
          label="Conversations"
          value={conversations.length}
          detail="Tenant-scoped threads available for test workflows."
        />
        <StatCard
          label="Bookings"
          value={bookings.bookings.length}
          detail="Calendar-ready drafts and synced booking records."
        />
        <StatCard
          label="Orders"
          value={orders.length}
          detail="Payment-link drafts and checkout records in test mode."
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr,0.8fr]">
        <div className="viva-auth-card rounded-[2rem] p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
              <CalendarCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                Customer journey
              </div>
              <h2 className="font-display text-2xl font-black text-viva-ink">
                Run this order for the first pilot tenant
              </h2>
            </div>
          </div>

          <div className="grid gap-3">
            {pilotSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Link
                  key={step.href}
                  href={step.href}
                  className="group viva-gradient-border rounded-2xl bg-viva-card/65 p-4 shadow-card transition hover:shadow-glow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-viva-gradient-soft text-viva-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-viva-primary">
                          Step {index + 1}
                        </span>
                        <ArrowRight className="h-4 w-4 text-viva-subtle transition group-hover:translate-x-1 group-hover:text-viva-primary" />
                      </div>
                      <h3 className="mt-1 font-display text-xl font-black text-viva-ink">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-viva-muted">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="viva-auth-card rounded-[2rem] p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
              Recommended first live lane
            </div>
            <h2 className="mt-2 font-display text-3xl font-black text-viva-ink">
              Stripe test mode or Cal.com test mode
            </h2>
            <p className="mt-3 text-sm leading-6 text-viva-muted">
              These are safer than WhatsApp for the first paid pilot because they let us validate
              booking and payment outcomes without customer-channel friction. Live activation
              remains off.
            </p>
          </div>

          {[
            {
              label: "Stripe checkout",
              description: "Create payment drafts and simulate checkout completion.",
              state: stripeState,
              href: "/dashboard/orders",
              icon: CreditCard,
            },
            {
              label: "Cal.com booking",
              description: "Create booking drafts and simulate calendar confirmation.",
              state: calcomState,
              href: "/dashboard/bookings",
              icon: CalendarCheck2,
            },
          ].map((lane) => {
            const Icon = lane.icon;

            return (
              <Link
                key={lane.label}
                href={lane.href}
                className="block viva-gradient-border rounded-[1.5rem] bg-viva-card/70 p-5 shadow-card transition hover:shadow-glow"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-viva-gradient-soft text-viva-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-viva-ink">
                      {lane.label}
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-viva-muted">
                      {lane.description}
                    </p>
                    <div className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-viva-subtle">
                      {lane.state
                        ? `${lane.state.status.replaceAll("_", " ")} · live ${
                            lane.state.live_enabled ? "on" : "off"
                          }`
                        : "not configured · live off"}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
