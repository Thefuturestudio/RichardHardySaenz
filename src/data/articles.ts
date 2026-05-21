import type { FaqItem } from "../seo/schema";

export type ArticleKey =
  | "holepProstata"
  | "calculosEndourologia"
  | "segundaOpinionUroOncologia"
  | "psaBiopsiaProstata"
  | "vasectomiaSaludMasculina"
  | "rtupVsHolep"
  | "sangreOrinaHematuria"
  | "primeraConsultaUrologica"
  | "cistoscopiaPreparacion";

export type ArticleSection = {
  heading: string;
  body: string[];
};

export type EducationArticle = {
  key: ArticleKey;
  path: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  category: string;
  readingTime: string;
  summary: string;
  schemaAbout: string;
  relatedProcedurePath: string;
  relatedProcedureLabel: string;
  sections: ArticleSection[];
  faqs: FaqItem[];
};

export const educationArticles: Record<ArticleKey, EducationArticle> = {
  holepProstata: {
    key: "holepProstata",
    path: "/educacion/holep-crecimiento-prostatico",
    title:
      "HoLEP y próstata agrandada: guía clara sobre crecimiento prostático benigno",
    shortTitle: "HoLEP y próstata agrandada",
    description:
      "Guía educativa sobre HoLEP en Panamá, próstata agrandada, hiperplasia prostática benigna, síntomas urinarios y láser de próstata.",
    eyebrow: "Educación para pacientes",
    category: "Próstata y HoLEP",
    readingTime: "6 min",
    summary:
      "Una guía para entender por qué la próstata puede obstruir la orina, qué estudios se revisan y cuando se conversa una alternativa láser como HoLEP.",
    schemaAbout: "Hiperplasia prostática benigna",
    relatedProcedurePath: "/holep",
    relatedProcedureLabel: "Ver página de HoLEP",
    sections: [
      {
        heading: "Qué significa tener la próstata agrandada",
        body: [
          "La hiperplasia prostática benigna es el crecimiento no canceroso de la próstata. Puede estrechar el canal por donde sale la orina y causar chorro débil, urgencia, levantadas nocturnas, goteo, esfuerzo para iniciar o sensación de no vaciar completamente la vejiga.",
          "Tener la próstata agrandada no significa automáticamente cáncer. Aun así, los síntomas merecen una evaluación ordenada porque pueden afectar el descanso, la calidad de vida, la vejiga y, en algunos casos, la función renal.",
        ],
      },
      {
        heading: "Qué es HoLEP y por qué se conversa",
        body: [
          "HoLEP significa enucleación prostática con láser de Holmio. En términos sencillos, es una técnica que permite retirar tejido prostático que bloquea la salida de la orina en pacientes seleccionados.",
          "La decisión no depende solo del tamaño de la próstata. También se revisan síntomas, estudios de imagen, flujo urinario, residuo en vejiga, antecedentes, medicamentos, riesgo de sangrado y objetivos del paciente.",
        ],
      },
      {
        heading: "Qué llevar a la consulta",
        body: [
          "Lleve una lista de síntomas, medicamentos, antecedentes quirúrgicos, infecciones urinarias, episodios de retención, uso de sonda y estudios previos. Si tiene PSA, ultrasonido, flujometría, medición de residuo o reportes de imagen, también conviene llevarlos.",
          "Anote cuántas veces se levanta en la noche, si el chorro ha cambiado, si ha visto sangre en la orina o si ha tenido dolor, fiebre o imposibilidad para orinar. Esa información ayuda a definir prioridad y próximos pasos.",
        ],
      },
      {
        heading: "Opciones que pueden compararse",
        body: [
          "En algunos casos se conversa observación, cambios de hábitos, medicamentos, RTUP, HoLEP, adenectomía prostática u otras alternativas. Ninguna opción debe presentarse como universal para todos los pacientes.",
          "Una buena evaluación busca explicar qué está causando los síntomas, qué tan importante es la obstrucción y qué opción ofrece una relación razonable entre beneficio, recuperación, riesgos y seguimiento para ese paciente.",
        ],
      },
      {
        heading: "Preguntas útiles para el urólogo",
        body: [
          "Pregunte qué hallazgos explican sus síntomas, si hay obstrucción, si la vejiga está vaciando bien, qué opciones son razonables, qué preparación requiere cada alternativa y qué seguimiento se necesita después.",
          "También puede preguntar cómo se compara HoLEP con RTUP u otras técnicas en su caso. La respuesta debe basarse en sus estudios y evaluación, no en una promesa general.",
        ],
      },
    ],
    faqs: [
      {
        question: "HoLEP es para todos los pacientes con próstata agrandada?",
        answer:
          "No. HoLEP puede ser una opción en casos seleccionados, pero la decisión depende de síntomas, tamaño prostático, estudios, antecedentes, medicamentos y evaluación médica individual.",
      },
      {
        question: "La próstata agrandada significa cáncer?",
        answer:
          "No necesariamente. La hiperplasia prostática benigna no es cáncer, pero la evaluación puede incluir PSA, examen clínico o imágenes si el caso lo requiere.",
      },
      {
        question: "Cuándo debo buscar atención urgente?",
        answer:
          "Busque atención urgente si no puede orinar, tiene fiebre, escalofríos, sangrado importante, dolor intenso persistente, vómitos o empeoramiento rápido.",
      },
    ],
  },
  calculosEndourologia: {
    key: "calculosEndourologia",
    path: "/educacion/calculos-renales-endourologia",
    title:
      "Cálculos renales y endourología: cómo prepararse para una evaluación",
    shortTitle: "Cálculos renales y endourología",
    description:
      "Guía educativa sobre cálculos renales en Panamá, ureteroscopia, láser para piedras en el riñón, litotricia y señales de alarma.",
    eyebrow: "Educación para pacientes",
    category: "Cálculos renales",
    readingTime: "6 min",
    summary:
      "Una guía para pacientes con dolor tipo cólico, piedras urinarias, estudios de imagen o episodios repetidos que necesitan ordenar la información antes de decidir.",
    schemaAbout: "Cálculos renales",
    relatedProcedurePath: "/laser-calculos-renales",
    relatedProcedureLabel: "Ver láser para cálculos",
    sections: [
      {
        heading: "Qué son los cálculos renales",
        body: [
          "Los cálculos renales son formaciones sólidas que pueden aparecer en el riñón o desplazarse hacia el uréter. Algunas piedras no producen síntomas al inicio, pero otras causan dolor intenso, náuseas, sangre en la orina, urgencia urinaria o infecciones.",
          "La ubicación, el tamaño, el grado de obstrucción y la presencia de fiebre o infección cambian la urgencia del caso. Por eso no basta con saber que existe una piedra; importa saber dónde está y qué está provocando.",
        ],
      },
      {
        heading: "Qué significa endourología en cálculos",
        body: [
          "La endourología agrupa técnicas mínimamente invasivas que permiten tratar problemas de las vías urinarias desde el interior. En cálculos puede incluir ureteroscopia flexible, ureteroscopia semirrígida, fragmentación con láser, litotricia extracorpórea o nefrolitotomía percutánea en casos seleccionados.",
          "No todos los cálculos requieren cirugía. Algunos se observan, otros se manejan con seguimiento y otros necesitan intervención por dolor, obstrucción, tamaño, infección, función renal o episodios repetidos.",
        ],
      },
      {
        heading: "Qué llevar a la consulta",
        body: [
          "Lleve tomografía, ultrasonido, radiografías, laboratorios, urocultivos, medicamentos y antecedentes de piedras previas si los tiene. Cuando sea posible, lleve el informe escrito y las imágenes, no solo una foto del reporte.",
          "Anote cuándo empezo el dolor, dónde se localiza, si hubo fiebre, escalofríos, vómitos, sangre en la orina, dificultad para orinar, visitas a urgencias o uso reciente de antibióticos.",
        ],
      },
      {
        heading: "Opciones que pueden conversarse",
        body: [
          "Según el caso, la consulta puede incluir observación, control del dolor, estudios adicionales, ureteroscopia, láser, litotricia o procedimientos para cálculos más complejos. La mejor opción depende de la piedra y del paciente.",
          "También se conversa prevención. Después de un episodio, puede ser importante revisar hidratación, análisis del cálculo, factores metabólicos y medidas para reducir recurrencias.",
        ],
      },
      {
        heading: "Señales de alarma",
        body: [
          "Fiebre, escalofríos, dolor intenso qué no cede, vómitos persistentes, debilidad marcada, dificultad para orinar o sospecha de infección con obstrucción requieren atención urgente.",
          "Una página web no puede determinar si una piedra está obstruyendo o infectada. Si hay síntomas de alarma, no espere una cita rutinaria.",
        ],
      },
    ],
    faqs: [
      {
        question: "Todos los cálculos renales necesitan cirugía?",
        answer:
          "No. Algunos cálculos pueden observarse o manejarse con seguimiento, mientras otros requieren un procedimiento. La decisión depende de tamaño, ubicación, síntomas, obstrucción, infección y evaluación médica.",
      },
      {
        question: "Qué estudio ayuda más a ubicar una piedra?",
        answer:
          "La tomografía suele aportar mucha información sobre ubicación y tamaño, pero el estudio indicado depende del caso, síntomas, antecedentes y criterio médico.",
      },
      {
        question: "Cuándo un cálculo renal puede ser urgente?",
        answer:
          "Puede ser urgente si hay fiebre, escalofríos, dolor intenso persistente, vómitos, dificultad para orinar o sospecha de infección asociada a obstrucción.",
      },
    ],
  },
  segundaOpinionUroOncologia: {
    key: "segundaOpinionUroOncologia",
    path: "/educacion/segunda-opinion-uro-oncologia",
    title:
      "Segúnda opinión en uro-oncología: cómo preparar estudios y preguntas",
    shortTitle: "Segúnda opinión en uro-oncología",
    description:
      "Guía para preparar una segunda opinión urológica en cáncer de próstata, riñón, vejiga o testículo, con estudios, reportes y preguntas útiles.",
    eyebrow: "Educación para pacientes",
    category: "Uro-oncología",
    readingTime: "6 min",
    summary:
      "Una guía para pacientes que ya tienen estudios, biopsias, imágenes o una recomendación previa y desean revisar el caso con orden y claridad.",
    schemaAbout: "Cáncer urológico",
    relatedProcedurePath: "/segunda-opinion",
    relatedProcedureLabel: "Ver segunda opinión",
    sections: [
      {
        heading: "Cuándo puede ser útil una segunda opinión",
        body: [
          "Una segunda opinión urológica puede ayudar cuando existe sospecha o diagnóstico de cáncer de próstata, riñón, vejiga, testículo u otro tumor urológico, o cuando ya se propuso una cirugía, biopsia, vigilancia, tratamiento focal o seguimiento.",
          "El objetivo no es contradecir por sistema una recomendación previa. El objetivo es revisar la información disponible, confirmar que el caso esté bien entendido y ordenar las preguntas antes de una decisión importante.",
        ],
      },
      {
        heading: "Qué estudios conviene preparar",
        body: [
          "Lleve reportes de biopsia, PSA, resonancia, tomografía, gammagrafía, PET, ultrasonido, cistoscopia, laboratorios, notas operatorias y recomendaciónes previas. Si existen imágenes en CD, enlace o USB, también son importantes.",
          "En uro-oncología, el detalle del reporte puede cambiar la conversación: grado, estadio, localización, márgenes, tamaño, número de lesiones, ganglios, función renal y antecedentes familiares pueden ser relevantes.",
        ],
      },
      {
        heading: "Cómo ordenar la historia del caso",
        body: [
          "Prepare una línea de tiempo simple: cuándo apareció el primer hallazgo, qué estudio se hizo, qué resultado salió, qué recomendación recibió y qué duda principal tiene ahora.",
          "También anote síntomas actuales, medicamentos, cirugías previas, enfermedades importantes y tratamientos ya realizados. Una segunda opinión es más productiva cuando la información llega completa y ordenada.",
        ],
      },
      {
        heading: "Preguntas útiles para la consulta",
        body: [
          "Puede preguntar si el diagnóstico está completo, si faltan estudios, qué opciones son razonables, qué riesgos tiene esperar, qué beneficios y límites tiene cada alternativa, y cómo se mediría el seguimiento.",
          "También es válido preguntar qué parte del caso es clara y qué parte todavia requiere confirmación. En medicina oncológica, reconocer incertidumbre de forma honesta es parte de una buena evaluación.",
        ],
      },
      {
        heading: "Lo que una segunda opinión no debe prometer",
        body: [
          "Una segunda opinión no garantiza que la recomendación cambie. Tampoco reemplaza una evaluación urgente si hay dolor intenso, sangrado importante, fiebre, retención urinaria, debilidad marcada o deterioro rápido.",
          "El valor está en revisar el caso con criterio especializado, explicar opciones en lenguaje claro y ayudar al paciente a tomar una decisión informada con su equipo médico.",
        ],
      },
    ],
    faqs: [
      {
        question: "Necesito repetir todos los estudios para una segunda opinión?",
        answer:
          "No siempre. Muchas veces se inicia revisando los estudios existentes. Después de la evaluación, el médico puede indicar si falta algún estudio especifico.",
      },
      {
        question: "Puedo pedir segunda opinión si ya tengo una recomendación quirúrgica?",
        answer:
          "Si. Es razonable revisar estudios, diagnóstico, alternativas y preguntas antes de una decisión quirúrgica importante.",
      },
      {
        question: "Una segunda opinión reemplaza urgencias?",
        answer:
          "No. Si hay fiebre, dolor intenso, sangrado importante, dificultad para orinar o deterioro rápido, busqué atención urgente.",
      },
    ],
  },
  psaBiopsiaProstata: {
    key: "psaBiopsiaProstata",
    path: "/educacion/psa-biopsia-prostata",
    title: "PSA elevado y biopsia de próstata: qué significa y qué preguntar",
    shortTitle: "PSA elevado y biopsia de próstata",
    description:
      "Guía educativa sobre PSA elevado, resonancia de próstata, biopsia de próstata en Panamá y revisión de estudios antes de decidir.",
    eyebrow: "Educación para pacientes",
    category: "Diagnostico prostático",
    readingTime: "6 min",
    summary:
      "Una explicación clara para entender por qué el PSA puede elevarse, cuando se conversa una biopsia y que información ayuda a evaluar el riesgo.",
    schemaAbout: "PSA elevado",
    relatedProcedurePath: "/biopsia-prostata",
    relatedProcedureLabel: "Ver biopsia de próstata",
    sections: [
      {
        heading: "Qué significa tener el PSA elevado",
        body: [
          "El PSA es una prueba de sangre relacionada con la próstata. Puede elevarse por crecimiento benigno, inflamación, infección, manipulación reciente, edad u otras causas. Un PSA elevado no significa automáticamente cáncer.",
          "Tampoco debe ignorarse sin contexto. La interpretación depende del valor, cambios en el tiempo, edad, tamaño de la próstata, síntomas, antecedentes familiares, examen clínico y estudios complementarios.",
        ],
      },
      {
        heading: "Dónde entra la resonancia y la biopsia",
        body: [
          "En algunos pacientes se conversa una resonancia multiparamétrica de próstata para identificar áreas sospechosas y orientar la decisión. En otros casos, la información disponible puede llevar a una recomendación distinta.",
          "La biopsia de próstata busca obtener muestras de tejido para confirmar o descartar cáncer. No debe entenderse como un trámite automático por un solo número de PSA, sino como una decisión basada en riesgo individual.",
        ],
      },
      {
        heading: "Qué llevar a la consulta",
        body: [
          "Lleve resultados de PSA anteriores con fechas, medicamentos, antecedentes familiares, infecciones urinarias recientes, procedimientos urológicos, resonancias, ultrasonidos y cualquier biopsia previa.",
          "Si ya tiene resonancia, lleve el reporte y las imágenes. Detalles cómo PI-RADS, volumen prostático, lesiones descritas y ubicación ayudan a ordenar la conversación.",
        ],
      },
      {
        heading: "Preguntas útiles para el urólogo",
        body: [
          "Pregunte qué factores pueden explicar el PSA, si conviene repetirlo, si hace falta resonancia, qué riesgo se estima, qué tipo de biopsia se considera y cómo se interpretarian los resultados.",
          "También pregunte qué pasa si la biopsia es negativa, si muestra cáncer de bajo riesgo o si muestra hallazgos que requieren tratamiento. Entender escenarios posibles ayuda a reducir ansiedad.",
        ],
      },
      {
        heading: "Seguridad y señales de alarma",
        body: [
          "La evaluación de PSA suele ser ambulatoria y ordenada, pero fiebre, escalofríos, dolor intenso, retención urinaria o sangrado importante después de un procedimiento requieren atención urgente.",
          "Esta guía no interpreta valores individuales de PSA. Esa interpretación debe hacerse con historia clínica, examen y estudios disponibles.",
        ],
      },
    ],
    faqs: [
      {
        question: "Un PSA elevado significa cáncer de próstata?",
        answer:
          "No necesariamente. Puede elevarse por varias razónes, pero debe evaluarse con contexto clínico, tendencia del PSA, edad, antecedentes y estudios.",
      },
      {
        question: "Siempre se necesita biopsia si el PSA está alto?",
        answer:
          "No siempre. La decisión depende del riesgo individual y puede incluir repetir PSA, revisar antecedentes, hacer resonancia u otros pasos antes de decidir.",
      },
      {
        question: "Qué debo llevar si ya tengo una resonancia?",
        answer:
          "Lleve el reporte y, si es posible, las imágenes. El detalle de lesiones, PI-RADS, volumen prostático y ubicación puede ser importante.",
      },
    ],
  },
  vasectomiaSaludMasculina: {
    key: "vasectomiaSaludMasculina",
    path: "/educacion/vasectomia-salud-masculina",
    title: "Vasectomía y salud masculina: guía clara antes de decidir",
    shortTitle: "Vasectomía y salud masculina",
    description:
      "Guía educativa sobre vasectomia en Panamá, anticoncepcion masculina permanente, preparación, dudas frecuentes y seguimiento posterior.",
    eyebrow: "Educación para pacientes",
    category: "Salud masculina",
    readingTime: "5 min",
    summary:
      "Una guía para hombres o parejas que desean entender la vasectomia, su caracter permanente, la preparación y el seguimiento necesario.",
    schemaAbout: "Vasectomía",
    relatedProcedurePath: "/vasectomia",
    relatedProcedureLabel: "Ver vasectomia",
    sections: [
      {
        heading: "Qué es una vasectomia",
        body: [
          "La vasectomia es un método de anticoncepcion masculina permanente. Consiste en interrumpir el paso de los espermatozoides por los conductos deferentes. No es una decisión menor: debe conversarse con claridad y sin presion.",
          "La vasectomia no está pensada cómo método temporal. Aunque existen procedimientos de reversa en algunos contextos, no deben asumirse como garantizados. La decisión debe tomarse cuando el paciente entiende su caracter permanente.",
        ],
      },
      {
        heading: "Qué no cambia con la vasectomia",
        body: [
          "La vasectomia no debe entenderse como una cirugía que cambia la masculinidad, el deseo sexual o la capacidad de erección. Su objetivo es anticonceptivo.",
          "También es importante saber qué no protege contra infecciones de transmisión sexual. Si existe riesgo, se deben mantener medidas de proteccion apropiadas.",
        ],
      },
      {
        heading: "Qué llevar a la consulta",
        body: [
          "Lleve antecedentes de cirugías escrotales, dolor testicular, infecciones, medicamentos, anticoagulantes, alergias y preguntas personales. También conviene tener clara la razón de la decisión y si ya fue conversada en pareja cuando aplique.",
          "El urólogo puede explicar preparación, cuidados posteriores, tiempo de reposo relativo y el control necesario antes de considerar qué el método ya es efectivo.",
        ],
      },
      {
        heading: "Seguimiento después del procedimiento",
        body: [
          "La vasectomia no es efectiva de inmediato. Generalmente se requiere un periodo y una prueba de semen posterior para confirmar ausencia de espermatozoides según la indicación médica.",
          "Hasta tener confirmación, se debe usar otro método anticonceptivo. El seguimiento es parte esencial del proceso y no debe omitirse.",
        ],
      },
      {
        heading: "Señales de alarma",
        body: [
          "Dolor intenso, fiebre, aumento importante de volumen, secrecion, sangrado persistente o empeoramiento rápido después de un procedimiento requieren contacto médico o atención urgente.",
          "Esta guía es educativa. La preparación exacta y los cuidados dependen de la evaluación y las instrucciones del equipo médico.",
        ],
      },
    ],
    faqs: [
      {
        question: "La vasectomia afecta la erección o el deseo sexual?",
        answer:
          "La vasectomia se realiza con objetivo anticonceptivo y no está destinada a afectar la erección o el deseo sexual. Las dudas individuales deben conversarse en consulta.",
      },
      {
        question: "La vasectomia funcióna de inmediato?",
        answer:
          "No. Se requiere seguimiento y una prueba posterior según indicación médica antes de dejar otros métodos anticonceptivos.",
      },
      {
        question: "La vasectomia protege contra infecciones de transmisión sexual?",
        answer:
          "No. La vasectomia no protege contra infecciones de transmisión sexual.",
      },
    ],
  },
  rtupVsHolep: {
    key: "rtupVsHolep",
    path: "/educacion/rtup-vs-holep-prostata",
    title: "RTUP vs HoLEP: diferencias para próstata agrandada",
    shortTitle: "RTUP vs HoLEP",
    description:
      "Guía educativa sobre RTUP vs HoLEP en Panamá, cirugía de próstata, crecimiento prostático benigno, láser de próstata y preparación para consulta.",
    eyebrow: "Educación para pacientes",
    category: "Próstata y cirugía",
    readingTime: "6 min",
    summary:
      "Una comparación clara entre RTUP y HoLEP para pacientes con síntomas por crecimiento prostático que desean entender opciones antes de consulta.",
    schemaAbout: "Cirugía de próstata",
    relatedProcedurePath: "/rtup",
    relatedProcedureLabel: "Ver página de RTUP",
    sections: [
      {
        heading: "Por qué se comparan RTUP y HoLEP",
        body: [
          "RTUP y HoLEP son procedimientos que pueden conversarse cuando la próstata agrandada obstruye la salida de la orina. Ambos buscan mejorar el paso de la orina, pero usan técnicas diferentes y no aplican igual para todos los pacientes.",
          "La elección depende de síntomas, tamaño prostático, estudios, medicamentos, riesgo de sangrado, antecedentes, experiencia del equipo y prioridades del paciente. La comparación debe hacerse con datos del caso, no solo con preferencias generales.",
        ],
      },
      {
        heading: "Qué es RTUP",
        body: [
          "RTUP significa resección transuretral de próstata. Es una técnica endoscópica usada por muchos años para retirar tejido prostático que bloquea el canal urinario en pacientes seleccionados.",
          "Puede ser una opción razonable en ciertos tamaños y escenarios clínicos. Durante la consulta se conversa preparación, anestesia, cuidados, posibles riesgos y seguimiento según la situación individual.",
        ],
      },
      {
        heading: "Qué es HoLEP",
        body: [
          "HoLEP utiliza láser de Holmio para enuclear tejido prostático obstructivo. Se conversa con frecuencia en próstatas de mayor volumen o en pacientes donde la técnica puede ofrecer ventajas específicas, siempre según valoración médica.",
          "No significa que sea automáticamente la mejor opción para todos. Una evaluación seria compara síntomas, flujo urinario, residuo, imágenes, PSA, salud general y objetivos del paciente.",
        ],
      },
      {
        heading: "Qué llevar a la consulta",
        body: [
          "Lleve PSA, ultrasonido, flujometría, medición de residuo, reportes de retención urinaria, infecciones, medicamentos, anticoagulantes, cirugías previas y cualquier recomendación recibida.",
          "También anote síntomas: levantadas nocturnas, urgencia, chorro débil, goteo, esfuerzo, sangre en la orina, dolor o episodios con sonda. Esa información ayuda a entender qué tan obstructivo puede ser el cuadro.",
        ],
      },
      {
        heading: "Preguntas útiles y señales de alarma",
        body: [
          "Pregunte qué procedimiento se ajusta mejor a su tamaño prostático, qué riesgos tiene cada opción, qué recuperación se espera, cómo se confirma mejoria y qué seguimiento será necesario.",
          "Busque atención urgente si no puede orinar, presenta fiebre, escalofríos, sangrado importante, dolor intenso o empeoramiento rápido. La comparación entre técnicas no debe retrasar una urgencia.",
        ],
      },
    ],
    faqs: [
      {
        question: "HoLEP es mejor qué RTUP?",
        answer:
          "No hay una respuesta única. Depende del tamaño de la próstata, síntomas, estudios, antecedentes, medicamentos y criterio médico.",
      },
      {
        question: "RTUP sigue siendo una opción actual?",
        answer:
          "Si. RTUP puede ser una opción en pacientes seleccionados. La indicación debe individualizarse.",
      },
      {
        question: "Puedo elegir el procedimiento solo por internet?",
        answer:
          "No. La decisión requiere evaluación médica, revisión de estudios y explicación de riesgos y beneficios.",
      },
    ],
  },
  sangreOrinaHematuria: {
    key: "sangreOrinaHematuria",
    path: "/educacion/sangre-en-la-orina-hematuria",
    title: "Sangre en la orina: cuándo consultar al urólogo",
    shortTitle: "Sangre en la orina",
    description:
      "Guía educativa sobre sangre en la orina, hematuria en Panamá, causas urológicas, estudios frecuentes, cistoscopia y señales de alarma.",
    eyebrow: "Educación para pacientes",
    category: "Sintomás urinarios",
    readingTime: "5 min",
    summary:
      "Una guía para entender por qué la sangre en la orina debe evaluarse con calma, sin asumir causas, pero sin ignorarla.",
    schemaAbout: "Hematuria",
    relatedProcedurePath: "/cistoscopia",
    relatedProcedureLabel: "Ver cistoscopia",
    sections: [
      {
        heading: "Qué significa ver sangre en la orina",
        body: [
          "La sangre en la orina se llama hematuria. Puede verse a simple vista o aparecer solo en un examen de orina. Puede relacionarse con infecciones, cálculos, crecimiento prostático, ejercicio, medicamentos, inflamación, tumores u otras causas.",
          "No es correcto asumir que siempre es algo grave, pero tampoco debe normalizarse. La evaluación busca identificar de dónde viene el sangrado y si requiere estudios adicionales.",
        ],
      },
      {
        heading: "Qué estudios pueden revisarse",
        body: [
          "Según edad, síntomas, antecedentes y tipo de sangrado, el urólogo puede revisar examen de orina, urocultivo, laboratorios, ultrasonido, tomografía, citología o cistoscopia.",
          "La decisión depende del contexto. Una persona con cólico renal no se evalua igual que una persona con sangrado visible sin dolor o con factores de riesgo.",
        ],
      },
      {
        heading: "Qué llevar a la consulta",
        body: [
          "Lleve exámenes de orina, cultivos, imágenes, medicamentos, anticoagulantes, antecedentes de cálculos, infecciones, cirugías, tabaquismo y episodios previos de sangrado.",
          "Anote si la orina fue roja, rosada o marrón; si hubo coágulos; si apareció al inicio o al final de la micción; y si se acompañó de dolor, fiebre, ardor o dificultad para orinar.",
        ],
      },
      {
        heading: "Preguntas útiles para el urólogo",
        body: [
          "Pregunte que causas son más probables en su caso, si hace falta imagen, si conviene cistoscopia, cómo se descartan causas importantes y qué seguimiento requiere.",
          "También pregunte qué cambios deben motivar atención urgente. Entender el plan evita quedarse solo con el susto del síntoma.",
        ],
      },
      {
        heading: "Señales de alarma",
        body: [
          "Busque atención urgente si hay coágulos, imposibilidad para orinar, fiebre, escalofríos, dolor intenso, debilidad marcada, sangrado abundante o empeoramiento rápido.",
          "Si la sangre en la orina ya desapareció, aun puede ser útil evaluarla, especialmente si fue visible o recurrente.",
        ],
      },
    ],
    faqs: [
      {
        question: "La sangre en la orina siempre es infección?",
        answer:
          "No. Puede tener muchas causas. La infección es una posibilidad, pero no debe asumirse sin evaluación.",
      },
      {
        question: "Necesito cistoscopia si vi sangre en la orina?",
        answer:
          "Depende del caso. El urólogo decide según edad, síntomas, antecedentes, exámenes e imágenes.",
      },
      {
        question: "Si el sangrado desaparece, debo consultar?",
        answer:
          "Puede ser recomendable, sobre todo si fue visible, tuvo coágulos, fue recurrente o existen factores de riesgo.",
      },
    ],
  },
  primeraConsultaUrologica: {
    key: "primeraConsultaUrologica",
    path: "/educacion/primera-consulta-urologica",
    title: "Primera consulta urológica: qué llevar y qué esperar",
    shortTitle: "Primera consulta urológica",
    description:
      "Guía para preparar una consulta urológica en Panamá: síntomas, estudios, medicamentos, preguntas útiles y proceso de evaluación.",
    eyebrow: "Educación para pacientes",
    category: "Preparación de consulta",
    readingTime: "5 min",
    summary:
      "Una guía práctica para llegar mejor preparado a la primera cita con el urólogo y aprovechar mejor la conversación médica.",
    schemaAbout: "Consulta urológica",
    relatedProcedurePath: "/agendar-cita",
    relatedProcedureLabel: "Solicitar cita",
    sections: [
      {
        heading: "Para qué sirve prepararse antes de la cita",
        body: [
          "Una consulta urológica puede abordar próstata, cálculos renales, sangre en la orina, infecciones, salud masculina, fertilidad, dolor, estudios alterados o segunda opinión.",
          "Llegar con información ordenada ayuda a qué el médico entienda mejor el problema, priorice riesgos y explique los próximos pasos con mayor claridad.",
        ],
      },
      {
        heading: "Qué llevar a la consulta",
        body: [
          "Lleve estudios de imagen, laboratorios, exámenes de orina, PSA, reportes de biopsia, medicamentos actuales, alergias, cirugías previas y notas médicas si las tiene.",
          "Si tiene imágenes en CD, USB o enlace digital, lleve también el acceso. En urología, ver la imagen puede aportar información que no siempre aparece completa en el resumen.",
        ],
      },
      {
        heading: "Cómo explicar sus síntomas",
        body: [
          "Anote cuándo inició el problema, qué lo mejora o empeora, si hay dolor, fiebre, sangrado, cambios al orinar, levantadas nocturnas, urgencia, goteo, disfunción sexual o episodios previos.",
          "No necesita usar palabras técnicas. Una descripción clara y honesta suele ser más útil que intentar diagnosticar el problema antes de la evaluación.",
        ],
      },
      {
        heading: "Preguntas útiles para el urólogo",
        body: [
          "Pregunte qué diagnósticos se están considerando, qué estudios faltan, qué opciones existen, qué señales deben preocupar, cómo será el seguimiento y qué debe preparar para una próxima visita.",
          "Si va por segunda opinión, pregunte qué información es suficiente, qué falta confirmar y qué decisiones no conviene apresurar.",
        ],
      },
      {
        heading: "Cuándo no esperar una cita rutinaria",
        body: [
          "Fiebre con dolor urinario, imposibilidad para orinar, dolor tipo cólico intenso, sangrado abundante, debilidad marcada o empeoramiento rápido deben atenderse como urgencia.",
          "La primera consulta ayuda a ordenar casos no urgentes. Las emergencias requieren atención inmediata.",
        ],
      },
    ],
    faqs: [
      {
        question: "Puedo ir al urólogo sin estudios previos?",
        answer:
          "Si. El médico puede iniciar con la historia clínica y definir qué estudios hacen falta según el caso.",
      },
      {
        question: "Qué es lo más importante que debo llevar?",
        answer:
          "Medicamentos, estudios recientes, imágenes, laboratorios y una lista clara de síntomas y preguntas.",
      },
      {
        question: "La primera consulta define tratamiento inmediato?",
        answer:
          "No siempre. A veces primero se requieren estudios o revisión de información antes de decidir.",
      },
    ],
  },
  cistoscopiaPreparacion: {
    key: "cistoscopiaPreparacion",
    path: "/educacion/cistoscopia-preparacion",
    title: "Cistoscopia: para qué sirve y cómo prepararse",
    shortTitle: "Cistoscopia y preparación",
    description:
      "Guía educativa sobre cistoscopia en Panamá, evaluación de vejiga, sangre en la orina, molestias urinarias y preparación antes del procedimiento.",
    eyebrow: "Educación para pacientes",
    category: "Vejiga y vías urinarias",
    readingTime: "5 min",
    summary:
      "Una explicación simple sobre la cistoscopia, cuándo se conversa, qué información aporta y qué preguntas llevar a la consulta.",
    schemaAbout: "Cistoscopia",
    relatedProcedurePath: "/cistoscopia",
    relatedProcedureLabel: "Ver cistoscopia",
    sections: [
      {
        heading: "Qué es una cistoscopia",
        body: [
          "La cistoscopia es un procedimiento que permite observar la uretra, la próstata en el hombre y la vejiga con un instrumento especial. Se usa para evaluar síntomas o hallazgos que requieren mirar directamente las vías urinarias bajas.",
          "Puede conversarse ante sangre en la orina, infecciones repetidas, molestias persistentes, sospecha de estrechez, seguimiento de vejiga o estudios que necesitan aclaración.",
        ],
      },
      {
        heading: "Qué información puede aportar",
        body: [
          "La cistoscopia puede ayudar a identificar inflamación, cálculos vesicales, obstrucción, lesiones, sangrado, cambios en la uretra o hallazgos que no siempre se ven igual en otros estudios.",
          "No reemplaza todos los exámenes. A veces se complementa con orina, imágenes, laboratorios u otros estudios según el motivo de consulta.",
        ],
      },
      {
        heading: "Qué llevar a la consulta",
        body: [
          "Lleve exámenes de orina, cultivos, ultrasonidos, tomografías, reportes previos, medicamentos, anticoagulantes, alergias, cirugías urológicas y síntomas actuales.",
          "Si el motivo es sangre en la orina, anote si fue visible, si hubo coágulos, si se acompañó de dolor, ardor, fiebre o dificultad para orinar.",
        ],
      },
      {
        heading: "Preguntas útiles antes del procedimiento",
        body: [
          "Pregunte por qué se recomienda, qué se espera encontrar, qué preparación requiere, si debe ajustar medicamentos, qué molestias son esperables y qué señales requieren contacto médico.",
          "También pregunte cómo recibirá resultados y cuál sería el siguiente paso si el estudio es normal o si muestra algún hallazgo.",
        ],
      },
      {
        heading: "Señales de alarma",
        body: [
          "Después de un procedimiento, fiebre, escalofríos, dolor intenso, imposibilidad para orinar, sangrado abundante o empeoramiento rápido requieren atención médica.",
          "La preparación exacta depende del tipo de cistoscopia y del estado del paciente, por lo que debe seguir las indicaciones del equipo médico.",
        ],
      },
    ],
    faqs: [
      {
        question: "La cistoscopia es solo para sangre en la orina?",
        answer:
          "No. También puede usarse para evaluar molestias urinarias, infecciones repetidas, estrecheces, seguimiento de vejiga u otros hallazgos.",
      },
      {
        question: "Necesito preparación especial?",
        answer:
          "Depende del tipo de cistoscopia y del paciente. El equipo médico indica preparación, medicamentos y cuidados.",
      },
      {
        question: "Qué síntomas después deben preocupar?",
        answer:
          "Fiebre, escalofríos, dolor intenso, imposibilidad para orinar, sangrado abundante o empeoramiento rápido requieren atención médica.",
      },
    ],
  },
};

export const educationArticleList = Object.values(educationArticles);





