import type { Language } from "./translations";

export const pageUxImprovements: Record<
  Language,
  {
    about: {
      identityEyebrow: string;
      identityTitle: string;
      identityBody: string;
      statCards: Array<{ value: string; label: string; body: string }>;
      principlesTitle: string;
      principlesBody: string;
      principles: Array<{ title: string; body: string }>;
      consultationTitle: string;
      consultationBody: string;
      consultationSteps: Array<{ title: string; body: string }>;
      credentialsNote: string;
      profileCaption: string;
    };
    booking: {
      quickTitle: string;
      quickBody: string;
      quickItems: Array<{ title: string; body: string }>;
      panelTitle: string;
      panelBody: string;
      panelSteps: string[];
      assuranceTitle: string;
      assuranceBody: string;
      preparationTitle: string;
      preparationBody: string;
    };
    secondOpinion: {
      reviewEyebrow: string;
      reviewTitle: string;
      reviewBody: string;
      reviewItems: Array<{ title: string; body: string }>;
      documentTitle: string;
      documentBody: string;
      documentItems: string[];
      decisionTitle: string;
      decisionSteps: Array<{ title: string; body: string }>;
      safetyNote: string;
    };
  }
> = {
  es: {
    about: {
      identityEyebrow: "Práctica especializada",
      identityTitle: "Una consulta pensada para claridad, privacidad y decisiones médicas responsables.",
      identityBody:
        "La experiencia del paciente debe sentirse ordenada desde el primer contacto: entender el motivo de consulta, revisar estudios disponibles y explicar próximos pasos con lenguaje claro.",
      statCards: [
        {
          value: "10+",
          label: "Años de experiencia",
          body: "Experiencia clínica y quirúrgica en urología compleja.",
        },
        {
          value: "HoLEP",
          label: "Láser prostático",
          body: "Entrenamiento internacional en enucleación prostática con láser.",
        },
        {
          value: "AUA",
          label: "EAU y SPU",
          body: "Membresías urológicas nacionales e internacionales.",
        },
      ],
      principlesTitle: "Cómo se estructura la atención",
      principlesBody:
        "El objetivo es que el paciente salga de la consulta con una comprensión más clara de su caso y de la información necesaria para decidir.",
      principles: [
        {
          title: "Escucha clínica",
          body: "Se ordena el motivo de consulta, antecedentes, síntomas y preocupaciones principales.",
        },
        {
          title: "Revisión de estudios",
          body: "Se revisan laboratorios, imágenes o informes disponibles cuando corresponda.",
        },
        {
          title: "Explicación médica",
          body: "Se conversa qué hallazgos importan, qué falta revisar y qué opciones pueden considerarse.",
        },
      ],
      consultationTitle: "Qué puede esperar durante la consulta",
      consultationBody:
        "Una conversación médica privada, orientada a entender el caso antes de definir estudios, seguimiento u opciones de manejo.",
      consultationSteps: [
        {
          title: "Preparación",
          body: "Puede traer estudios previos, medicamentos y preguntas principales.",
        },
        {
          title: "Evaluación",
          body: "El médico revisa síntomas, antecedentes e información disponible.",
        },
        {
          title: "Orientación",
          body: "Se explican posibles próximos pasos según la valoración médica.",
        },
        {
          title: "Seguimiento",
          body: "Si corresponde, se organiza control, estudios o revisión posterior.",
        },
      ],
      credentialsNote:
        "Formación en centros de referencia de Panamá, Argentina, España y Reino Unido, con énfasis en uro-oncología, endourología, HoLEP, cirugía percutánea y mínima invasión.",
      profileCaption: "Dr. Carlos A. Brugiati",
    },
    booking: {
      quickTitle: "Coordinar una cita debe sentirse simple.",
      quickBody:
        "El formulario reúne solo la información inicial necesaria para que el equipo pueda responder con disponibilidad y próximos pasos.",
      quickItems: [
        {
          title: "Solicitud",
          body: "Comparta datos de contacto y motivo principal de consulta.",
        },
        {
          title: "Confirmación",
          body: "El equipo revisa disponibilidad y se comunica por el canal indicado.",
        },
        {
          title: "Preparación",
          body: "Recibirá orientación sobre estudios o información útil para traer.",
        },
      ],
      panelTitle: "Coordinación privada",
      panelBody:
        "Use el formulario para una solicitud ordenada o WhatsApp si prefiere una conversación directa. El equipo revisa y confirma manualmente.",
      panelSteps: [
        "No use este formulario para emergencias.",
        "La cita queda sujeta a confirmación del equipo o flujo HuliPractice.",
        "Los estudios se preparan para la consulta; no se suben documentos sensibles desde esta página.",
      ],
      assuranceTitle: "Privacidad y discreción",
      assuranceBody:
        "Los datos se utilizan para responder la solicitud, preparar un resumen y coordinar la atención. El sitio no realiza diagnósticos ni reemplaza la evaluación médica.",
      preparationTitle: "Llegar mejor preparado",
      preparationBody:
        "Si ya tiene estudios, informes, biopsias, imágenes o laboratorios, llevarlos organizados ayuda a aprovechar mejor el tiempo de consulta.",
    },
    secondOpinion: {
      reviewEyebrow: "Revisión médica especializada",
      reviewTitle: "Una segunda opinión debe ordenar la información antes de orientar decisiones.",
      reviewBody:
        "Esta página está pensada para pacientes que ya tienen estudios, un diagnóstico previo, una recomendación quirúrgica o dudas importantes antes de avanzar.",
      reviewItems: [
        {
          title: "Diagnóstico o sospecha",
          body: "Se revisa qué información respalda el diagnóstico o qué datos aún necesitan aclararse.",
        },
        {
          title: "Recomendación previa",
          body: "Se analiza la recomendación recibida y qué preguntas conviene resolver antes de decidir.",
        },
        {
          title: "Próximos pasos",
          body: "La orientación depende del contexto clínico y de los estudios disponibles.",
        },
      ],
      documentTitle: "Documentos útiles para revisar",
      documentBody:
        "No es obligatorio tener todo para solicitar la cita, pero estos materiales pueden hacer la revisión más completa.",
      documentItems: [
        "Informes médicos y diagnóstico previo.",
        "Estudios de imagen y reportes.",
        "Laboratorios recientes.",
        "Biopsia o patología si existe.",
        "Lista de medicamentos actuales.",
        "Preguntas que desea resolver.",
      ],
      decisionTitle: "Cómo se conversa la decisión",
      decisionSteps: [
        {
          title: "Comprender",
          body: "Primero se busca entender el caso y la razón de la recomendación previa.",
        },
        {
          title: "Contrastar",
          body: "Luego se revisa si estudios, informes y síntomas cuentan la misma historia clínica.",
        },
        {
          title: "Orientar",
          body: "Finalmente se explican próximos pasos posibles, según evaluación médica.",
        },
      ],
      safetyNote:
        "Una segunda opinión no sustituye atención de urgencia y no garantiza que una recomendación previa cambie.",
    },
  },
  en: {
    about: {
      identityEyebrow: "Specialist practice",
      identityTitle: "A visit designed for clarity, privacy, and responsible medical decisions.",
      identityBody:
        "The patient experience should feel organized from the first contact: understand the concern, review available studies, and explain next steps in clear language.",
      statCards: [
        {
          value: "10+",
          label: "Years of experience",
          body: "Clinical and surgical experience in complex urology.",
        },
        {
          value: "HoLEP",
          label: "Prostate laser",
          body: "International training in Holmium laser prostate enucleation.",
        },
        {
          value: "AUA",
          label: "EAU and SPU",
          body: "National and international urology memberships.",
        },
      ],
      principlesTitle: "How care is structured",
      principlesBody:
        "The goal is for patients to leave the visit with a clearer understanding of their case and the information needed to decide.",
      principles: [
        {
          title: "Clinical listening",
          body: "The reason for consultation, history, symptoms, and main concerns are organized.",
        },
        {
          title: "Study review",
          body: "Labs, imaging, or available reports are reviewed when relevant.",
        },
        {
          title: "Medical explanation",
          body: "The visit clarifies which findings matter, what may be missing, and what options may be considered.",
        },
      ],
      consultationTitle: "What to expect during the visit",
      consultationBody:
        "A private medical conversation focused on understanding the case before defining studies, follow-up, or management options.",
      consultationSteps: [
        {
          title: "Preparation",
          body: "You may bring previous studies, medications, and main questions.",
        },
        {
          title: "Evaluation",
          body: "The doctor reviews symptoms, history, and available information.",
        },
        {
          title: "Guidance",
          body: "Possible next steps are explained according to medical evaluation.",
        },
        {
          title: "Follow-up",
          body: "When appropriate, follow-up, studies, or later review are organized.",
        },
      ],
      credentialsNote:
        "Training in reference centers across Panama, Argentina, Spain, and the United Kingdom, with emphasis on uro-oncology, endourology, HoLEP, percutaneous surgery, and minimally invasive care.",
      profileCaption: "Dr. Carlos A. Brugiati",
    },
    booking: {
      quickTitle: "Coordinating a visit should feel simple.",
      quickBody:
        "The form gathers only the initial information needed so the team can respond with availability and next steps.",
      quickItems: [
        {
          title: "Request",
          body: "Share contact details and your main reason for consultation.",
        },
        {
          title: "Confirmation",
          body: "The team reviews availability and contacts you through your chosen channel.",
        },
        {
          title: "Preparation",
          body: "You receive guidance on studies or information that may be useful to bring.",
        },
      ],
      panelTitle: "Private coordination",
      panelBody:
        "Use the form for an organized request or WhatsApp if you prefer a direct conversation. The team reviews and confirms manually.",
      panelSteps: [
        "Do not use this form for emergencies.",
        "Visits are subject to team confirmation or the HuliPractice workflow.",
        "Studies are prepared for the visit; sensitive documents are not uploaded from this page.",
      ],
      assuranceTitle: "Privacy and discretion",
      assuranceBody:
        "Data is used to respond to the request, prepare a summary, and coordinate care. The website does not provide diagnoses or replace medical evaluation.",
      preparationTitle: "Arrive better prepared",
      preparationBody:
        "If you already have studies, reports, biopsies, imaging, or labs, bringing them organized helps make the visit more useful.",
    },
    secondOpinion: {
      reviewEyebrow: "Specialist medical review",
      reviewTitle: "A second opinion should organize the information before guiding decisions.",
      reviewBody:
        "This page is designed for patients who already have studies, a prior diagnosis, a surgical recommendation, or important questions before moving forward.",
      reviewItems: [
        {
          title: "Diagnosis or suspicion",
          body: "The visit reviews what supports the diagnosis or what still needs clarification.",
        },
        {
          title: "Previous recommendation",
          body: "The recommendation received is reviewed along with questions worth resolving before deciding.",
        },
        {
          title: "Next steps",
          body: "Guidance depends on the clinical context and available studies.",
        },
      ],
      documentTitle: "Helpful documents to review",
      documentBody:
        "You do not need everything to request the visit, but these materials can make the review more complete.",
      documentItems: [
        "Medical reports and prior diagnosis.",
        "Imaging studies and reports.",
        "Recent labs.",
        "Biopsy or pathology if available.",
        "Current medication list.",
        "Questions you want answered.",
      ],
      decisionTitle: "How the decision is discussed",
      decisionSteps: [
        {
          title: "Understand",
          body: "First, the case and reason for the previous recommendation are clarified.",
        },
        {
          title: "Compare",
          body: "Then studies, reports, and symptoms are reviewed to see whether they tell the same clinical story.",
        },
        {
          title: "Guide",
          body: "Finally, possible next steps are explained according to medical evaluation.",
        },
      ],
      safetyNote:
        "A second opinion does not replace urgent care and does not guarantee that a previous recommendation will change.",
    },
  },
};
