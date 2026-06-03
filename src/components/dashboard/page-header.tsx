type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="viva-glow-card flex flex-col gap-4 rounded-[2rem] p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
      <div>
        {eyebrow ? (
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-viva-primary">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="font-display text-3xl font-black tracking-normal text-viva-ink sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-viva-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
