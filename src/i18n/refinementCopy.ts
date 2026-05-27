import type { Language, SpecialtyKey } from "./translations";

type DetailExtra = {
  meaningTitle: string;
  meaning: string;
  urgentTitle?: string;
  urgent?: string;
  bringTitle: string;
  bringIntro: string;
  bring: string[];
  evaluateTitle: string;
  nextTitle: string;
  relatedTitle: string;
  related: string[];
};

type BookingCopy = {
  heroBody: string;
  privacyTitle: string;
  privacyBody: string;
  consent: string;
  consentRequired: string;
  conciergeTitle: string;
  conciergeBody: string;
  international: string;
  nextTitle: string;
  next: Array<[string, string]>;
  assistantTitle: string;
  assistantBody: string;
  assistantButton: string;
};

type AssistantCopy = {
  title: string;
  opening: string;
  options: string[];
  responsePrompt: string;
  urgentNotice: string;
  fields: {
    name: string;
    whatsapp: string;
    reason: string;
    firstVisit: string;
    studies: string;
  };
  placeholders: {
    name: string;
    whatsapp: string;
    reason: string;
  };
  summaryTitle: string;
  summaryBody: string;
  sendWhatsapp: string;
};

type ConciergeCopy = {
  title: string;
  shortTitle: string;
  bookShort: string;
  body: string;
  note: string;
};

type RefinementCopy = {
  booking: BookingCopy;
  assistant: AssistantCopy;
  concierge: ConciergeCopy;
  whatsappMessages: Record<string, string>;
  detailLabels: {
    meaning: string;
    when: string;
    urgent: string;
    evaluate: string;
    bring: string;
    next: string;
    related: string;
    faqs: string;
  };
  detailExtras: Record<SpecialtyKey, DetailExtra>;
};

export const refinementCopy: Record<Language, RefinementCopy> = {
  es: {
    concierge: {
      title: "¿Desea coordinar una consulta?",
      shortTitle: "Coordinar consulta",
      bookShort: "Agendar",
      body: "Solicite disponibilidad o escriba por WhatsApp.",
      note: "Horarios sujetos a disponibilidad.",
    },
    whatsappMessages: {
      "/": "Hola, quisiera agendar una consulta con el Dr. Brugiati.",
      "/agendar-cita": "Hola, quisiera coordinar una cita con el Dr. Brugiati.",
      "/calculos-renales":
        "Hola, quisiera agendar una evaluación por cálculos renales con el Dr. Brugiati.",
      "/prostata":
        "Hola, quisiera agendar una evaluación prostática con el Dr. Brugiati.",
      "/segunda-opinion":
        "Hola, quisiera solicitar una segunda opinión urológica. Tengo estudios previos disponibles.",
      "/ureteroscopia": "Hola, quisiera consultar sobre ureteroscopía con el Dr. Brugiati.",
      "/laser-calculos-renales":
        "Hola, quisiera consultar sobre láser para cálculos urinarios con el Dr. Brugiati.",
      "/biopsia-prostata":
        "Hola, quisiera consultar sobre biopsia de próstata con el Dr. Brugiati.",
      "/nefrolitotomia-percutanea":
        "Hola, quisiera consultar sobre nefrolitotomía percutánea para cálculos renales.",
      "/cistoscopia":
        "Hola, quisiera consultar sobre cistoscopía y síntomas urinarios.",
      "/cirugia-laparoscopica-renal":
        "Hola, quisiera consultar sobre cirugía laparoscópica renal con el Dr. Brugiati.",
      "/holep": "Hola, quisiera consultar sobre HoLEP con el Dr. Brugiati.",
      "/rtup": "Hola, quisiera consultar sobre RTUP con el Dr. Brugiati.",
      "/adenectomia-prostatica":
        "Hola, quisiera consultar sobre adenectomía prostática laparoscópica o robótica.",
      "/ureteroscopia-flexible":
        "Hola, quisiera consultar sobre ureteroscopia flexible para cálculos renales.",
      "/ureteroscopia-semirrigida":
        "Hola, quisiera consultar sobre ureteroscopia semirrígida para cálculos en uréter.",
      "/litotricia-extracorporea":
        "Hola, quisiera consultar sobre litotricia extracorpórea para cálculos urinarios.",
      "/disfuncion-erectil":
        "Hola, quisiera agendar una consulta privada por disfunción eréctil.",
      "/vasectomia": "Hola, quisiera consultar sobre vasectomía con el Dr. Brugiati.",
      "/uro-oncologia":
        "Hola, quisiera solicitar una evaluación uro-oncológica con el Dr. Brugiati.",
      "/endourologia": "Hola, quisiera consultar sobre endourología.",
      "/cirugia-laparoscopica":
        "Hola, quisiera consultar sobre cirugía laparoscópica urológica.",
      "/salud-masculina":
        "Hola, quisiera agendar una consulta privada de salud urológica masculina.",
    },
    booking: {
      heroBody:
        "Escríbanos por WhatsApp o envíe una solicitud. El equipo confirmará la disponibilidad antes de agendar la cita.",
      privacyTitle: "Privacidad desde el primer contacto",
      privacyBody:
        "La información se utiliza solo para responder la solicitud y coordinar la atención. No sustituye una evaluación médica.",
      consent:
        "Acepto que mi información sea utilizada para coordinar una cita y preparar un resumen para el equipo. Este formulario no sustituye una evaluación médica.",
      consentRequired: "Debe aceptar el uso de la información para coordinar la cita.",
      conciergeTitle: "Canales de coordinación",
      conciergeBody:
        "WhatsApp es la vía más directa. El formulario sirve para dejar una solicitud ordenada; el equipo confirma disponibilidad antes de reservar.",
      international: "Apoyo para pacientes nacionales e internacionales.",
      nextTitle: "Qué ocurre después",
      next: [
        ["Envía su solicitud", "Comparta nombre, WhatsApp, motivo principal y preferencia de horario."],
        ["Revisión del equipo", "El equipo revisa disponibilidad y la información inicial."],
        ["Confirmación", "Recibirá próximos pasos por WhatsApp, llamada o el canal indicado."],
      ],
      assistantTitle: "Asistente de orientación",
      assistantBody:
        "Puede organizar información inicial y ayudarle a enviar una consulta por WhatsApp. No realiza diagnósticos, no interpreta estudios y no confirma citas.",
      assistantButton: "Abrir asistente",
    },
    assistant: {
      title: "Asistente digital de UroPanama",
      opening:
        "Hola, soy el asistente digital de UroPanama. Puedo ayudarle a preparar su consulta o coordinar una cita. No realizo diagnósticos médicos.",
      options: [
        "Agendar cita",
        "Cálculos renales",
        "Síntomas de próstata",
        "Segunda opinión",
        "Ubicación",
        "Hablar con el equipo",
      ],
      responsePrompt:
        "Puedo ayudarle a organizar la información inicial. Complete estos datos si desea preparar una solicitud para el equipo.",
      urgentNotice:
        "Si presenta dolor intenso persistente, fiebre, vómitos, sangrado importante o dificultad para orinar, acuda a un servicio médico de urgencia.",
      fields: {
        name: "Nombre",
        whatsapp: "WhatsApp",
        reason: "Motivo de consulta",
        firstVisit: "¿Es primera consulta?",
        studies: "¿Tiene estudios disponibles?",
      },
      placeholders: {
        name: "Nombre completo",
        whatsapp: "+507...",
        reason: "Cuéntenos brevemente el motivo",
      },
      summaryTitle: "Resumen para coordinación",
      summaryBody:
        "Gracias. Puede solicitar una cita o enviar esta información por WhatsApp para que el equipo confirme disponibilidad.",
      sendWhatsapp: "Enviar por WhatsApp",
    },
    detailLabels: {
      meaning: "Qué significa",
      when: "Motivos frecuentes de consulta",
      urgent: "Cuándo buscar atención urgente",
      evaluate: "Qué puede evaluar el médico",
      bring: "Qué traer",
      next: "Posibles próximos pasos",
      related: "Procedimientos relacionados",
      faqs: "Preguntas frecuentes",
    },
    detailExtras: {
      calculosRenales: {
        meaningTitle: "Un camino claro para entender el cálculo y sus opciones.",
        meaning:
          "Los cálculos pueden ubicarse en el riñón o desplazarse hacia el uréter. La evaluación médica permite revisar síntomas, estudios de imagen y factores que orientan el seguimiento o tratamiento según cada caso.",
        urgentTitle: "Busque atención urgente si los síntomas cambian rápido.",
        urgent:
          "Fiebre, dolor intenso persistente, vómitos, debilidad marcada, dificultad para orinar o empeoramiento rápido requieren atención médica urgente.",
        bringTitle: "Estudios útiles para revisar",
        bringIntro: "Si los tiene disponibles, lleve:",
        bring: [
          "Tomografía, ultrasonido o radiografías",
          "Resultados de orina y laboratorios",
          "Informes médicos previos",
          "Medicamentos actuales",
          "Fechas de episodios de dolor o infección",
        ],
        evaluateTitle: "Durante la consulta se puede revisar tamaño, ubicación y síntomas.",
        nextTitle: "El manejo depende del tamaño, ubicación, síntomas y condición general.",
        relatedTitle: "Opciones que pueden considerarse según valoración",
        related: ["Ureteroscopía", "Láser para cálculos", "Nefrolitotomía percutánea", "Seguimiento preventivo"],
      },
      prostata: {
        meaningTitle: "Evaluación prostática con privacidad y claridad.",
        meaning:
          "Los síntomas urinarios, el PSA elevado o el crecimiento prostático no significan lo mismo en todos los pacientes. La consulta permite revisar antecedentes, estudios disponibles y definir si corresponde seguimiento, laboratorios, imagen o biopsia.",
        bringTitle: "Información que ayuda a orientar la consulta",
        bringIntro: "Puede traer:",
        bring: ["PSA y laboratorios previos", "Ultrasonidos o resonancias", "Lista de medicamentos", "Antecedentes familiares", "Preguntas sobre síntomas urinarios"],
        evaluateTitle: "Se revisan síntomas urinarios, PSA, antecedentes y objetivos de cuidado.",
        nextTitle: "Los siguientes pasos se definen de forma individual.",
        relatedTitle: "Evaluaciones relacionadas",
        related: ["Revisión de PSA", "Evaluación de crecimiento prostático", "Biopsia de próstata si corresponde", "Seguimiento preventivo"],
      },
      uroOncologia: {
        meaningTitle: "Una revisión seria, calmada y orientada por evidencia.",
        meaning:
          "La uro-oncología aborda sospechas, diagnósticos o seguimiento de condiciones oncológicas del sistema urinario y reproductor masculino. La consulta se enfoca en revisar estudios y explicar opciones sin prometer resultados.",
        bringTitle: "Documentos importantes",
        bringIntro: "Si están disponibles, lleve:",
        bring: ["Biopsias o informes patológicos", "Tomografías, resonancias o ultrasonidos", "Laboratorios y marcadores", "Resumen de tratamientos previos", "Recomendaciones quirúrgicas previas"],
        evaluateTitle: "Se revisan estudios, diagnóstico, etapa de evaluación y dudas principales.",
        nextTitle: "Puede requerir estudios adicionales o una ruta de seguimiento especializada.",
        relatedTitle: "Áreas relacionadas",
        related: ["Próstata", "Riñón", "Vejiga", "Segunda opinión urológica"],
      },
      segundaOpinion: {
        meaningTitle: "Claridad antes de tomar una decisión médica.",
        meaning:
          "Una segunda opinión ayuda a revisar diagnósticos, estudios previos o recomendaciones quirúrgicas. El objetivo es que el paciente entienda su situación y las preguntas clave para decidir los próximos pasos.",
        bringTitle: "Qué traer para una revisión más útil",
        bringIntro: "Prepare, si los tiene:",
        bring: ["Informes médicos previos", "Imágenes en disco o enlace", "Laboratorios recientes", "Biopsias o patología", "Lista de preguntas y dudas"],
        evaluateTitle: "Se revisa la información disponible y se explican puntos pendientes.",
        nextTitle: "La revisión puede confirmar, aclarar o ampliar opciones según el caso.",
        relatedTitle: "Motivos frecuentes",
        related: ["Diagnóstico reciente", "Recomendación quirúrgica", "Dudas sobre estudios", "Seguimiento oncológico"],
      },
      endourologia: {
        meaningTitle: "Una categoría de procedimientos de mínima invasión.",
        meaning:
          "La endourología utiliza instrumentos especializados para evaluar o tratar condiciones de las vías urinarias. Puede relacionarse con cálculos, obstrucciones, cistoscopía o ureteroscopía según valoración médica.",
        bringTitle: "Información útil",
        bringIntro: "Puede traer:",
        bring: ["Estudios de imagen", "Laboratorios", "Informe de procedimientos previos", "Medicamentos actuales"],
        evaluateTitle: "Se revisa si un procedimiento endourológico corresponde en su caso.",
        nextTitle: "La indicación depende de síntomas, estudios y condición clínica.",
        relatedTitle: "Procedimientos relacionados",
        related: ["Ureteroscopía", "Cistoscopía", "Láser para cálculos", "Seguimiento posterior"],
      },
      ureteroscopia: {
        meaningTitle: "Un procedimiento específico dentro de la endourología.",
        meaning:
          "La ureteroscopía permite evaluar o tratar el uréter y ciertas condiciones del sistema urinario mediante instrumentos especializados. Puede indicarse en determinados casos de cálculos u obstrucción.",
        bringTitle: "Estudios que ayudan a definir indicación",
        bringIntro: "Si los tiene, lleve:",
        bring: ["Tomografía o ultrasonido", "Laboratorios", "Informe de urgencias", "Lista de medicamentos"],
        evaluateTitle: "Se revisa ubicación, tamaño del cálculo, síntomas y seguridad del procedimiento.",
        nextTitle: "La preparación y seguimiento se explican durante la consulta si corresponde.",
        relatedTitle: "Procedimientos relacionados",
        related: ["Láser para cálculos", "Seguimiento por imágenes", "Cistoscopía", "Evaluación de vías urinarias"],
      },
      cirugiaLaparoscopica: {
        meaningTitle: "Mínima invasión cuando el diagnóstico lo permite.",
        meaning:
          "La cirugía laparoscópica puede formar parte de algunas rutas quirúrgicas urológicas. La indicación depende del diagnóstico, estudios, condición general y conversación médica detallada.",
        bringTitle: "Qué traer",
        bringIntro: "Puede llevar:",
        bring: ["Estudios de imagen", "Evaluaciones preoperatorias", "Informes quirúrgicos previos", "Medicamentos actuales"],
        evaluateTitle: "Se revisan diagnóstico, opciones de abordaje y riesgos generales según el caso.",
        nextTitle: "El plan se define sólo después de valoración médica completa.",
        relatedTitle: "Áreas relacionadas",
        related: ["Cirugía renal", "Uro-oncología", "Segunda opinión", "Seguimiento especializado"],
      },
      saludMasculina: {
        meaningTitle: "Una consulta privada, humana y sin juicio.",
        meaning:
          "La salud masculina incluye función sexual, fertilidad, molestias urinarias y prevención. La evaluación se realiza con discreción, escuchando síntomas, antecedentes y objetivos del paciente.",
        bringTitle: "Información útil",
        bringIntro: "Puede traer:",
        bring: ["Medicamentos actuales", "Laboratorios previos", "Antecedentes relevantes", "Preguntas que desea resolver"],
        evaluateTitle: "Se revisan síntomas, salud general, medicamentos y estudios disponibles.",
        nextTitle: "Puede requerir laboratorios, seguimiento o evaluación específica según cada caso.",
        relatedTitle: "Temas frecuentes",
        related: ["Función sexual", "Fertilidad masculina", "Síntomas urinarios", "Prevención urológica"],
      },
    },
  },
  en: {
    concierge: {
      title: "Would you like to coordinate a visit?",
      shortTitle: "Coordinate visit",
      bookShort: "Book",
      body: "Request availability or contact us on WhatsApp.",
      note: "Times subject to availability.",
    },
    whatsappMessages: {
      "/": "Hello, I would like to book a visit with Dr. Brugiati.",
      "/agendar-cita": "Hello, I would like to coordinate a visit with Dr. Brugiati.",
      "/calculos-renales":
        "Hello, I would like to book an evaluation for kidney stones with Dr. Brugiati.",
      "/prostata": "Hello, I would like to book a prostate evaluation with Dr. Brugiati.",
      "/segunda-opinion":
        "Hello, I would like to request a urology second opinion. I have previous studies available.",
      "/ureteroscopia": "Hello, I would like to ask about ureteroscopy with Dr. Brugiati.",
      "/laser-calculos-renales":
        "Hello, I would like to ask about laser treatment for urinary stones with Dr. Brugiati.",
      "/biopsia-prostata":
        "Hello, I would like to ask about prostate biopsy with Dr. Brugiati.",
      "/nefrolitotomia-percutanea":
        "Hello, I would like to ask about percutaneous nephrolithotomy for kidney stones.",
      "/cistoscopia":
        "Hello, I would like to ask about cystoscopy and urinary symptoms.",
      "/cirugia-laparoscopica-renal":
        "Hello, I would like to ask about renal laparoscopic surgery with Dr. Brugiati.",
      "/holep": "Hello, I would like to ask about HoLEP with Dr. Brugiati.",
      "/rtup": "Hello, I would like to ask about TURP with Dr. Brugiati.",
      "/adenectomia-prostatica":
        "Hello, I would like to ask about laparoscopic or robotic prostate adenectomy.",
      "/ureteroscopia-flexible":
        "Hello, I would like to ask about flexible ureteroscopy for kidney stones.",
      "/ureteroscopia-semirrigida":
        "Hello, I would like to ask about semi-rigid ureteroscopy for ureter stones.",
      "/litotricia-extracorporea":
        "Hello, I would like to ask about shock wave lithotripsy for urinary stones.",
      "/disfuncion-erectil":
        "Hello, I would like to book a private consultation for erectile dysfunction.",
      "/vasectomia": "Hello, I would like to ask about vasectomy with Dr. Brugiati.",
      "/uro-oncologia":
        "Hello, I would like to request a uro-oncology evaluation with Dr. Brugiati.",
      "/endourologia": "Hello, I would like to ask about endourology.",
      "/cirugia-laparoscopica":
        "Hello, I would like to ask about laparoscopic urologic surgery.",
      "/salud-masculina":
        "Hello, I would like to book a private men's urologic health consultation.",
    },
    booking: {
      heroBody:
        "Message us on WhatsApp or send a request. The team confirms availability before booking the visit.",
      privacyTitle: "Privacy from the first contact",
      privacyBody:
        "Information is used only to respond to the request and coordinate care. It does not replace medical evaluation.",
      consent:
        "I agree that my information may be used to coordinate a visit and prepare a summary for the team. This form does not replace medical evaluation.",
      consentRequired: "Please accept information use to coordinate the visit.",
      conciergeTitle: "Coordination channels",
      conciergeBody:
        "WhatsApp is the most direct route. The form is for an organized request; the team confirms availability before booking.",
      international: "Support for local and international patients.",
      nextTitle: "What happens next",
      next: [
        ["Send your request", "Share your name, WhatsApp, main reason, and preferred time."],
        ["Team review", "The team reviews availability and the initial information."],
        ["Confirmation", "You receive next steps by WhatsApp, phone, or the selected channel."],
      ],
      assistantTitle: "Guidance assistant",
      assistantBody:
        "It can organize initial information and help you send a WhatsApp request. It does not diagnose, interpret studies, or confirm visits.",
      assistantButton: "Open assistant",
    },
    assistant: {
      title: "UroPanama digital assistant",
      opening:
        "Hello, I am UroPanama's digital assistant. I can help you prepare for consultation or coordinate a visit. I do not provide medical diagnoses.",
      options: ["Book visit", "Kidney stones", "Prostate symptoms", "Second opinion", "Location", "Talk to the team"],
      responsePrompt:
        "I can help organize initial information. Complete these details if you want to prepare a request for the team.",
      urgentNotice:
        "If you have persistent severe pain, fever, vomiting, significant bleeding, or difficulty urinating, seek urgent medical care.",
      fields: {
        name: "Name",
        whatsapp: "WhatsApp",
        reason: "Reason for consultation",
        firstVisit: "Is this your first visit?",
        studies: "Do you have studies available?",
      },
      placeholders: {
        name: "Full name",
        whatsapp: "+507...",
        reason: "Briefly describe the reason",
      },
      summaryTitle: "Coordination summary",
      summaryBody:
        "Thank you. You may book a visit or send this information by WhatsApp so the team can confirm availability.",
      sendWhatsapp: "Send by WhatsApp",
    },
    detailLabels: {
      meaning: "What it means",
      when: "Common reasons to consult",
      urgent: "When to seek urgent care",
      evaluate: "What the doctor may evaluate",
      bring: "What to bring",
      next: "Possible next steps",
      related: "Related procedures",
      faqs: "Frequently asked questions",
    },
    detailExtras: {
      calculosRenales: {
        meaningTitle: "A clear path to understand the stone and possible options.",
        meaning:
          "Stones may be located in the kidney or move into the ureter. Medical evaluation helps review symptoms, imaging, and factors that guide follow-up or treatment based on each case.",
        urgentTitle: "Seek urgent care if symptoms change quickly.",
        urgent:
          "Fever, persistent severe pain, vomiting, marked weakness, difficulty urinating, or rapidly worsening symptoms require urgent medical care.",
        bringTitle: "Useful studies to review",
        bringIntro: "If available, bring:",
        bring: ["CT scan, ultrasound, or X-rays", "Urine tests and lab results", "Previous medical reports", "Current medications", "Dates of pain or infection episodes"],
        evaluateTitle: "During consultation, size, location, and symptoms can be reviewed.",
        nextTitle: "Management depends on size, location, symptoms, and general condition.",
        relatedTitle: "Options that may be considered after evaluation",
        related: ["Ureteroscopy", "Laser for stones", "Percutaneous nephrolithotomy", "Preventive follow-up"],
      },
      prostata: {
        meaningTitle: "Prostate evaluation with privacy and clarity.",
        meaning:
          "Urinary symptoms, elevated PSA, or prostate enlargement do not mean the same thing for every patient. Consultation reviews history, available studies, and whether follow-up, labs, imaging, or biopsy may apply.",
        bringTitle: "Information that helps guide the visit",
        bringIntro: "You may bring:",
        bring: ["PSA and previous labs", "Ultrasound or MRI studies", "Medication list", "Family history", "Questions about urinary symptoms"],
        evaluateTitle: "Urinary symptoms, PSA, history, and care goals are reviewed.",
        nextTitle: "Next steps are defined individually.",
        relatedTitle: "Related evaluations",
        related: ["PSA review", "Evaluation of prostate enlargement", "Prostate biopsy if appropriate", "Preventive follow-up"],
      },
      uroOncologia: {
        meaningTitle: "A serious, calm, evidence-guided review.",
        meaning:
          "Uro-oncology addresses suspected diagnoses, confirmed diagnoses, or follow-up of cancer-related urologic conditions. The visit focuses on reviewing studies and explaining options without promising outcomes.",
        bringTitle: "Important documents",
        bringIntro: "If available, bring:",
        bring: ["Biopsy or pathology reports", "CT, MRI, or ultrasound studies", "Labs and markers", "Summary of prior treatments", "Prior surgical recommendations"],
        evaluateTitle: "Studies, diagnosis, evaluation stage, and main questions are reviewed.",
        nextTitle: "Additional studies or specialized follow-up may be required.",
        relatedTitle: "Related areas",
        related: ["Prostate", "Kidney", "Bladder", "Urology second opinion"],
      },
      segundaOpinion: {
        meaningTitle: "Clarity before making a medical decision.",
        meaning:
          "A second opinion helps review diagnoses, previous studies, or surgical recommendations. The goal is for the patient to understand the situation and key questions before deciding next steps.",
        bringTitle: "What to bring for a more useful review",
        bringIntro: "Prepare, if available:",
        bring: ["Previous medical reports", "Imaging in disc or link format", "Recent labs", "Biopsy or pathology", "List of questions and concerns"],
        evaluateTitle: "Available information is reviewed and pending questions are explained.",
        nextTitle: "The review may confirm, clarify, or broaden options depending on the case.",
        relatedTitle: "Common reasons",
        related: ["Recent diagnosis", "Surgical recommendation", "Questions about studies", "Oncology follow-up"],
      },
      endourologia: {
        meaningTitle: "A category of minimally invasive procedures.",
        meaning:
          "Endourology uses specialized instruments to evaluate or treat urinary tract conditions. It may relate to stones, obstruction, cystoscopy, or ureteroscopy depending on medical evaluation.",
        bringTitle: "Useful information",
        bringIntro: "You may bring:",
        bring: ["Imaging studies", "Lab results", "Prior procedure reports", "Current medications"],
        evaluateTitle: "The visit reviews whether an endourologic procedure applies to your case.",
        nextTitle: "Indication depends on symptoms, studies, and clinical condition.",
        relatedTitle: "Related procedures",
        related: ["Ureteroscopy", "Cystoscopy", "Laser for stones", "Post-procedure follow-up"],
      },
      ureteroscopia: {
        meaningTitle: "A specific procedure within endourology.",
        meaning:
          "Ureteroscopy allows evaluation or treatment of the ureter and certain urinary system conditions using specialized instruments. It may be indicated in selected stone or obstruction cases.",
        bringTitle: "Studies that help define indication",
        bringIntro: "If available, bring:",
        bring: ["CT scan or ultrasound", "Lab results", "Emergency report", "Medication list"],
        evaluateTitle: "Location, stone size, symptoms, and procedure safety are reviewed.",
        nextTitle: "Preparation and follow-up are explained during consultation if appropriate.",
        relatedTitle: "Related procedures",
        related: ["Laser for stones", "Imaging follow-up", "Cystoscopy", "Urinary tract evaluation"],
      },
      cirugiaLaparoscopica: {
        meaningTitle: "Minimally invasive surgery when the diagnosis allows it.",
        meaning:
          "Laparoscopic surgery may be part of some urologic surgical pathways. Indication depends on diagnosis, studies, general condition, and detailed medical discussion.",
        bringTitle: "What to bring",
        bringIntro: "You may bring:",
        bring: ["Imaging studies", "Preoperative evaluations", "Previous surgical reports", "Current medications"],
        evaluateTitle: "Diagnosis, approach options, and general risks are reviewed by case.",
        nextTitle: "The plan is defined only after full medical evaluation.",
        relatedTitle: "Related areas",
        related: ["Kidney surgery", "Uro-oncology", "Second opinion", "Specialized follow-up"],
      },
      saludMasculina: {
        meaningTitle: "A private, human, nonjudgmental consultation.",
        meaning:
          "Men's health includes sexual function, fertility, urinary concerns, and prevention. Evaluation is discreet and reviews symptoms, history, and patient goals.",
        bringTitle: "Useful information",
        bringIntro: "You may bring:",
        bring: ["Current medications", "Previous labs", "Relevant history", "Questions you want to resolve"],
        evaluateTitle: "Symptoms, general health, medications, and available studies are reviewed.",
        nextTitle: "Labs, follow-up, or specific evaluation may be required depending on each case.",
        relatedTitle: "Common topics",
        related: ["Sexual function", "Male fertility", "Urinary symptoms", "Urologic prevention"],
      },
    },
  },
};
