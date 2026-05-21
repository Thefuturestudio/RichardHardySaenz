import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import type { ArticleKey } from "../data/articles";
import { educationArticleList, educationArticles } from "../data/articles";
import { imageAssets } from "../data/images";
import { CTAButton } from "../components/shared/CTAButton";
import { Breadcrumbs } from "../components/shared/Breadcrumbs";
import { FAQAccordion } from "../components/shared/FAQAccordion";
import { PageHero } from "../components/shared/PageHero";
import { SectionContainer } from "../components/shared/SectionContainer";
import { SEO } from "../components/shared/SEO";
import { pageSchema } from "../seo/schema";

type ArticlePageProps = {
  articleKey: ArticleKey;
};

export function ArticlePage({ articleKey }: ArticlePageProps) {
  const article = educationArticles[articleKey];

  if (!article) {
    return <Navigate to="/educacion" replace />;
  }

  const breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Educación", href: "/educacion" },
    { label: article.shortTitle, href: article.path },
  ];

  const relatedArticles = getRelatedArticles(article.key);

  return (
    <>
      <SEO
        title={article.title}
        description={article.description}
        canonicalPath={article.path}
        jsonLd={pageSchema({
          breadcrumbs,
          faqs: article.faqs,
          article: {
            headline: article.title,
            description: article.description,
            path: article.path,
            aboutName: article.schemaAbout,
          },
        })}
      />
      <PageHero
        eyebrow={article.eyebrow}
        title={article.title}
        titleAccent={getArticleTitleAccent(article.key)}
        subtitle={article.summary}
        image={getArticleHero(article.key)}
        imageClassName="page-hero-image--v2"
        actions={
          <>
            <CTAButton
              to="/agendar-cita"
              icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
            >
              Solicitar orientación
            </CTAButton>
            <Link
              to={article.relatedProcedurePath}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-borderblue bg-white/78 px-7 text-[15px] font-semibold text-navy shadow-[0_14px_36px_rgba(13,43,69,0.07)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-navy hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              {article.relatedProcedureLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </>
        }
      />
      <Breadcrumbs items={breadcrumbs} />
      <SectionContainer className="pt-14 lg:pt-20" innerClassName="max-w-5xl">
        <article className="brugiati-card p-6 sm:p-9 lg:p-12">
          <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-borderblue pb-6 text-xs font-bold uppercase tracking-[0.16em] text-medical">
            <span>{article.category}</span>
            <span className="h-1 w-1 rounded-full bg-medical" aria-hidden="true" />
            <span className="inline-flex items-center gap-2">
              <Clock aria-hidden="true" className="h-4 w-4" />
              {article.readingTime}
            </span>
          </div>

          <div className="grid gap-10">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-heading text-4xl leading-none text-navy sm:text-5xl">
                  {section.heading}
                </h2>
                <div className="mt-5 grid gap-4 text-base leading-8 text-muted sm:text-lg">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div
            className="mt-10 rounded-2xl border border-borderblue bg-softblue/60 p-4 text-sm leading-6 text-muted"
            role="note"
          >
            Esta guía tiene fines educativos y no sustituye una evaluación médica.
            Si presenta imposibilidad para orinar, fiebre, escalofríos, sangrado
            importante, dolor intenso o empeoramiento rápido, busque atención
            médica urgente.
          </div>
        </article>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="brugiati-card p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
              Preguntas frecuentes
            </p>
            <h2 className="mt-3 font-heading text-4xl leading-none text-navy">
              Respuestas rápidas antes de la consulta.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Estas respuestas orientan al paciente y ayudan a preparar mejor la
              conversación médica. No reemplazan la evaluación individual.
            </p>
          </div>
          <FAQAccordion items={article.faqs} />
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
                Artículos relacionados
              </p>
              <h2 className="mt-3 font-heading text-4xl leading-none text-navy">
                Siga preparando su consulta.
              </h2>
            </div>
            <Link
              to="/educacion"
              className="inline-flex items-center gap-2 text-sm font-semibold text-medical transition hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              Ver todo el blog
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {relatedArticles.map((related) => (
              <Link
                key={related.key}
                to={related.path}
                className="brugiati-card group flex min-h-[16rem] flex-col p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-medical">
                  {related.category} · {related.readingTime}
                </p>
                <h3 className="mt-4 font-heading text-3xl leading-none text-navy">
                  {related.shortTitle}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-muted">
                  {related.summary}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-medical transition group-hover:text-navy">
                  Leer guía
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
              Próximo paso
            </p>
            <h2 className="mt-3 font-heading text-4xl leading-none text-navy">
              Organice síntomas y estudios antes de decidir.
            </h2>
          </div>
          <CTAButton
            to="/agendar-cita"
            icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
          >
            Coordinar consulta
          </CTAButton>
        </div>
      </SectionContainer>
    </>
  );
}

function getRelatedArticles(articleKey: ArticleKey) {
  return educationArticleList
    .filter((article) => article.key !== articleKey)
    .slice(0, 3);
}

function getArticleHero(articleKey: ArticleKey) {
  if (articleKey === "calculosEndourologia") {
    return imageAssets.bluegatiKidneyStonesHero;
  }

  if (articleKey === "segundaOpinionUroOncologia") {
    return imageAssets.bluegatiSecondOpinionHero;
  }

  if (articleKey === "vasectomiaSaludMasculina") {
    return imageAssets.bluegatiMensHealthHero;
  }

  if (articleKey === "sangreOrinaHematuria" || articleKey === "cistoscopiaPreparacion") {
    return imageAssets.bluegatiConsultationHero;
  }

  if (articleKey === "primeraConsultaUrologica") {
    return imageAssets.bluegatiEducationBlogHero;
  }

  return imageAssets.bluegatiProstateHero;
}

function getArticleTitleAccent(articleKey: ArticleKey) {
  const accents: Record<ArticleKey, string> = {
    holepProstata: "HoLEP",
    calculosEndourologia: "cálculos",
    segundaOpinionUroOncologia: "segunda opinión",
    psaBiopsiaProstata: "PSA",
    vasectomiaSaludMasculina: "vasectomía",
    rtupVsHolep: "RTUP",
    sangreOrinaHematuria: "sangre",
    primeraConsultaUrologica: "primera consulta",
    cistoscopiaPreparacion: "cistoscopia",
  };

  return accents[articleKey];
}
