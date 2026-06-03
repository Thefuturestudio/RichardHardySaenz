import Link from "next/link";
import { Bot, BrainCircuit, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { getCatalogForTenant } from "@/lib/data/catalog";
import { getConversationsForTenant } from "@/lib/data/conversations";
import { getFoundationsOverview } from "@/lib/data/foundations";
import { requireTenantContext } from "@/lib/data/tenant";

export default async function AiToolsPage() {
  const tenantContext = await requireTenantContext();
  const [overview, conversations, catalog] = await Promise.all([
    getFoundationsOverview(tenantContext.tenant.id),
    getConversationsForTenant(tenantContext.tenant.id),
    getCatalogForTenant(tenantContext.tenant.id),
  ]);

  const draftMessages = conversations.flatMap((conversation) =>
    conversation.messages.filter((message) => {
      return (
        message.sender_type === "assistant" &&
        message.direction === "internal" &&
        typeof message.metadata === "object" &&
        !Array.isArray(message.metadata) &&
        message.metadata !== null &&
        "draft" in message.metadata
      );
    }),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 7 live flow"
        title="AI agent tools"
        description="Safe internal drafting is now active. Viva can create review-only reply drafts from conversation context and catalog data without sending anything automatically."
        action={
          <Link
            href="/dashboard/conversations"
            className="viva-button-primary h-11 px-4 text-sm font-bold"
          >
            Open conversations
            <Bot className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Tools configured", String(overview.aiTools.length)],
          ["Draft replies", String(draftMessages.length)],
          ["Catalog items", String(catalog.items.length)],
          ["Mode", "Review only"],
        ].map(([label, value]) => (
          <div key={label} className="viva-glass rounded-2xl p-5">
            <div className="text-sm text-viva-muted">{label}</div>
            <div className="mt-1 font-display text-3xl font-black text-viva-ink">
              {value}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="viva-auth-card rounded-[1.8rem] p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-viva-gradient-soft text-viva-primary">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                Active now
              </div>
              <h2 className="mt-2 font-display text-2xl font-black text-viva-ink">
                Safe drafting mode
              </h2>
              <p className="mt-2 text-sm leading-6 text-viva-muted">
                Drafts are generated from the conversation intent, latest customer
                message, tenant settings, and current catalog. They are stored as
                internal assistant notes for review.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm leading-6 text-viva-muted">
            <p>Nothing is sent automatically.</p>
            <p>No OpenAI API calls are required in this mode.</p>
            <p>No customer data is used for shared model training.</p>
          </div>
        </div>

        <div className="space-y-4">
          {overview.aiTools.map((tool) => (
            <div key={tool.id} className="viva-auth-card rounded-[1.5rem] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                {tool.status}
              </div>
              <h3 className="mt-2 font-display text-2xl font-black text-viva-ink">
                {tool.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-viva-muted">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-3xl font-black text-viva-ink">
            Recent draft replies
          </h2>
          <p className="mt-1 text-sm text-viva-muted">
            Generated inside the conversation workflow. Review and send manually later.
          </p>
        </div>

        {draftMessages.length > 0 ? (
          <div className="grid gap-4">
            {draftMessages.slice(0, 6).map((message) => (
              <div key={message.id} className="viva-auth-card rounded-[1.5rem] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                  Draft reply
                </div>
                <p className="mt-3 text-sm leading-6 text-viva-ink">{message.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="viva-auth-card rounded-[2rem] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
              <Bot className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-3xl font-black text-viva-ink">
              No draft replies yet
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-viva-muted">
              Open a conversation and use the “Draft AI reply” action to create
              the first safe suggestion.
            </p>
          </div>
        )}
      </section>

      <div className="viva-auth-card rounded-[2rem] p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-viva-primary" />
          <p className="text-sm leading-6 text-viva-muted">
            This mode is intentionally conservative. It is built for operator
            review, not autonomous messaging, diagnoses, or unapproved outbound
            behavior.
          </p>
        </div>
      </div>
    </div>
  );
}
