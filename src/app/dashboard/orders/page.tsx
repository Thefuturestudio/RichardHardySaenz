import Link from "next/link";
import { CreditCard, PackageCheck, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  prepareStripeCheckoutFormAction,
  updateOrderStatus,
} from "@/app/dashboard/conversations/actions";
import { hasStripeConfig } from "@/lib/env";
import type { OrderFilters } from "@/lib/data/orders";
import { getOrdersForTenant } from "@/lib/data/orders";
import { requireTenantContext } from "@/lib/data/tenant";

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

type OrdersPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const orderStatuses = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "pending_payment", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const allowedStatuses = new Set(orderStatuses.map((status) => status.value));

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildOrdersHref(status: string, query?: string) {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (query?.trim()) params.set("q", query.trim());
  const queryString = params.toString();
  return queryString ? `/dashboard/orders?${queryString}` : "/dashboard/orders";
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const tenantContext = await requireTenantContext();
  const params = (await searchParams) ?? {};
  const statusParam = firstParam(params.status);
  const query = firstParam(params.q) ?? "";
  const filters: OrderFilters = {
    status: allowedStatuses.has(statusParam ?? "")
      ? (statusParam as OrderFilters["status"])
      : "all",
    query,
    limit: 50,
  };
  const orders = await getOrdersForTenant(tenantContext.tenant.id, filters);

  const pending = orders.filter((order) => order.status === "pending_payment").length;
  const paid = orders.filter((order) => order.status === "paid").length;
  const stripeReady = hasStripeConfig();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 8 live flow"
        title="Orders and payment drafts"
        description="Review test-mode payment links generated from conversations, track payment state internally, and keep order follow-up tied to the inbox."
        action={
          <Link
            href="/dashboard/conversations"
            className="viva-button-primary h-11 px-4 text-sm font-bold"
          >
            Open conversations
            <PackageCheck className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Orders", String(orders.length)],
          ["Pending payment", String(pending)],
          ["Paid", String(paid)],
          ["Provider ready", stripeReady ? "yes" : "no"],
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
              Order controls
            </h2>
            <p className="mt-1 text-sm text-viva-muted">
              Filter payment drafts without touching the underlying tenant records.
            </p>
          </div>
          <form
            action="/dashboard/orders"
            className="grid gap-3 sm:grid-cols-[minmax(12rem,1fr)_11rem_auto]"
          >
            <input
              name="q"
              defaultValue={query}
              placeholder="Search customer, provider, phone..."
              className="viva-field h-11 px-4 text-sm"
            />
            <select
              name="status"
              defaultValue={filters.status ?? "all"}
              className="viva-field h-11 px-3 text-sm"
            >
              {orderStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <button type="submit" className="viva-button-primary h-11 px-4 text-sm font-bold">
              Apply
            </button>
          </form>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {orderStatuses.map((status) => (
            <Link
              key={status.value}
              href={buildOrdersHref(status.value, query)}
              className={
                (filters.status ?? "all") === status.value
                  ? "viva-button-primary h-9 px-3 text-xs font-bold"
                  : "viva-button-ghost h-9 px-3 text-xs font-bold"
              }
            >
              {status.label}
            </Link>
          ))}
          {(filters.status !== "all" || query) ? (
            <Link href="/dashboard/orders" className="viva-button-ghost h-9 px-3 text-xs font-bold">
              Reset
            </Link>
          ) : null}
        </div>
      </section>

      {orders.length > 0 ? (
        <div className="grid gap-5">
          {orders.map((order) => (
            <article key={order.id} className="viva-auth-card rounded-[1.7rem] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-viva-gradient-soft text-viva-primary">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                      {order.status.replaceAll("_", " ")}
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                      {order.customer_display_name ?? "Draft order"}
                    </h2>
                    <p className="mt-1 text-sm text-viva-muted">
                      {order.customer_phone || order.customer_email || "No customer contact saved"}
                    </p>
                  </div>
                </div>

                <form action={updateOrderStatus} className="flex items-center gap-2">
                  <input type="hidden" name="order_id" value={order.id} />
                  <select
                    name="status"
                    defaultValue={order.status}
                    className="viva-field h-10 px-3 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending_payment">Pending payment</option>
                    <option value="paid">Paid</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <button
                    type="submit"
                    className="viva-button-ghost h-10 px-3 text-sm font-bold"
                  >
                    Update
                  </button>
                </form>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/35 p-3">
                  <div className="text-xs uppercase tracking-[0.12em] text-viva-subtle">
                    Total
                  </div>
                  <div className="mt-1 text-sm font-semibold text-viva-ink">
                    {formatMoney(order.total_amount, order.currency)}
                  </div>
                </div>
                <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/35 p-3">
                  <div className="text-xs uppercase tracking-[0.12em] text-viva-subtle">
                    Provider
                  </div>
                  <div className="mt-1 text-sm font-semibold text-viva-ink">
                    {order.payment_provider ?? "Not set"}
                  </div>
                </div>
                <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/35 p-3">
                  <div className="text-xs uppercase tracking-[0.12em] text-viva-subtle">
                    Link preview
                  </div>
                  <div className="mt-1 truncate text-sm font-semibold text-viva-ink">
                    {order.payment_link_url ?? "No preview yet"}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-viva-line/70 bg-viva-card/55 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-viva-muted">
                  Items
                </div>
                <div className="mt-3 space-y-3">
                  {order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 rounded-2xl border border-viva-line/60 bg-viva-elevated/35 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <div className="font-semibold text-viva-ink">{item.name}</div>
                          <div className="text-sm text-viva-muted">
                            Qty {item.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-viva-ink">
                          {formatMoney(item.total_amount, order.currency)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-viva-muted">
                      No order items stored yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <form action={prepareStripeCheckoutFormAction}>
                  <input type="hidden" name="order_id" value={order.id} />
                  <button
                    type="submit"
                    className="viva-button-ghost h-10 px-4 text-sm font-bold"
                  >
                    Prepare checkout
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="viva-auth-card rounded-[2rem] p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
            <CreditCard className="h-7 w-7" />
          </div>
          <h3 className="mt-5 font-display text-3xl font-black text-viva-ink">
            No order drafts yet
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-viva-muted">
            Create a payment draft from a conversation. The link is internal test
            mode only until Stripe is activated later.
          </p>
        </div>
      )}

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <p className="text-sm leading-6 text-viva-muted">
            These payment links are previews only. They let us verify the
            conversation-to-order workflow without creating real Stripe checkout
            sessions or charging anyone. Once Stripe credentials are added, the
            same button can generate a real hosted checkout session.
          </p>
        </div>
      </div>
    </div>
  );
}
