import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { ImageAsset } from "../../data/images";
import { useLanguage } from "../../i18n/LanguageContext";
import { cn } from "../../lib/cn";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  intro?: string;
  image?: ImageAsset;
  imageClassName?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  intro,
  image,
  imageClassName,
  actions,
  className,
}: PageHeroProps) {
  const reduceMotion = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section
      className={cn(
        "luxury-shell site-hero isolate min-h-[66vh] px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40",
        className,
      )}
    >
      {image && (
        <img
          src={image.src}
          alt=""
          aria-hidden="true"
          className={cn(
            "page-hero-image",
            imageClassName,
          )}
          loading="eager"
          decoding="async"
        />
      )}
      <div className="page-hero-overlay" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-white/95 via-white/55 to-transparent" />
      <div className="relative z-20 mx-auto w-full max-w-7xl min-w-0">
        <motion.div
          initial={reduceMotion ? false : { y: 18 }}
          animate={reduceMotion ? undefined : { y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full min-w-0 max-w-4xl"
        >
          <p className="site-hero-eyebrow mb-5">
            {eyebrow ?? t.brand.platform}
          </p>
          <h1 className="site-hero-title max-w-full break-words font-heading text-navy text-balance">
            <HeroTitleText title={title} accent={titleAccent} />
          </h1>
          <p className="mt-7 max-w-[20.5rem] text-lg leading-[1.75] text-muted sm:max-w-2xl sm:text-xl">
            {subtitle}
          </p>
          {intro && (
            <p className="mt-5 max-w-[20.5rem] text-base leading-[1.75] text-muted sm:max-w-2xl">
              {intro}
            </p>
          )}
          {actions && (
            <div className="mt-10 flex max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              {actions}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

type HeroTitleTextProps = {
  title: string;
  accent?: string;
};

export function HeroTitleText({ title, accent }: HeroTitleTextProps) {
  if (!accent) {
    return <>{title}</>;
  }

  const accentIndex = title.toLocaleLowerCase().indexOf(accent.toLocaleLowerCase());

  if (accentIndex < 0) {
    return <>{title}</>;
  }

  const before = title.slice(0, accentIndex);
  const highlighted = title.slice(accentIndex, accentIndex + accent.length);
  const after = title.slice(accentIndex + accent.length);

  return (
    <>
      {before}
      <span className="text-medical">{highlighted}</span>
      {after}
    </>
  );
}
