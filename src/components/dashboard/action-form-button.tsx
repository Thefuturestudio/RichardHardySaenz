"use client";

import { useActionState } from "react";
import type { LucideIcon } from "lucide-react";
import type { ActionState } from "@/types";

const initialState: ActionState = {};

type ActionFormButtonProps = {
  action: (previousState: ActionState, formData: FormData) => Promise<ActionState>;
  hiddenName: string;
  hiddenValue: string;
  label: string;
  pendingLabel: string;
  icon: LucideIcon;
  variant?: "ghost" | "primary";
};

export function ActionFormButton({
  action,
  hiddenName,
  hiddenValue,
  label,
  pendingLabel,
  icon: Icon,
  variant = "ghost",
}: ActionFormButtonProps) {
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
