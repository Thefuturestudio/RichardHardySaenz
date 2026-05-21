import type { Language } from "../i18n/translations";
import { getRelevantFaqContext, selectRelevantFaqs } from "./assistantFaq";

type KnowledgeEntry = {
  id: string;
  keywords: string[];
  es: {
    title: string;
    guidance: string;
    bring?: string;
    safety?: string;
  };
  en: {
    title: string;
    guidance: string;
    bring?: string;
    safety?: string;
  };
};

const entries: KnowledgeEntry[] = [
  {
    id: "first-visit",
    keywords: ["primera consulta", "primera cita", "first visit", "what to bring"],
    es: {
      title: "Primera consulta",
      guidance:
        "La primera consulta ayuda a ordenar síntomas, antecedentes, estudios disponibles y preguntas principales antes de definir próximos pasos.",
      bring:
        "Lleve estudios de imagen, informes, laboratorios, lista de medicamentos, alergias conocidas y una lista corta de preguntas.",
    },
    en: {
      title: "First visit",
      guidance:
        "The first visit helps organize symptoms, history, available studies, and main questions before next steps are defined.",
      bring:
        "Bring imaging, reports, labs, current medications, known allergies, and a short list of questions.",
    },
  },
  {
    id: "holep-bph",
    keywords: ["holep", "prostata agrandada", "hiperplasia", "bph", "laser prostata"],
    es: {
      title: "HoLEP y próstata agrandada",
      guidance:
        "HoLEP es una técnica con láser que puede considerarse en algunos casos de crecimiento prostático benigno. La indicación depende de síntomas, tamaño prostático, estudios urinarios, PSA, salud general y evaluación médica.",
      bring:
        "Lleve PSA, ultrasonido, estudios urinarios, medicamentos actuales e informes previos.",
    },
    en: {
      title: "HoLEP and enlarged prostate",
      guidance:
        "HoLEP is a laser technique that may be considered in selected cases of benign prostate enlargement. Indication depends on symptoms, prostate size, urinary studies, PSA, general health, and medical evaluation.",
      bring:
        "Bring PSA, ultrasound, urinary studies, current medications, and prior reports.",
    },
  },
  {
    id: "stones",
    keywords: ["calculo", "piedra", "rinon", "renal colic", "kidney stone", "lithotripsy", "litotricia"],
    es: {
      title: "Cálculos renales",
      guidance:
        "Los cálculos pueden causar dolor, náuseas, sangre en la orina o molestias urinarias. La conducta depende de tamaño, ubicación, síntomas, infección, función renal y estudios de imagen.",
      bring:
        "Lleve tomografía, ultrasonido, laboratorios, examen de orina, informe de urgencias y medicamentos actuales.",
      safety:
        "Fiebre, escalofríos, dolor intenso persistente, vómitos, debilidad o dificultad para orinar requieren atención urgente.",
    },
    en: {
      title: "Kidney stones",
      guidance:
        "Stones may cause pain, nausea, blood in urine, or urinary discomfort. Management depends on size, location, symptoms, infection, kidney function, and imaging.",
      bring:
        "Bring CT scan, ultrasound, labs, urine test, emergency report, and current medications.",
      safety:
        "Fever, chills, persistent severe pain, vomiting, weakness, or trouble urinating require urgent care.",
    },
  },
  {
    id: "psa-biopsy",
    keywords: ["psa", "biopsia", "resonancia", "prostate biopsy", "elevated psa"],
    es: {
      title: "PSA elevado y biopsia",
      guidance:
        "Un PSA elevado no confirma cáncer por sí solo. Puede relacionarse con crecimiento prostático, inflamación, infección, procedimientos recientes u otros factores. El urólogo revisa contexto, tendencia y estudios.",
      bring:
        "Lleve resultados previos de PSA, resonancia si existe, informes, medicamentos y antecedentes relevantes.",
    },
    en: {
      title: "Elevated PSA and biopsy",
      guidance:
        "An elevated PSA does not confirm cancer by itself. It can relate to prostate enlargement, inflammation, infection, recent procedures, or other factors. The urologist reviews context, trend, and studies.",
      bring:
        "Bring prior PSA results, MRI if available, reports, medications, and relevant history.",
    },
  },
  {
    id: "second-opinion",
    keywords: ["segunda opinion", "second opinion", "revisar estudios", "diagnostico", "diagnosis"],
    es: {
      title: "Segunda opinión",
      guidance:
        "Una segunda opinión ayuda a revisar estudios, diagnósticos previos o recomendaciones quirúrgicas. No garantiza que una recomendación cambie y no reemplaza urgencias.",
      bring:
        "Lleve informes médicos, imágenes, biopsia o patología si existe, laboratorios, medicamentos y preguntas principales.",
    },
    en: {
      title: "Second opinion",
      guidance:
        "A second opinion helps review studies, prior diagnoses, or surgical recommendations. It does not guarantee a recommendation will change and does not replace emergency care.",
      bring:
        "Bring medical reports, imaging, biopsy or pathology if available, labs, medications, and main questions.",
    },
  },
  {
    id: "male-health",
    keywords: ["vasectomia", "disfuncion", "erectil", "fertilidad", "salud masculina", "vasectomy", "erectile"],
    es: {
      title: "Salud masculina",
      guidance:
        "La consulta de salud masculina puede revisar función sexual, fertilidad, vasectomía, síntomas urinarios o prevención de forma privada y respetuosa.",
      bring:
        "Lleve medicamentos actuales, antecedentes relevantes, estudios previos y preguntas principales.",
    },
    en: {
      title: "Men's health",
      guidance:
        "A men's health visit can review sexual function, fertility, vasectomy, urinary symptoms, or prevention in a private and respectful setting.",
      bring: "Bring current medications, relevant history, prior studies, and main questions.",
    },
  },
  {
    id: "privacy-safety",
    keywords: ["privacidad", "datos", "transcript", "privacy", "data", "consent"],
    es: {
      title: "Privacidad y uso de datos",
      guidance:
        "El chat es informativo y para coordinación. Si el paciente solicita contacto, la información puede usarse para preparar un resumen para el equipo. No debe enviar documentos médicos sensibles por el chat.",
    },
    en: {
      title: "Privacy and data use",
      guidance:
        "The chat is informational and for coordination. If the patient requests contact, information may be used to prepare a team summary. Sensitive medical documents should not be sent through chat.",
    },
  },
];

export function getAssistantKnowledgeContext(language: Language, query = "") {
  const normalizedQuery = normalize(query);
  const matches = entries.filter((entry) =>
    entry.keywords.some((keyword) => normalizedQuery.includes(normalize(keyword))),
  );
  const selected = matches.length ? matches : entries.slice(0, 4);
  const faqContext = getRelevantFaqContext(language, query, 6);

  const topicContext = selected
    .map((entry) => {
      const copy = entry[language];
      return [
        copy.title,
        copy.guidance,
        copy.bring ? `Preparación: ${copy.bring}` : "",
        copy.safety ? `Seguridad: ${copy.safety}` : "",
      ]
        .filter(Boolean)
        .join(" ");
    })
    .join("\n");

  return [topicContext, faqContext].filter(Boolean).join("\n");
}

export function getAssistantKnowledgeReply(language: Language, query: string) {
  const normalizedQuery = normalize(query);
  const match = entries.find((entry) =>
    entry.keywords.some((keyword) => normalizedQuery.includes(normalize(keyword))),
  );

  if (!match) {
    const relevantFaqs = selectRelevantFaqs(query, 2, false);

    if (!relevantFaqs.length) {
      return "";
    }

    return [
      ...relevantFaqs.map(
        (faq) => `${faq.question} ${faq.answer}`,
      ),
      language === "es"
        ? "No puedo diagnosticar por este chat ni confirmar disponibilidad automaticamente, pero puedo ayudarle a preparar una solicitud para que el equipo le contacte."
        : "I cannot diagnose through this chat or confirm availability automatically, but I can help prepare a request for the team to contact you.",
    ].join(" ");
  }

  const copy = match[language];
  return [
    copy.guidance,
    copy.bring ? `Para prepararse: ${copy.bring}` : "",
    copy.safety ? `Importante: ${copy.safety}` : "",
    language === "es"
      ? "No puedo diagnosticar por este chat, pero puedo ayudarle a preparar una solicitud para que el equipo le contacte."
      : "I cannot diagnose through this chat, but I can help prepare a request for the team to contact you.",
  ]
    .filter(Boolean)
    .join(" ");
}

function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
