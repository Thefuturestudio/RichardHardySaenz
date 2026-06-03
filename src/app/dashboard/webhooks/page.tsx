import { Activity, CheckCircle2, Clock3, XCircle } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { getLaunchReadinessOverview } from "@/lib/data/launch-ops";
import { requireTenantContext } from "@/lib/data/tenant";

type WebhooksPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const statusOptions = ["all", "processed", "ignored", "failed", "received"];
const providerOptions = ["all", "unipile", "calcom", "stripe"];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildWebhookHref(status: string, provider: string) {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (provider !== "all") params.set("provider", provider);
  const queryString = params.toString();
  return queryString ? `/dashboard/webhooks?${queryString}` : "/dashboard/webhooks";
}

export default async function WebhooksPage({ searchParams }: WebhooksPageProps) {
  const tenantContext = await requireTenantContext();
  const overview = await getLaunchReadinessOverview(tenantContext.tenant.id);
  const params = (await searchParams) ?? {};
  const status = statusOptions.includes(firstParam(params.status) ?? "")
    ? firstParam(params.status) ?? "all"
    : "all";
  const provider = providerOptions.includes(firstParam(params.provider) ?? "")
    ? firstParam(params.provider) ?? "all"
    : "all";
  const events = overview.webhookEvents.filter((event) => {
    const statusMatch = status === "all" || event.status === status;
    const providerMatch = provider === "all" || event.provider === provider;
    return statusMatch && providerMatch;
  });
  const processed = overview.webhookEvents.filter((event) => event.status === "processed").length;
  const ignored = overview.webhookEvents.filter((event) => event.status === "ignored").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 23"
        title="Webhook activity"
        description="Track inbound provider events across Unipile, Cal.com, and Stripe so launch debugging stays visible before anything goes truly live."
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Events logged", String(overview.webhookEvents.length)],
          ["Processed", String(processed)],
          ["Ignored", String(ignored)],
          ["Most recent", overview.webhookEvents[0]?.provider ?? "none"],
        ].map(([label, value]) => (
          <div key={label} className="viva-glass rounded-2xl p-5">
            <div className="text-sm text-viva-muted">{label}</div>
            <div className="mt-1 font-display text-3xl font-black text-viva-ink">
              {value}
            </div>
          </div>
        ))}
      </section>

      <section className="viva-auth-card rounded-[1.6rem] p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="font-display text-xl font-black text-viva-ink">
              Webhook controls
            </h2>
            <p className="mt-1 text-sm text-viva-muted">
              Showing {events.length} of {overview.webhookEvents.length} recent provider events.
            </p>
          </div>
          <form
            action="/dashboard/webhooks"
            className="grid gap-3 sm:grid-cols-[11rem_11rem_auto]"
          >
            <select name="provider" defaultValue={provider} className="viva-field h-11 px-3 text-sm">
              {providerOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All providers" : option}
                </option>
              ))}
            </select>
            <select name="status" defaultValue={status} className="viva-field h-11 px-3 text-sm">
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All statuses" : option}
                </option>
              ))}
            </select>
            <button type="submit" className="viva-button-primary h-11 px-4 text-sm font-bold">
              Apply
            </button>
          </form>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {providerOptions.map((option) => (
            <Link
              key={option}
              href={buildWebhookHref(status, option)}
              className={
                provider === option
                  ? "viva-button-primary h-9 px-3 text-xs font-bold capitalize"
                  : "viva-button-ghost h-9 px-3 text-xs font-bold capitalize"
              }
            >
              {option === "all" ? "All providers" : option}
            </Link>
          ))}
          {(provider !== "all" || status !== "all") ? (
            <Link href="/dashboard/webhooks" className="viva-button-ghost h-9 px-3 text-xs font-bold">
              Reset
            </Link>
          ) : null}
        </div>
      </section>

      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <article key={event.id} className="viva-auth-card rounded-[1.7rem] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-viva-gradient-soft text-viva-primary">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                      {event.provider}
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                      {event.event_type}
                    </h2>
                    <p className="mt-2 text-sm text-viva-muted">
                      {new Date(event.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-viva-line/70 bg-viva-card/50 px-3 py-2 text-sm font-semibold capitalize text-viva-ink">
                  {event.status}
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/35 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-viva-subtle">
                    <Clock3 className="h-3.5 w-3.5" />
                    Processed at
                  </div>
                  <div className="mt-2 text-sm text-viva-ink">
                    {event.processed_at ? new Date(event.processed_at).toLocaleString() : "Pending"}
                  </div>
                </div>
                <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/35 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-viva-subtle">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Conversation reference
                  </div>
                  <div className="mt-2 break-all text-sm text-viva-ink">
                    {event.external_conversation_id ?? "Not supplied"}
                  </div>
                </div>
                <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/35 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-viva-subtle">
                    <XCircle className="h-3.5 w-3.5" />
                    Error
                  </div>
                  <div className="mt-2 text-sm text-viva-ink">
                    {event.error_message ?? "None"}
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="viva-auth-card rounded-[2rem] p-8 text-center text-sm text-viva-muted">
            No webhook activity yet. Use the test center to send the first event through.
          </div>
        )}
      </div>
    </div>
  );
}
