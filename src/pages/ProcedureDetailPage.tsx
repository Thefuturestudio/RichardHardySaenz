import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  HelpCircle,
  MessageCircle,
  Stethoscope,
} from "lucide-react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumbs } from "../components/shared/Breadcrumbs";
import { CTAButton } from "../components/shared/CTAButton";
import { FAQAccordion } from "../components/shared/FAQAccordion";
import { MedicalDisclaimer } from "../components/shared/MedicalDisclaimer";
import { PageHero } from "../components/shared/PageHero";
import { SEO } from "../components/shared/SEO";
import { SectionContainer } from "../components/shared/SectionContainer";
import { imageAssets } from "../data/images";
import {
  procedurePages,
  procedureRoutes,
  type ProcedureKey,
} from "../i18n/procedurePages";
import { useLanguage } from "../i18n/LanguageContext";
import { getWhatsAppHref } from "../lib/whatsapp";
import { procedureBreadcrumbs } from "../seo/breadcrumbs";
import { seoMetadata, type SeoPageKey } from "../seo/metadata";
import { pageSchema } from "../seo/schema";

type ProcedureDetailPageProps = {
  procedureKey: ProcedureKey;
};

const procedureSeoKey: Record<ProcedureKey, SeoPageKey> = {
  ureteroscopia: "ureteroscopia",
  laserCalculos: "laserCalculos",
  biopsiaProstata: "biopsiaProstata",
  nefrolitotomiaPercutanea: "nefrolitotomiaPercutanea",
  cistoscopia: "cistoscopia",
  laparoscopiaRenal: "laparoscopiaRenal",
  holep: "holep",
  rtup: "rtup",
  adenectomiaProstatica: "adenectomiaProstatica",
  ureteroscopiaFlexible: "ureteroscopiaFlexible",
  ureteroscopiaSemirrigida: "ureteroscopiaSemirrigida",
  litotriciaExtracorporea: "litotriciaExtracorporea",
  disfuncionErectil: "disfuncionErectil",
  vasectomia: "vasectomia",
};

const procedureHeroImages: Record<ProcedureKey, (typeof imageAssets)[keyof typeof imageAssets]> = {
  ureteroscopia: imageAssets.bluegatiUreteroscopyHero,
  laserCalculos: imageAssets.bluegatiKidneyStonesHero,
  biopsiaProstata: imageAssets.bluegatiUroOncologyHero,
  nefrolitotomiaPercutanea: imageAssets.bluegatiEndourologyHero,
  cistoscopia: imageAssets.bluegatiConsultationHero,
  laparoscopiaRenal: imageAssets.bluegatiLaparoscopyHero,
  holep: imageAssets.bluegatiProstateHero,
  rtup: imageAssets.bluegatiProstateHero,
  adenectomiaProstatica: imageAssets.bluegatiLaparoscopyHero,
  ureteroscopiaFlexible: imageAssets.bluegatiUreteroscopyHero,
  ureteroscopiaSemirrigida: imageAssets.bluegatiEndourologyHero,
  litotriciaExtracorporea: imageAssets.bluegatiKidneyStonesHero,
  disfuncionErectil: imageAssets.bluegatiMensHealthHero,
  vasectomia: imageAssets.bluegatiConsultationHero,
};

const procedureHeroFocus: Record<ProcedureKey, string> = {
  ureteroscopia: "page-hero-image--v2",
  laserCalculos: "page-hero-image--v2",
  biopsiaProstata: "page-hero-image--v2",
  nefrolitotomiaPercutanea: "page-hero-image--v2",
  cistoscopia: "page-hero-image--v2",
  laparoscopiaRenal: "page-hero-image--v2",
  holep: "page-hero-image--v2",
  rtup: "page-hero-image--v2",
  adenectomiaProstatica: "page-hero-image--v2",
  ureteroscopiaFlexible: "page-hero-image--v2",
  ureteroscopiaSemirrigida: "page-hero-image--v2",
  litotriciaExtracorporea: "page-hero-image--v2",
  disfuncionErectil: "page-hero-image--v2",
  vasectomia: "page-hero-image--v2",
};

const procedureTitleAccent: Record<"es" | "en", Record<ProcedureKey, string>> = {
  es: {
    ureteroscopia: "Ureteroscopía",
    laserCalculos: "cálculos urinarios",
    biopsiaProstata: "Biopsia de próstata",
    nefrolitotomiaPercutanea: "Nefrolitotomía percutánea",
    cistoscopia: "Cistoscopía",
    laparoscopiaRenal: "Cirugía laparoscópica renal",
    holep: "HoLEP",
    rtup: "RTUP",
    adenectomiaProstatica: "Adenectomía prostática",
    ureteroscopiaFlexible: "Ureteroscopia flexible",
    ureteroscopiaSemirrigida: "Ureteroscopia semirrígida",
    litotriciaExtracorporea: "Litotricia extracorpórea",
    disfuncionErectil: "Disfunción eréctil",
    vasectomia: "Vasectomía",
  },
  en: {
    ureteroscopia: "Ureteroscopy",
    laserCalculos: "urinary stones",
    biopsiaProstata: "Prostate biopsy",
    nefrolitotomiaPercutanea: "Percutaneous nephrolithotomy",
    cistoscopia: "Cystoscopy",
    laparoscopiaRenal: "Renal laparoscopic surgery",
    holep: "HoLEP",
    rtup: "TURP",
    adenectomiaProstatica: "Prostate adenectomy",
    ureteroscopiaFlexible: "Flexible ureteroscopy",
    ureteroscopiaSemirrigida: "Semi-rigid ureteroscopy",
    litotriciaExtracorporea: "Shock wave lithotripsy",
    disfuncionErectil: "Erectile dysfunction",
    vasectomia: "Vasectomy",
  },
};

const procedureFeatureImages: Record<
  ProcedureKey,
  (typeof imageAssets)[keyof typeof imageAssets]
> = {
  ureteroscopia: imageAssets.procedureFlexibleUreteroscopy,
  laserCalculos: imageAssets.procedureLaserStones,
  biopsiaProstata: imageAssets.procedureProstateBiopsy,
  nefrolitotomiaPercutanea: imageAssets.procedurePcnl,
  cistoscopia: imageAssets.procedureFlexibleUreteroscopy,
  laparoscopiaRenal: imageAssets.precisionSurgery,
  holep: imageAssets.procedureHolep,
  rtup: imageAssets.procedureTurp,
  adenectomiaProstatica: imageAssets.procedureTurp,
  ureteroscopiaFlexible: imageAssets.procedureFlexibleUreteroscopy,
  ureteroscopiaSemirrigida: imageAssets.procedureFlexibleUreteroscopy,
  litotriciaExtracorporea: imageAssets.procedureLaserStones,
  disfuncionErectil: imageAssets.procedureErectileDysfunction,
  vasectomia: imageAssets.procedureVasectomy,
};

export function ProcedureDetailPage({ procedureKey }: ProcedureDetailPageProps) {
  const { language, t } = useLanguage();
  const location = useLocation();
  const page =
    procedurePages[language]?.[procedureKey] ?? procedurePages.es[procedureKey];
  const labels =
    language === "es"
      ? {
          procedure: "Procedimiento urológico",
          overview: "Comprender el procedimiento",
          when: "Cuándo se conversa",
          preparation: "Antes del procedimiento",
          after: "Después y seguimiento",
          questions: "Preguntas para su consulta",
          timeline: "Ruta de decisión",
          evaluate: "Evaluar",
          evaluateText: "Síntomas, estudios y motivo de consulta.",
          evaluateItems: [
            "Revisar el sintoma principal y su evolucion.",
            "Ordenar estudios, reportes y antecedentes relevantes.",
          ],
          plan: "Planificar",
          planText: "Confirmar si el procedimiento corresponde.",
          planItems: [
            "Comparar alternativas antes de decidir.",
            "Aclarar preparacion, riesgos generales y expectativas.",
          ],
          recover: "Recuperar",
          recoverText: "Seguimiento y cuidados posteriores.",
          recoverItems: [
            "Definir controles y señales de alarma.",
            "Ajustar cuidados según evolución y hallazgos.",
          ],
          timelineNote:
            "La ruta puede cambiar según estudios disponibles, seguridad del paciente y criterio médico.",
          decisionEyebrow: "Decisión y seguimiento",
          decisionTitle: "Cómo se organiza el siguiente paso.",
          decisionSubtitle:
            "La indicación se define después de revisar estudios, objetivos del paciente, alternativas y condiciones de seguridad.",
          safety:
            "La indicación de cualquier procedimiento depende de una evaluación médica, estudios disponibles y condición general del paciente.",
        }
      : {
          procedure: "Urologic procedure",
          overview: "Understand the procedure",
          when: "When it is discussed",
          preparation: "Before the procedure",
          after: "Afterward and follow-up",
          questions: "Questions for your visit",
          timeline: "Decision pathway",
          evaluate: "Evaluate",
          evaluateText: "Symptoms, studies, and reason for consultation.",
          evaluateItems: [
            "Review the main symptom and its timeline.",
            "Organize studies, reports, and relevant history.",
          ],
          plan: "Plan",
          planText: "Confirm whether the procedure is appropriate.",
          planItems: [
            "Compare alternatives before deciding.",
            "Clarify preparation, general risks, and expectations.",
          ],
          recover: "Recover",
          recoverText: "Follow-up and aftercare.",
          recoverItems: [
            "Define follow-up and warning signs.",
            "Adjust care according to recovery and findings.",
          ],
          timelineNote:
            "The pathway may change according to available studies, patient safety, and medical judgment.",
          decisionEyebrow: "Decision and follow-up",
          decisionTitle: "How the next step is organized.",
          decisionSubtitle:
            "The indication is defined after reviewing studies, patient goals, alternatives, and safety considerations.",
          safety:
            "The indication for any procedure depends on medical evaluation, available studies, and the patient’s overall condition.",
        };
  const path = procedureRoutes[procedureKey];
  const seo = seoMetadata[procedureSeoKey[procedureKey]];
  const breadcrumbs = procedureBreadcrumbs(language, page.title, path);
  const faqItems = page.faq.map(([question, answer]) => ({
    question,
    answer: completeProcedureFaq(answer, language),
  }));

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.path}
        jsonLd={pageSchema({
          breadcrumbs,
          faqs: faqItems,
          medicalProcedure: {
            name: page.title,
            description: seo.description,
            path: seo.path,
          },
        })}
      />
      <PageHero
        eyebrow={labels.procedure}
        title={page.title}
        titleAccent={procedureTitleAccent[language][procedureKey]}
        subtitle={page.subtitle}
        intro={page.intro}
        image={procedureHeroImages[procedureKey]}
        imageClassName={procedureHeroFocus[procedureKey]}
        actions={
          <>
            <CTAButton
              to="/agendar-cita"
              icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
            >
              {page.cta}
            </CTAButton>
            <CTAButton
              href={getWhatsAppHref(location.pathname, language)}
              variant="secondary"
              icon={<MessageCircle aria-hidden="true" className="h-4 w-4" />}
            >
              {t.cta.whatsapp}
            </CTAButton>
          </>
        }
      />
      <Breadcrumbs items={breadcrumbs} />

      <SectionContainer className="bg-white">
        <div className="grid items-stretch gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-[minmax(360px,auto)_1fr]">
          <div className="grid gap-6 lg:grid-rows-subgrid lg:row-span-2">
            <ProcedureImageCard image={procedureFeatureImages[procedureKey]} />
            <ProcedureTimelineCard
              eyebrow={labels.timeline}
              steps={[
                {
                  number: "1",
                  title: labels.evaluate,
                  body: labels.evaluateText,
                  items: labels.evaluateItems,
                },
                {
                  number: "2",
                  title: labels.plan,
                  body: labels.planText,
                  items: labels.planItems,
                },
                {
                  number: "3",
                  title: labels.recover,
                  body: labels.recoverText,
                  items: labels.recoverItems,
                },
              ]}
              note={labels.timelineNote}
            />
          </div>
          <div className="grid gap-6 lg:grid-rows-subgrid lg:row-span-2">
            <ProcedurePanel
              icon={<Stethoscope aria-hidden="true" className="h-6 w-6" />}
              eyebrow={labels.overview}
              title={page.overviewTitle}
              body={page.overview}
              emphasis={labels.safety}
            />

            <ProcedurePanel
              icon={<CheckCircle2 aria-hidden="true" className="h-6 w-6" />}
              eyebrow={labels.when}
              title={page.whenTitle}
              items={page.when}
              compact
            />
          </div>
        </div>
      </SectionContainer>

      <SectionContainer
        dark
        eyebrow={labels.decisionEyebrow}
        title={labels.decisionTitle}
        subtitle={labels.decisionSubtitle}
      >
        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          <ProcedureDarkPanel
            icon={<ClipboardList aria-hidden="true" className="h-6 w-6" />}
            eyebrow={labels.preparation}
            title={page.preparationTitle}
            body={page.preparation}
            items={page.preparationItems}
          />
          <ProcedureDarkPanel
            icon={<ArrowRight aria-hidden="true" className="h-6 w-6" />}
            eyebrow={labels.after}
            title={page.afterTitle}
            body={page.after}
            items={page.afterItems}
          />
          <ProcedureDarkPanel
            icon={<HelpCircle aria-hidden="true" className="h-6 w-6" />}
            eyebrow={labels.questions}
            title={page.questionsTitle}
            items={page.questions}
            compact
          />
        </div>
      </SectionContainer>

      <SectionContainer title={page.faqTitle}>
        <FAQAccordion items={faqItems} />
        <div className="mt-9 flex flex-wrap gap-4">
          <CTAButton
            to="/agendar-cita"
            icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
          >
            {page.cta}
          </CTAButton>
          <CTAButton
            href={getWhatsAppHref(location.pathname, language)}
            variant="secondary"
            icon={<MessageCircle aria-hidden="true" className="h-4 w-4" />}
          >
            {t.cta.whatsapp}
          </CTAButton>
        </div>
        <MedicalDisclaimer className="mt-8" />
      </SectionContainer>
    </>
  );
}

function ProcedureImageCard({
  image,
}: {
  image: (typeof imageAssets)[keyof typeof imageAssets];
}) {
  return (
    <figure className="h-full min-h-[320px] overflow-hidden rounded-[1.55rem] border border-borderblue bg-transparent shadow-[0_24px_70px_rgba(6,27,51,0.1)] lg:min-h-[360px]">
      <img
        src={image.src}
        alt={image.alt}
        className="block h-full w-full object-cover"
        loading="lazy"
      />
    </figure>
  );
}

function ProcedureTimelineCard({
  eyebrow,
  steps,
  note,
}: {
  eyebrow: string;
  steps: Array<{
    number: string;
    title: string;
    body: string;
    items: string[];
  }>;
  note: string;
}) {
  return (
    <article className="premium-card flex h-full flex-col rounded-[1.55rem] p-6 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
        {eyebrow}
      </p>
      <div className="mt-5 grid gap-5">
        {steps.map((step) => (
          <div key={step.number} className="grid grid-cols-[2.75rem_1fr] gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-softblue text-sm font-bold text-medical">
              {step.number}
            </div>
            <div>
              <h2 className="text-xl font-semibold leading-6 text-navy">
                {step.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted">{step.body}</p>
              <ul className="mt-3 grid gap-2">
                {step.items.map((item) => (
                  <li key={item} className="flex gap-2 text-xs leading-5 text-muted">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 flex-none text-cyan"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-auto pt-5 text-xs leading-5 text-muted">{note}</p>
    </article>
  );
}

function ProcedurePanel({
  icon,
  eyebrow,
  title,
  body,
  emphasis,
  items,
  compact = false,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  body?: string;
  emphasis?: string;
  items?: string[];
  compact?: boolean;
}) {
  return (
    <article className="premium-card flex h-full flex-col rounded-[1.55rem] p-7 sm:p-9">
      <div className="text-medical">{icon}</div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-medical">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-8 text-navy">{title}</h2>
      {body && <p className="mt-4 text-sm leading-7 text-muted">{body}</p>}
      {emphasis && (
        <p className="mt-5 rounded-2xl border border-borderblue bg-softblue/50 px-4 py-3 text-sm leading-6 text-muted">
          {emphasis}
        </p>
      )}
      {items && items.length > 0 && (
        <ul className={compact ? "mt-6 grid gap-4" : "mt-6 grid gap-3"}>
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="mt-1 h-4 w-4 flex-none text-cyan"
              />
              <span className="text-sm leading-6 text-muted">{item}</span>
            </li>
          ))}
        </ul>
      )}
      {items && !body && (
        <div className="mt-auto pt-6">
          <FileText aria-hidden="true" className="h-5 w-5 text-gold" />
        </div>
      )}
    </article>
  );
}

function ProcedureDarkPanel({
  icon,
  eyebrow,
  title,
  body,
  items,
  compact = false,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  body?: string;
  items?: string[];
  compact?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col rounded-[1.55rem] border border-white/12 bg-white/[0.07] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.15)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan/55 hover:bg-white/[0.12] hover:shadow-[0_28px_90px_rgba(93,190,235,0.22)] sm:p-9">
      <div className="text-cyan transition duration-300 group-hover:text-white">
        {icon}
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-cyan transition duration-300 group-hover:text-white">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-8 text-white">
        {title}
      </h2>
      {body && <p className="mt-4 text-sm leading-7 text-blue-100">{body}</p>}
      {items && items.length > 0 && (
        <ul className={compact ? "mt-6 grid gap-4" : "mt-6 grid gap-3"}>
          {items.map((item) => (
            <li key={item} className="flex gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="mt-1 h-4 w-4 flex-none text-cyan"
              />
              <span className="text-sm leading-6 text-blue-100">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function completeProcedureFaq(answer: string, language: "es" | "en") {
  if (answer.length >= 220) {
    return answer;
  }

  const appendix =
    language === "es"
      ? " Durante la consulta se revisan los estudios disponibles, el motivo de consulta y la condición general para explicar si este procedimiento realmente corresponde y qué alternativas pueden existir."
      : " During the visit, available studies, the reason for consultation, and overall condition are reviewed to explain whether this procedure is appropriate and what alternatives may exist.";

  return `${answer}${appendix}`;
}
