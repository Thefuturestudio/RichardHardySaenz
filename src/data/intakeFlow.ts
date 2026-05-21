import type { PatientConcern } from "../types/intake";
import type { Language } from "../i18n/translations";

type IntakeConcernConfig = {
  label: string;
  safeResponse: string;
  intakePrompt: string;
  emergencyWarning?: string;
  bookingCta: string;
  whatsappMessage: string;
};

type IntakeFlowCopy = {
  assistantTitle: string;
  diagnosticDisclaimer: string;
  openingMessage: string;
  responsePrompt: string;
  urgentGuidance: string;
  quickActions: Array<{ concern: PatientConcern; label: string }>;
  fields: {
    name: string;
    phone: string;
    email: string;
    preferredTime: string;
    isFirstVisit: string;
    hasStudies: string;
    studyTypes: string;
    message: string;
    consent: string;
  };
  placeholders: {
    name: string;
    phone: string;
    email: string;
    preferredTime: string;
    studyTypes: string;
    message: string;
  };
  options: {
    yes: string;
    no: string;
    notSure: string;
  };
  validation: {
    required: string;
    phone: string;
    email: string;
    consent: string;
  };
  summary: {
    title: string;
    body: string;
    urgentTitle: string;
    urgentBody: string;
    nextAction: string;
    urgentNextAction: string;
    book: string;
    sendWhatsapp: string;
    prepare: string;
    startOver: string;
    emergencyNote: string;
  };
  concerns: Record<PatientConcern, IntakeConcernConfig>;
};

const urgentGuidance = {
  es: "Por seguridad, si presenta dolor agudo, sangrado, retención de orina, cólico renal, fiebre, escalofríos, una preocupación post-operatoria reciente o una urgencia no clasificada, contacte al equipo de inmediato o acuda a un servicio médico de urgencia. Este asistente no sustituye una evaluación médica.",
  en: "For safety, if you have acute pain, bleeding, urinary retention, renal colic, fever, chills, a recent post-operative concern, or an unclassified urgent situation, contact the team immediately or seek urgent medical care. This assistant does not replace a medical evaluation.",
};

export const intakeFlow: Record<Language, IntakeFlowCopy> = {
  es: {
    assistantTitle: "Asistente IA UroPanama",
    diagnosticDisclaimer: "No realiza diagnósticos.",
    openingMessage:
      "Hola, soy el asistente IA de UroPanama. Puedo ayudarle a ordenar síntomas, estudios disponibles y preguntas antes de hablar con el equipo. No realizo diagnósticos médicos ni confirmo citas automáticamente.",
    responsePrompt: "Seleccione el motivo principal y comparta datos básicos para preparar una solicitud que el equipo revisará manualmente.",
    urgentGuidance: urgentGuidance.es,
    quickActions: [
      { concern: "general", label: "Agendar cita" },
      { concern: "kidney_stones", label: "Cálculos renales" },
      { concern: "prostate", label: "Síntomas de próstata" },
      { concern: "second_opinion", label: "Segunda opinión" },
      { concern: "location", label: "Ubicación" },
      { concern: "speak_to_team", label: "Dolor o urgencia" },
    ],
    fields: {
      name: "Nombre",
      phone: "WhatsApp",
      email: "Email",
      preferredTime: "Preferencia de horario",
      isFirstVisit: "¿Es primera consulta?",
      hasStudies: "¿Tiene estudios disponibles?",
      studyTypes: "Tipo de estudios disponibles",
      message: "Mensaje adicional",
      consent:
        "Acepto que mi información sea utilizada para coordinar una cita y preparar un resumen para el equipo. Este asistente no sustituye una evaluación médica.",
    },
    placeholders: {
      name: "Nombre completo",
      phone: "+507...",
      email: "correo@ejemplo.com",
      preferredTime: "Mañana, tarde o fecha tentativa",
      studyTypes: "Ej. tomografía, ultrasonido, laboratorios, informe previo",
      message: "Cuéntenos brevemente el motivo de consulta. No incluya documentos ni valores de laboratorio aquí.",
    },
    options: {
      yes: "Sí",
      no: "No",
      notSure: "No estoy seguro",
    },
    validation: {
      required: "Este campo es requerido.",
      phone: "Ingrese un teléfono o WhatsApp válido.",
      email: "Ingrese un email válido o deje el campo vacío.",
      consent: "Debe aceptar el uso de la información para coordinar la cita.",
    },
    summary: {
      title: "Resumen de orientación inicial",
      body: "Gracias. Esta es la información inicial que se enviará para coordinar su cita.",
      urgentTitle: "Síntomas que pueden requerir urgencia",
      urgentBody: urgentGuidance.es,
      nextAction:
        "Puede solicitar la cita o enviar este resumen por WhatsApp. El equipo confirmará disponibilidad y próximos pasos manualmente.",
      urgentNextAction:
        "Busque atención médica urgente si presenta estos síntomas. También puede contactar al equipo, pero este canal no sustituye urgencias.",
      book: "Agendar cita",
      sendWhatsapp: "Enviar por WhatsApp",
      prepare: "Preparar resumen",
      startOver: "Empezar de nuevo",
      emergencyNote: "Este formulario no debe utilizarse para emergencias médicas.",
    },
    concerns: {
      general: {
        label: "Agendar cita",
        safeResponse:
          "Puedo ayudarle a organizar la información básica para coordinar una evaluación urológica. El médico determinará qué estudios o pasos corresponden según cada caso.",
        intakePrompt: "Para coordinar la cita, comparta sus datos básicos y el motivo general de consulta.",
        bookingCta: "Agendar cita",
        whatsappMessage: "Hola, quisiera agendar una consulta con el Dr. Brugiati.",
      },
      kidney_stones: {
        label: "Cálculos renales",
        safeResponse:
          "Puedo ayudarle a coordinar una evaluación por cálculos renales. La indicación depende del tamaño, ubicación, síntomas y estudios disponibles.",
        intakePrompt:
          "Si tiene estudios de imagen o laboratorios, puede traerlos a la consulta. No es necesario enviar documentos por este asistente.",
        emergencyWarning: urgentGuidance.es,
        bookingCta: "Agendar evaluación por cálculos",
        whatsappMessage:
          "Hola, quisiera agendar una evaluación por cálculos renales con el Dr. Brugiati.",
      },
      prostate: {
        label: "Síntomas de próstata",
        safeResponse:
          "Podemos ayudarle a coordinar una evaluación prostática. Un PSA elevado o síntomas urinarios requieren valoración médica, pero no significan un diagnóstico por sí solos.",
        intakePrompt: "Comparta datos básicos y si tiene PSA, imágenes o informes disponibles para llevarlos a consulta.",
        bookingCta: "Agendar evaluación prostática",
        whatsappMessage:
          "Hola, quisiera agendar una evaluación prostática con el Dr. Brugiati.",
      },
      uro_oncology: {
        label: "Uro-oncología",
        safeResponse:
          "La evaluación uro-oncológica puede ayudar a revisar estudios, diagnósticos previos o hallazgos que requieren seguimiento especializado.",
        intakePrompt: "Puede preparar informes, biopsias, imágenes o laboratorios disponibles para revisión durante la consulta.",
        bookingCta: "Solicitar evaluación uro-oncológica",
        whatsappMessage:
          "Hola, quisiera solicitar una evaluación uro-oncológica con el Dr. Brugiati.",
      },
      second_opinion: {
        label: "Segunda opinión",
        safeResponse:
          "Una segunda opinión puede ayudarle a comprender mejor estudios, diagnóstico previo o una recomendación quirúrgica antes de tomar decisiones.",
        intakePrompt: "Puede traer estudios previos, informes médicos, laboratorios o imágenes disponibles para revisión.",
        bookingCta: "Solicitar segunda opinión",
        whatsappMessage:
          "Hola, quisiera solicitar una segunda opinión urológica. Tengo estudios previos disponibles.",
      },
      ureteroscopy: {
        label: "Ureteroscopía",
        safeResponse:
          "La ureteroscopía es un procedimiento que puede considerarse en casos seleccionados. Primero se requiere evaluación médica para confirmar si corresponde.",
        intakePrompt: "Comparta el motivo de consulta y si ya tiene imágenes o una recomendación previa.",
        bookingCta: "Consultar sobre ureteroscopía",
        whatsappMessage:
          "Hola, quisiera consultar sobre ureteroscopía con el Dr. Brugiati.",
      },
      male_health: {
        label: "Salud masculina",
        safeResponse:
          "Puede coordinar una consulta privada y respetuosa para conversar sobre función sexual, fertilidad, síntomas urinarios o prevención.",
        intakePrompt: "Comparta sus datos básicos y el tema general que desea evaluar.",
        bookingCta: "Agendar consulta privada",
        whatsappMessage:
          "Hola, quisiera agendar una consulta privada de salud urológica masculina.",
      },
      location: {
        label: "Ubicación",
        safeResponse:
          "La atención se coordina en Ciudad de Panamá, Panamá. El equipo puede confirmar detalles de ubicación y disponibilidad antes de la cita.",
        intakePrompt: "Si desea, deje sus datos para que el equipo comparta la información de coordinación.",
        bookingCta: "Solicitar información",
        whatsappMessage:
          "Hola, quisiera recibir información de ubicación y disponibilidad para una consulta con el Dr. Brugiati.",
      },
      speak_to_team: {
        label: "Dolor o urgencia",
        safeResponse:
          "Si presenta dolor agudo, sangrado, retención de orina, cólico renal, fiebre, escalofríos o una preocupación post-operatoria reciente, busque atención médica urgente o contacte al equipo de inmediato. No se realizan diagnósticos por este canal.",
        intakePrompt: "Comparta sus datos básicos para que el equipo pueda contactarle.",
        bookingCta: "Contactar al equipo",
        whatsappMessage:
          "Hola, quisiera hablar con el equipo de UroPanama por una posible urgencia urológica.",
      },
    },
  },
  en: {
    assistantTitle: "UroPanama AI Assistant",
    diagnosticDisclaimer: "Does not provide diagnoses.",
    openingMessage:
      "Hello, I am the UroPanama AI assistant. I can help organize symptoms, available studies, and questions before you speak with the team. I do not provide medical diagnoses or automatically confirm visits.",
    responsePrompt: "Select the main reason and share basic details to prepare a request the team will review manually.",
    urgentGuidance: urgentGuidance.en,
    quickActions: [
      { concern: "general", label: "Book visit" },
      { concern: "kidney_stones", label: "Kidney stones" },
      { concern: "prostate", label: "Prostate symptoms" },
      { concern: "second_opinion", label: "Second opinion" },
      { concern: "location", label: "Location" },
      { concern: "speak_to_team", label: "Pain or urgent concern" },
    ],
    fields: {
      name: "Name",
      phone: "WhatsApp",
      email: "Email",
      preferredTime: "Preferred time",
      isFirstVisit: "Is this your first visit?",
      hasStudies: "Do you have studies available?",
      studyTypes: "Available study types",
      message: "Additional message",
      consent:
        "I agree that my information may be used to coordinate an appointment and prepare a summary for the team. This assistant does not replace a medical evaluation.",
    },
    placeholders: {
      name: "Full name",
      phone: "+507...",
      email: "email@example.com",
      preferredTime: "Morning, afternoon, or tentative date",
      studyTypes: "E.g. CT scan, ultrasound, labs, prior report",
      message: "Briefly share the reason for the visit. Do not include documents or lab values here.",
    },
    options: {
      yes: "Yes",
      no: "No",
      notSure: "Not sure",
    },
    validation: {
      required: "This field is required.",
      phone: "Enter a valid phone or WhatsApp number.",
      email: "Enter a valid email or leave this field blank.",
      consent: "Please accept information use to coordinate the visit.",
    },
    summary: {
      title: "Initial guidance summary",
      body: "Thank you. This is the initial information that will be sent to coordinate your visit.",
      urgentTitle: "Symptoms that may require urgent care",
      urgentBody: urgentGuidance.en,
      nextAction:
        "You may request the visit or send this summary by WhatsApp. The team will manually confirm availability and next steps.",
      urgentNextAction:
        "Please seek urgent medical care if you have these symptoms. You may still contact the team, but this channel does not replace emergency care.",
      book: "Book visit",
      sendWhatsapp: "Send via WhatsApp",
      prepare: "Prepare summary",
      startOver: "Start over",
      emergencyNote: "This form should not be used for medical emergencies.",
    },
    concerns: {
      general: {
        label: "Book visit",
        safeResponse:
          "I can help organize basic information to coordinate a urology evaluation. The doctor will determine which studies or next steps are appropriate for each case.",
        intakePrompt: "To coordinate the visit, share your basic details and general reason for consultation.",
        bookingCta: "Book visit",
        whatsappMessage: "Hello, I would like to schedule a visit with Dr. Brugiati.",
      },
      kidney_stones: {
        label: "Kidney stones",
        safeResponse:
          "I can help coordinate an evaluation for kidney stones. The indication depends on stone size, location, symptoms, and available studies.",
        intakePrompt:
          "If you have imaging or labs, you can bring them to the visit. You do not need to send documents through this assistant.",
        emergencyWarning: urgentGuidance.en,
        bookingCta: "Book kidney stone evaluation",
        whatsappMessage:
          "Hello, I would like to schedule an evaluation for kidney stones with Dr. Brugiati.",
      },
      prostate: {
        label: "Prostate symptoms",
        safeResponse:
          "We can help coordinate a prostate evaluation. Elevated PSA or urinary symptoms require medical assessment, but they do not mean a diagnosis by themselves.",
        intakePrompt: "Share basic details and whether you have PSA results, imaging, or reports to bring to the visit.",
        bookingCta: "Book prostate evaluation",
        whatsappMessage:
          "Hello, I would like to schedule a prostate evaluation with Dr. Brugiati.",
      },
      uro_oncology: {
        label: "Uro-oncology",
        safeResponse:
          "A uro-oncology evaluation may help review studies, prior diagnoses, or findings that need specialized follow-up.",
        intakePrompt: "You may prepare available reports, biopsies, imaging, or labs for review during the consultation.",
        bookingCta: "Request uro-oncology evaluation",
        whatsappMessage:
          "Hello, I would like to request a uro-oncology evaluation with Dr. Brugiati.",
      },
      second_opinion: {
        label: "Second opinion",
        safeResponse:
          "A second opinion may help you better understand studies, a prior diagnosis, or a surgical recommendation before making decisions.",
        intakePrompt: "You may bring previous studies, medical reports, labs, or imaging available for review.",
        bookingCta: "Request second opinion",
        whatsappMessage:
          "Hello, I would like to request a urological second opinion. I have previous studies available.",
      },
      ureteroscopy: {
        label: "Ureteroscopy",
        safeResponse:
          "Ureteroscopy is a procedure that may be considered in selected cases. A medical evaluation is needed first to confirm whether it is appropriate.",
        intakePrompt: "Share the reason for consultation and whether you already have imaging or a prior recommendation.",
        bookingCta: "Ask about ureteroscopy",
        whatsappMessage:
          "Hello, I would like to ask about ureteroscopy with Dr. Brugiati.",
      },
      male_health: {
        label: "Men’s health",
        safeResponse:
          "You may coordinate a private and respectful visit to discuss sexual function, fertility, urinary symptoms, or prevention.",
        intakePrompt: "Share your basic details and the general topic you would like to evaluate.",
        bookingCta: "Book private visit",
        whatsappMessage:
          "Hello, I would like to schedule a private men’s urological health consultation.",
      },
      location: {
        label: "Location",
        safeResponse:
          "Care is coordinated in Panama City, Panama. The team can confirm location details and availability before the visit.",
        intakePrompt: "If you wish, leave your details so the team can share coordination information.",
        bookingCta: "Request information",
        whatsappMessage:
          "Hello, I would like location and availability information for a visit with Dr. Brugiati.",
      },
      speak_to_team: {
        label: "Pain or urgent concern",
        safeResponse:
          "If you have acute pain, bleeding, urinary retention, renal colic, fever, chills, or a recent post-operative concern, seek urgent medical care or contact the team immediately. Diagnoses are not provided through this channel.",
        intakePrompt: "Share your basic details so the team can contact you.",
        bookingCta: "Contact the team",
        whatsappMessage:
          "Hello, I would like to speak with the UroPanama team about a possible urgent urology concern.",
      },
    },
  },
};

export function concernFromPath(pathname: string): PatientConcern {
  if (
    pathname.includes("calculos") ||
    pathname.includes("laser") ||
    pathname.includes("nefrolitotomia") ||
    pathname.includes("litotricia")
  ) {
    return "kidney_stones";
  }

  if (
    pathname.includes("prostata") ||
    pathname.includes("biopsia") ||
    pathname.includes("holep") ||
    pathname.includes("rtup") ||
    pathname.includes("adenectomia")
  ) {
    return "prostate";
  }

  if (pathname.includes("uro-oncologia")) {
    return "uro_oncology";
  }

  if (pathname.includes("segunda-opinion")) {
    return "second_opinion";
  }

  if (pathname.includes("ureteroscopia")) {
    return "ureteroscopy";
  }

  if (
    pathname.includes("salud-masculina") ||
    pathname.includes("disfuncion-erectil") ||
    pathname.includes("vasectomia")
  ) {
    return "male_health";
  }

  return "general";
}

export function getConcernLabel(concern: PatientConcern, language: Language) {
  return intakeFlow[language].concerns[concern].label;
}
