import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { imageAssets } from "../data/images";
import { useLanguage } from "../i18n/LanguageContext";
import { internalPages } from "../i18n/internalPages";
import { pageUxImprovements } from "../i18n/pageUxImprovements";
import { CTAButton } from "../components/shared/CTAButton";
import { Breadcrumbs } from "../components/shared/Breadcrumbs";
import { PageHero } from "../components/shared/PageHero";
import { SEO } from "../components/shared/SEO";
import { SectionContainer } from "../components/shared/SectionContainer";
import { simpleBreadcrumbs } from "../seo/breadcrumbs";
import { seoMetadata } from "../seo/metadata";
import { pageSchema } from "../seo/schema";

export function AboutPage() {
  const { language } = useLanguage();
  const about = internalPages[language].about;
  const aboutUx = pageUxImprovements[language].about;
  const credentials = doctorCredentials[language];
  const breadcrumbs = simpleBreadcrumbs(
    language,
    "about",
    seoMetadata.about.path,
  );

  return (
    <>
      <SEO
        title={seoMetadata.about.title}
        description={seoMetadata.about.description}
        canonicalPath={seoMetadata.about.path}
        jsonLd={pageSchema({ breadcrumbs })}
      />
      <PageHero
        title={about.title}
        titleAccent="Carlos A. Brugiati"
        subtitle={about.subtitle}
        intro={about.intro}
        image={imageAssets.bluegatiAboutHero}
        imageClassName="page-hero-image--v2"
        actions={
          <CTAButton
            to="/agendar-cita"
            icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
          >
            {about.cta}
          </CTAButton>
        }
      />
      <Breadcrumbs items={breadcrumbs} />

      <SectionContainer className="bg-white">
        <div className="grid items-stretch gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="flex h-full flex-col gap-5">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {aboutUx.statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="premium-card rounded-[1.45rem] p-5"
                >
                  <p className="font-heading text-4xl leading-none text-gold">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-navy">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {stat.body}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <div className="grid gap-6">
            <article className="premium-card rounded-[2rem] p-7 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-medical">
                {aboutUx.identityEyebrow}
              </p>
              <h2 className="mt-4 max-w-3xl font-heading text-5xl leading-[0.95] text-navy text-balance sm:text-6xl">
                {aboutUx.identityTitle}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
                {aboutUx.identityBody}
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <InfoNote
                  icon={<ClipboardCheck aria-hidden="true" className="h-5 w-5" />}
                  title={about.clinicalTitle}
                  body={about.clinicalBody}
                />
                <InfoNote
                  icon={<ShieldCheck aria-hidden="true" className="h-5 w-5" />}
                  title={about.philosophyTitle}
                  body={about.philosophyBody}
                />
              </div>
            </article>

            <article className="rounded-[2rem] border border-borderblue bg-gradient-to-br from-softblue/72 via-white to-white p-7 shadow-[0_20px_70px_rgba(6,27,51,0.06)] sm:p-9">
              <div className="grid gap-8 lg:grid-cols-[0.84fr_1.16fr]">
                <div>
                  <h2 className="font-heading text-5xl leading-none text-navy">
                    {aboutUx.principlesTitle}
                  </h2>
                  <p className="mt-5 text-base leading-8 text-muted">
                    {aboutUx.principlesBody}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {about.areas.map((area) => (
                      <Link
                        key={area.href}
                        to={area.href}
                        className="rounded-full border border-borderblue bg-white/80 px-4 py-2 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:border-navy hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                      >
                        {area.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3">
                  {aboutUx.principles.map((principle) => (
                    <div
                      key={principle.title}
                      className="rounded-[1.2rem] border border-borderblue bg-white/82 p-5"
                    >
                      <p className="text-sm font-semibold text-navy">
                        {principle.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {principle.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="bg-mist">
        <div className="rounded-[2rem] border border-borderblue bg-white/86 p-6 shadow-[0_24px_80px_rgba(6,27,51,0.07)] backdrop-blur sm:p-9">
          <div className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr]">
            <div>
              <FileText aria-hidden="true" className="h-7 w-7 text-medical" />
              <h2 className="mt-5 font-heading text-5xl leading-none text-navy">
                {aboutUx.consultationTitle}
              </h2>
              <p className="mt-5 text-base leading-8 text-muted">
                {aboutUx.consultationBody}
              </p>
              <div className="mt-7 rounded-[1.25rem] border border-borderblue bg-softblue/55 p-5">
                <GraduationCap
                  aria-hidden="true"
                  className="h-6 w-6 text-gold"
                />
                <h3 className="mt-4 text-lg font-semibold text-navy">
                  {about.credentialsTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {aboutUx.credentialsNote}
                </p>
                <div className="mt-5 grid gap-2">
                  {credentials.training.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-borderblue bg-white/78 px-4 py-3 text-sm font-semibold leading-6 text-navy"
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {credentials.memberships.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-borderblue bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.11em] text-medical"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {aboutUx.consultationSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="group rounded-[1.35rem] border border-borderblue bg-white p-6 transition hover:-translate-y-1 hover:border-navy hover:shadow-soft"
                >
                  <span className="text-xs font-bold text-gold">
                    0{index + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {step.body}
                  </p>
                </div>
              ))}
              <div className="rounded-[1.35rem] border border-navy/10 bg-navy p-6 text-white md:col-span-2">
                <h3 className="font-heading text-4xl leading-none">
                  {about.expectTitle}
                </h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {about.expect.map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-1 h-5 w-5 flex-none text-cyan"
                      />
                      <p className="text-sm leading-6 text-blue-100">{item}</p>
                    </div>
                  ))}
                </div>
                <CTAButton
                  to="/agendar-cita"
                  variant="light"
                  className="mt-7"
                  icon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}
                >
                  {about.cta}
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}

const doctorCredentials = {
  es: {
    training: [
      "Más de 10 años de experiencia clínica y quirúrgica en urología.",
      "Formación en uro-oncología avanzada en la Universidad de Barcelona y Hospital Clínic de Barcelona.",
      "Endourología y cirugía percutánea en Hospital Italiano de Buenos Aires.",
      "Entrenamiento en HoLEP en Addenbrooke's Hospital, Cambridge, Reino Unido.",
      "Cirugía laparoscópica urológica avanzada en Centro Jesús Usón, Cáceres, España.",
    ],
    memberships: [
      "Sociedad Panameña de Urología",
      "European Association of Urology",
      "American Urological Association",
    ],
  },
  en: {
    training: [
      "More than 10 years of clinical and surgical urology experience.",
      "Advanced uro-oncology training at Universidad de Barcelona and Hospital Clínic de Barcelona.",
      "Endourology and percutaneous surgery at Hospital Italiano de Buenos Aires.",
      "HoLEP training at Addenbrooke's Hospital, Cambridge, United Kingdom.",
      "Advanced laparoscopic urologic surgery at Centro Jesús Usón, Cáceres, Spain.",
    ],
    memberships: [
      "Panamanian Society of Urology",
      "European Association of Urology",
      "American Urological Association",
    ],
  },
} as const;

function InfoNote({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-borderblue bg-soft/80 p-5">
      <div className="text-medical">{icon}</div>
      <h3 className="mt-4 text-base font-semibold text-navy">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
    </div>
  );
}
