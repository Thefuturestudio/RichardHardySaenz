"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  Bot,
  CalendarPlus2,
  CheckCircle2,
  Clock3,
  Hand,
  MessageCircle,
  MessageSquarePlus,
  PackageCheck,
  PhoneCall,
  Save,
  SendHorizontal,
  ShieldCheck,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import {
  addMessageRecord,
  approveOutboundMessage,
  claimConversation,
  createBookingDraftFromConversation,
  createConversation,
  createPaymentLinkDraftFromConversation,
  generateConversationDraft,
  queueOutboundReviewReply,
  recordOutboundMessageSent,
  requestHumanHandoff,
  updateConversationStatus,
} from "@/app/dashboard/conversations/actions";
import type { CatalogItemWithCategory } from "@/lib/data/catalog";
import type {
  ConversationFilters,
  ConversationWithMessages,
} from "@/lib/data/conversations";
import type { ActionState } from "@/types";
import type { ChannelBinding } from "@/types/database";

type ConversationsManagerProps = {
  conversations: ConversationWithMessages[];
  channelBindings: ChannelBinding[];
  catalogItems: CatalogItemWithCategory[];
  canManageConfig: boolean;
  filters: ConversationFilters;
};

const initialState: ActionState = {};

const statusLabels = {
  open: "Open",
  pending: "Pending",
  resolved: "Resolved",
  archived: "Archived",
};

const intentLabels = {
  unknown: "Unknown",
  booking: "Booking",
  sales: "Sales",
  support: "Support",
  handoff: "Human handoff",
};

const statusFilterOptions = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
  { value: "archived", label: "Archived" },
];

const intentFilterOptions = [
  { value: "all", label: "All intents" },
  { value: "booking", label: "Booking" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "handoff", label: "Handoff" },
  { value: "unknown", label: "Unknown" },
];

function formatDate(value: string | null) {
  if (!value) return "No messages yet";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Panama",
  }).format(new Date(value));
}

function statusClass(status: ConversationWithMessages["status"]) {
  if (status === "resolved") return "text-viva-success";
  if (status === "pending") return "text-viva-warning";
  if (status === "archived") return "text-viva-subtle";
  return "text-viva-primary";
}

function ConversationCreateForm({
  channelBindings,
  canManageConfig,
}: {
  channelBindings: ChannelBinding[];
  canManageConfig: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    createConversation,
    initialState,
  );

  return (
    <form action={formAction} className="viva-glow-card rounded-[2rem] p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
          <MessageSquarePlus className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-viva-primary">
            Live inbox flow
          </div>
          <h2 className="mt-2 font-display text-3xl font-black text-viva-ink">
            Create or simulate a conversation
          </h2>
          <p className="mt-2 text-sm leading-6 text-viva-muted">
            Use this for manual testing, imports, or support cases. The same
            tenant-safe tables are also used by the WhatsApp beta simulator.
          </p>
        </div>
      </div>

      {!canManageConfig ? (
        <div className="mt-5 rounded-xl border border-viva-line/70 bg-viva-card/55 px-4 py-3 text-sm text-viva-muted">
          You can still work the inbox. Owners and admins manage channel setup
          separately.
        </div>
      ) : null}

      <fieldset
        disabled={isPending}
        className="mt-6 grid gap-5 sm:grid-cols-2 disabled:opacity-60"
      >
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Channel</span>
          <select
            name="channel"
            defaultValue="whatsapp"
            className="viva-field mt-2 px-4 py-3"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="voice">Voice</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">
            Channel binding
          </span>
          <select
            name="channel_binding_id"
            defaultValue=""
            className="viva-field mt-2 px-4 py-3"
          >
            <option value="">No binding yet</option>
            {channelBindings.map((binding) => (
              <option key={binding.id} value={binding.id}>
                {binding.channel} / {binding.provider} / {binding.external_id}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Customer name</span>
          <input
            name="customer_display_name"
            className="viva-field mt-2 px-4 py-3"
            placeholder="Alex Morgan"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Intent</span>
          <select
            name="intent"
            defaultValue="unknown"
            className="viva-field mt-2 px-4 py-3"
          >
            <option value="unknown">Unknown</option>
            <option value="booking">Booking</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="handoff">Human handoff</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Phone</span>
          <input
            name="customer_phone"
            className="viva-field mt-2 px-4 py-3"
            placeholder="+507..."
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Email</span>
          <input
            name="customer_email"
            type="email"
            className="viva-field mt-2 px-4 py-3"
            placeholder="customer@example.com"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-viva-ink">Summary</span>
          <input
            name="summary"
            className="viva-field mt-2 px-4 py-3"
            placeholder="Asked about pricing, availability, or next steps."
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-viva-ink">
            Initial message
          </span>
          <textarea
            name="initial_message"
            required
            rows={4}
            className="viva-field mt-2 px-4 py-3"
            placeholder="Hi, I want to know if you have anything available on Friday."
          />
        </label>
      </fieldset>

      {state.error ? (
        <div className="mt-5 rounded-xl border border-viva-error/30 bg-viva-error/10 px-4 py-3 text-sm text-viva-error">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="mt-5 rounded-xl border border-viva-success/30 bg-viva-success/10 px-4 py-3 text-sm text-viva-success">
          {state.success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="viva-button-primary mt-6 h-12 px-5 text-sm font-bold"
      >
        <Save className="h-4 w-4" />
        {isPending ? "Saving..." : "Create conversation"}
      </button>
    </form>
  );
}

function MessageRecordForm({ conversationId }: { conversationId: string }) {
  const [state, formAction, isPending] = useActionState(
    addMessageRecord,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-viva-line/70 bg-viva-elevated/40 p-4"
    >
      <input type="hidden" name="conversation_id" value={conversationId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">
            Sender
          </span>
          <select
            name="sender_type"
            defaultValue="customer"
            className="viva-field mt-2 px-3 py-2.5 text-sm"
          >
            <option value="customer">Customer</option>
            <option value="human">Human team</option>
            <option value="assistant">Assistant log</option>
            <option value="system">System event</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">
            Direction
          </span>
          <select
            name="direction"
            defaultValue="inbound"
            className="viva-field mt-2 px-3 py-2.5 text-sm"
          >
            <option value="inbound">Inbound</option>
            <option value="internal">Internal note</option>
            <option value="outbound">Outbound record only</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">
            Message body
          </span>
          <textarea
            name="body"
            rows={3}
            required
            className="viva-field mt-2 px-3 py-2.5 text-sm"
            placeholder="Add a transcript line or internal note."
          />
        </label>
      </div>

      {state.error ? (
        <div className="mt-3 rounded-xl border border-viva-error/30 bg-viva-error/10 px-3 py-2 text-xs text-viva-error">
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="mt-3 rounded-xl border border-viva-success/30 bg-viva-success/10 px-3 py-2 text-xs text-viva-success">
          {state.success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="viva-button-ghost mt-3 h-10 px-4 text-sm font-bold"
      >
        <SendHorizontal className="h-4 w-4" />
        {isPending ? "Adding..." : "Add record"}
      </button>
    </form>
  );
}

function ActionButtonForm({
  action,
  hiddenName,
  hiddenValue,
  label,
  pendingLabel,
  icon: Icon,
  variant = "ghost",
}: {
  action: (
    previousState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  hiddenName: string;
  hiddenValue: string;
  label: string;
  pendingLabel: string;
  icon: LucideIcon;
  variant?: "ghost" | "primary";
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name={hiddenName} value={hiddenValue} />
      <button
        type="submit"
        disabled={isPending}
        className={
          variant === "primary"
            ? "viva-button-primary h-10 px-4 text-sm font-bold"
            : "viva-button-ghost h-10 px-4 text-sm font-bold"
        }
      >
        <Icon className="h-4 w-4" />
        {isPending ? pendingLabel : label}
      </button>
      {state.error ? (
        <div className="rounded-xl border border-viva-error/30 bg-viva-error/10 px-3 py-2 text-xs text-viva-error">
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="rounded-xl border border-viva-success/30 bg-viva-success/10 px-3 py-2 text-xs text-viva-success">
          {state.success}
        </div>
      ) : null}
    </form>
  );
}

function BookingDraftForm({ conversationId }: { conversationId: string }) {
  const [state, formAction, isPending] = useActionState(
    createBookingDraftFromConversation,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-viva-line/70 bg-viva-card/55 p-4"
    >
      <input type="hidden" name="conversation_id" value={conversationId} />
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-viva-primary">
        Reserva Viva
      </div>
      <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr_9rem]">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">
            Service
          </span>
          <input
            name="service_name"
            required
            className="viva-field mt-2 px-3 py-2.5 text-sm"
            placeholder="Consultation, whitening, property visit..."
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">
            Start time
          </span>
          <input
            name="starts_at"
            type="datetime-local"
            className="viva-field mt-2 px-3 py-2.5 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">
            Minutes
          </span>
          <input
            name="duration_minutes"
            defaultValue="30"
            className="viva-field mt-2 px-3 py-2.5 text-sm"
          />
        </label>
      </div>

      {state.error ? (
        <div className="mt-3 rounded-xl border border-viva-error/30 bg-viva-error/10 px-3 py-2 text-xs text-viva-error">
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="mt-3 rounded-xl border border-viva-success/30 bg-viva-success/10 px-3 py-2 text-xs text-viva-success">
          {state.success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="viva-button-ghost mt-3 h-10 px-4 text-sm font-bold"
      >
        <CalendarPlus2 className="h-4 w-4" />
        {isPending ? "Creating..." : "Create booking draft"}
      </button>
    </form>
  );
}

function PaymentDraftForm({
  conversationId,
  catalogItems,
}: {
  conversationId: string;
  catalogItems: CatalogItemWithCategory[];
}) {
  const [state, formAction, isPending] = useActionState(
    createPaymentLinkDraftFromConversation,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-viva-line/70 bg-viva-card/55 p-4"
    >
      <input type="hidden" name="conversation_id" value={conversationId} />
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-viva-primary">
        Venta Viva
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_7rem_5rem]">
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">
            Catalog item
          </span>
          <select
            name="catalog_item_id"
            defaultValue=""
            className="viva-field mt-2 px-3 py-2.5 text-sm"
          >
            <option value="">Manual item instead</option>
            {catalogItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
                {item.price_amount !== null
                  ? ` - ${item.currency} ${item.price_amount.toFixed(2)}`
                  : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">
            Amount
          </span>
          <input
            name="amount"
            className="viva-field mt-2 px-3 py-2.5 text-sm"
            placeholder="49.00"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">
            CCY
          </span>
          <input
            name="currency"
            defaultValue="USD"
            className="viva-field mt-2 px-3 py-2.5 text-sm uppercase"
          />
        </label>
        <label className="block sm:col-span-4">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-muted">
            Manual item name
          </span>
          <input
            name="item_name"
            className="viva-field mt-2 px-3 py-2.5 text-sm"
            placeholder="Only needed if you are not choosing a catalog item."
          />
        </label>
      </div>

      {state.error ? (
        <div className="mt-3 rounded-xl border border-viva-error/30 bg-viva-error/10 px-3 py-2 text-xs text-viva-error">
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="mt-3 rounded-xl border border-viva-success/30 bg-viva-success/10 px-3 py-2 text-xs text-viva-success">
          {state.success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="viva-button-ghost mt-3 h-10 px-4 text-sm font-bold"
      >
        <PackageCheck className="h-4 w-4" />
        {isPending ? "Creating..." : "Create payment draft"}
      </button>
    </form>
  );
}

function ConversationCard({
  conversation,
  catalogItems,
}: {
  conversation: ConversationWithMessages;
  catalogItems: CatalogItemWithCategory[];
}) {
  const Icon = conversation.channel === "voice" ? PhoneCall : MessageCircle;
  const lastAssistantDraft = [...conversation.messages]
    .reverse()
    .find(
      (message) =>
        message.sender_type === "assistant" &&
        message.direction === "internal" &&
        typeof message.metadata === "object" &&
        !Array.isArray(message.metadata) &&
        message.metadata !== null &&
        "draft" in message.metadata,
    );

  return (
    <article className="viva-auth-card rounded-[1.8rem] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-viva-gradient-soft text-viva-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-viva-line bg-viva-elevated/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-viva-muted">
                {conversation.channel}
              </span>
              <span className={`text-xs font-semibold ${statusClass(conversation.status)}`}>
                {statusLabels[conversation.status]}
              </span>
              <span className="text-xs font-semibold text-viva-subtle">
                {intentLabels[conversation.intent]}
              </span>
              {conversation.assigned_user_id ? (
                <span className="text-xs font-semibold text-viva-success">
                  Claimed
                </span>
              ) : null}
            </div>
            <h3 className="mt-2 font-display text-2xl font-black text-viva-ink">
              {conversation.customer_display_name || "Unnamed customer"}
            </h3>
            <p className="mt-1 text-sm text-viva-muted">
              {conversation.customer_phone ||
                conversation.customer_email ||
                "No contact detail saved"}
            </p>
          </div>
        </div>

        <form
          action={updateConversationStatus}
          className="flex items-center gap-2"
        >
          <input type="hidden" name="conversation_id" value={conversation.id} />
          <select
            name="status"
            defaultValue={conversation.status}
            className="viva-field h-10 px-3 text-sm"
          >
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>
          <button
            type="submit"
            className="viva-button-ghost h-10 px-3 text-sm font-bold"
          >
            Update
          </button>
        </form>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/35 p-3">
          <div className="text-xs uppercase tracking-[0.12em] text-viva-subtle">
            Last activity
          </div>
          <div className="mt-1 text-sm font-semibold text-viva-ink">
            {formatDate(conversation.last_message_at ?? conversation.created_at)}
          </div>
        </div>
        <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/35 p-3">
          <div className="text-xs uppercase tracking-[0.12em] text-viva-subtle">
            Binding
          </div>
          <div className="mt-1 truncate text-sm font-semibold text-viva-ink">
            {conversation.channel_binding?.provider ?? "No binding"}
          </div>
        </div>
        <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/35 p-3">
          <div className="text-xs uppercase tracking-[0.12em] text-viva-subtle">
            Messages
          </div>
          <div className="mt-1 text-sm font-semibold text-viva-ink">
            {conversation.messages.length}
          </div>
        </div>
        <div className="rounded-2xl border border-viva-line/70 bg-viva-elevated/35 p-3">
          <div className="text-xs uppercase tracking-[0.12em] text-viva-subtle">
            AI draft
          </div>
          <div className="mt-1 text-sm font-semibold text-viva-ink">
            {lastAssistantDraft ? "Ready" : "Not yet"}
          </div>
        </div>
      </div>

      {conversation.summary ? (
        <p className="mt-4 rounded-2xl border border-viva-line/70 bg-viva-card/45 px-4 py-3 text-sm leading-6 text-viva-muted">
          {conversation.summary}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <ActionButtonForm
          action={claimConversation}
          hiddenName="conversation_id"
          hiddenValue={conversation.id}
          label="Claim"
          pendingLabel="Claiming..."
          icon={UserRoundCheck}
        />
        <ActionButtonForm
          action={requestHumanHandoff}
          hiddenName="conversation_id"
          hiddenValue={conversation.id}
          label="Request handoff"
          pendingLabel="Routing..."
          icon={Hand}
        />
        <ActionButtonForm
          action={generateConversationDraft}
          hiddenName="conversation_id"
          hiddenValue={conversation.id}
          label="Draft AI reply"
          pendingLabel="Drafting..."
          icon={Bot}
          variant="primary"
        />
        <ActionButtonForm
          action={queueOutboundReviewReply}
          hiddenName="conversation_id"
          hiddenValue={conversation.id}
          label="Queue reviewed reply"
          pendingLabel="Queueing..."
          icon={SendHorizontal}
        />
      </div>

      <div className="mt-5 space-y-3">
        {conversation.messages.length > 0 ? (
          conversation.messages.map((message) => {
            const isDraft =
              typeof message.metadata === "object" &&
              !Array.isArray(message.metadata) &&
              message.metadata !== null &&
              "draft" in message.metadata;

            return (
              <div
                key={message.id}
                className="rounded-2xl border border-viva-line/60 bg-viva-card/55 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-viva-subtle">
                  <span className="font-semibold uppercase tracking-[0.12em] text-viva-primary">
                    {message.sender_type}
                  </span>
                  <span>{message.direction}</span>
                  {isDraft ? (
                    <span className="font-semibold text-viva-warning">
                      draft
                    </span>
                  ) : null}
                  <span>{formatDate(message.occurred_at)}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-viva-ink">
                  {message.body}
                </p>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-viva-line px-4 py-5 text-sm text-viva-muted">
            No messages stored yet.
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <MessageRecordForm conversationId={conversation.id} />
        <BookingDraftForm conversationId={conversation.id} />
        <PaymentDraftForm
          conversationId={conversation.id}
          catalogItems={catalogItems}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-viva-line/70 bg-viva-card/45 p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-viva-primary">
          Reviewed outbound queue
        </div>
        <div className="mt-3 space-y-3">
          {conversation.outbound_messages.length > 0 ? (
            conversation.outbound_messages.map((outbound) => (
              <div
                key={outbound.id}
                className="rounded-2xl border border-viva-line/60 bg-viva-elevated/35 p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-viva-subtle">
                      {outbound.channel} / {outbound.review_status}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-viva-ink">
                      {outbound.body}
                    </p>
                    <p className="mt-2 text-xs text-viva-muted">
                      {outbound.recipient_phone ||
                        outbound.recipient_email ||
                        "No recipient saved"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {outbound.review_status === "draft" ? (
                      <ActionButtonForm
                        action={approveOutboundMessage}
                        hiddenName="outbound_message_id"
                        hiddenValue={outbound.id}
                        label="Approve"
                        pendingLabel="Approving..."
                        icon={CheckCircle2}
                      />
                    ) : null}
                    {outbound.review_status === "approved" ? (
                      <ActionButtonForm
                        action={recordOutboundMessageSent}
                        hiddenName="outbound_message_id"
                        hiddenValue={outbound.id}
                        label="Record as sent"
                        pendingLabel="Recording..."
                        icon={SendHorizontal}
                        variant="primary"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-viva-muted">
              Queue an AI draft when you want a human-reviewed outbound reply.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function ConversationsManager({
  conversations,
  channelBindings,
  catalogItems,
  canManageConfig,
  filters,
}: ConversationsManagerProps) {
  const openCount = conversations.filter(
    (conversation) => conversation.status === "open",
  ).length;
  const pendingCount = conversations.filter(
    (conversation) => conversation.status === "pending",
  ).length;
  const draftCount = conversations.reduce((count, conversation) => {
    return (
      count +
      conversation.messages.filter((message) => {
        return (
          message.sender_type === "assistant" &&
          message.direction === "internal" &&
          typeof message.metadata === "object" &&
          !Array.isArray(message.metadata) &&
          message.metadata !== null &&
          "draft" in message.metadata
        );
      }).length
    );
  }, 0);

  const statCards: Array<{
    label: string;
    value: number;
    icon: LucideIcon;
  }> = [
    { label: "Total", value: conversations.length, icon: MessageCircle },
    { label: "Open", value: openCount, icon: Clock3 },
    { label: "Pending", value: pendingCount, icon: ShieldCheck },
    { label: "Draft replies", value: draftCount, icon: CheckCircle2 },
  ];

  const currentStatus = filters.status ?? "all";
  const currentIntent = filters.intent ?? "all";
  const currentQuery = filters.query ?? "";

  function buildFilterHref(next: Partial<ConversationFilters>) {
    const params = new URLSearchParams();
    const status = next.status ?? currentStatus;
    const intent = next.intent ?? currentIntent;
    const query = next.query ?? currentQuery;

    if (status && status !== "all") params.set("status", status);
    if (intent && intent !== "all") params.set("intent", intent);
    if (query.trim()) params.set("q", query.trim());

    const queryString = params.toString();
    return queryString
      ? `/dashboard/conversations?${queryString}`
      : "/dashboard/conversations";
  }

  return (
    <div className="space-y-6">
      <section className="viva-auth-card rounded-[1.6rem] p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="font-display text-xl font-black text-viva-ink">
              Inbox controls
            </h2>
            <p className="mt-1 text-sm text-viva-muted">
              Filter the tenant inbox without deleting any test or customer data.
            </p>
          </div>

          <form
            action="/dashboard/conversations"
            className="grid gap-3 sm:grid-cols-[minmax(12rem,1fr)_11rem_11rem_auto]"
          >
            <input
              name="q"
              defaultValue={currentQuery}
              placeholder="Search name, phone, email, summary..."
              className="viva-field h-11 px-4 text-sm"
            />
            <select
              name="status"
              defaultValue={currentStatus}
              className="viva-field h-11 px-3 text-sm"
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              name="intent"
              defaultValue={currentIntent}
              className="viva-field h-11 px-3 text-sm"
            >
              {intentFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button type="submit" className="viva-button-primary h-11 px-4 text-sm font-bold">
              Apply
            </button>
          </form>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {statusFilterOptions.map((option) => {
            const active = currentStatus === option.value;
            return (
              <Link
                key={option.value}
                href={buildFilterHref({
                  status: option.value as ConversationFilters["status"],
                })}
                className={
                  active
                    ? "viva-button-primary h-9 px-3 text-xs font-bold"
                    : "viva-button-ghost h-9 px-3 text-xs font-bold"
                }
              >
                {option.label}
              </Link>
            );
          })}
          {(currentStatus !== "all" || currentIntent !== "all" || currentQuery) ? (
            <Link
              href="/dashboard/conversations"
              className="viva-button-ghost h-9 px-3 text-xs font-bold"
            >
              Reset
            </Link>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="viva-glass rounded-2xl p-5">
            <Icon className="h-5 w-5 text-viva-primary" />
            <div className="mt-3 text-sm text-viva-muted">{label}</div>
            <div className="mt-1 font-display text-3xl font-black text-viva-ink">
              {value}
            </div>
          </div>
        ))}
      </section>

      <ConversationCreateForm
        channelBindings={channelBindings}
        canManageConfig={canManageConfig}
      />

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-3xl font-black text-viva-ink">
            Conversation library
          </h2>
          <p className="mt-1 text-sm text-viva-muted">
            Showing the latest {conversations.length} matching thread
            {conversations.length === 1 ? "" : "s"}. Capture inbound demand,
            work the inbox, and turn threads into bookings or payment follow-up.
          </p>
        </div>

        {conversations.length > 0 ? (
          <div className="grid gap-5">
            {conversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                catalogItems={catalogItems}
              />
            ))}
          </div>
        ) : (
          <div className="viva-auth-card rounded-[2rem] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
              <MessageSquarePlus className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-3xl font-black text-viva-ink">
              No conversations yet
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-viva-muted">
              Start with the WhatsApp beta simulator or create a manual test
              conversation here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
