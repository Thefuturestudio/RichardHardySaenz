"use client";

import { useActionState } from "react";
import { FileText } from "lucide-react";
import { createPrivacyRequest } from "@/app/dashboard/privacy/actions";
import type { ActionState } from "@/types";

const initialState: ActionState = {};

export function PrivacyRequestForm({ disabled }: { disabled?: boolean }) {
  const [state, formAction, isPending] = useActionState(
    createPrivacyRequest,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Request type</span>
          <select
            name="request_type"
            className="viva-field mt-2 px-4 py-3"
            defaultValue="access"
            disabled={disabled || isPending}
          >
            <option value="access">Access</option>
            <option value="export">Export</option>
            <option value="correction">Correction</option>
            <option value="deletion">Deletion</option>
            <option value="restriction">Restriction</option>
            <option value="retention_review">Retention review</option>
            <option value="incident">Incident</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-viva-ink">Subject contact</span>
          <input
            name="subject_contact"
            className="viva-field mt-2 px-4 py-3"
            placeholder="Phone or email"
            disabled={disabled || isPending}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-viva-ink">Subject name</span>
          <input
            name="subject_display_name"
            className="viva-field mt-2 px-4 py-3"
            placeholder="Customer or patient name"
            disabled={disabled || isPending}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-viva-ink">Notes</span>
          <textarea
            name="notes"
            className="viva-field mt-2 min-h-24 px-4 py-3"
            placeholder="Record the request, source, scope, deadline, and any legal hold notes."
            disabled={disabled || isPending}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={disabled || isPending}
        className="viva-button-primary h-12 px-5 text-sm font-bold"
      >
        <FileText className="h-4 w-4" />
        {isPending ? "Recording..." : "Record request"}
      </button>

      {state.error ? (
        <div className="rounded-xl border border-viva-error/30 bg-viva-error/10 px-4 py-3 text-sm text-viva-error">
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="rounded-xl border border-viva-success/30 bg-viva-success/10 px-4 py-3 text-sm text-viva-success">
          {state.success}
        </div>
      ) : null}
    </form>
  );
}
