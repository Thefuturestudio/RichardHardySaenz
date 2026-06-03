import { ConversationsManager } from "@/components/conversations/conversations-manager";
import { PageHeader } from "@/components/dashboard/page-header";
import { getCatalogForTenant } from "@/lib/data/catalog";
import { getChannelBindingsForTenant } from "@/lib/data/channels";
import type { ConversationFilters } from "@/lib/data/conversations";
import { getConversationsForTenant } from "@/lib/data/conversations";
import { requireTenantContext } from "@/lib/data/tenant";

type ConversationsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const allowedStatuses = new Set(["all", "open", "pending", "resolved", "archived"]);
const allowedIntents = new Set([
  "all",
  "unknown",
  "booking",
  "sales",
  "support",
  "handoff",
]);

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ConversationsPage({
  searchParams,
}: ConversationsPageProps) {
  const tenantContext = await requireTenantContext();
  const params = (await searchParams) ?? {};
  const status = firstParam(params.status);
  const intent = firstParam(params.intent);
  const query = firstParam(params.q);
  const filters: ConversationFilters = {
    status: allowedStatuses.has(status ?? "") ? (status as ConversationFilters["status"]) : "all",
    intent: allowedIntents.has(intent ?? "") ? (intent as ConversationFilters["intent"]) : "all",
    query,
    limit: 50,
  };
  const [conversations, channelBindings, catalog] = await Promise.all([
    getConversationsForTenant(tenantContext.tenant.id, filters),
    getChannelBindingsForTenant(tenantContext.tenant.id),
    getCatalogForTenant(tenantContext.tenant.id),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Step 3"
        title="Conversations"
        description="Run the live internal workflow: capture inbound messages, triage them in the inbox, draft AI-assisted replies, and create booking or payment follow-up in test mode."
      />

      <ConversationsManager
        conversations={conversations}
        channelBindings={channelBindings}
        catalogItems={catalog.items}
        canManageConfig={tenantContext.role === "owner" || tenantContext.role === "admin"}
        filters={filters}
      />
    </div>
  );
}
