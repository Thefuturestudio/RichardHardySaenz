import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, MessageCircle } from "lucide-react";
import { contact } from "../../data/contact";
import { imageAssets } from "../../data/images";
import { useLanguage } from "../../i18n/LanguageContext";
import { CTAButton } from "../shared/CTAButton";
import { KidneyIcon } from "../shared/KidneyIcon";
import { MedicalDisclaimer } from "../shared/MedicalDisclaimer";

type AssistantPreviewProps = {
  compact?: boolean;
};

export function AssistantPreview({ compact = false }: AssistantPreviewProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr]">
      <div className="premium-card rounded-[1.5rem] p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-navy text-white">
            <KidneyIcon aria-hidden="true" className="h-6 w-6" />
          </div>
          <div>
            <p className="font-heading text-3xl leading-none text-navy">
              {t.home.assistant.eyebrow}
            </p>
            <p className="mt-1 text-sm text-muted">{t.safety.assistant}</p>
          </div>
        </div>

        <div className="rounded-[1.2rem] bg-softblue/70 p-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-7 text-navy shadow-sm"
          >
            {t.home.assistant.opening}
          </motion.div>
          <motion.div
            key={selected}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-auto mt-3 max-w-[88%] rounded-2xl rounded-tr-sm bg-navy p-4 text-sm leading-7 text-white shadow-sm"
          >
            {t.home.assistant.responses[selected]}
          </motion.div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {t.home.assistant.quick.map((action, index) => (
            <button
              key={action}
              type="button"
              onClick={() => setSelected(index)}
              className="rounded-full border border-borderblue bg-white/80 px-3 py-2 text-xs font-semibold text-navy transition hover:border-cyan hover:bg-softblue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              {action}
            </button>
          ))}
        </div>

        <MedicalDisclaimer compact className="mt-5" />

        <div className="mt-6 flex flex-wrap gap-3">
          <CTAButton
            href={contact.whatsappHref}
            icon={<MessageCircle aria-hidden="true" className="h-4 w-4" />}
          >
            {t.cta.assistant}
          </CTAButton>
          <CTAButton
            to="/agendar-cita"
            variant="secondary"
            icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
          >
            {t.cta.book}
          </CTAButton>
        </div>
      </div>

      {!compact && (
        <div className="relative overflow-hidden rounded-[1.5rem] border border-borderblue bg-white shadow-premium">
          <img
            src={imageAssets.aiAssistant.src}
            alt={imageAssets.aiAssistant.alt}
            className="h-full min-h-[500px] w-full object-cover object-center opacity-80"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/5 to-white/10" />
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/50 bg-white/90 p-5 text-sm leading-6 text-navy shadow-soft backdrop-blur">
            {t.home.assistant.body}
          </div>
        </div>
      )}
    </div>
  );
}
