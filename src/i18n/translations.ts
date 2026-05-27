export type Language = "es" | "en";

type SpecialtyKey =
  | "prostata"
  | "uroOncologia"
  | "endourologia"
  | "cirugiaLaparoscopica"
  | "saludMasculina"
  | "segundaOpinion"
  | "calculosRenales"
  | "ureteroscopia";

export const specialtyRouteByKey: Record<SpecialtyKey, string> = {
  prostata: "/prostata",
  uroOncologia: "/uro-oncologia",
  endourologia: "/endourologia",
  cirugiaLaparoscopica: "/cirugia-laparoscopica",
  saludMasculina: "/salud-masculina",
  segundaOpinion: "/segunda-opinion",
  calculosRenales: "/calculos-renales",
  ureteroscopia: "/ureteroscopia",
};

const es = {
  locale: "es",
  brand: {
    doctor: "Dr. Carlos A. Brugiati",
    platform: "UroPanama",
    line: "Urología avanzada y cirugía mínimamente invasiva en Panamá",
    location: "Ciudad de Panamá, Panamá",
  },
  nav: [
    { label: "Inicio", href: "/" },
    { label: "Dr. Brugiati", href: "/dr-carlos-brugiati" },
    { label: "Especialidades", href: "/especialidades" },
    { label: "Cálculos renales", href: "/calculos-renales" },
    { label: "Ureteroscopía", href: "/ureteroscopia" },
    { label: "Agendar cita", href: "/agendar-cita" },
  ],
  cta: {
    book: "Agendar cita",
    assistant: "Hablar con el asistente",
    whatsapp: "WhatsApp",
    call: "Llamar",
    learn: "Conocer tratamientos",
    evaluation: "Solicitar evaluación",
    secondOpinion: "Solicitar segunda opinión",
    send: "Enviar solicitud",
    again: "Enviar otra solicitud",
    view: "Ver orientación",
  },
  header: {
    homeLabel: "Ir al inicio",
    navLabel: "Navegación principal",
    mobileNavLabel: "Navegación móvil",
    languageLabel: "Selector de idioma",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    nav: {
      home: { label: "Inicio", href: "/" },
      doctor: { label: "Dr. Brugiati", href: "/dr-carlos-brugiati" },
      specialties: { label: "Especialidades", href: "/especialidades" },
      procedures: { label: "Procedimientos", href: "/procedimientos" },
      secondOpinion: { label: "Segunda opinión", href: "/segunda-opinion" },
      blog: { label: "Blog", href: "/educacion" },
      contact: { label: "Contacto", href: "/agendar-cita" },
      booking: { label: "Agendar", href: "/agendar-cita" },
    },
    specialtiesLabel: "Especialidades",
    specialtiesIntro: "Áreas de atención especializada",
    specialtiesHint: "Seleccione una ruta de evaluación",
    proceduresLabel: "Procedimientos",
    proceduresIntro: "Procedimientos urológicos",
    proceduresHint: "Opciones que se definen según evaluación médica",
    menuTitle: "UroPanama",
  },
  safety: {
    global:
      "La información de este sitio tiene fines educativos y de orientación general. No sustituye una evaluación médica. En caso de emergencia, acuda a un servicio médico de urgencia.",
    assistant:
      "El asistente digital no realiza diagnósticos. Su función es orientación inicial y coordinación de citas.",
    emergency:
      "Este formulario no debe utilizarse para emergencias médicas. En caso de emergencia, acuda a un servicio médico de urgencia.",
    urgentStones:
      "Si presenta dolor agudo, sangrado, retención de orina, cólico renal, fiebre, escalofríos o una preocupación post-operatoria reciente, busque atención médica urgente.",
  },
  seo: {
    homeTitle: "Dr. Carlos Brugiati | Urólogo en Panamá | UroPanama",
    homeDescription:
      "Atención urológica especializada en Panamá con enfoque en próstata, cálculos renales, uro-oncología, endourología y cirugía mínimamente invasiva.",
    aboutTitle:
      "Dr. Carlos A. Brugiati | Urología, Uro-oncología y Mínima Invasión",
    specialtiesTitle: "Especialidades Urológicas en Panamá | UroPanama",
    stonesTitle:
      "Cálculos Renales en Panamá | Evaluación Urológica Especializada",
    ureteroscopyTitle:
      "Ureteroscopía en Panamá | Tratamiento de Cálculos Renales",
    bookingTitle: "Agendar Cita con Urólogo en Panamá | Dr. Carlos Brugiati",
  },
  home: {
    hero: {
      eyebrow: "DR. CARLOS A. BRUGIATI · UROPANAMA",
      title: "Urología avanzada y cirugía mínimamente invasiva en Panamá",
      subtitle:
        "Atención especializada en próstata, cálculos renales, uro-oncología, endourología y cirugía laparoscópica, con orientación clara desde el primer contacto.",
      microcopy:
        "Privacidad, discreción y coordinación personalizada para pacientes nacionales e internacionales.",
      trust: [
        "Uro-oncología",
        "Endourología",
        "Cirugía percutánea",
        "Laparoscopía",
        "Mínima invasión",
      ],
      microTrust: [
        "Privacidad",
        "Atención especializada",
        "Pacientes nacionales e internacionales",
        "Coordinación digital",
      ],
      appointmentTitle: "Agendar cita",
      appointmentSubtitle: "Seleccione una orientación inicial",
      protected: "Información protegida y confidencial",
    },
    concerns: {
      eyebrow: "Orientación inicial",
      title: "¿Qué necesita evaluar?",
      subtitle:
        "Seleccione el motivo de consulta y conozca qué tipo de evaluación puede corresponder.",
      items: [
        {
          title: "Síntomas de próstata",
          text: "Dificultad al orinar, PSA elevado o seguimiento prostático.",
          href: "/prostata",
        },
        {
          title: "Cálculos renales",
          text: "Dolor, piedras, estudios de imagen o procedimientos relacionados.",
          href: "/calculos-renales",
        },
        {
          title: "Uro-oncología",
          text: "Evaluación de sospechas, diagnósticos o seguimiento oncológico urológico.",
          href: "/uro-oncologia",
        },
        {
          title: "Molestias urinarias",
          text: "Ardor, infecciones, sangre en la orina o cambios al orinar.",
          href: "/especialidades",
        },
        {
          title: "Salud masculina",
          text: "Función sexual, fertilidad masculina y salud urológica integral.",
          href: "/salud-masculina",
        },
        {
          title: "Segunda opinión",
          text: "Revisión de estudios, diagnósticos previos o recomendaciones quirúrgicas.",
          href: "/segunda-opinion",
        },
      ],
    },
    authority: {
      eyebrow: "Confianza y claridad",
      title: "Confianza, claridad y atención especializada.",
      body:
        "Una experiencia digital diseñada para orientar al paciente desde el primer contacto, preparar la consulta y facilitar el acceso a atención urológica especializada en Ciudad de Panamá.",
      stats: [
        ["5.0", "perfil público HuliHealth", "sin publicar texto testimonial no autorizado"],
        ["Especialista", "atención urológica", "próstata, riñón y vías urinarias"],
        ["Acceso digital", "orientación y solicitud de cita", "disponibilidad sujeta a confirmación"],
      ],
      reviewsTitle: "Opiniones públicas",
      reviews: [
        [
          "Testimonio a verificar",
          "Espacio reservado para una opinión pública real, revisada y aprobada antes de la publicación final.",
          "Pendiente de verificación",
        ],
        [
          "Opinión pública pendiente de aprobación",
          "No se muestra texto testimonial hasta contar con autorización o fuente pública validada.",
          "Dato a confirmar",
        ],
        [
          "Referencia de reputación",
          "La integración final puede conectarse con perfiles públicos verificados y reseñas aprobadas.",
          "Integración futura",
        ],
      ],
    },
    specialties: {
      eyebrow: "Especialidades",
      title: "Atención urológica con enfoque de especialista.",
      subtitle:
        "Un sistema de atención claro para condiciones complejas, procedimientos mínimamente invasivos y seguimiento responsable.",
    },
    anatomy: {
      eyebrow: "Explorador anatómico",
      title: "Comprenda su condición con una guía visual clara.",
      subtitle:
        "Una experiencia educativa para entender qué áreas del sistema urológico pueden requerir valoración especializada.",
      areas: [
        {
          label: "Riñón",
          text: "Puede estar relacionado con cálculos renales, dolor lumbar de origen urológico, tumores renales o estudios de imagen alterados.",
          related: ["Cálculos renales", "Estudios de imagen", "Dolor lumbar de origen urológico", "Cirugía renal según valoración"],
          procedures: ["Ureteroscopía", "Láser para cálculos", "Nefrolitotomía percutánea", "Seguimiento especializado"],
          cta: "Agendar evaluación renal",
          href: "/calculos-renales",
        },
        {
          label: "Uréter",
          text: "Puede verse afectado por cálculos, obstrucciones o alteraciones que requieren estudios específicos.",
          related: ["Cálculos en uréter", "Obstrucción urinaria", "Dolor asociado a vías urinarias"],
          procedures: ["Ureteroscopía", "Láser para cálculos", "Tomografía o ultrasonido"],
          cta: "Consultar sobre ureteroscopía",
          href: "/ureteroscopia",
        },
        {
          label: "Vejiga",
          text: "Puede estar relacionada con molestias urinarias, infecciones, sangre en la orina o evaluación mediante cistoscopía.",
          related: ["Cistoscopía", "Sangre en la orina", "Síntomas urinarios"],
          procedures: ["Evaluación urinaria", "Laboratorios", "Plan de seguimiento"],
          cta: "Consultar síntomas urinarios",
          href: "/especialidades",
        },
        {
          label: "Próstata",
          text: "La próstata puede requerir evaluación por síntomas urinarios, crecimiento prostático, PSA elevado, biopsia o sospecha de enfermedad prostática.",
          related: ["PSA", "Crecimiento prostático", "Biopsia de próstata", "Cáncer de próstata"],
          procedures: ["Evaluación prostática", "Revisión de PSA", "Seguimiento preventivo"],
          cta: "Agendar evaluación prostática",
          href: "/prostata",
        },
        {
          label: "Salud masculina",
          text: "Incluye función sexual, fertilidad masculina, síntomas urinarios y prevención urológica.",
          related: ["Función sexual", "Fertilidad masculina", "Evaluación preventiva"],
          procedures: ["Consulta privada", "Laboratorios si corresponden", "Seguimiento médico"],
          cta: "Agendar consulta privada",
          href: "/salud-masculina",
        },
      ],
      relatedLabel: "Puede estar relacionado con",
      proceduresLabel: "Evaluaciones o procedimientos relacionados",
    },
    procedures: {
      eyebrow: "Procedimientos",
      title: "Entienda su procedimiento antes de llegar al consultorio.",
      subtitle:
        "Explicaciones simples, visuales y no gráficas sobre procedimientos urológicos frecuentes.",
    },
    journey: {
      eyebrow: "Proceso de atención",
      title: "Un recorrido claro desde el primer contacto.",
      subtitle:
        "Desde el primer mensaje hasta el seguimiento, el proceso está diseñado para que el paciente sepa qué esperar y llegue mejor preparado a su consulta.",
      steps: [
        ["Usted nos cuenta qué necesita", "Comparta el motivo de consulta y el canal por el que prefiere ser contactado."],
        ["Organizamos la información inicial", "El equipo o asistente digital ayuda a ordenar datos básicos antes de la cita."],
        ["Consulta con el especialista", "El médico revisa síntomas, antecedentes y estudios disponibles."],
        ["Estudios si corresponden", "Según cada caso, pueden solicitarse laboratorios, imágenes u otros estudios."],
        ["Plan claro y seguimiento", "El objetivo es que comprenda su condición, sus opciones y los próximos pasos según la valoración médica."],
      ],
    },
    floating: {
      assistantLabel: "Asistente",
      assistantTitle: "Asistente de orientación inicial",
      assistantBody:
        "Puede ayudarle a conocer servicios, preparar su consulta o coordinar una cita. No realiza diagnósticos ni sustituye la evaluación médica.",
      closeAssistant: "Cerrar asistente",
      whatsappLabel: "WhatsApp",
    },
    stickyBooking: {
      title: "¿Desea coordinar una consulta?",
      body: "Solicite disponibilidad o escriba por WhatsApp.",
      availabilityLabel: "Coordinación",
      availabilityNote: "Horarios sujetos a confirmación",
      availability: ["Solicitar disponibilidad"],
      minimize: "Ocultar barra de coordinación",
    },
    assistant: {
      eyebrow: "Asistente digital",
      title: "Orientación inicial y coordinación de citas, sin reemplazar la consulta.",
      body:
        "El asistente digital de UroPanama ayuda a organizar la primera atención, responder preguntas generales y coordinar una cita. No realiza diagnósticos ni sustituye la consulta médica.",
      opening:
        "Hola, soy el asistente digital de UroPanama. Puedo ayudarle a conocer servicios, preparar su consulta o coordinar una cita.",
      quick: [
        "Agendar cita",
        "Tengo cálculos renales",
        "Tengo síntomas de próstata",
        "Quiero una segunda opinión",
        "Ver ubicación",
        "Hablar con el equipo",
      ],
      responses: [
        "Puedo ayudarle a coordinar una cita. Comparta su nombre, teléfono y motivo de consulta para que el equipo confirme disponibilidad.",
        "Puedo ayudarle a coordinar una cita para evaluación. Si presenta fiebre, dolor intenso persistente, vómitos o dificultad para orinar, busque atención médica urgente.",
        "Podemos ayudarle a coordinar una evaluación urológica. El médico determinará qué estudios o pasos corresponden según su caso.",
        "Puede traer estudios previos, informes médicos, laboratorios o imágenes disponibles para revisión durante la consulta.",
        "La atención se coordina en Ciudad de Panamá. El equipo puede confirmar dirección y disponibilidad al agendar.",
        "Puede comunicarse por WhatsApp o teléfono para recibir orientación inicial y coordinar la cita.",
      ],
    },
    booking: {
      eyebrow: "Agendamiento",
      title: "Agende una consulta en una experiencia privada y ordenada.",
      body:
        "Solicite una evaluación urológica especializada. El equipo o asistente digital puede ayudarle a coordinar el horario y preparar la información inicial.",
    },
  },
  about: {
    title: "Dr. Carlos A. Brugiati",
    subtitle: "Urología, uro-oncología, endourología y cirugía mínimamente invasiva.",
    intro:
      "Atención especializada para pacientes que buscan claridad diagnóstica, orientación médica responsable y opciones de tratamiento ajustadas a cada caso.",
    sections: [
      {
        title: "Enfoque médico especializado",
        body:
          "El Dr. Carlos A. Brugiati brinda atención especializada a pacientes con condiciones urológicas que requieren diagnóstico claro, seguimiento cuidadoso y opciones de tratamiento modernas. Su práctica se enfoca en enfermedades prostáticas, cálculos renales, condiciones oncológicas urológicas, endourología y procedimientos mínimamente invasivos.",
      },
      {
        title: "Claridad médica para tomar mejores decisiones",
        body:
          "La atención médica debe ser clara, ordenada y humana. Cada paciente debe comprender su condición, sus opciones y los siguientes pasos antes de tomar decisiones. Por eso, la comunicación, la evaluación cuidadosa y el seguimiento forman parte esencial del proceso.",
      },
    ],
    areas: [
      "Próstata",
      "Cálculos renales",
      "Uro-oncología",
      "Endourología",
      "Cirugía laparoscópica",
      "Salud urológica masculina",
    ],
  },
  specialtiesPage: {
    title: "Especialidades urológicas",
    subtitle:
      "Atención especializada para condiciones de próstata, riñón, vías urinarias y salud masculina.",
    intro:
      "Cada paciente requiere una evaluación individual. Esta sección ofrece una orientación general sobre las principales áreas de atención urológica y cuándo puede ser recomendable solicitar una consulta.",
  },
  forms: {
    title: "Solicitud de cita",
    subtitle: "Complete solo lo esencial. El equipo confirmará por WhatsApp; la cita no queda agendada automáticamente.",
    submit: "Enviar solicitud de cita",
    successTitle: "Gracias. Su solicitud fue registrada.",
    successBody: "El equipo se pondrá en contacto para confirmar disponibilidad.",
    required: "Este campo es requerido.",
    fields: {
      name: "Nombre completo",
      phone: "Teléfono / WhatsApp",
      email: "Email (opcional)",
      schedule: "Preferencia de horario",
      reason: "Motivo de consulta",
      firstVisit: "¿Es primera consulta? (opcional)",
      message: "Mensaje adicional (opcional)",
      schedulePlaceholder: "Mañana, tarde o fecha tentativa",
      reasonPlaceholder: "Seleccione una opción",
      messagePlaceholder:
        "Puede compartir síntomas, estudios disponibles o preguntas para la consulta.",
    },
    reasons: [
      "Síntomas de próstata",
      "HoLEP / crecimiento prostático",
      "Cálculos renales",
      "Ureteroscopia o litotricia",
      "Uro-oncología",
      "Dolor o molestias urinarias",
      "Disfunción eréctil",
      "Vasectomía",
      "Salud masculina",
      "Segunda opinión",
      "Otro motivo",
    ],
    firstVisitOptions: ["Sí", "No", "No estoy seguro"],
  },
  bookingPage: {
    title: "Agendar cita",
    subtitle:
      "Escríbanos por WhatsApp para coordinar más rápido o envíe una solicitud si prefiere dejar los datos ordenados.",
    intro:
      "El equipo revisa disponibilidad y confirma manualmente antes de reservar la cita.",
    bringTitle: "Para su primera consulta",
    bringIntro: "Si los tiene disponibles, puede traer:",
    bring: [
      "Estudios de imagen",
      "Resultados de laboratorio",
      "Medicamentos actuales",
      "Informes médicos previos",
      "Motivo principal de consulta",
      "Preguntas que desea resolver",
    ],
    reassurance: [
      ["Clínica privada y segura", "Discreción absoluta"],
      ["Pacientes internacionales", "Coordinación de viaje y alojamiento"],
      ["Atención oportuna", "Horarios flexibles según disponibilidad"],
    ],
  },
  footer: {
    body: "Atención urológica especializada en Ciudad de Panamá.",
    credit: "Sistema digital por The Future Studio.",
    contact: "Contacto",
    navigation: "Navegación",
  },
  procedures: [
    {
      title: "Ureteroscopía",
      text: "Procedimiento mínimamente invasivo que permite evaluar o tratar condiciones del uréter, incluyendo algunos casos de cálculos urinarios.",
      href: "/ureteroscopia",
    },
    {
      title: "Cirugía láser para cálculos renales",
      text: "Técnica utilizada en determinados casos para fragmentar cálculos y facilitar su manejo, según tamaño, ubicación y evaluación médica.",
      href: "/calculos-renales",
    },
    {
      title: "Biopsia de próstata",
      text: "Estudio que puede indicarse cuando existen hallazgos clínicos, de laboratorio o imagen que requieren una evaluación más específica.",
      href: "/prostata",
    },
    {
      title: "Nefrolitotomía percutánea",
      text: "Procedimiento que puede considerarse en ciertos casos de cálculos renales de mayor tamaño o complejidad.",
      href: "/calculos-renales",
    },
    {
      title: "Cistoscopía",
      text: "Evaluación visual de la vejiga y vías urinarias que puede ayudar a estudiar síntomas como sangre en la orina o molestias urinarias persistentes.",
      href: "/especialidades",
    },
    {
      title: "Cirugía laparoscópica renal",
      text: "Técnica quirúrgica mínimamente invasiva utilizada en determinados casos renales, según diagnóstico y valoración médica.",
      href: "/cirugia-laparoscopica",
    },
  ],
  specialties: {
    prostata: {
      title: "Próstata",
      subtitle:
        "Evaluación médica de síntomas urinarios, PSA elevado, crecimiento prostático y sospecha de enfermedad prostática.",
      intro:
        "La evaluación prostática permite ordenar síntomas, antecedentes, estudios disponibles y posibles próximos pasos según cada caso.",
      when: [
        "Dificultad o cambios al orinar",
        "PSA elevado o estudios alterados",
        "Crecimiento prostático conocido",
        "Seguimiento preventivo o segunda opinión",
      ],
      evaluation:
        "Durante la consulta se revisan síntomas, antecedentes, medicamentos, laboratorios e imágenes disponibles. El médico determinará si corresponden estudios adicionales, seguimiento o procedimientos específicos.",
      next: ["Evaluación prostática", "PSA y estudios disponibles", "Biopsia si corresponde", "Seguimiento médico"],
      faq: [
        ["¿Un PSA elevado significa cáncer?", "No necesariamente. El PSA puede elevarse por distintas causas. La interpretación requiere evaluación médica."],
        ["¿Qué debo llevar?", "Lleve laboratorios, imágenes, informes previos y medicamentos actuales si los tiene disponibles."],
      ],
      cta: "Agendar evaluación prostática",
    },
    uroOncologia: {
      title: "Uro-oncología",
      subtitle:
        "Evaluación y seguimiento de condiciones oncológicas relacionadas con próstata, riñón, vejiga y otros órganos urológicos.",
      intro:
        "La uro-oncología requiere claridad, revisión cuidadosa de estudios y conversación responsable sobre opciones de manejo según cada caso.",
      when: [
        "Sospecha o diagnóstico previo de cáncer urológico",
        "Estudios de imagen o laboratorio alterados",
        "Seguimiento después de tratamiento",
        "Necesidad de segunda opinión especializada",
      ],
      evaluation:
        "La consulta puede incluir revisión de informes, laboratorios, imágenes, biopsias y recomendaciones previas para definir los siguientes pasos médicos.",
      next: ["Revisión de estudios", "Plan diagnóstico", "Opciones de manejo", "Seguimiento especializado"],
      faq: [
        ["¿Puedo pedir una segunda opinión?", "Sí. Puede llevar estudios e informes previos para revisarlos durante la consulta."],
        ["¿La consulta define tratamiento inmediato?", "No siempre. El médico puede solicitar estudios adicionales antes de definir un plan."],
      ],
      cta: "Solicitar evaluación uro-oncológica",
    },
    endourologia: {
      title: "Endourología",
      subtitle:
        "Procedimientos de mínima invasión para evaluar o tratar condiciones de las vías urinarias con instrumentos de precisión.",
      intro:
        "La endourología puede formar parte del manejo de cálculos, obstrucciones y otras condiciones urológicas según la valoración médica.",
      when: [
        "Cálculos en vías urinarias",
        "Obstrucciones o molestias persistentes",
        "Necesidad de evaluación visual de vías urinarias",
        "Procedimientos mínimamente invasivos indicados por el médico",
      ],
      evaluation:
        "La indicación depende de síntomas, estudios de imagen, laboratorios y condición general del paciente.",
      next: ["Ureteroscopía", "Cistoscopía", "Tratamiento láser", "Seguimiento posterior"],
      faq: [
        ["¿Siempre se necesita procedimiento?", "No. Primero se realiza una evaluación médica para determinar si corresponde."],
        ["¿Es lo mismo que cirugía abierta?", "No. Son técnicas que pueden ser menos invasivas en casos seleccionados."],
      ],
      cta: "Conocer procedimientos",
    },
    cirugiaLaparoscopica: {
      title: "Cirugía laparoscópica",
      subtitle:
        "Técnicas quirúrgicas mínimamente invasivas utilizadas en determinados casos urológicos.",
      intro:
        "La cirugía laparoscópica puede ofrecer una alternativa de abordaje en algunos diagnósticos, siempre según valoración médica.",
      when: [
        "Condiciones renales seleccionadas",
        "Recomendación quirúrgica previa",
        "Necesidad de revisar opciones mínimamente invasivas",
        "Segunda opinión antes de una cirugía",
      ],
      evaluation:
        "La decisión quirúrgica se basa en diagnóstico, estudios, condición general y conversación médica detallada.",
      next: ["Revisión de diagnóstico", "Estudios preoperatorios", "Opciones de abordaje", "Seguimiento"],
      faq: [
        ["¿La laparoscopía aplica para todos los casos?", "No. Depende del diagnóstico y de la valoración médica."],
        ["¿Garantiza recuperación rápida?", "No se deben prometer tiempos. La recuperación depende de cada paciente y procedimiento."],
      ],
      cta: "Solicitar orientación",
    },
    saludMasculina: {
      title: "Salud masculina",
      subtitle:
        "Atención médica para función sexual, fertilidad masculina, molestias urinarias y prevención urológica.",
      intro:
        "La salud urológica masculina requiere una conversación privada, ordenada y sin juicios para identificar causas y próximos pasos.",
      when: [
        "Cambios en función sexual",
        "Dudas sobre fertilidad masculina",
        "Molestias urinarias o dolor pélvico",
        "Prevención y chequeo urológico",
      ],
      evaluation:
        "La consulta revisa síntomas, antecedentes, medicamentos, estilo de vida y estudios disponibles para orientar una evaluación responsable.",
      next: ["Evaluación clínica", "Laboratorios si corresponden", "Orientación preventiva", "Seguimiento"],
      faq: [
        ["¿La consulta es confidencial?", "Sí. La privacidad y discreción forman parte esencial de la atención."],
        ["¿Se requiere preparación especial?", "Puede llevar medicamentos actuales y estudios previos si los tiene."],
      ],
      cta: "Agendar consulta",
    },
    segundaOpinion: {
      title: "Segunda opinión urológica",
      subtitle:
        "Revise diagnósticos, estudios o recomendaciones quirúrgicas antes de tomar una decisión médica.",
      intro:
        "Una segunda opinión puede ayudarle a comprender mejor un diagnóstico, revisar estudios previos y ordenar dudas antes de decidir los siguientes pasos.",
      when: [
        "Ya tiene un diagnóstico o sospecha clínica",
        "Le recomendaron cirugía o procedimiento",
        "Tiene estudios, laboratorios o imágenes disponibles",
        "Desea mayor claridad antes de decidir",
      ],
      evaluation:
        "Durante la consulta se revisan informes, imágenes, laboratorios, antecedentes y recomendaciones previas. El objetivo es brindar orientación médica responsable, no reemplazar emergencias.",
      next: ["Revisión de estudios", "Lista de preguntas", "Explicación de opciones", "Plan de seguimiento"],
      faq: [
        ["¿Qué debo llevar?", "Estudios de imagen, informes médicos, laboratorios, biopsias y recomendaciones previas si los tiene."],
        ["¿La segunda opinión cambia mi tratamiento?", "Puede confirmar, aclarar o ampliar opciones. La decisión final depende de la evaluación médica."],
      ],
      cta: "Solicitar segunda opinión",
    },
    calculosRenales: {
      title: "Cálculos renales",
      subtitle:
        "Evaluación y tratamiento de piedras en los riñones o vías urinarias.",
      intro:
        "Los cálculos renales son formaciones sólidas que pueden aparecer en los riñones o desplazarse hacia las vías urinarias. La evaluación médica permite conocer tamaño, ubicación y características del cálculo.",
      when: [
        "Dolor intenso en espalda baja o costado",
        "Sangre en la orina",
        "Ardor, urgencia o molestias al orinar",
        "Fiebre, escalofríos o vómitos asociados",
      ],
      evaluation:
        "La evaluación puede incluir revisión de síntomas, antecedentes, examen médico, análisis de orina, laboratorios, ultrasonido, tomografía u otros estudios de imagen.",
      next: ["Observación y seguimiento", "Ureteroscopía", "Cirugía láser", "Nefrolitotomía percutánea"],
      faq: [
        ["¿Todos los cálculos renales necesitan cirugía?", "No necesariamente. El manejo depende del tamaño, ubicación, síntomas y condición general del paciente."],
        ["¿Cuándo debo buscar atención urgente?", "Busque atención urgente si presenta fiebre, dolor intenso persistente, vómitos, debilidad marcada o dificultad para orinar."],
        ["¿La ureteroscopía sirve para cálculos?", "Puede indicarse en determinados casos, especialmente cuando están ubicados en el uréter o sistema urinario."],
      ],
      cta: "Agendar evaluación por cálculos renales",
    },
    ureteroscopia: {
      title: "Ureteroscopía",
      subtitle:
        "Procedimiento mínimamente invasivo para evaluar o tratar cálculos y condiciones del uréter.",
      intro:
        "La ureteroscopía permite acceder al uréter y al sistema urinario mediante instrumentos especializados. Puede utilizarse para evaluar o tratar cálculos y otras condiciones según ubicación, tamaño y características.",
      when: [
        "Cálculos ubicados en el uréter",
        "Dolor asociado a obstrucción urinaria",
        "Evaluación de alteraciones de vías urinarias",
        "Casos donde el médico considera necesario observar o tratar el área afectada",
      ],
      evaluation:
        "La preparación depende del caso clínico, estudios disponibles e indicaciones del médico. Durante la consulta se explica qué pasos seguir si el procedimiento llega a ser necesario.",
      next: ["Revisión de imágenes", "Preparación indicada", "Procedimiento si corresponde", "Seguimiento posterior"],
      faq: [
        ["¿Siempre requiere hospitalización?", "Depende del caso, del procedimiento realizado y de la condición del paciente."],
        ["¿Se usa para cálculos renales?", "Puede utilizarse en determinados casos de cálculos, especialmente cuando están ubicados en el uréter."],
        ["¿Necesito estudios antes?", "Es posible que se requieran imágenes, laboratorios u otros exámenes antes de definir el manejo adecuado."],
      ],
      cta: "Consultar sobre ureteroscopía",
    },
  },
} as const;

const en = {
  ...es,
  locale: "en",
  brand: {
    doctor: "Dr. Carlos A. Brugiati",
    platform: "UroPanama",
    line: "Advanced urology and minimally invasive surgery in Panama",
    location: "Panama City, Panama",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Dr. Brugiati", href: "/dr-carlos-brugiati" },
    { label: "Specialties", href: "/especialidades" },
    { label: "Kidney stones", href: "/calculos-renales" },
    { label: "Ureteroscopy", href: "/ureteroscopia" },
    { label: "Book visit", href: "/agendar-cita" },
  ],
  cta: {
    book: "Book visit",
    assistant: "Talk to the assistant",
    whatsapp: "WhatsApp",
    call: "Call",
    learn: "Explore treatments",
    evaluation: "Request evaluation",
    secondOpinion: "Request second opinion",
    send: "Send request",
    again: "Send another request",
    view: "View guidance",
  },
  header: {
    homeLabel: "Go to home",
    navLabel: "Primary navigation",
    mobileNavLabel: "Mobile navigation",
    languageLabel: "Language selector",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    nav: {
      home: { label: "Home", href: "/" },
      doctor: { label: "Dr. Brugiati", href: "/dr-carlos-brugiati" },
      specialties: { label: "Specialties", href: "/especialidades" },
      procedures: { label: "Procedures", href: "/procedimientos" },
      secondOpinion: { label: "Second opinion", href: "/segunda-opinion" },
      blog: { label: "Blog", href: "/educacion" },
      contact: { label: "Contact", href: "/agendar-cita" },
      booking: { label: "Book visit", href: "/agendar-cita" },
    },
    specialtiesLabel: "Specialties",
    specialtiesIntro: "Specialized care areas",
    specialtiesHint: "Choose an evaluation path",
    proceduresLabel: "Procedures",
    proceduresIntro: "Urology procedures",
    proceduresHint: "Options are defined after medical evaluation",
    menuTitle: "UroPanama",
  },
  safety: {
    global:
      "The information on this site is for educational and general guidance purposes only. It does not replace a medical evaluation. In an emergency, seek urgent medical care.",
    assistant:
      "The digital assistant does not diagnose. It is only for initial guidance and appointment coordination.",
    emergency:
      "This form should not be used for medical emergencies. In an emergency, seek urgent medical care.",
    urgentStones:
      "If you have acute pain, bleeding, urinary retention, renal colic, fever, chills, or a recent post-operative concern, seek urgent medical care.",
  },
  seo: {
    homeTitle: "Dr. Carlos Brugiati | Urologist in Panama | UroPanama",
    homeDescription:
      "Specialized urology care in Panama focused on prostate conditions, kidney stones, uro-oncology, endourology, and minimally invasive surgery.",
    aboutTitle:
      "Dr. Carlos A. Brugiati | Urology, Uro-oncology and Minimally Invasive Care",
    specialtiesTitle: "Urology Specialties in Panama | UroPanama",
    stonesTitle: "Kidney Stones in Panama | Specialized Urology Evaluation",
    ureteroscopyTitle: "Ureteroscopy in Panama | Kidney Stone Care",
    bookingTitle: "Book a Urology Visit in Panama | Dr. Carlos Brugiati",
  },
  home: {
    hero: {
      eyebrow: "DR. CARLOS A. BRUGIATI · UROPANAMA",
      title: "Advanced urology and minimally invasive surgery in Panama",
      subtitle:
        "Specialized care for prostate conditions, kidney stones, uro-oncology, endourology, and laparoscopic surgery, with clear guidance from the first contact.",
      microcopy:
        "Privacy, discretion, and personalized coordination for local and international patients.",
      trust: ["Uro-oncology", "Endourology", "Percutaneous surgery", "Laparoscopy", "Minimally invasive"],
      microTrust: [
        "Privacy",
        "Specialized care",
        "Local and international patients",
        "Digital coordination",
      ],
      appointmentTitle: "Book visit",
      appointmentSubtitle: "Select initial guidance",
      protected: "Protected and confidential information",
    },
    concerns: {
      eyebrow: "Initial guidance",
      title: "What would you like to evaluate?",
      subtitle:
        "Choose your reason for visiting and learn what type of medical evaluation may apply.",
      items: [
        {
          title: "Prostate symptoms",
          text: "Urinary difficulty, elevated PSA, or prostate follow-up.",
          href: "/prostata",
        },
        {
          title: "Kidney stones",
          text: "Pain, stones, imaging studies, or related procedures.",
          href: "/calculos-renales",
        },
        {
          title: "Uro-oncology",
          text: "Evaluation of suspected, diagnosed, or follow-up urologic oncology concerns.",
          href: "/uro-oncologia",
        },
        {
          title: "Urinary discomfort",
          text: "Burning, infections, blood in urine, or urinary changes.",
          href: "/especialidades",
        },
        {
          title: "Men's health",
          text: "Sexual function, male fertility, and comprehensive urologic health.",
          href: "/salud-masculina",
        },
        {
          title: "Second opinion",
          text: "Review prior studies, diagnoses, or surgical recommendations.",
          href: "/segunda-opinion",
        },
      ],
    },
    authority: {
      eyebrow: "Trust and clarity",
      title: "Trust, clarity, and specialized care.",
      body:
        "A digital experience designed to guide patients from first contact, prepare the consultation, and make access to specialized urology care in Panama City easier.",
      stats: [
        ["5.0", "public HuliHealth profile", "no unauthorized testimonial text shown"],
        ["Specialist", "urology care", "prostate, kidney, urinary tract"],
        ["Digital access", "guidance and visit request", "availability subject to confirmation"],
      ],
      reviewsTitle: "Public opinions",
      reviews: [
        [
          "Testimonial to verify",
          "Reserved space for a real public opinion, reviewed and approved before final publication.",
          "Pending verification",
        ],
        [
          "Public opinion pending approval",
          "No testimonial text is shown until authorization or a validated public source is available.",
          "Data to confirm",
        ],
        [
          "Reputation reference",
          "The final integration can connect to verified public profiles and approved reviews.",
          "Future integration",
        ],
      ],
    },
    specialties: {
      eyebrow: "Specialties",
      title: "Specialized urology care with a focused approach.",
      subtitle:
        "A clear care system for complex conditions, minimally invasive procedures, and responsible follow-up.",
    },
    anatomy: {
      eyebrow: "Anatomy explorer",
      title: "Understand your condition through a clear visual guide.",
      subtitle:
        "An educational experience to understand which areas of the urologic system may require specialist evaluation.",
      areas: [
        {
          label: "Kidney",
          text: "May be related to kidney stones, urologic back pain, kidney tumors, or abnormal imaging studies.",
          related: ["Kidney stones", "Imaging studies", "Urologic back pain", "Kidney surgery after evaluation"],
          procedures: ["Ureteroscopy", "Laser for stones", "Percutaneous nephrolithotomy", "Specialized follow-up"],
          cta: "Book kidney evaluation",
          href: "/calculos-renales",
        },
        {
          label: "Ureter",
          text: "May be affected by stones, obstruction, or changes that require specific studies.",
          related: ["Ureter stones", "Urinary obstruction", "Urinary tract pain"],
          procedures: ["Ureteroscopy", "Laser for stones", "CT scan or ultrasound"],
          cta: "Ask about ureteroscopy",
          href: "/ureteroscopia",
        },
        {
          label: "Bladder",
          text: "May be related to urinary discomfort, infections, blood in urine, or evaluation with cystoscopy.",
          related: ["Cystoscopy", "Blood in urine", "Urinary symptoms"],
          procedures: ["Urinary evaluation", "Lab studies", "Follow-up plan"],
          cta: "Ask about urinary symptoms",
          href: "/especialidades",
        },
        {
          label: "Prostate",
          text: "The prostate may require evaluation for urinary symptoms, enlargement, elevated PSA, biopsy, or suspected prostate disease.",
          related: ["PSA", "Enlarged prostate", "Prostate biopsy", "Prostate cancer"],
          procedures: ["Prostate evaluation", "PSA review", "Preventive follow-up"],
          cta: "Book prostate evaluation",
          href: "/prostata",
        },
        {
          label: "Men's health",
          text: "Includes sexual function, male fertility, urinary symptoms, and urologic prevention.",
          related: ["Sexual function", "Male fertility", "Preventive evaluation"],
          procedures: ["Private consultation", "Labs when appropriate", "Medical follow-up"],
          cta: "Book private consultation",
          href: "/salud-masculina",
        },
      ],
      relatedLabel: "May be related to",
      proceduresLabel: "Related evaluations or procedures",
    },
    procedures: {
      eyebrow: "Procedures",
      title: "Understand your procedure before arriving at the office.",
      subtitle:
        "Simple, visual, non-graphic explanations of frequent urologic procedures.",
    },
    journey: {
      eyebrow: "Care process",
      title: "A clear path from the first contact.",
      subtitle:
        "From the first message through follow-up, the process is designed so patients know what to expect and arrive better prepared for the visit.",
      steps: [
        ["Tell us what you need", "Share your reason for consultation and preferred contact channel."],
        ["We organize the initial information", "The team or digital assistant helps organize basic details before the visit."],
        ["Visit with the specialist", "The doctor reviews symptoms, history, and available studies."],
        ["Studies when appropriate", "Depending on each case, labs, imaging, or other studies may be requested."],
        ["Clear plan and follow-up", "The goal is for you to understand your condition, options, and next steps according to medical evaluation."],
      ],
    },
    floating: {
      assistantLabel: "Assistant",
      assistantTitle: "Initial guidance assistant",
      assistantBody:
        "It can help you learn about services, prepare for consultation, or coordinate a visit. It does not diagnose or replace medical evaluation.",
      closeAssistant: "Close assistant",
      whatsappLabel: "WhatsApp",
    },
    stickyBooking: {
      title: "Would you like to coordinate a visit?",
      body: "Request availability or contact us on WhatsApp.",
      availabilityLabel: "Coordination",
      availabilityNote: "Schedules subject to confirmation",
      availability: ["Request availability"],
      minimize: "Hide coordination bar",
    },
    assistant: {
      eyebrow: "Digital assistant",
      title: "Initial guidance and appointment coordination, without replacing consultation.",
      body:
        "UroPanama's digital assistant helps organize first contact, answer general questions, and coordinate appointments. It does not diagnose or replace medical evaluation.",
      opening:
        "Hello, I am UroPanama's digital assistant. I can help you learn about services, prepare for consultation, or coordinate an appointment.",
      quick: [
        "Book visit",
        "I have kidney stones",
        "I have prostate symptoms",
        "I want a second opinion",
        "View location",
        "Talk to the team",
      ],
      responses: [
        "I can help coordinate a visit. Share your name, phone number, and reason for consultation so the team can confirm availability.",
        "I can help coordinate an evaluation. If you have fever, persistent severe pain, vomiting, or difficulty urinating, seek urgent medical care.",
        "We can help coordinate a urology evaluation. The doctor will determine which studies or next steps apply to your case.",
        "You may bring previous studies, medical reports, lab results, or imaging for review during consultation.",
        "Care is coordinated in Panama City. The team can confirm address and availability when booking.",
        "You can contact the team by WhatsApp or phone for initial guidance and appointment coordination.",
      ],
    },
    booking: {
      eyebrow: "Booking",
      title: "Schedule a visit through a private, organized experience.",
      body:
        "Request a specialized urology evaluation. The team or digital assistant can help coordinate timing and prepare initial information.",
    },
  },
  about: {
    title: "Dr. Carlos A. Brugiati",
    subtitle: "Urology, uro-oncology, endourology, and minimally invasive surgery.",
    intro:
      "Specialized care for patients seeking diagnostic clarity, responsible medical guidance, and treatment options tailored to each case.",
    sections: [
      {
        title: "Specialized medical focus",
        body:
          "Dr. Carlos A. Brugiati provides specialized care for patients with urologic conditions that require clear diagnosis, careful follow-up, and modern treatment options. His practice focuses on prostate disease, kidney stones, urologic oncology, endourology, and minimally invasive procedures.",
      },
      {
        title: "Medical clarity for better decisions",
        body:
          "Medical care should be clear, organized, and human. Each patient should understand their condition, options, and next steps before making decisions. Communication, careful evaluation, and follow-up are essential parts of the process.",
      },
    ],
    areas: ["Prostate", "Kidney stones", "Uro-oncology", "Endourology", "Laparoscopic surgery", "Men's urologic health"],
  },
  specialtiesPage: {
    title: "Urology specialties",
    subtitle:
      "Specialized care for prostate, kidney, urinary tract, and men's health conditions.",
    intro:
      "Each patient requires individual evaluation. This section provides general guidance on the main areas of urologic care and when it may be appropriate to request a visit.",
  },
  forms: {
    title: "Appointment request",
    subtitle: "Complete only the essentials. The team confirms by WhatsApp; the visit is not booked automatically.",
    submit: "Send appointment request",
    successTitle: "Thank you. Your request was registered.",
    successBody: "The team will contact you to confirm availability.",
    required: "This field is required.",
    fields: {
      name: "Full name",
      phone: "Phone / WhatsApp",
      email: "Email (optional)",
      schedule: "Preferred time",
      reason: "Reason for consultation",
      firstVisit: "Is this your first visit? (optional)",
      message: "Additional message (optional)",
      schedulePlaceholder: "Morning, afternoon, or preferred date",
      reasonPlaceholder: "Select an option",
      messagePlaceholder:
        "You may share symptoms, available studies, or questions for the consultation.",
    },
    reasons: [
      "Prostate symptoms",
      "HoLEP / prostate enlargement",
      "Kidney stones",
      "Ureteroscopy or lithotripsy",
      "Uro-oncology",
      "Urinary discomfort",
      "Erectile dysfunction",
      "Vasectomy",
      "Men's health",
      "Second opinion",
      "Other",
    ],
    firstVisitOptions: ["Yes", "No", "Not sure"],
  },
  bookingPage: {
    title: "Book visit",
    subtitle:
      "Message us on WhatsApp for the fastest coordination, or send a request if you prefer to leave the details organized.",
    intro:
      "The team reviews availability and manually confirms before reserving the visit.",
    bringTitle: "For your first visit",
    bringIntro: "If available, you may bring:",
    bring: ["Imaging studies", "Lab results", "Current medications", "Previous medical reports", "Main reason for consultation", "Questions you want to resolve"],
    reassurance: [
      ["Private and secure clinic", "Absolute discretion"],
      ["International patients", "Travel and accommodation coordination"],
      ["Timely attention", "Flexible scheduling based on availability"],
    ],
  },
  footer: {
    body: "Specialized urology care in Panama City.",
    credit: "Digital system by The Future Studio.",
    contact: "Contact",
    navigation: "Navigation",
  },
  procedures: [
    {
      title: "Ureteroscopy",
      text: "A minimally invasive procedure that allows evaluation or treatment of ureter conditions, including selected urinary stone cases.",
      href: "/ureteroscopia",
    },
    {
      title: "Laser kidney stone surgery",
      text: "A technique used in selected cases to fragment stones and support management according to size, location, and medical evaluation.",
      href: "/calculos-renales",
    },
    {
      title: "Prostate biopsy",
      text: "A study that may be indicated when clinical, lab, or imaging findings require a more specific evaluation.",
      href: "/prostata",
    },
    {
      title: "Percutaneous nephrolithotomy",
      text: "A procedure that may be considered for certain larger or more complex kidney stones.",
      href: "/calculos-renales",
    },
    {
      title: "Cystoscopy",
      text: "Visual evaluation of the bladder and urinary tract that can help study symptoms such as blood in urine or persistent urinary discomfort.",
      href: "/especialidades",
    },
    {
      title: "Renal laparoscopic surgery",
      text: "A minimally invasive surgical technique used in selected kidney cases according to diagnosis and medical assessment.",
      href: "/cirugia-laparoscopica",
    },
  ],
  specialties: {
    prostata: {
      title: "Prostate",
      subtitle:
        "Medical evaluation for urinary symptoms, elevated PSA, enlarged prostate, and suspected prostate disease.",
      intro:
        "Prostate evaluation helps organize symptoms, history, available studies, and possible next steps according to each case.",
      when: ["Difficulty or changes when urinating", "Elevated PSA or abnormal studies", "Known prostate enlargement", "Preventive follow-up or second opinion"],
      evaluation:
        "During consultation, symptoms, history, medications, labs, and available imaging are reviewed. The doctor will determine whether additional studies, follow-up, or specific procedures are appropriate.",
      next: ["Prostate evaluation", "PSA and available studies", "Biopsy if appropriate", "Medical follow-up"],
      faq: [
        ["Does elevated PSA mean cancer?", "Not necessarily. PSA can rise for different reasons. Interpretation requires medical evaluation."],
        ["What should I bring?", "Bring labs, imaging, previous reports, and current medications if available."],
      ],
      cta: "Book prostate evaluation",
    },
    uroOncologia: {
      title: "Uro-oncology",
      subtitle:
        "Evaluation and follow-up for cancer-related conditions involving the prostate, kidney, bladder, and other urologic organs.",
      intro:
        "Uro-oncology requires clarity, careful review of studies, and responsible discussion of management options according to each case.",
      when: ["Suspected or diagnosed urologic cancer", "Abnormal imaging or lab studies", "Follow-up after treatment", "Need for a specialized second opinion"],
      evaluation:
        "The visit may include review of reports, labs, imaging, biopsies, and prior recommendations to define medical next steps.",
      next: ["Study review", "Diagnostic plan", "Management options", "Specialized follow-up"],
      faq: [
        ["Can I request a second opinion?", "Yes. You may bring previous studies and reports for review during consultation."],
        ["Will treatment be decided immediately?", "Not always. The doctor may request additional studies before defining a plan."],
      ],
      cta: "Request uro-oncology evaluation",
    },
    endourologia: {
      title: "Endourology",
      subtitle:
        "Minimally invasive procedures for evaluating or treating urinary tract conditions with precision instruments.",
      intro:
        "Endourology may be part of the management of stones, obstruction, and other urologic conditions according to medical assessment.",
      when: ["Urinary tract stones", "Obstruction or persistent discomfort", "Need for visual evaluation of the urinary tract", "Minimally invasive procedures considered by the doctor"],
      evaluation:
        "The indication depends on symptoms, imaging studies, lab results, and the patient's general condition.",
      next: ["Ureteroscopy", "Cystoscopy", "Laser treatment", "Post-procedure follow-up"],
      faq: [
        ["Is a procedure always needed?", "No. A medical evaluation is required first to determine whether it applies."],
        ["Is it the same as open surgery?", "No. These techniques may be less invasive in selected cases."],
      ],
      cta: "Explore procedures",
    },
    cirugiaLaparoscopica: {
      title: "Laparoscopic surgery",
      subtitle:
        "Minimally invasive surgical techniques used in selected urologic cases.",
      intro:
        "Laparoscopic surgery may offer an approach option for some diagnoses, always according to medical assessment.",
      when: ["Selected kidney conditions", "Prior surgical recommendation", "Need to review minimally invasive options", "Second opinion before surgery"],
      evaluation:
        "Surgical decisions are based on diagnosis, studies, general condition, and detailed medical discussion.",
      next: ["Diagnosis review", "Preoperative studies", "Approach options", "Follow-up"],
      faq: [
        ["Does laparoscopy apply to every case?", "No. It depends on diagnosis and medical evaluation."],
        ["Does it guarantee fast recovery?", "No recovery time should be promised. Recovery depends on each patient and procedure."],
      ],
      cta: "Request guidance",
    },
    saludMasculina: {
      title: "Men's health",
      subtitle:
        "Medical care for sexual function, male fertility, urinary symptoms, and urologic prevention.",
      intro:
        "Men's urologic health requires a private, organized, nonjudgmental conversation to identify causes and next steps.",
      when: ["Changes in sexual function", "Questions about male fertility", "Urinary discomfort or pelvic pain", "Prevention and urologic checkup"],
      evaluation:
        "The visit reviews symptoms, history, medications, lifestyle, and available studies to guide responsible evaluation.",
      next: ["Clinical evaluation", "Labs when appropriate", "Preventive guidance", "Follow-up"],
      faq: [
        ["Is the visit confidential?", "Yes. Privacy and discretion are essential parts of care."],
        ["Is special preparation required?", "You may bring current medications and previous studies if available."],
      ],
      cta: "Book consultation",
    },
    segundaOpinion: {
      title: "Urology second opinion",
      subtitle:
        "Review diagnoses, studies, or surgical recommendations before making a medical decision.",
      intro:
        "A second opinion can help you better understand a diagnosis, review prior studies, and organize questions before deciding next steps.",
      when: ["You already have a diagnosis or suspected condition", "A surgery or procedure was recommended", "You have studies, labs, or imaging available", "You want more clarity before deciding"],
      evaluation:
        "During consultation, reports, imaging, labs, history, and previous recommendations are reviewed. The goal is responsible medical guidance, not emergency care replacement.",
      next: ["Study review", "Question list", "Explanation of options", "Follow-up plan"],
      faq: [
        ["What should I bring?", "Imaging studies, medical reports, labs, biopsies, and prior recommendations if available."],
        ["Can a second opinion change my treatment?", "It may confirm, clarify, or broaden options. The final decision depends on medical evaluation."],
      ],
      cta: "Request second opinion",
    },
    calculosRenales: {
      title: "Kidney stones",
      subtitle:
        "Evaluation and treatment of stones in the kidneys or urinary tract.",
      intro:
        "Kidney stones are solid formations that may appear in the kidneys or move through the urinary tract. Medical evaluation helps determine size, location, and stone characteristics.",
      when: ["Severe lower back or flank pain", "Blood in urine", "Burning, urgency, or urinary discomfort", "Fever, chills, or vomiting associated with symptoms"],
      evaluation:
        "Evaluation may include symptom review, history, physical exam, urinalysis, lab work, ultrasound, CT scan, or other imaging studies.",
      next: ["Observation and follow-up", "Ureteroscopy", "Laser surgery", "Percutaneous nephrolithotomy"],
      faq: [
        ["Do all kidney stones need surgery?", "Not necessarily. Management depends on size, location, symptoms, and the patient's general condition."],
        ["When should I seek urgent care?", "Seek urgent care if you have fever, persistent severe pain, vomiting, marked weakness, difficulty urinating, or rapidly worsening symptoms."],
        ["Can ureteroscopy treat stones?", "It may be indicated in selected cases, especially when stones are located in the ureter or urinary system."],
      ],
      cta: "Book kidney stone evaluation",
    },
    ureteroscopia: {
      title: "Ureteroscopy",
      subtitle:
        "A minimally invasive procedure to evaluate or treat stones and ureter conditions.",
      intro:
        "Ureteroscopy allows access to the ureter and urinary system using specialized instruments. It may be used to evaluate or treat stones and other conditions according to location, size, and characteristics.",
      when: ["Stones located in the ureter", "Pain related to urinary obstruction", "Evaluation of certain urinary tract changes", "Cases where the doctor considers direct observation or treatment necessary"],
      evaluation:
        "Preparation depends on the clinical case, available studies, and the doctor's instructions. During consultation, the required steps are explained if the procedure becomes necessary.",
      next: ["Imaging review", "Indicated preparation", "Procedure when appropriate", "Post-procedure follow-up"],
      faq: [
        ["Does it always require hospitalization?", "It depends on the case, procedure performed, and patient condition."],
        ["Is it used for kidney stones?", "It may be used in selected stone cases, especially when located in the ureter."],
        ["Do I need studies first?", "Imaging, labs, or other tests may be needed before defining appropriate management."],
      ],
      cta: "Ask about ureteroscopy",
    },
  },
} as const;

export const translations = { es, en } as const;
export type Translation = typeof es;
export type { SpecialtyKey };
