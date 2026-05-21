import { CalendarDays } from "lucide-react";
import { Breadcrumbs } from "../components/shared/Breadcrumbs";
import { CTAButton } from "../components/shared/CTAButton";
import { SEO } from "../components/shared/SEO";
import { SectionContainer } from "../components/shared/SectionContainer";
import { useLanguage } from "../i18n/LanguageContext";
import { simpleBreadcrumbs } from "../seo/breadcrumbs";
import { seoMetadata } from "../seo/metadata";
import { pageSchema } from "../seo/schema";

type LegalPageProps = {
  type: "privacy" | "terms";
};

export function LegalPage({ type }: LegalPageProps) {
  const { language, t } = useLanguage();
  const seo = seoMetadata[type];
  const breadcrumbs = simpleBreadcrumbs(language, type, seo.path);
  const copy = getCopy(type, language);

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.path}
        jsonLd={pageSchema({ breadcrumbs })}
      />
      <section className="luxury-shell site-hero px-4 pb-14 pt-32 sm:px-6 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-4xl">
          <p className="site-hero-eyebrow">
            UroPanama
          </p>
          <h1 className="site-hero-title mt-5 font-heading text-navy">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            {copy.intro}
          </p>
        </div>
      </section>
      <Breadcrumbs items={breadcrumbs} />
      <SectionContainer className="bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="premium-card rounded-[1.55rem] p-7 sm:p-9">
            <p className="rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm leading-7 text-muted">
              {copy.notice}
            </p>
            <div className="mt-8 grid gap-7">
              {copy.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="font-heading text-4xl leading-none text-navy">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-muted">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
            <div className="mt-9">
              <CTAButton
                to="/agendar-cita"
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

function getCopy(type: "privacy" | "terms", language: "es" | "en") {
  if (type === "privacy") {
    return language === "es"
      ? {
          title: "Privacidad",
          intro:
            "Información sobre cómo se usa la información enviada por formularios, WhatsApp, asistente digital y futuros canales de voz.",
          notice:
            "Esta página resume el manejo operativo de información para coordinar citas. No sustituye una política legal revisada por la práctica antes de publicación final.",
          sections: [
            {
              title: "Datos de contacto",
              body:
                "Los formularios, WhatsApp y el asistente pueden solicitar nombre, teléfono, email, motivo general de consulta, preferencia de horario, si es primera visita y si existen estudios disponibles. No se solicitan documentos médicos ni valores de laboratorio desde esta página.",
            },
            {
              title: "Uso de la información",
              body:
                "La información se utiliza para responder solicitudes, preparar un resumen de coordinación, revisar disponibilidad y confirmar manualmente próximos pasos. Las citas no se reservan automáticamente y HuliPractice o el equipo pueden seguir siendo el flujo operativo de confirmación.",
            },
            {
              title: "WhatsApp, asistente y llamadas de voz",
              body:
                "Si el paciente usa WhatsApp, el asistente digital o un futuro asistente de voz, la información puede convertirse en un resumen para el equipo. Estos canales se usan para orientar la coordinación, identificar señales de alarma y facilitar el seguimiento administrativo; no reemplazan la consulta médica.",
            },
            {
              title: "Transcripciones, resúmenes y retención",
              body:
                "Las llamadas de voz o conversaciones digitales pueden generar transcripciones o resúmenes operativos si el servicio se activa. La retención, revisión y eliminación de esos registros debe confirmarse con la práctica antes del lanzamiento final. Hasta que exista un flujo seguro aprobado, el sitio no debe recibir documentos médicos sensibles.",
            },
            {
              title: "Seguridad médica",
              body:
                "El sitio, formularios, asistente y futuros resúmenes de voz no realizan diagnósticos, decisiones de tratamiento ni indicaciones de medicamentos. Si presenta dolor agudo, fiebre, sangrado, retención urinaria, cólico renal, escalofríos o una preocupación postoperatoria reciente, acuda a urgencias o contacte al equipo de inmediato.",
            },
          ],
        }
      : {
          title: "Privacy",
          intro:
            "Information about how data submitted through forms, WhatsApp, the digital assistant, and future voice channels is used.",
          notice:
            "This page summarizes operational data handling for visit coordination. It does not replace a legal policy reviewed by the practice before final publication.",
          sections: [
            {
              title: "Contact data",
              body:
                "Forms, WhatsApp, and the assistant may request name, phone, email, general reason for consultation, preferred time, whether this is a first visit, and whether studies are available. Medical documents and lab values are not requested from this page.",
            },
            {
              title: "Use of information",
              body:
                "Information is used to respond to requests, prepare a coordination summary, review availability, and manually confirm next steps. Visits are not booked automatically, and HuliPractice or the team may remain the operational confirmation workflow.",
            },
            {
              title: "WhatsApp, assistant, and voice calls",
              body:
                "If the patient uses WhatsApp, the digital assistant, or a future voice assistant, the information may be turned into a staff summary. These channels support coordination, warning-sign routing, and administrative follow-up; they do not replace a medical consultation.",
            },
            {
              title: "Transcripts, summaries, and retention",
              body:
                "Voice calls or digital conversations may generate operational transcripts or summaries if the service is activated. Retention, review, and deletion of those records should be confirmed with the practice before final launch. Until an approved secure workflow exists, the site should not receive sensitive medical documents.",
            },
            {
              title: "Medical safety",
              body:
                "The website, forms, assistant, and future voice summaries do not provide diagnoses, treatment decisions, or medication instructions. If you have acute pain, fever, bleeding, urinary retention, renal colic, chills, or a recent post-operative concern, seek urgent care or contact the team immediately.",
            },
          ],
        };
  }

  return language === "es"
    ? {
        title: "Términos de uso",
        intro:
          "Condiciones generales para usar el sitio de UroPanama como recurso educativo y canal de coordinación.",
        notice:
          "Estas condiciones reflejan el flujo operativo descrito en los documentos del proyecto. La versión final debe ser revisada y aprobada antes de publicación.",
        sections: [
          {
            title: "Contenido educativo",
            body:
              "La información del sitio tiene fines educativos y de orientación general sobre urología, uro-oncología, endourología, HoLEP, cálculos renales, salud masculina y segunda opinión. No constituye diagnóstico, tratamiento ni recomendación médica personalizada.",
          },
          {
            title: "Coordinación de citas",
            body:
              "El envío de un formulario, mensaje de WhatsApp, resumen del asistente o futuro resumen de voz no confirma una cita automáticamente. El equipo revisa la solicitud, confirma disponibilidad manualmente y puede orientar el flujo por HuliPractice u otro canal autorizado.",
          },
          {
            title: "Canales digitales y revisión humana",
            body:
              "Los canales digitales pueden ayudar a organizar información inicial, pero las decisiones médicas y la confirmación de agenda requieren revisión humana. El paciente no debe enviar documentos sensibles, imágenes diagnósticas completas ni datos clínicos extensos hasta que la práctica indique un canal seguro.",
          },
          {
            title: "Emergencias",
            body:
              "Este sitio no debe utilizarse para emergencias médicas. Dolor agudo, fiebre, escalofríos, sangrado, retención urinaria, cólico renal, vómitos persistentes o preocupación postoperatoria reciente requieren atención médica urgente.",
          },
        ],
      }
    : {
        title: "Terms of use",
        intro:
          "General conditions for using the UroPanama website as an educational resource and coordination channel.",
        notice:
          "These terms reflect the operational flow described in the project documents. Final copy should be reviewed and approved before publication.",
        sections: [
          {
            title: "Educational content",
            body:
              "Website information is for education and general guidance about urology, uro-oncology, endourology, HoLEP, kidney stones, men's health, and second opinions. It is not a diagnosis, treatment, or personalized medical recommendation.",
          },
          {
            title: "Appointment coordination",
            body:
              "Submitting a form, WhatsApp message, assistant summary, or future voice summary does not automatically confirm a visit. The team reviews the request, manually confirms availability, and may guide the workflow through HuliPractice or another authorized channel.",
          },
          {
            title: "Digital channels and human review",
            body:
              "Digital channels can help organize initial information, but medical decisions and schedule confirmation require human review. Patients should not send sensitive documents, complete diagnostic images, or extensive clinical data until the practice indicates a secure channel.",
          },
          {
            title: "Emergencies",
            body:
              "This site should not be used for medical emergencies. Acute pain, fever, chills, bleeding, urinary retention, renal colic, persistent vomiting, or recent post-operative concern requires urgent medical care.",
          },
        ],
      };
}
