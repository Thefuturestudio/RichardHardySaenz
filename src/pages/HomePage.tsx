import { Suspense, lazy } from "react";
import { specialtyVisuals } from "../data/pageVisuals";
import { specialtyRouteByKey, type SpecialtyKey } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";
import { homeFaqs } from "../i18n/faqPlacement";
import { ConcernSelector } from "../components/home/ConcernSelector";
import { HeroSection } from "../components/home/HeroSection";
import { AccessNetwork } from "../components/home/AccessNetwork";
import { BlogRoadmap } from "../components/home/BlogRoadmap";
import { PatientJourney } from "../components/home/PatientJourney";
import { SpecialtyCard } from "../components/home/SpecialtyCard";
import { TrustReputation } from "../components/home/TrustReputation";
import { FAQAccordion } from "../components/shared/FAQAccordion";
import { SEO } from "../components/shared/SEO";
import { SectionContainer } from "../components/shared/SectionContainer";
import { seoMetadata } from "../seo/metadata";

const AnatomyExplorer = lazy(() =>
  import("../components/home/AnatomyExplorer").then((module) => ({
    default: module.AnatomyExplorer,
  })),
);

const homeSpecialtyKeys: SpecialtyKey[] = [
  "uroOncologia",
  "calculosRenales",
  "prostata",
  "endourologia",
  "cirugiaLaparoscopica",
  "saludMasculina",
];

export function HomePage() {
  const { language, t } = useLanguage();
  const homeFaqItems = homeFaqs[language].map(([question, answer]) => ({
    question,
    answer,
  }));

  return (
    <>
      <SEO
        title={seoMetadata.home.title}
        description={seoMetadata.home.description}
        canonicalPath={seoMetadata.home.path}
      />
      <HeroSection />

      <SectionContainer
        eyebrow={t.home.concerns.eyebrow}
        title={t.home.concerns.title}
        subtitle={t.home.concerns.subtitle}
        className="navy-panel"
        dark
      >
        <ConcernSelector />
      </SectionContainer>

      <SectionContainer className="soft-white-section bg-white">
        <AccessNetwork />
      </SectionContainer>

      <SectionContainer
        title={t.home.specialties.title}
        eyebrow={t.home.specialties.eyebrow}
        subtitle={t.home.specialties.subtitle}
        className="navy-panel"
        dark
      >
        <div className="grid gap-7 xl:grid-cols-2">
          {homeSpecialtyKeys.map((key) => (
            <SpecialtyCard
              key={key}
              title={t.specialties[key].title}
              text={t.specialties[key].subtitle}
              href={specialtyRouteByKey[key]}
              image={specialtyVisuals[key].image}
            />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="soft-white-section bg-white">
        <TrustReputation />
      </SectionContainer>

      <SectionContainer
        title={t.home.journey.title}
        eyebrow={t.home.journey.eyebrow}
        subtitle={t.home.journey.subtitle}
        className="soft-white-section bg-white"
      >
        <PatientJourney />
      </SectionContainer>

      <Suspense fallback={<div className="bg-navy py-24" aria-hidden="true" />}>
        <AnatomyExplorer />
      </Suspense>

      <SectionContainer
        eyebrow={language === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
        title={
          language === "es"
            ? "Respuestas rápidas antes de consultar."
            : "Quick answers before booking."
        }
        subtitle={
          language === "es"
            ? "Una selección breve de las dudas más comunes para orientar el siguiente paso sin saturar la página."
            : "A brief selection of common questions to guide the next step without overwhelming the page."
        }
        className="soft-white-section bg-white"
      >
        <div className="mx-auto max-w-4xl">
          <FAQAccordion items={homeFaqItems} />
        </div>
      </SectionContainer>

      <SectionContainer className="bg-white">
        <BlogRoadmap />
      </SectionContainer>
    </>
  );
}
