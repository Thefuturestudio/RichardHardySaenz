export type SeoPageKey =
  | "home"
  | "about"
  | "specialties"
  | "calculosRenales"
  | "prostata"
  | "uroOncologia"
  | "endourologia"
  | "ureteroscopia"
  | "cirugiaLaparoscopica"
  | "saludMasculina"
  | "segundaOpinion"
  | "booking"
  | "education"
  | "articleHolepProstata"
  | "laserCalculos"
  | "biopsiaProstata"
  | "nefrolitotomiaPercutanea"
  | "cistoscopia"
  | "laparoscopiaRenal"
  | "holep"
  | "rtup"
  | "adenectomiaProstatica"
  | "ureteroscopiaFlexible"
  | "ureteroscopiaSemirrigida"
  | "litotriciaExtracorporea"
  | "disfuncionErectil"
  | "vasectomia"
  | "privacy"
  | "terms"
  | "notFound";

export type SeoMetadata = {
  path: string;
  title: string;
  description: string;
};

export const seoMetadata: Record<SeoPageKey, SeoMetadata> = {
  home: {
    path: "/",
    title: "Dr. Carlos Brugiati | Urólogo en Panamá | UroPanama",
    description:
      "Atención urológica especializada en Panamá con enfoque en próstata, cálculos renales, uro-oncología, endourología y cirugía mínimamente invasiva.",
  },
  about: {
    path: "/dr-carlos-brugiati",
    title: "Dr. Carlos A. Brugiati | Urología, Uro-oncología y Mínima Invasión",
    description:
      "Conozca el enfoque médico del Dr. Carlos A. Brugiati en urología, uro-oncología, endourología y cirugía mínimamente invasiva en Panamá.",
  },
  specialties: {
    path: "/especialidades",
    title: "Especialidades Urológicas en Panamá | UroPanama",
    description:
      "Orientación sobre especialidades urológicas para próstata, riñón, vías urinarias, uro-oncología, endourología y salud masculina.",
  },
  calculosRenales: {
    path: "/calculos-renales",
    title: "Cálculos renales en Panamá | Evaluación urológica especializada",
    description:
      "Información educativa sobre evaluación de cálculos renales, síntomas, estudios y opciones de manejo según cada caso.",
  },
  prostata: {
    path: "/prostata",
    title: "Evaluación de próstata en Panamá | Dr. Carlos Brugiati",
    description:
      "Evaluación médica de síntomas prostáticos, PSA elevado, crecimiento prostático y seguimiento preventivo según cada caso.",
  },
  uroOncologia: {
    path: "/uro-oncologia",
    title: "Uro-oncología en Panamá | Evaluación especializada",
    description:
      "Evaluación especializada de sospechas, diagnósticos o seguimiento relacionado con cáncer urológico, con lenguaje claro y seguro.",
  },
  endourologia: {
    path: "/endourologia",
    title: "Endourología en Panamá | Procedimientos mínimamente invasivos",
    description:
      "Orientación sobre endourología y procedimientos mínimamente invasivos para condiciones seleccionadas de las vías urinarias.",
  },
  ureteroscopia: {
    path: "/ureteroscopia",
    title: "Ureteroscopía en Panamá | Procedimiento urológico especializado",
    description:
      "Guía educativa sobre ureteroscopía, cuándo puede considerarse, preparación general y seguimiento según evaluación médica.",
  },
  cirugiaLaparoscopica: {
    path: "/cirugia-laparoscopica",
    title: "Cirugía laparoscópica urológica en Panamá | Dr. Carlos Brugiati",
    description:
      "Información sobre cirugía laparoscópica urológica, evaluación previa y conversación médica antes de decidir próximos pasos.",
  },
  saludMasculina: {
    path: "/salud-masculina",
    title: "Salud urológica masculina en Panamá | Consulta privada",
    description:
      "Consulta privada para salud urológica masculina, función sexual, fertilidad, síntomas urinarios y prevención.",
  },
  segundaOpinion: {
    path: "/segunda-opinion",
    title: "Segunda opinión urológica en Panamá | Dr. Carlos Brugiati",
    description:
      "Revisión de estudios, diagnósticos previos o recomendaciones quirúrgicas para orientar decisiones médicas con claridad.",
  },
  booking: {
    path: "/agendar-cita",
    title: "Agendar cita con urólogo en Panamá | Dr. Carlos Brugiati",
    description:
      "Coordine una evaluación urológica especializada con el Dr. Carlos A. Brugiati en Ciudad de Panamá.",
  },
  education: {
    path: "/educacion",
    title: "Educación urológica para pacientes | UroPanama",
    description:
      "Guías educativas en español sobre próstata, HoLEP, cálculos renales, endourología, uro-oncología y segunda opinión urológica.",
  },
  articleHolepProstata: {
    path: "/educacion/holep-crecimiento-prostatico",
    title: "HoLEP y próstata agrandada | Guía para pacientes",
    description:
      "Guía educativa sobre HoLEP, crecimiento prostático benigno, síntomas urinarios, estudios que se revisan y preguntas para la consulta.",
  },
  laserCalculos: {
    path: "/laser-calculos-renales",
    title: "Láser para cálculos urinarios en Panamá | UroPanama",
    description:
      "Información educativa sobre uso de láser para cálculos urinarios, evaluación previa y seguimiento según cada caso.",
  },
  biopsiaProstata: {
    path: "/biopsia-prostata",
    title: "Biopsia de próstata en Panamá | Evaluación especializada",
    description:
      "Información sobre biopsia de próstata, cuándo puede indicarse y qué estudios se revisan antes de decidir.",
  },
  nefrolitotomiaPercutanea: {
    path: "/nefrolitotomia-percutanea",
    title: "Nefrolitotomía percutánea en Panamá | Cálculos complejos",
    description:
      "Orientación sobre nefrolitotomía percutánea para ciertos cálculos renales grandes o complejos según evaluación médica.",
  },
  cistoscopia: {
    path: "/cistoscopia",
    title: "Cistoscopía en Panamá | Evaluación de vejiga",
    description:
      "Información sobre cistoscopía para evaluación visual de vejiga y vías urinarias bajas en casos seleccionados.",
  },
  laparoscopiaRenal: {
    path: "/cirugia-laparoscopica-renal",
    title: "Cirugía laparoscópica renal en Panamá | Dr. Carlos Brugiati",
    description:
      "Información sobre cirugía laparoscópica renal y evaluación quirúrgica mínimamente invasiva según cada caso.",
  },
  holep: {
    path: "/holep",
    title: "HoLEP en Panamá | Enucleación prostática con láser",
    description:
      "Información sobre HoLEP o enucleación prostática con láser de Holmio para crecimiento prostático benigno y síntomas urinarios.",
  },
  rtup: {
    path: "/rtup",
    title: "RTUP en Panamá | Resección transuretral de próstata",
    description:
      "Guía educativa sobre RTUP para hiperplasia prostática benigna, obstrucción urinaria y síntomas prostáticos.",
  },
  adenectomiaProstatica: {
    path: "/adenectomia-prostatica",
    title: "Adenectomía prostática laparoscópica o robótica en Panamá",
    description:
      "Información sobre adenectomía prostática laparoscópica o con asistencia robótica para próstatas grandes con obstrucción urinaria.",
  },
  ureteroscopiaFlexible: {
    path: "/ureteroscopia-flexible",
    title: "Ureteroscopia flexible en Panamá | Cirugía intrarrenal",
    description:
      "Información sobre ureteroscopia flexible o cirugía endoscópica intrarrenal para cálculos renales sin incisiones externas.",
  },
  ureteroscopiaSemirrigida: {
    path: "/ureteroscopia-semirrigida",
    title: "Ureteroscopia semirrígida en Panamá | Cálculos en uréter",
    description:
      "Información sobre ureteroscopia semirrígida para cálculos ubicados en el uréter y obstrucciones urinarias.",
  },
  litotriciaExtracorporea: {
    path: "/litotricia-extracorporea",
    title: "Litotricia extracorpórea en Panamá | Ondas de choque",
    description:
      "Información sobre litotricia extracorpórea con ondas de choque para ciertos cálculos urinarios pequeños o medianos.",
  },
  disfuncionErectil: {
    path: "/disfuncion-erectil",
    title: "Disfunción eréctil en Panamá | Evaluación urológica privada",
    description:
      "Evaluación integral y privada de disfunción eréctil, con revisión hormonal, vascular, metabólica y opciones personalizadas.",
  },
  vasectomia: {
    path: "/vasectomia",
    title: "Vasectomía en Panamá | Anticoncepción masculina permanente",
    description:
      "Información sobre vasectomía como método anticonceptivo masculino permanente, ambulatorio y con seguimiento posterior.",
  },
  privacy: {
    path: "/privacidad",
    title: "Privacidad | UroPanama",
    description:
      "Información general sobre el uso de datos enviados por formularios y canales digitales para coordinar citas urológicas.",
  },
  terms: {
    path: "/terminos",
    title: "Términos de uso | UroPanama",
    description:
      "Condiciones generales de uso del sitio web de UroPanama y recordatorios de seguridad médica.",
  },
  notFound: {
    path: "/404",
    title: "Página no encontrada | UroPanama",
    description:
      "La página solicitada no está disponible. Puede volver al inicio o coordinar una consulta urológica.",
  },
};
