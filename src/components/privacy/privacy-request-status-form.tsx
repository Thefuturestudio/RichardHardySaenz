"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { updatePrivacyRequestStatus } from "@/app/dashboard/privacy/actions";
import type { ActionState } from "@/types";

const initialState: ActionState = {};

export function PrivacyRequestStatusForm({
  requestId,
  currentStatus,
  disabled,
}: {
  requestId: string;
  currentStatus: string;
  disabled?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    updatePrivacyRequestStatus,
    initialState,
  );

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <input type="hidden" name="request_id" value={requestId} />
      <div className="grid gap-3 md:grid-cols-[0.8fr,1fr,auto]">
        <select
          name="status"
          defaultValue={currentStatus}
          className="viva-field h-10 px-3 text-sm"
          disabled={disabled || isPending}
        >
          <option value="open">Open</option>
          <option value="in_review">In review</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          name="resolution_notes"
          className="viva-field h-10 px-3 text-sm"
          placeholder="Resolution note"
          disabled={disabled || isPending}
        />
        <button
          type="submit"
          disabled={disabled || isPending}
          className="viva-button-ghost h-10 px-3 text-sm font-bold"
        >
          <CheckCircle2 className="h-4 w-4" />
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>

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
