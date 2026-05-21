import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { imageAssets } from "../data/images";
import { specialtyVisuals } from "../data/pageVisuals";
import { specialtyRouteByKey, type SpecialtyKey } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import { internalPages } from "../i18n/internalPages";
import { Breadcrumbs } from "../components/shared/Breadcrumbs";
import { CTAButton } from "../components/shared/CTAButton";
import { ImageCard } from "../components/shared/ImageCard";
import { PageHero } from "../components/shared/PageHero";
import { SEO } from "../components/shared/SEO";
import { SectionContainer } from "../components/shared/SectionContainer";
import { simpleBreadcrumbs } from "../seo/breadcrumbs";
import { seoMetadata } from "../seo/metadata";
import { pageSchema } from "../seo/schema";

const specialtyKeys: SpecialtyKey[] = [
  "prostata",
  "calculosRenales",
  "uroOncologia",
  "endourologia",
  "cirugiaLaparoscopica",
  "saludMasculina",
];

const pathwayCopy = {
  es: {
    eyebrow: "Ruta de orientación",
    title: "Entienda el motivo, elija la ruta y confirme el próximo paso.",
    body:
      "La selección de una especialidad debe partir de síntomas, estudios disponibles y el objetivo de la visita. Si no está seguro, el equipo puede orientar el primer contacto.",
    understandLabel: "01 Entender",
    understandTitle: "Primero se organiza la preocupación.",
    understandBody:
      "Síntomas, antecedentes, estudios previos y dudas principales ayudan a definir qué área conviene revisar.",
    evaluateLabel: "02 Evaluar",
    evaluateTitle: "Después se define la ruta de evaluación.",
    evaluateBody:
      "La consulta permite revisar hallazgos y conversar opciones responsables según cada caso.",
    closing:
      "Esta ruta ayuda a que el primer contacto sea más claro, ordenado y útil para decidir el tipo de evaluación.",
    gridLead:
      "Seleccione el área que mejor coincide con su motivo de consulta.",
    guidanceTitle: "¿No está seguro por dónde empezar?",
    guidanceBody:
      "Comparta sus síntomas o estudios disponibles y el equipo le orientará hacia la especialidad adecuada.",
    guidanceCta: "Solicitar orientación",
  },
  en: {
    eyebrow: "Guided pathway",
    title: "Understand the concern, choose the route, and confirm the next step.",
    body:
      "Selecting a specialty should start with symptoms, available studies, and the goal of the visit. If you are unsure, the team can help direct the first contact.",
    understandLabel: "01 Understand",
    understandTitle: "First, organize the concern.",
    understandBody:
      "Symptoms, history, prior studies, and key questions help define which area should be reviewed.",
    evaluateLabel: "02 Evaluate",
    evaluateTitle: "Then, define the evaluation route.",
    evaluateBody:
      "The visit allows findings to be reviewed and responsible options to be discussed according to each case.",
    closing:
      "This pathway helps make the first contact clearer, more organized, and more useful when choosing the right evaluation.",
    gridLead:
      "Select the area that best matches your reason for consultation.",
    guidanceTitle: "Not sure where to start?",
    guidanceBody:
      "Share your symptoms or available studies and the team can guide you toward the right specialty.",
    guidanceCta: "Request guidance",
  },
} as const;

export function SpecialtiesPage() {
  const { language, t } = useLanguage();
  const copy = internalPages[language];
  const hub = copy.specialtiesHub;
  const pathway = pathwayCopy[language] ?? pathwayCopy.es;
  const breadcrumbs = simpleBreadcrumbs(
    language,
    "specialties",
    seoMetadata.specialties.path,
  );

  function openAssistant() {
    window.dispatchEvent(new CustomEvent("uropanama:open-assistant"));
  }

  return (
    <>
      <SEO
        title={seoMetadata.specialties.title}
        description={seoMetadata.specialties.description}
        canonicalPath={seoMetadata.specialties.path}
        jsonLd={pageSchema({ breadcrumbs })}
      />
      <PageHero
        title={hub.title}
        titleAccent={language === "en" ? "Urology specialties" : "Especialidades urológicas"}
        subtitle={hub.subtitle}
        intro={hub.intro}
        image={imageAssets.bluegatiSpecialtiesHero}
        imageClassName="page-hero-image--v2"
        actions={
          <>
            <CTAButton
              to="/agendar-cita"
              icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
            >
              {t.cta.evaluation}
            </CTAButton>
            <button
              type="button"
              onClick={openAssistant}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-borderblue bg-white/88 px-5 py-3 text-sm font-semibold text-navy shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-medical hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              {t.cta.assistant}
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
            </button>
          </>
        }
      />
      <Breadcrumbs items={breadcrumbs} />

      <SectionContainer className="bg-white">
        <article className="brugiati-card overflow-hidden p-0 lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="min-h-[24rem]">
            <ImageCard
              image={imageAssets.bluegatiBookingHero}
              className="h-full min-h-[24rem] rounded-none border-0 shadow-none"
              imageClassName="object-cover object-[62%_45%]"
              overlay={false}
            />
          </div>
          <div className="p-7 sm:p-9 lg:p-12">
            <div className="flex h-full flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-medical">
                {pathway.eyebrow}
              </p>
              <h2 className="mt-4 max-w-3xl font-heading text-5xl leading-[0.95] text-navy text-balance">
                {pathway.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
                {pathway.body}
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <PathwayStep
                  label={pathway.understandLabel}
                  title={pathway.understandTitle}
                  body={pathway.understandBody}
                />
                <PathwayStep
                  label={pathway.evaluateLabel}
                  title={pathway.evaluateTitle}
                  body={pathway.evaluateBody}
                />
              </div>
              <p className="mt-6 border-l-2 border-medical/35 pl-4 text-sm leading-7 text-muted">
                {pathway.closing}
              </p>
            </div>
          </div>
        </article>
      </SectionContainer>

      <SectionContainer
        title={hub.selectorTitle}
        eyebrow={t.brand.platform}
        subtitle={pathway.gridLead}
        className="specialties-selector-section"
        dark
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {specialtyKeys.map((key) => {
            const page = copy.pages[key];
            return (
              <Link
                key={key}
                to={specialtyRouteByKey[key]}
                className="brugiati-card group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                <ImageCard
                  image={specialtyVisuals[key].image}
                  className="h-56 rounded-none border-0 shadow-none"
                  imageClassName="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="p-6">
                  <h2 className="font-heading text-4xl leading-none text-navy">
                    {page.title}
                  </h2>
                  <p className="mt-4 min-h-[5.25rem] text-sm leading-7 text-muted">
                    {page.intro}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-medical">
                    {page.cta}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </SectionContainer>

      <SectionContainer className="bg-mist">
        <div className="brugiati-card mx-auto max-w-5xl px-7 py-12 text-center sm:px-10 lg:px-16 lg:py-16">
            <div className="mx-auto max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-medical">
                {copy.common.assistant}
              </p>
              <h2 className="mt-4 font-heading text-5xl leading-none text-navy">
                {hub.unsureTitle}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted">
                {hub.unsureBody}
              </p>
              <div className="mx-auto mt-8 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={openAssistant}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-navy bg-navy px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(6,27,51,0.18)] transition hover:-translate-y-0.5 hover:bg-medical focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                >
                  {t.cta.assistant}
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                </button>
                <CTAButton
                  to="/agendar-cita"
                  variant="light"
                  className="flex-1"
                  icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
                >
                  {t.cta.book}
                </CTAButton>
              </div>
            </div>
        </div>
      </SectionContainer>
    </>
  );
}

function PathwayStep({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-[1.25rem] border border-borderblue bg-white/72 p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
        {label}
      </p>
      <h3 className="mt-4 font-heading text-2xl leading-none text-navy">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-muted">{body}</p>
    </article>
  );
}
