import { ArrowRight, BookOpenText, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { educationArticleList } from "../data/articles";
import { imageAssets } from "../data/images";
import { CTAButton } from "../components/shared/CTAButton";
import { PageHero } from "../components/shared/PageHero";
import { SectionContainer } from "../components/shared/SectionContainer";
import { SEO } from "../components/shared/SEO";
import { seoMetadata } from "../seo/metadata";
import { pageSchema } from "../seo/schema";

export function EducationPage() {
  const metadata = seoMetadata.education;
  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Educación", href: metadata.path },
  ];

  return (
    <>
      <SEO
        title={metadata.title}
        description={metadata.description}
        canonicalPath={metadata.path}
        jsonLd={pageSchema({ breadcrumbs })}
      />
      <PageHero
        eyebrow="Educación médica"
        title="Guías claras para preparar mejor la consulta urológica."
        titleAccent="Guías claras"
        subtitle="Contenido educativo en español para entender síntomas, estudios y procedimientos frecuentes sin reemplazar la evaluación médica."
        image={imageAssets.bluegatiEducationBlogHero}
        imageClassName="page-hero-image--v2"
        actions={
          <CTAButton
            to="/agendar-cita"
            icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
          >
            Solicitar orientación
          </CTAButton>
        }
      />
      <SectionContainer
        eyebrow="Biblioteca inicial"
        title="Temas prioritarios"
        subtitle="La primera fase se enfoca en próstata, HoLEP, cálculos renales, endourología, uro-oncología y segunda opinión."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {educationArticleList.map((article, index) => (
            <Link
              key={article.key}
              to={article.path}
              className="brugiati-card group flex min-h-[22rem] flex-col p-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-borderblue bg-white text-navy shadow-[0_14px_34px_rgba(11,102,195,0.08)] transition duration-300 group-hover:border-navy/70 group-hover:bg-navy group-hover:text-white">
                  <BookOpenText aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="brugiati-card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-medical">
                {article.category} · {article.readingTime}
              </p>
              <h2 className="mt-3 font-heading text-3xl leading-none text-navy">
                {article.shortTitle}
              </h2>
              <p className="mt-4 flex-1 text-sm leading-7 text-muted">
                {article.summary}
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-medical transition group-hover:text-navy">
                Leer guía
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </SectionContainer>
    </>
  );
}
