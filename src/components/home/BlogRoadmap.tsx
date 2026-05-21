import { ArrowRight, BookOpenText, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CTAButton } from "../shared/CTAButton";
import { useLanguage } from "../../i18n/LanguageContext";

const copy = {
  es: {
    eyebrow: "Educación médica",
    title: "Temas que el paciente suele necesitar antes de decidir.",
    body:
      "La biblioteca educativa puede iniciar con los temas SEO definidos en el onboarding, conectando síntomas comunes con procedimientos avanzados sin reemplazar la consulta.",
    cta: "Solicitar orientación",
    open: "Leer más",
    topics: [
      [
        "Uro-oncología",
        "Cáncer urológico, estudios alterados y segunda opinión.",
        "Guía para preparar reportes, imágenes, biopsias y preguntas antes de revisar una recomendación importante.",
        "/educacion/segunda-opinion-uro-oncologia",
      ],
      [
        "Enucleación de próstata",
        "HPB, crecimiento prostático benigno, HoLEP y síntomas urinarios.",
        "Explicación para pacientes con flujo débil, urgencia, retención o próstata grande que desean entender opciones láser.",
        "/educacion/holep-crecimiento-prostatico",
      ],
      [
        "Endourología",
        "Litiasis renal, ureteroscopia, láser, litotricia y prevención.",
        "Ruta de contenidos para entender cálculos, estudios de imagen, procedimientos endoscópicos y prevención de nuevos episodios.",
        "/educacion/calculos-renales-endourologia",
      ],
      [
        "PSA y biopsia de próstata",
        "PSA elevado, resonancia, biopsia y evaluación de riesgo.",
        "Explicación clara para entender por qué el PSA puede subir y qué información ayuda antes de decidir una biopsia.",
        "/educacion/psa-biopsia-prostata",
      ],
      [
        "Vasectomía y salud masculina",
        "Anticoncepción masculina permanente, preparación y seguimiento.",
        "Guía para conversar la decisión, entender el seguimiento y resolver dudas frecuentes sin promesas ni presión.",
        "/educacion/vasectomia-salud-masculina",
      ],
    ],
  },
  en: {
    eyebrow: "Medical education",
    title: "Topics patients often need before deciding.",
    body:
      "The education library can start with SEO topics defined during onboarding, connecting common symptoms with advanced procedures without replacing consultation.",
    cta: "Request guidance",
    open: "Read more",
    topics: [
      [
        "Uro-oncology",
        "Urologic cancer, abnormal studies, and second opinion.",
        "Guidance for preparing reports, imaging, biopsies, and questions before reviewing an important recommendation.",
        "/educacion/segunda-opinion-uro-oncologia",
      ],
      [
        "Prostate enucleation",
        "BPH, benign prostate enlargement, HoLEP, and urinary symptoms.",
        "A patient-friendly explanation for weak stream, urgency, retention, or enlarged prostate concerns involving laser options.",
        "/educacion/holep-crecimiento-prostatico",
      ],
      [
        "Endourology",
        "Kidney stones, ureteroscopy, laser, lithotripsy, and prevention.",
        "A content pathway for understanding stones, imaging, endoscopic procedures, and prevention of future episodes.",
        "/educacion/calculos-renales-endourologia",
      ],
      [
        "PSA and prostate biopsy",
        "Elevated PSA, MRI, biopsy, and risk evaluation.",
        "A clear explanation of why PSA can rise and what information helps before deciding on biopsy.",
        "/educacion/psa-biopsia-prostata",
      ],
      [
        "Vasectomy and men's health",
        "Permanent male contraception, preparation, and follow-up.",
        "A guide for discussing the decision, understanding follow-up, and answering common questions without pressure.",
        "/educacion/vasectomia-salud-masculina",
      ],
    ],
  },
} as const;

export function BlogRoadmap() {
  const { language } = useLanguage();
  const t = copy[language] ?? copy.es;
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleTopics = useMemo(() => {
    return [0, 1, 2].map((offset) => {
      const index = (activeIndex + offset) % t.topics.length;

      return {
        index,
        item: t.topics[index],
      };
    });
  }, [activeIndex, t.topics]);

  function scrollTopics(direction: "prev" | "next") {
    setActiveIndex((current) => {
      if (direction === "next") {
        return (current + 1) % t.topics.length;
      }

      return (current - 1 + t.topics.length) % t.topics.length;
    });
  }

  return (
    <div>
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
          {t.eyebrow}
        </p>
        <h2 className="mx-auto mt-4 max-w-4xl font-heading text-5xl leading-[0.98] text-navy text-balance sm:text-6xl">
          {t.title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted">
          {t.body}
        </p>
        <CTAButton
          to="/agendar-cita"
          className="mt-8"
          icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
        >
          {t.cta}
        </CTAButton>
      </div>

      <div className="mx-auto mt-7 flex max-w-7xl justify-end">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollTopics("prev")}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-borderblue bg-white text-navy shadow-[0_14px_34px_rgba(11,102,195,0.08)] transition duration-300 hover:border-navy/70 hover:bg-navy hover:text-white hover:shadow-[0_18px_42px_rgba(13,43,69,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            aria-label={language === "es" ? "Tema anterior" : "Previous topic"}
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollTopics("next")}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-borderblue bg-white text-navy shadow-[0_14px_34px_rgba(11,102,195,0.08)] transition duration-300 hover:border-navy/70 hover:bg-navy hover:text-white hover:shadow-[0_18px_42px_rgba(13,43,69,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            aria-label={language === "es" ? "Tema siguiente" : "Next topic"}
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className="relative z-10 mx-auto mt-5 grid max-w-7xl gap-5 bg-transparent md:grid-cols-3"
        aria-label={t.title}
      >
        {visibleTopics.map(({ item, index }) => {
          const [title, body, more, href] = item;

          return (
          <details
            key={title}
            className="brugiati-card education-topic-card group min-h-[300px] p-7"
          >
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-borderblue bg-white text-navy shadow-[0_14px_34px_rgba(11,102,195,0.08)] transition duration-300 group-hover:border-navy/70 group-hover:bg-navy group-hover:text-white group-hover:shadow-[0_18px_42px_rgba(13,43,69,0.16)]">
                  <BookOpenText aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="brugiati-card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-7 font-heading text-3xl leading-none text-navy">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">{body}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-medical transition group-hover:text-navy">
                {t.open}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-open:rotate-90" />
              </span>
            </summary>
            <p className="mt-5 border-t border-borderblue pt-5 text-sm leading-7 text-muted">
              {more}
            </p>
            {href && (
              <Link
                to={href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-medical transition hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                {language === "es" ? "Leer guía completa" : "Read full guide"}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            )}
          </details>
          );
        })}
      </div>
    </div>
  );
}
