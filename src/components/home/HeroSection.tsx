import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, MessageCircle } from "lucide-react";
import { imageAssets } from "../../data/images";
import { useLanguage } from "../../i18n/LanguageContext";
import { CTAButton } from "../shared/CTAButton";
import { HeroTitleText } from "../shared/PageHero";

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const { language, t } = useLanguage();
  const [doctorName, platformName] = t.home.hero.eyebrow.split("·").map((part) => part.trim());
  const titleAccent =
    language === "en" ? "advanced urology" : "Urología avanzada";
  const proofPoints =
    language === "en"
      ? [
          ["10+", "years of clinical and surgical experience"],
          ["HoLEP", "laser prostate and endourology training"],
          ["AUA · EAU", "international urology memberships"],
        ]
      : [
          ["10+", "años de experiencia clínica y quirúrgica"],
          ["HoLEP", "láser prostático y endourología"],
          ["AUA · EAU", "membresías urológicas internacionales"],
        ];

  function openAssistant() {
    window.dispatchEvent(new CustomEvent("uropanama:open-assistant"));
  }

  return (
    <section className="luxury-shell site-hero relative isolate min-h-[94vh] px-4 pb-12 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <img
        src={imageAssets.bluegatiHomeHero.src}
        alt=""
        aria-hidden="true"
        decoding="async"
        className="absolute -right-[62%] top-0 -z-30 h-[121%] w-[168%] object-cover object-[76%_24%] opacity-100 saturate-[1.02] contrast-[1.04] sm:-right-[24%] sm:w-[128%] md:-right-[17%] md:w-[120%] lg:-right-[12%] lg:h-[124%] lg:w-[116%] xl:-right-[13%]"
      />
      <div className="absolute inset-0 -z-10 bg-[url('/images/medical-background-texture.webp')] bg-cover bg-center opacity-[0.055]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(245,247,249,0.995)_0%,rgba(255,255,255,0.96)_46%,rgba(255,255,255,0.68)_74%,rgba(224,238,247,0.16)_100%)] sm:bg-[linear-gradient(90deg,rgba(245,247,249,0.98)_0%,rgba(255,255,255,0.9)_38%,rgba(255,255,255,0.44)_62%,rgba(224,238,247,0.08)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-mist via-mist/70 to-transparent" />

      <div className="relative mx-auto grid min-h-[calc(94vh-8rem)] max-w-[1360px] items-center gap-12">
        <motion.div
          initial={reduceMotion ? false : { y: 18 }}
          animate={reduceMotion ? undefined : { y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="min-w-0 max-w-[940px] lg:-mt-4"
        >
          <p className="site-hero-eyebrow flex max-w-full min-w-0 flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-8">
            <span>{doctorName}</span>
            <span className="h-px w-10 bg-medical/50" aria-hidden="true" />
            <span>{platformName}</span>
          </p>
          <h1 className="site-hero-title mt-9 max-w-[920px] font-heading text-navy text-balance">
            <HeroTitleText title={t.home.hero.title} accent={titleAccent} />
          </h1>
          <p className="mt-8 max-w-[48rem] text-[17px] leading-[1.78] text-slate-600 sm:mt-9 sm:text-xl">
            {t.home.hero.subtitle}
          </p>

          <div className="mt-9 flex max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <CTAButton
              to="/agendar-cita"
              icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
              className="min-h-12 w-full px-7 text-[15px] shadow-[0_16px_42px_rgba(13,43,69,0.14)] sm:w-auto"
            >
              {t.cta.book}
            </CTAButton>
            <button
              type="button"
              onClick={openAssistant}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-borderblue bg-white/78 px-7 text-[15px] font-semibold text-navy shadow-[0_14px_36px_rgba(13,43,69,0.07)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-navy hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan sm:w-auto"
            >
              {t.cta.assistant}
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10 flex max-w-4xl flex-wrap gap-2.5">
            {proofPoints.map(([value, label]) => (
              <div
                key={value}
                className="rounded-2xl border border-borderblue/85 bg-white/58 px-4 py-3 shadow-[0_10px_26px_rgba(6,27,51,0.045)] backdrop-blur"
              >
                <p className="font-heading text-[1.7rem] leading-none text-navy">
                  {value}
                </p>
                <p className="mt-1.5 max-w-[11.5rem] text-[10px] font-semibold uppercase leading-4 tracking-[0.11em] text-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-5xl border-t border-borderblue/70 pt-5 sm:mt-10">
            <div className="site-hero-eyebrow flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-center">
              {t.home.hero.trust.map((item, index) => (
                <span key={item} className="inline-flex items-center gap-5">
                  {index > 0 && (
                    <span className="hidden h-1 w-1 rounded-full bg-medical sm:block" />
                  )}
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
