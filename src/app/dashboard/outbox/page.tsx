import Link from "next/link";
import { CheckCircle2, Send, ShieldCheck } from "lucide-react";
import {
  approveOutboundMessage,
  recordOutboundMessageSent,
} from "@/app/dashboard/conversations/actions";
import { ActionFormButton } from "@/components/dashboard/action-form-button";
import { PageHeader } from "@/components/dashboard/page-header";
import { getLaunchReadinessOverview } from "@/lib/data/launch-ops";
import { requireTenantContext } from "@/lib/data/tenant";

type OutboxPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const outboxStatuses = ["all", "draft", "approved", "sent", "failed", "cancelled"];
const outboxChannels = ["all", "whatsapp", "voice", "email", "sms"];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildOutboxHref(status: string, channel: string) {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (channel !== "all") params.set("channel", channel);
  const queryString = params.toString();
  return queryString ? `/dashboard/outbox?${queryString}` : "/dashboard/outbox";
}

export default async function OutboxPage({ searchParams }: OutboxPageProps) {
  const tenantContext = await requireTenantContext();
  const overview = await getLaunchReadinessOverview(tenantContext.tenant.id);
  const params = (await searchParams) ?? {};
  const status = outboxStatuses.includes(firstParam(params.status) ?? "")
    ? firstParam(params.status) ?? "all"
    : "all";
  const channel = outboxChannels.includes(firstParam(params.channel) ?? "")
    ? firstParam(params.channel) ?? "all"
    : "all";
  const messages = overview.outboundQueue.filter((message) => {
    const statusMatch = status === "all" || message.review_status === status;
    const channelMatch = channel === "all" || message.channel === channel;
    return statusMatch && channelMatch;
  });
  const draftCount = overview.outboundQueue.filter((item) => item.review_status === "draft").length;
  const approvedCount = overview.outboundQueue.filter((item) => item.review_status === "approved").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 24"
        title="Reviewed outbox"
        description="Manage outbound replies after AI drafting but before any real provider send happens. This keeps a human in control."
        action={
          <Link
            href="/dashboard/conversations"
            className="viva-button-primary h-11 px-4 text-sm font-bold"
          >
            Open inbox
            <Send className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Queued", String(overview.outboundQueue.length)],
          ["Draft review", String(draftCount)],
          ["Approved", String(approvedCount)],
          ["Sent", String(overview.outboundQueue.filter((item) => item.review_status === "sent").length)],
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
              Outbox controls
            </h2>
            <p className="mt-1 text-sm text-viva-muted">
              Showing {messages.length} of {overview.outboundQueue.length} reviewed outbound records.
            </p>
          </div>
          <form
            action="/dashboard/outbox"
            className="grid gap-3 sm:grid-cols-[11rem_11rem_auto]"
          >
            <select name="channel" defaultValue={channel} className="viva-field h-11 px-3 text-sm">
              {outboxChannels.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All channels" : option}
                </option>
              ))}
            </select>
            <select name="status" defaultValue={status} className="viva-field h-11 px-3 text-sm">
              {outboxStatuses.map((option) => (
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
          {outboxStatuses.slice(0, 4).map((option) => (
            <Link
              key={option}
              href={buildOutboxHref(option, channel)}
              className={
                status === option
                  ? "viva-button-primary h-9 px-3 text-xs font-bold capitalize"
                  : "viva-button-ghost h-9 px-3 text-xs font-bold capitalize"
              }
            >
              {option === "all" ? "All" : option}
            </Link>
          ))}
          {(channel !== "all" || status !== "all") ? (
            <Link href="/dashboard/outbox" className="viva-button-ghost h-9 px-3 text-xs font-bold">
              Reset
            </Link>
          ) : null}
        </div>
      </section>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <article key={message.id} className="viva-auth-card rounded-[1.7rem] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                    {message.channel} / {message.review_status}
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                    {message.recipient_phone ?? message.recipient_email ?? "No recipient saved"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-viva-muted">{message.body}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {message.review_status === "draft" ? (
                    <ActionFormButton
                      action={approveOutboundMessage}
                      hiddenName="outbound_message_id"
                      hiddenValue={message.id}
                      label="Approve"
                      pendingLabel="Approving..."
                      icon={CheckCircle2}
                    />
                  ) : null}
                  {message.review_status === "approved" ? (
                    <ActionFormButton
                      action={recordOutboundMessageSent}
                      hiddenName="outbound_message_id"
                      hiddenValue={message.id}
                      label="Record as sent"
                      pendingLabel="Recording..."
                      icon={Send}
                      variant="primary"
                    />
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-viva-muted">
                <span>Created {new Date(message.created_at).toLocaleString()}</span>
                {message.sent_at ? <span>Sent {new Date(message.sent_at).toLocaleString()}</span> : null}
                {message.conversation_id ? (
                  <Link href="/dashboard/conversations" className="font-semibold text-viva-primary">
                    Open related conversation
                  </Link>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <div className="viva-auth-card rounded-[2rem] p-8 text-center text-sm text-viva-muted">
            No reviewed outbound messages yet. Queue one from a conversation to test approval.
          </div>
        )}
      </div>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <p className="text-sm leading-6 text-viva-muted">
            This surface records approval and send state only. It does not transmit to
            WhatsApp, voice, SMS, or email until a live provider is explicitly enabled.
          </p>
        </div>
      </div>
    </div>
  );
}
