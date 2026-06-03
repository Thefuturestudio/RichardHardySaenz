import {
  AlertTriangle,
  ClipboardCheck,
  FileText,
  ShieldCheck,
} from "lucide-react";
import {
  prepareMedicalPrivacyLaunchChecks,
  recordIncidentDrill,
  recordRetentionReview,
} from "@/app/dashboard/privacy/actions";
import { FoundationActionButton } from "@/components/dashboard/foundation-action-button";
import { FoundationCard, StatPill } from "@/components/dashboard/foundation-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { PrivacyRequestForm } from "@/components/privacy/privacy-request-form";
import { PrivacyRequestStatusForm } from "@/components/privacy/privacy-request-status-form";
import { getPrivacyOperationsOverview } from "@/lib/data/privacy-ops";
import { canManageTenant, requireTenantContext } from "@/lib/data/tenant";

function formatDate(value: string | null) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function PrivacyOperationsPage() {
  const tenantContext = await requireTenantContext();
  const overview = await getPrivacyOperationsOverview(
    tenantContext.tenant.id,
    tenantContext.settings,
  );
  const canEdit = canManageTenant(tenantContext.role);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Medical launch"
        title="Privacy operations"
        description="Track the work required before medical tenants can process PHI: BAAs, HIPAA project setup, provider reviews, MFA, retention, exports, deletion requests, and incidents."
      />

      <FoundationCard
        eyebrow="PHI go-live gate"
        title="Prepare medical launch checks"
        description="Create the approval records that must be reviewed before any PHI-capable provider workflow is turned on."
        icon={ShieldCheck}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <StatPill label="Checks" value={String(overview.checks.length)} />
          <StatPill label="Blocked" value={String(overview.blockedCount)} />
          <StatPill label="Requests" value={String(overview.privacyRequests.length)} />
          <StatPill label="Providers" value={String(overview.providerActivations.length)} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <FoundationActionButton
            action={prepareMedicalPrivacyLaunchChecks}
            label="Prepare checks"
            pendingLabel="Preparing..."
            icon="shield"
            disabled={!canEdit}
          />
          <FoundationActionButton
            action={recordRetentionReview}
            label="Queue retention review"
            pendingLabel="Recording..."
            icon="archive"
            disabled={!canEdit}
          />
          <FoundationActionButton
            action={recordIncidentDrill}
            label="Record incident drill"
            pendingLabel="Recording..."
            icon="check"
            disabled={!canEdit}
          />
        </div>
      </FoundationCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overview.checks.map((check) => (
          <div key={check.key} className="viva-auth-card rounded-[1.5rem] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className={
                    check.status === "pass"
                      ? "text-xs font-semibold uppercase tracking-[0.16em] text-viva-success"
                      : check.status === "warning"
                        ? "text-xs font-semibold uppercase tracking-[0.16em] text-viva-warning"
                        : "text-xs font-semibold uppercase tracking-[0.16em] text-viva-error"
                  }
                >
                  {check.status}
                </div>
                <h2 className="mt-2 font-display text-xl font-black text-viva-ink">
                  {check.label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-viva-muted">
                  {check.detail}
                </p>
              </div>
              {check.status === "pass" ? (
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-viva-success" />
              ) : (
                <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-viva-warning" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr,1.1fr]">
        <div className="viva-auth-card rounded-[2rem] p-6">
          <div className="flex items-start gap-3">
            <FileText className="mt-1 h-5 w-5 text-viva-primary" />
            <div>
              <h2 className="font-display text-2xl font-black text-viva-ink">
                New privacy request
              </h2>
              <p className="mt-2 text-sm leading-6 text-viva-muted">
                Record access, export, correction, deletion, restriction,
                retention, or incident work. Completion should happen only after
                legal and operational review.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <PrivacyRequestForm disabled={!canEdit} />
          </div>
        </div>

        <div className="space-y-4">
          {overview.privacyRequests.length > 0 ? (
            overview.privacyRequests.map((request) => (
              <div key={request.id} className="viva-auth-card rounded-[1.5rem] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <ClipboardCheck className="mt-1 h-5 w-5 text-viva-primary" />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-primary">
                        {request.request_type.replaceAll("_", " ")}
                      </div>
                      <h2 className="mt-2 font-display text-xl font-black text-viva-ink">
                        {request.subject_display_name || "Privacy request"}
                      </h2>
                      <p className="mt-1 text-sm text-viva-muted">
                        {request.subject_contact || "No contact recorded"}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-viva-muted">
                        {request.notes || "No notes saved yet."}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-viva-line/70 bg-viva-card/50 px-3 py-2 text-xs font-semibold text-viva-muted">
                    Due {formatDate(request.due_at)}
                  </div>
                </div>
                <PrivacyRequestStatusForm
                  requestId={request.id}
                  currentStatus={request.status}
                  disabled={!canEdit}
                />
              </div>
            ))
          ) : (
            <div className="viva-auth-card rounded-[2rem] p-6 text-sm leading-6 text-viva-muted">
              No privacy requests are recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
