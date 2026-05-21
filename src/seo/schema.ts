import { contact } from "../data/contact";
import { siteConfig } from "../data/siteConfig";

export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type MedicalProcedureInput = {
  name: string;
  description: string;
  path: string;
};

export type ArticleInput = {
  headline: string;
  description: string;
  path: string;
  aboutName?: string;
};

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.baseUrl}${normalizedPath}`;
}

export function absoluteImageUrl(path = siteConfig.defaultOgImage) {
  return absoluteUrl(path);
}

export function physicianSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Physician", "MedicalBusiness"],
    name: siteConfig.doctorName,
    alternateName: siteConfig.platformName,
    url: siteConfig.baseUrl,
    image: absoluteImageUrl(),
    description:
      "Atención urológica especializada en Panamá con enfoque en próstata, cálculos renales, uro-oncología, endourología y cirugía mínimamente invasiva.",
    medicalSpecialty: [
      "Urology",
      "Urologic Oncology",
      "Endourology",
      "Minimally Invasive Surgery",
    ],
    areaServed: {
      "@type": "City",
      name: "Ciudad de Panamá",
    },
    telephone: contact.phoneDisplay,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad de Panamá",
      addressCountry: "PA",
    },
    sameAs: [contact.instagramUrl],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Publication status",
        value:
          "Public CV and onboarding-source schema. Address, hours, reviews, insurance, and affiliations require final publication approval.",
      },
    ],
  };
}

export function medicalClinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: siteConfig.platformName,
    url: siteConfig.baseUrl,
    image: absoluteImageUrl(),
    description:
      "Coordinación de atención urológica en Ciudad de Panamá para evaluación de próstata, cálculos renales, uro-oncología, endourología y salud masculina.",
    medicalSpecialty: "Urology",
    areaServed: {
      "@type": "Country",
      name: "Panamá",
    },
    telephone: contact.phoneDisplay,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad de Panamá",
      addressCountry: "PA",
    },
    availableService: [
      "Evaluación urológica",
      "Evaluación de próstata",
      "Evaluación de cálculos renales",
      "Segunda opinión urológica",
      "Coordinación manual de citas",
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Publication status",
        value:
          "Source-backed clinic coordination schema. Public address, hours, insurance coverage, affiliations, and staff routing require final approval before publication.",
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.platformName,
    alternateName: siteConfig.doctorName,
    url: siteConfig.baseUrl,
    inLanguage: ["es", "en"],
    publisher: {
      "@type": "MedicalBusiness",
      name: siteConfig.doctorName,
    },
  };
}

export function medicalProcedureSchema(input: MedicalProcedureInput) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    procedureType: "Urologic procedure",
    bodyLocation: "Urinary tract",
    medicalSpecialty: "Urology",
    provider: {
      "@type": "Physician",
      name: siteConfig.doctorName,
      url: siteConfig.baseUrl,
    },
    howPerformed:
      "La técnica, preparación y seguimiento dependen de la evaluación médica, estudios disponibles, condición general del paciente y coordinación del equipo.",
    preparation:
      "El paciente debe llevar síntomas, estudios, medicamentos, antecedentes y preguntas organizadas para revisión médica antes de definir próximos pasos.",
    followup:
      "El seguimiento se confirma manualmente de forma individual después de revisar hallazgos, evolución y señales de alarma.",
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(input: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: input.headline,
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "es-PA",
    about: {
      "@type": "MedicalCondition",
      name: input.aboutName ?? "Urología",
    },
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Patient",
    },
    reviewedBy: {
      "@type": "Physician",
      name: siteConfig.doctorName,
      url: siteConfig.baseUrl,
    },
    publisher: {
      "@type": "MedicalBusiness",
      name: siteConfig.platformName,
      url: siteConfig.baseUrl,
    },
  };
}

export function pageSchema({
  breadcrumbs,
  faqs,
  medicalProcedure,
  article,
}: {
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FaqItem[];
  medicalProcedure?: MedicalProcedureInput;
  article?: ArticleInput;
} = {}) {
  return [
    physicianSchema(),
    medicalClinicSchema(),
    websiteSchema(),
    ...(medicalProcedure ? [medicalProcedureSchema(medicalProcedure)] : []),
    ...(article ? [articleSchema(article)] : []),
    ...(breadcrumbs ? [breadcrumbSchema(breadcrumbs)] : []),
    ...(faqs && faqs.length ? [faqSchema(faqs)] : []),
  ];
}
