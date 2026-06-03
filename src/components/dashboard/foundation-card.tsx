import type { LucideIcon } from "lucide-react";

type FoundationCardProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function FoundationCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}: FoundationCardProps) {
  return (
    <section className="viva-glow-card rounded-[2rem] p-6 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-viva-primary">
            {eyebrow}
          </div>
          <h2 className="mt-2 font-display text-3xl font-black text-viva-ink">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-viva-muted sm:text-base">
            {description}
          </p>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-viva-gradient text-white shadow-glow">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}

type StatPillProps = {
  label: string;
  value: string;
};

export function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-2xl border border-viva-line/70 bg-viva-card/60 p-4 shadow-card backdrop-blur-xl">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-viva-subtle">
        {label}
      </div>
      <div className="mt-2 font-display text-xl font-black capitalize text-viva-ink">
        {value.replaceAll("_", " ")}
      </div>
    </div>
  );
}
