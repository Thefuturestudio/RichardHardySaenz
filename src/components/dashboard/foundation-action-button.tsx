"use client";

import { useActionState } from "react";
import {
  Bot,
  Archive,
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  PlayCircle,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { ActionState } from "@/types";

const initialState: ActionState = {};

const icons = {
  archive: Archive,
  bot: Bot,
  calendar: CalendarCheck2,
  check: CheckCircle2,
  creditCard: CreditCard,
  play: PlayCircle,
  radio: Radio,
  shield: ShieldCheck,
  sliders: SlidersHorizontal,
  users: Users,
  wifi: Wifi,
} satisfies Record<string, LucideIcon>;

type FoundationActionButtonProps = {
  action: () => Promise<ActionState>;
  label: string;
  pendingLabel?: string;
  icon: keyof typeof icons;
  disabled?: boolean;
};

export function FoundationActionButton({
  action,
  label,
  pendingLabel = "Preparing...",
  icon,
  disabled,
}: FoundationActionButtonProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const Icon = icons[icon];

  return (
    <form action={formAction} className="space-y-3">
      <button
        type="submit"
        disabled={disabled || isPending}
        className="viva-button-primary h-12 px-5 text-sm font-bold"
      >
        <Icon className="h-4 w-4" />
        {isPending ? pendingLabel : label}
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
