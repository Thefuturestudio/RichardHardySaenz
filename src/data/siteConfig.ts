import { contact } from "./contact";

export const siteConfig = {
  doctorName: "Dr. Carlos A. Brugiati",
  platformName: "UroPanama",
  baseUrl: `https://${contact.domain}`,
  defaultOgImage: "/images/hero-uro-panama.png",
  positioning:
    "Urología avanzada y cirugía mínimamente invasiva en Panamá",
  shortPositioning:
    "Urología, uro-oncología, endourología y mínima invasión.",
  disclaimer:
    "La información de este sitio tiene fines educativos y de orientación general. No sustituye una evaluación médica. En caso de emergencia, acuda a un servicio médico de urgencia.",
  assistantDisclaimer:
    "El asistente digital no realiza diagnósticos, decisiones de tratamiento ni indicaciones de medicamentos. Su función es organizar información inicial y apoyar la coordinación manual de citas.",
  publicTrustSignals: [
    "Perfil público con alta valoración de pacientes.",
    "Opiniones públicas a validar antes de publicación",
    "Especialista en urología",
    "Atención en Ciudad de Panamá",
  ],
  trustStrip: [
    "Uro-oncología",
    "Endourología",
    "Cirugía percutánea",
    "Laparoscopía",
    "Mínima invasión",
  ],
  verifiedNote: "Datos clínicos y operativos sujetos a revisión final antes de publicación.",
};

// Keep schema limited to source-backed public facts. Do not add review/rating
// claims or private verification/admin details to public schema.
export const physicianJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Physician", "MedicalBusiness"],
  name: siteConfig.doctorName,
  alternateName: siteConfig.platformName,
  description:
    "Atención urológica especializada en Panamá con enfoque en próstata, cálculos renales, uro-oncología, endourología y cirugía mínimamente invasiva.",
  url: siteConfig.baseUrl,
  medicalSpecialty: [
    "Urology",
    "Urologic Oncology",
    "Endourology",
    "Minimally Invasive Surgery",
  ],
  telephone: contact.phoneDisplay,
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "The Panama Clinic, Torre B, piso 21, consultorio 10-11",
    addressLocality: "Ciudad de Panamá",
    addressCountry: "PA",
  },
  openingHoursSpecification: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ].map((dayOfWeek) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek,
    opens: "12:00",
    closes: "18:00",
  })).concat({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "08:00",
    closes: "12:00",
  }),
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Publication status",
      value: "Public CV and onboarding-source schema. Reviews, insurance coverage, and affiliations require final publication approval.",
    },
  ],
};
