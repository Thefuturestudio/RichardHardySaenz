import {
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { contact } from "../data/contact";
import { imageAssets } from "../data/images";
import { useLanguage } from "../i18n/LanguageContext";
import { bookingFaqs } from "../i18n/faqPlacement";
import { pageUxImprovements } from "../i18n/pageUxImprovements";
import { refinementCopy } from "../i18n/refinementCopy";
import { getWhatsAppHref } from "../lib/whatsapp";
import { BookingForm } from "../components/home/BookingForm";
import { Breadcrumbs } from "../components/shared/Breadcrumbs";
import { CTAButton } from "../components/shared/CTAButton";
import { FAQAccordion } from "../components/shared/FAQAccordion";
import { PageHero } from "../components/shared/PageHero";
import { SEO } from "../components/shared/SEO";
import { SectionContainer } from "../components/shared/SectionContainer";
import { simpleBreadcrumbs } from "../seo/breadcrumbs";
import { seoMetadata } from "../seo/metadata";
import { pageSchema } from "../seo/schema";

export function BookingPage() {
  const { language, t } = useLanguage();
  const location = useLocation();
  const bookingCopy = refinementCopy[language].booking;
  const bookingUx = pageUxImprovements[language].booking;
  const bookingFaqItems = bookingFaqs[language].map(([question, answer]) => ({
    question,
    answer,
  }));
  const breadcrumbs = simpleBreadcrumbs(
    language,
    "booking",
    seoMetadata.booking.path,
  );
  const contactLabels =
    language === "es"
      ? ["WhatsApp", "Teléfono", "Email", "Ubicación"]
      : ["WhatsApp", "Phone", "Email", "Location"];
  const contactCards = [
    {
      label: contactLabels[0],
      value: contact.whatsappDisplay,
      href: getWhatsAppHref(location.pathname, language),
      icon: MessageCircle,
    },
    {
      label: contactLabels[1],
      value: contact.phoneDisplay,
      href: contact.phoneHref,
      icon: Phone,
    },
    {
      label: contactLabels[2],
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: Mail,
    },
    {
      label: contactLabels[3],
      value: contact.location,
      href: contact.mapsHref,
      icon: MapPin,
    },
  ];
  const directContactTitle = language === "es" ? "Contacto directo" : "Direct contact";
  const directContactBody =
    language === "es"
      ? "WhatsApp es la vía más rápida. También puede enviar el formulario si prefiere dejar la información ordenada."
      : "WhatsApp is the fastest route. You can also send the form if you prefer to leave the details organized.";
  const heroWhatsappLabel = language === "es" ? "Escribir por WhatsApp" : "Message on WhatsApp";
  const manualConfirmationNote =
    language === "es"
      ? "La cita no queda reservada automáticamente. El equipo confirma disponibilidad y próximos pasos por el canal indicado."
      : "The visit is not booked automatically. The team confirms availability and next steps through the selected channel.";
  const appointmentFacts =
    language === "es"
      ? [
          ["Ruta rápida", "WhatsApp"],
          ["Solicitud ordenada", "Formulario"],
          ["Confirmación", "Manual por el equipo"],
        ]
      : [
          ["Fast route", "WhatsApp"],
          ["Organized request", "Form"],
          ["Confirmation", "Manual by the team"],
        ];
  const firstVisitNotes =
    language === "es"
      ? [
          {
            title: "No necesita tener todo listo",
            body: "Si no tiene estudios recientes, puede solicitar la visita y el equipo le indicará qué información conviene preparar.",
          },
          {
            title: "Organice sus dudas",
            body: "Traer una lista corta de preguntas ayuda a enfocar la consulta y aprovechar mejor el tiempo con el especialista.",
          },
        ]
      : [
          {
            title: "You do not need everything ready",
            body: "If you do not have recent studies, you can still request the visit and the team can guide what to prepare.",
          },
          {
            title: "Organize your questions",
            body: "A short question list helps focus the visit and make the specialist conversation more useful.",
          },
        ];

  return (
    <>
      <SEO
        title={seoMetadata.booking.title}
        description={seoMetadata.booking.description}
        canonicalPath={seoMetadata.booking.path}
        jsonLd={pageSchema({ breadcrumbs })}
      />
      <PageHero
        eyebrow={t.brand.platform}
        title={t.bookingPage.title}
        titleAccent={language === "en" ? "visit" : "cita"}
        subtitle={t.bookingPage.subtitle}
        intro={bookingCopy.heroBody}
        image={imageAssets.bluegatiBookingHero}
        imageClassName="page-hero-image--v2"
        actions={
          <>
            <CTAButton
              href={getWhatsAppHref(location.pathname, language)}
              icon={<MessageCircle aria-hidden="true" className="h-4 w-4" />}
            >
              {heroWhatsappLabel}
            </CTAButton>
            <CTAButton
              href={contact.phoneHref}
              variant="secondary"
              icon={<Phone aria-hidden="true" className="h-4 w-4" />}
            >
              {t.cta.call}
            </CTAButton>
          </>
        }
      />
      <Breadcrumbs items={breadcrumbs} />

      <SectionContainer className="bg-white pb-12 lg:pb-16">
        <div className="relative isolate grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-softblue/70 via-white to-transparent" />
          <div className="relative">
            <BookingForm />
          </div>
          <aside id="contacto" className="relative xl:sticky xl:top-28">
            <SupportCard title={directContactTitle}>
              <p className="text-sm leading-7 text-muted">{directContactBody}</p>
              <div className="mt-5 grid gap-3">
                {contactCards.slice(0, 2).map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className={
                        index === 0
                          ? "flex min-h-[4.75rem] min-w-0 gap-3 rounded-2xl border border-navy bg-navy p-4 text-white shadow-[0_18px_42px_rgba(6,27,51,0.16)] transition hover:-translate-y-0.5 hover:bg-medical focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                          : "flex min-h-[4.75rem] min-w-0 gap-3 rounded-2xl border border-borderblue bg-white/82 p-4 text-navy transition hover:-translate-y-0.5 hover:bg-softblue/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                      }
                    >
                      <Icon
                        aria-hidden="true"
                        className={
                          index === 0
                            ? "mt-0.5 h-5 w-5 flex-none text-cyan"
                            : "mt-0.5 h-5 w-5 flex-none text-medical"
                        }
                      />
                      <span className="min-w-0">
                        <span
                          className={
                            index === 0
                              ? "block text-xs font-bold uppercase tracking-[0.14em] text-white/70"
                              : "block text-xs font-bold uppercase tracking-[0.14em] text-navy"
                          }
                        >
                          {item.label}
                        </span>
                        <span
                          className={
                            index === 0
                              ? "mt-1 block break-words text-sm font-semibold leading-6 text-white"
                              : "mt-1 block break-words text-sm leading-6 text-muted"
                          }
                        >
                          {item.value}
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-3">
                {contactCards.slice(2).map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex min-w-0 gap-3 rounded-2xl border border-borderblue bg-softblue/55 p-4 transition hover:bg-white/86 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                    >
                      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 flex-none text-medical" />
                      <span className="min-w-0">
                        <span className="block text-xs font-bold uppercase tracking-[0.14em] text-navy">
                          {item.label}
                        </span>
                        <span className="mt-1 block break-words text-sm leading-6 text-muted">
                          {item.value}
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[1.15rem] border border-borderblue bg-softblue/70 p-5">
                <p className="text-sm font-semibold text-navy">
                  {bookingUx.assuranceTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {manualConfirmationNote}
                </p>
              </div>

              <div className="mt-4 rounded-[1.15rem] border border-borderblue bg-white/74 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                  {language === "es" ? "Horario" : "Hours"}
                </p>
                <div className="mt-3 grid gap-2">
                  {contact.hours.map((item) => (
                    <div
                      key={item.day}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-sm"
                    >
                      <span className="font-semibold text-navy">{item.day}</span>
                      <span className="text-right text-muted">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-2 rounded-[1.15rem] border border-borderblue bg-white/74 p-4">
                {appointmentFacts.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-borderblue/70 py-2 first:pt-0 last:border-0 last:pb-0"
                  >
                    <span className="min-w-0 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                      {label}
                    </span>
                    <span className="max-w-[9rem] text-right text-sm font-semibold leading-5 text-navy">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </SupportCard>
          </aside>
        </div>
      </SectionContainer>

      <SectionContainer className="bg-mist">
        <div className="rounded-[2rem] border border-borderblue bg-white/86 p-5 shadow-[0_24px_80px_rgba(13,43,69,0.07)] backdrop-blur sm:p-7 lg:p-8">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <h2 className="font-heading text-4xl leading-none text-navy">
                {bookingCopy.nextTitle}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                {manualConfirmationNote}
              </p>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-muted lg:justify-self-end lg:text-right">
              {bookingUx.preparationBody}
            </p>
          </div>

          <div className="mt-7 grid gap-3 lg:grid-cols-3">
              {bookingCopy.next.map(([title, body], index) => (
              <div
                key={title}
                className="flex h-full gap-4 rounded-[1.25rem] border border-borderblue bg-soft/76 p-5"
              >
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full border border-borderblue bg-white text-sm font-bold text-medical">
                    {index + 1}
                  </span>
                  <div>
                  <p className="text-sm font-semibold text-navy">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-7 border-t border-borderblue pt-7">
            <div className="grid gap-5 lg:grid-cols-[0.42fr_1fr] lg:items-start">
              <div>
                <h3 className="font-heading text-3xl leading-none text-navy">
                  {bookingUx.preparationTitle}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {t.bookingPage.bringIntro}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {t.bookingPage.bring.map((item) => (
                  <div key={item} className="flex min-h-12 gap-3 rounded-xl bg-softblue/55 px-3 py-2.5">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-cyan" />
                  <p className="text-sm font-semibold leading-5 text-navy">{item}</p>
                </div>
              ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {firstVisitNotes.map((note) => (
                <div
                  key={note.title}
                  className="rounded-2xl border border-borderblue bg-white/72 p-5"
                >
                  <p className="text-sm font-semibold text-navy">{note.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{note.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer
        eyebrow={language === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
        title={language === "es" ? "Antes de agendar" : "Before booking"}
        subtitle={
          language === "es"
            ? "Información práctica sobre horarios, sede, seguros y preparación para la primera consulta."
            : "Practical information about hours, location, insurance, and preparation for the first visit."
        }
        className="bg-white"
      >
        <div className="mx-auto max-w-4xl">
          <FAQAccordion items={bookingFaqItems} />
        </div>
      </SectionContainer>
    </>
  );
}

function SupportCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="premium-card rounded-[1.45rem] p-5 sm:p-6">
      <h2 className="font-heading text-3xl leading-none text-navy">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

