import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/cn";

type SectionContainerProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  dark?: boolean;
};

export function SectionContainer({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
  innerClassName,
  dark = false,
}: SectionContainerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32",
        dark ? "bg-navy text-white" : "soft-white-section bg-white text-navy",
        className,
      )}
    >
      <motion.div
        className={cn("mx-auto max-w-7xl", innerClassName)}
        initial={reduceMotion ? false : { y: 20 }}
        whileInView={reduceMotion ? undefined : { y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {(eyebrow || title || subtitle) && (
          <div className="mx-auto mb-12 max-w-4xl text-center">
            {eyebrow && (
              <p
                className={cn(
                  "mb-3 text-xs font-bold uppercase tracking-[0.18em]",
                  dark ? "text-cyan" : "text-medical",
                )}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className={cn(
                  "mx-auto max-w-4xl text-5xl leading-[0.98] text-balance sm:text-6xl lg:text-[4.25rem]",
                  dark ? "text-white" : "text-navy",
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={cn(
                  "mx-auto mt-6 max-w-2xl text-[17px] leading-[1.75] sm:text-lg",
                  dark ? "text-blue-100" : "text-muted",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </motion.div>
    </section>
  );
}
