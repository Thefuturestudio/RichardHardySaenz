import {
  Bot,
  CheckCircle2,
  FileText,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { contact } from "../data/contact";
import { imageAssets } from "../data/images";
import { useLanguage } from "../i18n/LanguageContext";
import { pageUxImprovements } from "../i18n/pageUxImprovements";
import { refinementCopy } from "../i18n/refinementCopy";
import { getWhatsAppHref } from "../lib/whatsapp";
import { AppointmentCalendarCard, BookingForm } from "../components/home/BookingForm";
import { Breadcrumbs } from "../components/shared/Breadcrumbs";
import { CTAButton } from "../components/shared/CTAButton";
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
      href: "#contacto",
      icon: MapPin,
    },
  ];
  const appointmentFacts =
    language === "es"
      ? [
          ["Coordinación", "Equipo privado"],
          ["Primera consulta", "45 minutos"],
          ["Seguimiento", "30 minutos"],
          ["Confirmación", "Manual por el equipo"],
        ]
      : [
          ["Coordination", "Private team"],
          ["New visit", "45 minutes"],
          ["Follow-up", "30 minutes"],
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
              {t.cta.whatsapp}
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
          <aside className="relative xl:sticky xl:top-28">
            <AppointmentCalendarCard />
          </aside>
        </div>
      </SectionContainer>

      <SectionContainer className="navy-panel py-12 lg:py-16" dark>
        <aside id="contacto">
          <SupportCard title={bookingUx.panelTitle}>
            <div className="grid gap-4">
              <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {contactCards.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex min-h-[7rem] min-w-0 gap-3 rounded-2xl border border-borderblue bg-white/82 p-4 transition hover:-translate-y-0.5 hover:bg-softblue/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                    >
                      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 flex-none text-medical" />
                      <span className="min-w-0">
                        <span className="block text-xs font-bold uppercase tracking-[0.14em] text-navy">
                          {item.label}
                        </span>
                        <span
                          className={
                            index === 2
                              ? "mt-1 block break-all text-[13px] leading-6 text-muted"
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

              <div className="grid items-stretch gap-4 lg:grid-cols-[1.05fr_1fr_1.05fr]">
                <div className="flex h-full min-w-0 flex-col rounded-[1.25rem] border border-borderblue bg-white/78 p-5">
                  <p className="text-sm leading-7 text-muted">
                    {bookingUx.panelBody}
                  </p>
                  <div className="mt-4 flex-1 rounded-[1.15rem] border border-borderblue bg-softblue/55 p-5">
                    <p className="text-sm font-semibold text-navy">
                      {bookingUx.assuranceTitle}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {bookingUx.assuranceBody}
                    </p>
                  </div>
                </div>

                <div className="grid h-full min-w-0 gap-2 rounded-[1.25rem] border border-borderblue bg-softblue/72 p-5">
                  {appointmentFacts.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-borderblue/70 py-2 first:pt-0 last:border-0 last:pb-0"
                    >
                      <span className="min-w-0 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                        {label}
                      </span>
                      <span className="max-w-[8.5rem] text-right text-sm font-semibold leading-5 text-navy">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex h-full min-w-0 flex-col gap-4">
                  <ul className="grid flex-1 content-center gap-4 rounded-[1.25rem] border border-borderblue bg-white/78 p-5">
                    {bookingUx.panelSteps.map((step) => (
                      <li key={step} className="flex gap-3 text-sm leading-6 text-muted">
                        <CheckCircle2
                          aria-hidden="true"
                          className="mt-0.5 h-4 w-4 flex-none text-cyan"
                        />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("uropanama:open-assistant"))
                    }
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-navy bg-navy px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_rgba(6,27,51,0.18)] transition hover:-translate-y-0.5 hover:bg-medical focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                  >
                    {t.cta.assistant}
                    <Bot aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </SupportCard>
        </aside>
      </SectionContainer>

      <SectionContainer className="bg-mist">
        <div className="rounded-[2rem] border border-borderblue bg-white/86 p-5 shadow-[0_24px_80px_rgba(13,43,69,0.07)] backdrop-blur sm:p-8 lg:p-10">
          <div className="grid gap-7">
            <div className="rounded-[1.5rem] border border-borderblue bg-soft/72 p-5 lg:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
                {t.bookingPage.bringTitle}
              </p>
              <div className="mt-3 grid gap-5 lg:grid-cols-[0.72fr_1fr] lg:items-end">
                <div>
                  <h2 className="max-w-xl font-heading text-5xl leading-[0.96] text-navy text-balance">
                    {bookingUx.preparationTitle}
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-7 text-muted">
                  {bookingUx.preparationBody}
                </p>
              </div>
              <div className="mt-6 grid gap-3 lg:grid-cols-3">
                <InfoPill
                  icon={<ShieldCheck aria-hidden="true" className="h-5 w-5" />}
                  title={bookingUx.assuranceTitle}
                  body={bookingUx.assuranceBody}
                />
                <InfoPill
                  icon={<Globe2 aria-hidden="true" className="h-5 w-5" />}
                  title={bookingCopy.international}
                  body={t.bookingPage.subtitle}
                />
                <InfoPill
                  icon={<FileText aria-hidden="true" className="h-5 w-5" />}
                  title={refinementCopy[language].concierge.note}
                  body={bookingCopy.heroBody}
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[1.5rem] border border-borderblue bg-soft/75 p-5">
                <h3 className="font-heading text-3xl leading-none text-navy">
                  {bookingCopy.nextTitle}
                </h3>
                <div className="mt-5 grid gap-4">
                  {bookingCopy.next.map(([title, body], index) => (
                    <div key={title} className="flex gap-3">
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-full border border-borderblue bg-white text-xs font-bold text-medical">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-navy">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <CTAButton
                  to="/agendar-cita"
                  className="mt-6"
                >
                  {t.cta.book}
                </CTAButton>
              </div>

              <div className="rounded-[1.5rem] border border-borderblue bg-soft/75 p-5">
                <h3 className="font-heading text-3xl leading-none text-navy">
                  {t.bookingPage.bringTitle}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {t.bookingPage.bringIntro}
                </p>
                <div className="mt-5 grid gap-2">
                  {t.bookingPage.bring.map((item) => (
                    <div key={item} className="flex gap-3 rounded-xl bg-softblue/55 px-3 py-2.5">
                      <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-cyan" />
                      <p className="text-sm font-semibold leading-5 text-navy">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-3">
                  {firstVisitNotes.map((note) => (
                    <div
                      key={note.title}
                      className="rounded-2xl border border-borderblue bg-white/72 p-4"
                    >
                      <p className="text-sm font-semibold text-navy">{note.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{note.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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

function InfoPill({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4 p-4">
      <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-white text-medical shadow-[0_10px_30px_rgba(13,43,69,0.06)]">
        {icon}
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-navy">
          {title}
        </p>
        <p className="mt-2 text-xs leading-6 text-muted">{body}</p>
      </div>
    </div>
  );
}

