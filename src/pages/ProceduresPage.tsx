import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  homeProcedureKeys,
  procedurePages,
  procedureRoutes,
  procedureSectionLabels,
  type ProcedureKey,
} from "../i18n/procedurePages";
import { useLanguage } from "../i18n/LanguageContext";
import { CTAButton } from "../components/shared/CTAButton";
import { Breadcrumbs } from "../components/shared/Breadcrumbs";
import { ImageCard } from "../components/shared/ImageCard";
import { PageHero } from "../components/shared/PageHero";
import { SEO } from "../components/shared/SEO";
import { SectionContainer } from "../components/shared/SectionContainer";
import { imageAssets } from "../data/images";
import { simpleBreadcrumbs } from "../seo/breadcrumbs";

const accessibleProcedureTitles: Record<ProcedureKey, { es: string; en: string }> = {
  ureteroscopia: {
    es: "Ureteroscopia: evaluacion y tratamiento endoscopico del ureter",
    en: "Ureteroscopy: endoscopic evaluation and treatment of the ureter",
  },
  laserCalculos: {
    es: "Laser para calculos urinarios",
    en: "Laser treatment for urinary stones",
  },
  biopsiaProstata: {
    es: "Biopsia de prostata para aclarar hallazgos",
    en: "Prostate biopsy to clarify findings",
  },
  nefrolitotomiaPercutanea: {
    es: "Nefrolitotomia percutanea para calculos grandes o complejos",
    en: "Percutaneous nephrolithotomy for large or complex stones",
  },
  cistoscopia: {
    es: "Cistoscopia para evaluar vejiga y via urinaria",
    en: "Cystoscopy to evaluate the bladder and urinary tract",
  },
  laparoscopiaRenal: {
    es: "Cirugia renal laparoscopica de minima invasion",
    en: "Minimally invasive laparoscopic kidney surgery",
  },
  holep: {
    es: "HoLEP: cirugia laser para crecimiento benigno de prostata",
    en: "HoLEP: laser surgery for benign prostate enlargement",
  },
  rtup: {
    es: "RTUP: reseccion endoscopica para obstruccion prostatica",
    en: "TURP: endoscopic resection for prostate obstruction",
  },
  adenectomiaProstatica: {
    es: "Adenectomia prostatica para prostatas de gran tamano",
    en: "Prostate adenomectomy for very enlarged prostates",
  },
  ureteroscopiaFlexible: {
    es: "Ureteroscopia flexible para calculos dentro del rinon",
    en: "Flexible ureteroscopy for stones inside the kidney",
  },
  ureteroscopiaSemirrigida: {
    es: "Ureteroscopia semirrigida para calculos en el ureter",
    en: "Semirigid ureteroscopy for stones in the ureter",
  },
  litotriciaExtracorporea: {
    es: "Litotricia extracorporea con ondas de choque",
    en: "Extracorporeal shock wave lithotripsy",
  },
  disfuncionErectil: {
    es: "Evaluacion integral de disfuncion erectil",
    en: "Comprehensive erectile dysfunction evaluation",
  },
  vasectomia: {
    es: "Vasectomia: anticoncepcion masculina ambulatoria",
    en: "Vasectomy: outpatient male contraception",
  },
};

const procedureCardImages: Record<ProcedureKey, (typeof imageAssets)[keyof typeof imageAssets]> = {
  holep: imageAssets.procedureHolep,
  rtup: imageAssets.procedureTurp,
  adenectomiaProstatica: imageAssets.procedureTurpB,
  ureteroscopia: imageAssets.procedureFlexibleUreteroscopy,
  ureteroscopiaFlexible: imageAssets.procedureFlexibleUreteroscopyB,
  ureteroscopiaSemirrigida: imageAssets.ureteroscopy,
  laserCalculos: imageAssets.procedureLaserStones,
  litotriciaExtracorporea: imageAssets.procedureLaserStonesB,
  biopsiaProstata: imageAssets.procedureProstateBiopsy,
  nefrolitotomiaPercutanea: imageAssets.procedurePcnl,
  cistoscopia: imageAssets.cystoscopy,
  laparoscopiaRenal: imageAssets.laparoscopicSurgery,
  disfuncionErectil: imageAssets.procedureErectileDysfunction,
  vasectomia: imageAssets.procedureVasectomy,
};

const copy = {
  es: {
    title: "Procedimientos urologicos explicados con claridad.",
    subtitle:
      "Rutas educativas para entender cuando se conversa cada procedimiento, que estudios se revisan y como se confirma la indicacion medica.",
    eyebrow: "Procedimientos",
    sectionTitle: "Opciones frecuentes de procedimiento",
    sectionSubtitle:
      "Cada tarjeta usa un titulo descriptivo para pacientes que visitan el sitio por primera vez, manteniendo el nombre medico como referencia.",
    cta: "Agendar orientacion",
    pathwayEyebrow: "Ruta de procedimiento",
    pathwayTitle: "Revise la indicacion, confirme la opcion y entienda el seguimiento.",
    pathwayBody:
      "Los procedimientos se conversan despues de revisar sintomas, estudios disponibles, objetivos del paciente y alternativas razonables.",
    stepOneLabel: "01 Evaluar",
    stepOneTitle: "Primero se revisa el caso.",
    stepOneBody:
      "Sintomas, imagenes, laboratorios y antecedentes ayudan a confirmar si el procedimiento tiene sentido.",
    stepTwoLabel: "02 Planificar",
    stepTwoTitle: "Luego se compara la opcion.",
    stepTwoBody:
      "La consulta permite explicar alternativas, preparacion, riesgos generales y expectativas responsables.",
    closing:
      "Esta estructura ayuda a que cada procedimiento se entienda como una decision medica, no como una opcion aislada.",
    gridLead:
      "Seleccione el procedimiento que desea entender con mayor claridad.",
    guidanceTitle: "No esta seguro cual procedimiento corresponde?",
    guidanceBody:
      "Puede enviar sus sintomas o estudios disponibles para orientar si conviene iniciar por una evaluacion, una segunda opinion o una pagina especifica.",
    guidanceSupport:
      "El asistente puede ayudar a ordenar sus dudas antes de escribir o solicitar cita. Si ya tiene estudios, reportes o una recomendacion previa, puede explicar que pagina revisar primero.",
    guidanceCta: "Solicitar orientacion",
    assistantEyebrow: "Asistente",
    cardPurpose: "Que aclara",
    cardReviewed: "Se revisa",
  },
  en: {
    title: "Urologic procedures explained clearly.",
    subtitle:
      "Educational pathways to understand when each procedure may be discussed, which studies are reviewed, and how the medical indication is confirmed.",
    eyebrow: "Procedures",
    sectionTitle: "Common procedure options",
    sectionSubtitle:
      "Each card uses a patient-friendly title while preserving the medical name as a reference.",
    cta: "Request guidance",
    pathwayEyebrow: "Procedure pathway",
    pathwayTitle: "Review the indication, confirm the option, and understand follow-up.",
    pathwayBody:
      "Procedures are discussed after reviewing symptoms, available studies, patient goals, and reasonable alternatives.",
    stepOneLabel: "01 Evaluate",
    stepOneTitle: "First, the case is reviewed.",
    stepOneBody:
      "Symptoms, imaging, labs, and history help confirm whether a procedure makes sense.",
    stepTwoLabel: "02 Plan",
    stepTwoTitle: "Then, the option is compared.",
    stepTwoBody:
      "The visit explains alternatives, preparation, general risks, and responsible expectations.",
    closing:
      "This structure helps each procedure read as a medical decision, not an isolated option.",
    gridLead:
      "Select the procedure you want to understand more clearly.",
    guidanceTitle: "Not sure which procedure applies?",
    guidanceBody:
      "You can share symptoms or available studies to clarify whether to start with an evaluation, a second opinion, or a specific procedure page.",
    guidanceSupport:
      "The assistant can help organize questions before messaging or booking. If you already have studies, reports, or a prior recommendation, it can point you to the most relevant page first.",
    guidanceCta: "Request guidance",
    assistantEyebrow: "Assistant",
    cardPurpose: "What it clarifies",
    cardReviewed: "Reviewed",
  },
} as const;

export function ProceduresPage() {
  const { language, t: translations } = useLanguage();
  const t = copy[language] ?? copy.es;
  const procedureCopy = procedurePages[language] ?? procedurePages.es;
  const procedureLabels = procedureSectionLabels[language] ?? procedureSectionLabels.es;
  const breadcrumbs = simpleBreadcrumbs(
    language,
    "procedures",
    "/procedimientos",
  );

  function openAssistant() {
    window.dispatchEvent(new CustomEvent("uropanama:open-assistant"));
  }

  return (
    <>
      <SEO
        title="Procedimientos urologicos | Dr. Carlos Brugiati"
        description={t.subtitle}
        canonicalPath="/procedimientos"
      />
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        titleAccent={language === "en" ? "clearly" : "claridad"}
        subtitle={t.subtitle}
        image={imageAssets.bluegatiProceduresHero}
        imageClassName="page-hero-image--v2"
        actions={<CTAButton to="/agendar-cita">{t.cta}</CTAButton>}
      />
      <Breadcrumbs items={breadcrumbs} />

      <SectionContainer className="bg-white">
        <article className="brugiati-card overflow-hidden p-0 lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="min-h-[24rem]">
            <ImageCard
              image={imageAssets.bluegatiScrubsProcedureHero}
              className="h-full min-h-[24rem] rounded-none border-0 shadow-none"
              imageClassName="object-cover object-[58%_44%]"
              overlay={false}
            />
          </div>
          <div className="p-7 sm:p-9 lg:p-12">
            <div className="flex h-full flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-medical">
                {t.pathwayEyebrow}
              </p>
              <h2 className="mt-4 max-w-3xl font-heading text-5xl leading-[0.95] text-navy text-balance">
                {t.pathwayTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
                {t.pathwayBody}
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <PathwayStep
                  label={t.stepOneLabel}
                  title={t.stepOneTitle}
                  body={t.stepOneBody}
                />
                <PathwayStep
                  label={t.stepTwoLabel}
                  title={t.stepTwoTitle}
                  body={t.stepTwoBody}
                />
              </div>
              <p className="mt-6 border-l-2 border-medical/35 pl-4 text-sm leading-7 text-muted">
                {t.closing}
              </p>
            </div>
          </div>
        </article>
      </SectionContainer>

      <SectionContainer
        title={t.sectionTitle}
        subtitle={t.gridLead}
        eyebrow={t.eyebrow}
        className="specialties-selector-section"
        dark
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {homeProcedureKeys.map((key) => {
            const item = procedureCopy[key] ?? procedurePages.es[key];
            const accessibleTitle =
              accessibleProcedureTitles[key]?.[language] ??
              accessibleProcedureTitles[key]?.es ??
              item.title;

            return (
              <Link
                key={key}
                to={procedureRoutes[key]}
                aria-label={accessibleTitle}
                className="brugiati-card group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                <ImageCard
                  image={procedureCardImages[key]}
                  className="h-56 rounded-none border-0 shadow-none"
                  imageClassName="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="p-6">
                  <h2 className="font-heading text-4xl leading-none text-navy">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted">
                    {item.cardText}
                  </p>
                  <div className="mt-5 grid gap-3 border-t border-borderblue pt-5">
                    <ProcedureCardPoint
                      label={t.cardPurpose}
                      text={item.subtitle}
                    />
                    <ProcedureCardPoint
                      label={t.cardReviewed}
                      text={item.when.slice(0, 2).join(" ")}
                    />
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-medical">
                    {procedureLabels.cardCta}
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
                {t.assistantEyebrow}
              </p>
              <h2 className="mt-4 font-heading text-5xl leading-none text-navy">
                {t.guidanceTitle}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted">
                {t.guidanceBody}
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted">
                {t.guidanceSupport}
              </p>
              <div className="mx-auto mt-8 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={openAssistant}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-navy bg-navy px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(6,27,51,0.18)] transition hover:-translate-y-0.5 hover:bg-medical focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                >
                  {translations.cta.assistant}
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                </button>
                <CTAButton
                  to="/agendar-cita"
                  variant="light"
                  className="flex-1"
                  icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
                >
                  {translations.cta.book}
                </CTAButton>
              </div>
            </div>
        </div>
      </SectionContainer>
    </>
  );
}

function ProcedureCardPoint({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <CheckCircle2
        aria-hidden="true"
        className="mt-1 h-4 w-4 flex-none text-cyan"
      />
      <p className="text-xs leading-5 text-muted">
        <span className="font-bold uppercase tracking-[0.14em] text-medical">
          {label}:{" "}
        </span>
        {text}
      </p>
    </div>
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
