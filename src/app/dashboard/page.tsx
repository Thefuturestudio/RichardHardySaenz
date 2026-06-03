import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { FUTURE_MODULES } from "@/lib/constants";
import { requireTenantContext } from "@/lib/data/tenant";
import { formatLocation } from "@/lib/utils";

function statusLabel(value?: string | null) {
  return value ? value.replaceAll("_", " ") : "draft";
}

export default async function DashboardPage() {
  const { tenant, settings } = await requireTenantContext();
  const hasFallback = Boolean(settings?.human_fallback_number);
  const setupItems = [
    { label: "Business profile", complete: Boolean(tenant.business_name) },
    { label: "Tenant membership", complete: true },
    { label: "Language set", complete: Boolean(settings?.languages?.length) },
    { label: "Human fallback", complete: hasFallback },
  ];
  const completeCount = setupItems.filter((item) => item.complete).length;
  const setupProgress = Math.round((completeCount / setupItems.length) * 100);
  const metrics = [
    {
      label: "Plan",
      value: tenant.plan ?? "starter",
      icon: WalletCards,
      accent: "text-viva-primary",
      helper: "Current workspace tier",
    },
    {
      label: "Status",
      value: statusLabel(tenant.status),
      icon: ShieldCheck,
      accent: "text-viva-success",
      helper: "Activation state",
    },
    {
      label: "Location",
      value: formatLocation(tenant.city, tenant.country),
      icon: MapPin,
      accent: "text-viva-blue",
      helper: "Business region",
    },
    {
      label: "Setup progress",
      value: `${setupProgress}%`,
      icon: TrendingUp,
      accent: "text-viva-pink",
      helper: `${completeCount} of ${setupItems.length} complete`,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title={tenant.business_name}
        description="Your Viva tenant foundation, catalog, conversation storage, and provider-agnostic channel records are ready. Live providers, automations, orders, payments, and booking sync are future modules."
        action={
          <Link
            href="/dashboard/settings"
            className="viva-button-primary h-11 px-4 text-sm font-bold"
          >
            Edit settings
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      {!hasFallback ? (
        <section className="flex gap-3 rounded-2xl border border-viva-warning/30 bg-viva-warning/10 p-4 text-viva-ink shadow-card">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-viva-warning" />
          <div>
            <h2 className="text-sm font-semibold">Human fallback number missing</h2>
            <p className="mt-1 text-sm leading-6">
              Future WhatsApp and voice flows require a human fallback path. Add
              one in settings before any live channel is activated.
            </p>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="viva-glass rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-viva-gradient-soft ${metric.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex h-8 items-end gap-1">
                  {[28, 18, 24, 16, 30].map((height, index) => (
                    <span
                      key={`${metric.label}-${height}-${index}`}
                      className="w-1.5 rounded-full bg-viva-primary/30"
                      style={{ height }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-5 text-sm text-viva-muted">{metric.label}</div>
              <div className="mt-1 truncate font-display text-2xl font-bold capitalize text-viva-ink">
                {metric.value}
              </div>
              <div className="mt-2 text-xs text-viva-subtle">{metric.helper}</div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="viva-glow-card rounded-3xl p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-viva-ink">
                Setup checklist
              </h2>
              <p className="mt-1 text-sm text-viva-muted">
                The first four foundation steps are ready for the next build phase.
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {setupItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-2xl border border-viva-line/70 bg-viva-card/60 px-4 py-3"
              >
                <span className="text-sm font-medium text-viva-ink">{item.label}</span>
                {item.complete ? (
                  <CheckCircle2 className="h-5 w-5 text-viva-success" />
                ) : (
                  <CircleDashed className="h-5 w-5 text-viva-warning" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="viva-glass rounded-3xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-viva-ink">
                Future modules
              </h2>
              <p className="mt-1 text-sm text-viva-muted">
                These remain placeholders. They are not connected yet.
              </p>
            </div>
            <span className="rounded-full border border-viva-line bg-viva-elevated/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-viva-muted">
              Step 4
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {FUTURE_MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.title}
                  className="rounded-2xl border border-dashed border-viva-line bg-viva-elevated/50 p-4 opacity-85"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-viva-gradient-soft text-viva-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-viva-ink">
                        {module.title}
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-viva-muted">
                        Not yet implemented
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-viva-muted">
                    {module.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
