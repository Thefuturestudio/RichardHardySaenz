import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Quote, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

const trustIcons = [BadgeCheck, ShieldCheck, Sparkles];

const reviewCopy = {
  es: {
    label: "Testimonios",
    source:
      "HuliHealth muestra una calificación pública de 5.0 basada en opiniones de pacientes. El texto individual de las reseñas no se publica aquí sin autorización o exportación verificable.",
    patient: "Paciente verificado",
    body:
      "Referencia de cinco estrellas registrada en HuliHealth. No se inventa texto testimonial; se incorporará contenido completo solo con autorización o fuente verificable.",
  },
  en: {
    label: "Testimonials",
    source:
      "HuliHealth shows a public 5.0 rating based on patient reviews. Individual review text is not published here without authorization or a verifiable export.",
    patient: "Verified patient",
    body:
      "Five-star reference registered on HuliHealth. No testimonial text is invented; full content will be added only with authorization or a verifiable source.",
  },
} as const;

export function TrustReputation() {
  const { language, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const reviews = Array.from({ length: 10 }, (_, index) => index + 1);
  const review = reviewCopy[language] ?? reviewCopy.es;

  return (
    <div className="space-y-12">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
          {t.home.authority.eyebrow}
        </p>
        <h2 className="mx-auto mt-5 max-w-4xl font-heading text-5xl leading-[0.98] text-navy text-balance lg:text-[4.25rem]">
          {t.home.authority.title}
        </h2>
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-[1.75] text-muted">
          {t.home.authority.body}
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {t.home.authority.stats.map(([value, label, note], index) => {
          const Icon = trustIcons[index] ?? BadgeCheck;

          return (
            <motion.article
              key={label}
              initial={reduceMotion ? false : { y: 14 }}
              whileInView={reduceMotion ? undefined : { y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="brugiati-card group h-full p-6 text-center"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-borderblue bg-softblue text-navy transition group-hover:bg-navy group-hover:text-white">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="mt-5 font-heading text-4xl leading-none text-navy">
                {value}
              </p>
              <p className="mt-2 text-sm font-semibold leading-5 text-navy">
                {label}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted">{note}</p>
            </motion.article>
          );
        })}
      </div>

      <div>
        <div className="mx-auto mb-6 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
            {review.label}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">{review.source}</p>
        </div>
        <div className="flex w-full max-w-full snap-x gap-4 overflow-x-auto px-0 pb-4">
          {reviews.map((number) => (
            <article
              key={number}
              className="brugiati-card min-w-[18rem] snap-start p-6 md:min-w-[22rem]"
            >
              <div className="flex items-center justify-between gap-4">
                <Quote aria-hidden="true" className="h-5 w-5 text-medical" />
                <div className="flex gap-0.5 text-gold" aria-label="5 estrellas">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <h3 className="mt-5 text-base font-semibold text-navy">
                {review.patient} {String(number).padStart(2, "0")}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">{review.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
