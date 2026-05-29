import type { SpecialtyKey } from "./translations";
import type { ProcedureKey } from "./procedurePages";

type Language = "es" | "en";
type FaqTuple = [string, string];

export const homeFaqs: Record<Language, FaqTuple[]> = {
  es: [
    [
      "¿Cuándo debo consultar con un urólogo?",
      "Debe considerar una evaluación si presenta síntomas urinarios, infecciones urinarias, cálculos, sangre en la orina, molestias prostáticas, dolor testicular, dificultad para orinar o dudas sobre función sexual e infertilidad masculina.",
    ],
    [
      "¿Qué síntomas requieren atención urgente?",
      "Dolor intenso, fiebre, incapacidad para orinar, sangre abundante en la orina, inflamación importante, dolor testicular agudo, vómitos persistentes o síntomas severos asociados a infección urinaria requieren atención médica inmediata.",
    ],
    [
      "¿Qué debo llevar a mi primera cita?",
      "Lleve identificación, lista de medicamentos, estudios previos como laboratorios, ultrasonidos, tomografías o resonancias, informes médicos y una lista corta de preguntas o síntomas principales.",
    ],
    [
      "¿Cómo puedo agendar una cita?",
      "Puede agendar por WhatsApp, llamada telefónica o el formulario del sitio. El equipo confirma disponibilidad, sede y próximos pasos por el canal indicado.",
    ],
    [
      "¿Dónde atiende el Dr. Brugiati?",
      "La dirección principal es The Panama Clinic, Torre B, piso 21, consultorio 10-11. También cuenta con atención en Hospiten Paitilla, Hospital Pacífica Salud Costa del Este y Clínica Hospital San Fernando según disponibilidad.",
    ],
    [
      "¿Aceptan seguros privados?",
      "Sí. Se trabaja con múltiples seguros nacionales e internacionales. La cobertura, copago o reembolso se confirma caso por caso según la póliza del paciente.",
    ],
    [
      "¿El asistente digital da diagnósticos?",
      "No. El asistente ayuda a orientar, organizar la solicitud y explicar información general. No sustituye una evaluación médica ni define diagnósticos o tratamientos.",
    ],
  ],
  en: [
    [
      "When should I see a urologist?",
      "Consider an evaluation for urinary symptoms, infections, kidney stones, blood in the urine, prostate concerns, testicular pain, difficulty urinating, sexual function concerns, or male fertility questions.",
    ],
    [
      "Which symptoms need urgent attention?",
      "Severe pain, fever, inability to urinate, heavy blood in the urine, significant swelling, acute testicular pain, persistent vomiting, or severe urinary infection symptoms require immediate medical attention.",
    ],
    [
      "What should I bring to my first visit?",
      "Bring identification, a medication list, prior studies such as labs, ultrasound, CT or MRI reports, medical summaries, and a short list of your main symptoms or questions.",
    ],
    [
      "How can I schedule an appointment?",
      "You can request an appointment by WhatsApp, phone, or the website form. The team confirms availability, location, and next steps through your selected contact channel.",
    ],
    [
      "Where does Dr. Brugiati see patients?",
      "The main office is The Panama Clinic, Tower B, 21st floor, office 10-11. Care is also available at Hospiten Paitilla, Hospital Pacífica Salud Costa del Este, and Clínica Hospital San Fernando depending on availability.",
    ],
    [
      "Do you accept private insurance?",
      "Yes. The practice works with multiple national and international insurers. Coverage, copay, or reimbursement details are confirmed case by case according to each policy.",
    ],
    [
      "Does the digital assistant provide diagnoses?",
      "No. The assistant helps with orientation, intake, and general information. It does not replace medical evaluation or define diagnoses or treatments.",
    ],
  ],
};

export const bookingFaqs: Record<Language, FaqTuple[]> = {
  es: [
    [
      "¿Cómo puedo agendar una cita?",
      "Puede escribir por WhatsApp al +507 6314-5514, llamar al mismo número o enviar el formulario del sitio. La cita se confirma manualmente según disponibilidad.",
    ],
    [
      "¿Cuál es el horario de atención?",
      "El horario regular es de lunes a viernes de 12:00 p.m. a 6:00 p.m. y sábados de 8:00 a.m. a 12:00 p.m., sujeto a agenda y sede disponible.",
    ],
    [
      "¿Dónde está ubicado el consultorio?",
      "La dirección principal es The Panama Clinic, Torre B, piso 21, consultorio 10-11. También hay atención en distintas sedes según coordinación previa.",
    ],
    [
      "¿Qué debo llevar a la consulta?",
      "Lleve identificación, lista de medicamentos, estudios previos, informes médicos y cualquier pregunta que desee resolver durante la visita.",
    ],
    [
      "¿Aceptan seguros privados?",
      "Sí. Se trabaja con seguros nacionales e internacionales. El equipo puede orientar sobre cobertura, copagos, deducibles o documentos para reembolso.",
    ],
    [
      "¿Cuánto demora conseguir una cita?",
      "Depende de la sede y disponibilidad de agenda. El equipo buscará ofrecer la opción más pronta y conveniente para el paciente.",
    ],
    [
      "¿Realizan teleconsulta o atienden pacientes internacionales?",
      "Sí. Hay teleconsulta y orientación inicial en casos seleccionados. También se atienden pacientes internacionales y se puede coordinar una planificación previa al viaje.",
    ],
  ],
  en: [
    [
      "How can I schedule an appointment?",
      "You can message WhatsApp at +507 6314-5514, call the same number, or submit the website form. Appointments are confirmed manually based on availability.",
    ],
    [
      "What are the office hours?",
      "Regular hours are Monday to Friday from 12:00 p.m. to 6:00 p.m. and Saturdays from 8:00 a.m. to 12:00 p.m., depending on schedule and location availability.",
    ],
    [
      "Where is the office located?",
      "The main address is The Panama Clinic, Tower B, 21st floor, office 10-11. Care is also available at different locations with prior coordination.",
    ],
    [
      "What should I bring to the visit?",
      "Bring identification, a medication list, prior studies, medical reports, and any questions you would like to discuss during the visit.",
    ],
    [
      "Do you accept private insurance?",
      "Yes. The practice works with national and international insurers. The team can guide coverage, copays, deductibles, or reimbursement documents.",
    ],
    [
      "How long does it take to get an appointment?",
      "Timing depends on location and schedule availability. The team will look for the earliest practical option for the patient.",
    ],
    [
      "Do you offer teleconsultation or see international patients?",
      "Yes. Teleconsultation and initial orientation are available in selected cases. International patients can also coordinate evaluation and planning before travel.",
    ],
  ],
};

export const specialtyFaqOverrides: Record<
  Language,
  Partial<Record<SpecialtyKey, FaqTuple[]>>
> = {
  es: {
    prostata: [
      [
        "¿Qué síntomas puede dar la próstata aumentada?",
        "Puede producir chorro débil, intermitencia, goteo después de orinar, dificultad para iniciar la micción, levantarse varias veces en la noche, urgencia urinaria y sensación de vaciamiento incompleto.",
      ],
      [
        "¿A qué edad debo revisar la próstata?",
        "La evaluación prostática suele recomendarse desde los 40 a 50 años, según antecedentes familiares, factores de riesgo, síntomas y criterio médico.",
      ],
      [
        "¿Qué es el PSA?",
        "El PSA es un examen de sangre utilizado para evaluar la próstata. Puede elevarse por crecimiento prostático, inflamación, infección o cáncer, por lo que debe interpretarse junto con la evaluación clínica.",
      ],
      [
        "¿El PSA elevado siempre significa cáncer?",
        "No. Un PSA elevado no siempre significa cáncer. También puede relacionarse con crecimiento benigno de la próstata, prostatitis, infección u otras condiciones.",
      ],
      [
        "¿El tacto rectal es necesario?",
        "En algunos pacientes sí, porque complementa la evaluación prostática. La decisión depende de edad, síntomas, PSA, antecedentes y objetivo de la consulta.",
      ],
      [
        "¿El examen de próstata duele?",
        "Generalmente no duele. Puede causar una molestia leve y suele durar pocos segundos cuando está indicado.",
      ],
      [
        "¿Cómo se detecta el cáncer de próstata?",
        "Se evalúa con historia clínica, examen físico, PSA, resonancia y, cuando corresponde, biopsia de próstata.",
      ],
      [
        "¿La próstata aumentada significa cáncer?",
        "No. El crecimiento prostático benigno es frecuente y no siempre se relaciona con cáncer, pero los síntomas y estudios deben revisarse de forma adecuada.",
      ],
      [
        "¿Qué debo llevar a la consulta de próstata?",
        "Lleve resultados de PSA, ultrasonidos, resonancias, biopsias previas, lista de medicamentos y una descripción clara de sus síntomas urinarios.",
      ],
      [
        "¿Cuándo debo consultar con prontitud?",
        "Consulte con prontitud si hay sangre en la orina, fiebre, dificultad severa para orinar, retención urinaria, dolor importante o empeoramiento rápido de los síntomas.",
      ],
    ],
    calculosRenales: [
      [
        "¿Cómo sé si tengo cálculos renales?",
        "Algunos cálculos no dan síntomas hasta que causan obstrucción. Cuando ocurre, puede aparecer dolor intenso en la espalda o costado, sangre en la orina, náuseas, molestias urinarias o fiebre.",
      ],
      [
        "¿Los cálculos renales pueden salir solos?",
        "Sí. Algunos cálculos pequeños pueden eliminarse espontáneamente, pero dolor intenso, fiebre, vómitos o infección requieren valoración médica.",
      ],
      [
        "¿Cómo se eliminan las piedras en los riñones?",
        "Depende del tamaño, dureza y ubicación. Pueden manejarse con medicamentos, láser, litotricia extracorpórea con ondas de choque o cirugía mínimamente invasiva.",
      ],
      [
        "¿Cuánta agua debo tomar al día?",
        "En general se recomiendan 2 a 3 litros diarios, siempre que no exista contraindicación por insuficiencia cardiaca, enfermedad renal, hepatopatía u otra condición médica.",
      ],
      [
        "¿Qué alimentos favorecen los cálculos renales?",
        "El exceso de sal, sodas, baja ingesta de agua y algunas dietas altas en proteínas pueden aumentar el riesgo en ciertos pacientes.",
      ],
      [
        "¿Cuándo debo ir a urgencias por un cálculo?",
        "Debe acudir si presenta dolor intenso que no cede, fiebre, vómitos persistentes, incapacidad para orinar, escalofríos o deterioro general.",
      ],
      [
        "¿Qué estudios debo llevar?",
        "Traiga ultrasonidos, tomografías, radiografías, laboratorios, urocultivos e informes previos relacionados con cálculos, riñones o vías urinarias.",
      ],
      [
        "¿Los cálculos pueden volver a aparecer?",
        "Sí. Algunos pacientes tienen tendencia a formar nuevos cálculos, por lo que la prevención, hidratación, dieta y seguimiento son importantes.",
      ],
      [
        "¿Qué es un catéter doble J?",
        "Es un tubo delgado interno que se coloca entre el riñón y la vejiga para facilitar el drenaje de la orina en casos seleccionados.",
      ],
      [
        "¿Qué síntomas requieren atención urgente con un doble J?",
        "Fiebre, dolor intenso, incapacidad para orinar, sangrado abundante o vómitos persistentes requieren evaluación médica inmediata.",
      ],
    ],
    uroOncologia: [
      [
        "¿Cuándo debo pedir una evaluación uro-oncológica?",
        "Debe solicitar evaluación si hay sospecha o diagnóstico de cáncer de próstata, vejiga, riñón, testículo o pene, o si un estudio muestra una lesión que requiere revisión especializada.",
      ],
      [
        "¿Cómo se detecta el cáncer de próstata?",
        "Se detecta mediante evaluación médica, PSA, tacto rectal, resonancia y biopsia cuando está indicada.",
      ],
      [
        "¿El cáncer de próstata tiene cura?",
        "Cuando se detecta de forma temprana, muchos casos pueden tratarse exitosamente. El plan depende de etapa, riesgo, salud general y objetivos del paciente.",
      ],
      [
        "¿Qué síntomas pueden indicar cáncer de vejiga?",
        "La sangre en la orina, urgencia urinaria y molestias persistentes deben evaluarse, especialmente si aparecen sin explicación clara.",
      ],
      [
        "¿Qué síntomas pueden indicar cáncer renal?",
        "Puede sospecharse por dolor lumbar, sangre en la orina o hallazgos en estudios de imagen. Algunos casos se detectan incidentalmente.",
      ],
      [
        "¿Qué significa sangre en la orina?",
        "Puede relacionarse con infecciones, cálculos, inflamación o tumores urinarios. Aunque no siempre sea visible, la hematuria debe ser evaluada.",
      ],
      [
        "¿Qué estudios debo llevar?",
        "Lleve biopsias, PSA, resonancias, tomografías, ultrasonidos, laboratorios, informes de patología y cualquier resumen médico disponible.",
      ],
      [
        "¿Puedo pedir una segunda opinión?",
        "Sí. Una segunda opinión puede ayudar a revisar diagnóstico, etapa, opciones de tratamiento y prioridad de los próximos pasos.",
      ],
      [
        "¿La consulta define si necesito cirugía?",
        "La consulta permite revisar si cirugía, vigilancia, tratamiento médico, estudios adicionales u otras alternativas son apropiadas según el caso.",
      ],
      [
        "¿Puedo ir acompañado?",
        "Sí. Puede asistir con un familiar o persona de confianza, especialmente si desea revisar estudios, decisiones terapéuticas o próximos pasos.",
      ],
    ],
    saludMasculina: [
      [
        "¿La disfunción eréctil tiene tratamiento?",
        "Sí. Puede mejorar significativamente en muchos casos. El manejo depende de la causa e incluye hábitos, medicamentos, terapias especializadas y tratamientos avanzados.",
      ],
      [
        "¿La diabetes puede afectar la erección?",
        "Sí. La diabetes puede afectar la circulación y los nervios relacionados con la erección, por lo que conviene evaluar salud metabólica y vascular.",
      ],
      [
        "¿Qué causa la disminución del deseo sexual?",
        "Puede relacionarse con estrés, hormonas, medicamentos, diabetes, hipertensión, dislipidemia, ansiedad u otras condiciones médicas.",
      ],
      [
        "¿La infertilidad masculina tiene solución?",
        "Sí. Muchos casos pueden tratarse o mejorar al identificar causas hormonales, infecciosas, varicocele, alteraciones del semen o problemas de transporte espermático.",
      ],
      [
        "¿La vasectomía afecta la vida sexual?",
        "No. La vasectomía no afecta la erección, el deseo sexual ni la producción hormonal.",
      ],
      [
        "¿La vasectomía es reversible?",
        "En algunos casos sí, aunque el éxito depende del tiempo transcurrido, técnica previa y características de cada paciente.",
      ],
      [
        "¿Cuándo debo consultar por salud masculina?",
        "Consulte si hay dificultad de erección, cambios en deseo sexual, dolor testicular, problemas de fertilidad, molestias urinarias o dudas sobre vasectomía.",
      ],
      [
        "¿La consulta es privada?",
        "Sí. La evaluación se maneja con confidencialidad y se enfoca en entender síntomas, antecedentes y objetivos del paciente.",
      ],
      [
        "¿Los problemas urinarios afectan la vida sexual?",
        "Sí. Algunas enfermedades urinarias pueden afectar función sexual, sueño, bienestar y calidad de vida.",
      ],
      [
        "¿Qué debo llevar?",
        "Lleve medicamentos actuales, estudios previos, análisis hormonales o seminales si los tiene, y una descripción clara de síntomas y objetivos de consulta.",
      ],
    ],
    ureteroscopia: [
      [
        "¿Qué es una ureteroscopia?",
        "Es un procedimiento endoscópico que permite entrar por la vía urinaria para evaluar o tratar cálculos y otras obstrucciones sin incisiones externas.",
      ],
      [
        "¿Cuándo se utiliza láser?",
        "El láser puede usarse para fragmentar cálculos según tamaño, dureza, ubicación y características del caso.",
      ],
      [
        "¿Qué es un catéter doble J o stent ureteral?",
        "Es un tubo delgado interno que se coloca entre el riñón y la vejiga para facilitar el drenaje urinario después de ciertos procedimientos o ante obstrucción.",
      ],
      [
        "¿El doble J se ve por fuera del cuerpo?",
        "No. Habitualmente queda completamente interno y no es visible desde fuera.",
      ],
      [
        "¿Qué síntomas son normales con un doble J?",
        "Puede causar ardor al orinar, urgencia, mayor frecuencia urinaria, sangre leve en la orina o molestias lumbares temporales.",
      ],
      [
        "¿Qué síntomas requieren atención urgente con doble J?",
        "Fiebre, dolor intenso, incapacidad para orinar, sangrado abundante, coágulos importantes o vómitos persistentes requieren valoración inmediata.",
      ],
      [
        "¿Cómo se retira el doble J?",
        "Habitualmente se retira mediante cistoscopia, un procedimiento rápido y ambulatorio. La indicación depende del caso.",
      ],
      [
        "¿Puedo hacer actividad normal con doble J?",
        "Muchas personas pueden caminar, trabajar y hacer actividades cotidianas con precauciones, evitando esfuerzos intensos si hay dolor o indicación médica.",
      ],
    ],
  },
  en: {
    prostata: [
      [
        "What symptoms can an enlarged prostate cause?",
        "It may cause a weak stream, intermittent flow, dribbling after urination, difficulty starting, waking at night to urinate, urgency, and incomplete emptying.",
      ],
      [
        "At what age should I check my prostate?",
        "Prostate evaluation is commonly recommended from ages 40 to 50 depending on family history, risk factors, symptoms, and medical judgment.",
      ],
      [
        "What is PSA?",
        "PSA is a blood test used to evaluate the prostate. It can rise due to enlargement, inflammation, infection, or cancer, so it must be interpreted with clinical context.",
      ],
      [
        "Does an elevated PSA always mean cancer?",
        "No. Elevated PSA does not always mean cancer. It can also be related to benign prostate enlargement, prostatitis, infection, or other conditions.",
      ],
      [
        "Is a rectal exam necessary?",
        "In some patients, yes, because it complements prostate evaluation. The decision depends on age, symptoms, PSA, history, and the goal of the visit.",
      ],
      [
        "Does the prostate exam hurt?",
        "It usually does not hurt. It may cause mild discomfort and typically lasts only a few seconds when indicated.",
      ],
      [
        "How is prostate cancer detected?",
        "It is evaluated with medical history, physical exam, PSA, MRI, and prostate biopsy when appropriate.",
      ],
      [
        "Does an enlarged prostate mean cancer?",
        "No. Benign prostate enlargement is common and is not always related to cancer, but symptoms and studies should be reviewed properly.",
      ],
      [
        "What should I bring to a prostate visit?",
        "Bring PSA results, ultrasound, MRI, prior biopsy reports, medication list, and a clear description of your urinary symptoms.",
      ],
      [
        "When should I seek prompt care?",
        "Seek care promptly for blood in the urine, fever, severe difficulty urinating, urinary retention, significant pain, or rapidly worsening symptoms.",
      ],
    ],
    calculosRenales: [
      [
        "How do I know if I have kidney stones?",
        "Some stones cause no symptoms until they obstruct. Symptoms may include severe back or flank pain, blood in the urine, nausea, urinary discomfort, or fever.",
      ],
      [
        "Can kidney stones pass on their own?",
        "Yes. Some small stones can pass spontaneously, but severe pain, fever, vomiting, or infection requires medical evaluation.",
      ],
      [
        "How are kidney stones removed?",
        "Treatment depends on size, hardness, and location. Options may include medication, laser treatment, shock wave lithotripsy, or minimally invasive surgery.",
      ],
      [
        "How much water should I drink per day?",
        "In general, 2 to 3 liters daily may be recommended unless restricted by heart failure, kidney disease, liver disease, or another medical condition.",
      ],
      [
        "Which foods increase stone risk?",
        "Excess salt, sodas, low water intake, and some high-protein diets may increase stone risk in certain patients.",
      ],
      [
        "When should I go to urgent care for a stone?",
        "Go urgently for severe pain that does not improve, fever, persistent vomiting, inability to urinate, chills, or worsening general condition.",
      ],
      [
        "What studies should I bring?",
        "Bring ultrasound, CT scans, X-rays, lab tests, urine cultures, and prior reports related to stones, kidneys, or urinary tract issues.",
      ],
      [
        "Can stones come back?",
        "Yes. Some patients tend to form new stones, so prevention, hydration, diet, and follow-up matter.",
      ],
      [
        "What is a double-J stent?",
        "It is a thin internal tube placed between the kidney and bladder to help urine drain in selected cases.",
      ],
      [
        "Which symptoms are urgent with a double-J stent?",
        "Fever, severe pain, inability to urinate, heavy bleeding, or persistent vomiting require immediate medical evaluation.",
      ],
    ],
    uroOncologia: [
      [
        "When should I request a uro-oncology evaluation?",
        "Request evaluation for suspected or diagnosed prostate, bladder, kidney, testicular, or penile cancer, or when an imaging study shows a lesion needing specialist review.",
      ],
      [
        "How is prostate cancer detected?",
        "It is detected through medical evaluation, PSA, rectal exam, MRI, and biopsy when indicated.",
      ],
      [
        "Is prostate cancer curable?",
        "When detected early, many cases can be treated successfully. The plan depends on stage, risk, general health, and patient goals.",
      ],
      [
        "Which symptoms may suggest bladder cancer?",
        "Blood in the urine, urinary urgency, and persistent urinary discomfort should be evaluated, especially when there is no clear explanation.",
      ],
      [
        "Which symptoms may suggest kidney cancer?",
        "It may be suspected with flank pain, blood in the urine, or findings on imaging studies. Some cases are found incidentally.",
      ],
      [
        "What does blood in the urine mean?",
        "It may be related to infection, stones, inflammation, or urinary tumors. Hematuria should be evaluated even when it is not always visible.",
      ],
      [
        "What studies should I bring?",
        "Bring biopsy reports, PSA, MRI, CT scans, ultrasound, lab tests, pathology reports, and any available medical summary.",
      ],
      [
        "Can I request a second opinion?",
        "Yes. A second opinion can help review diagnosis, staging, treatment options, and priority next steps.",
      ],
      [
        "Will the visit define whether I need surgery?",
        "The visit helps determine whether surgery, surveillance, medical treatment, additional studies, or other options are appropriate.",
      ],
      [
        "Can I bring someone with me?",
        "Yes. You may bring a family member or trusted person, especially when reviewing studies, treatment decisions, or next steps.",
      ],
    ],
    saludMasculina: [
      [
        "Does erectile dysfunction have treatment?",
        "Yes. Many cases improve significantly. Management depends on the cause and may include lifestyle changes, medications, specialized therapies, and advanced treatments.",
      ],
      [
        "Can diabetes affect erections?",
        "Yes. Diabetes can affect circulation and nerves involved in erections, so metabolic and vascular health should be evaluated.",
      ],
      [
        "What causes low sexual desire?",
        "It may be related to stress, hormones, medications, diabetes, hypertension, dyslipidemia, anxiety, or other medical conditions.",
      ],
      [
        "Can male infertility be treated?",
        "Yes. Many cases can be treated or improved by identifying hormonal, infectious, varicocele, semen, or sperm transport factors.",
      ],
      [
        "Does vasectomy affect sexual life?",
        "No. Vasectomy does not affect erections, sexual desire, or hormone production.",
      ],
      [
        "Is vasectomy reversible?",
        "In some cases, yes, although success depends on time since vasectomy, prior technique, and patient-specific factors.",
      ],
      [
        "When should I consult for men's health?",
        "Consult for erection difficulty, desire changes, testicular pain, fertility concerns, urinary symptoms, or questions about vasectomy.",
      ],
      [
        "Is the visit private?",
        "Yes. The evaluation is confidential and focuses on understanding symptoms, history, and patient goals.",
      ],
      [
        "Can urinary problems affect sexual life?",
        "Yes. Some urinary conditions can affect sexual function, sleep, well-being, and quality of life.",
      ],
      [
        "What should I bring?",
        "Bring current medications, prior studies, hormone or semen tests if available, and a clear description of symptoms and visit goals.",
      ],
    ],
    ureteroscopia: [
      [
        "What is ureteroscopy?",
        "It is an endoscopic procedure that enters through the urinary tract to evaluate or treat stones and selected obstructions without external incisions.",
      ],
      [
        "When is laser used?",
        "Laser may be used to fragment stones depending on size, hardness, location, and the details of the case.",
      ],
      [
        "What is a double-J stent?",
        "It is a thin internal tube placed between the kidney and bladder to help urine drain after certain procedures or during obstruction.",
      ],
      [
        "Is the double-J visible outside the body?",
        "No. It is usually completely internal and not visible externally.",
      ],
      [
        "What symptoms are normal with a double-J stent?",
        "Burning with urination, urgency, increased frequency, mild blood in the urine, or temporary flank discomfort may occur.",
      ],
      [
        "Which double-J symptoms need urgent attention?",
        "Fever, severe pain, inability to urinate, heavy bleeding, large clots, or persistent vomiting require immediate evaluation.",
      ],
      [
        "How is the double-J removed?",
        "It is usually removed by cystoscopy, a quick outpatient procedure. The specific indication depends on the case.",
      ],
      [
        "Can I do normal activities with a double-J stent?",
        "Many people can walk, work, and do daily activities with precautions, avoiding intense effort if pain or medical instructions require it.",
      ],
    ],
  },
};

export const procedureFaqOverrides: Record<
  Language,
  Partial<Record<ProcedureKey, FaqTuple[]>>
> = {
  es: {
    ureteroscopia: [
      [
        "¿Qué es una ureteroscopia?",
        "Es un procedimiento endoscópico que permite evaluar o tratar ciertas condiciones del uréter y vías urinarias, incluyendo cálculos seleccionados, sin incisiones externas.",
      ],
      [
        "¿Siempre se usa láser?",
        "No. El uso de láser depende del tipo de cálculo, ubicación, tamaño, dureza, equipo disponible y criterio médico.",
      ],
      [
        "¿Qué es un catéter doble J?",
        "Es un tubo interno que se coloca entre el riñón y la vejiga para facilitar el drenaje de la orina después de ciertos procedimientos o ante obstrucción.",
      ],
      [
        "¿El doble J produce molestias?",
        "Puede causar ardor, urgencia, aumento de frecuencia urinaria, molestias lumbares o sangre leve en la orina mientras está colocado.",
      ],
      [
        "¿Cuándo debo consultar urgente después del procedimiento?",
        "Fiebre, dolor intenso, incapacidad para orinar, sangrado abundante, vómitos persistentes o deterioro general requieren atención médica inmediata.",
      ],
      [
        "¿Qué debo llevar a la consulta?",
        "Lleve tomografías, ultrasonidos, laboratorios, urocultivos, reportes de urgencias, medicamentos actuales y alergias.",
      ],
    ],
    laserCalculos: [
      [
        "¿Cómo se eliminan las piedras con láser?",
        "El láser puede fragmentar cálculos durante un procedimiento endoscópico para facilitar su manejo. La indicación depende de tamaño, dureza y ubicación.",
      ],
      [
        "¿El láser sirve para todos los cálculos?",
        "No. Algunos cálculos pueden requerir observación, litotricia extracorpórea, nefrolitotomía percutánea u otra estrategia.",
      ],
      [
        "¿Los cálculos pueden volver a aparecer?",
        "Sí. Algunos pacientes tienen tendencia a formar nuevos cálculos, por lo que se revisan hidratación, dieta, antecedentes y prevención.",
      ],
      [
        "¿Cuándo debo acudir a urgencias?",
        "Dolor intenso, fiebre, vómitos persistentes, escalofríos, incapacidad para orinar o sospecha de infección requieren atención inmediata.",
      ],
      [
        "¿Qué estudios ayudan a decidir?",
        "La tomografía, ultrasonido, laboratorios, examen de orina y urocultivo pueden ayudar a definir la mejor opción.",
      ],
    ],
    cistoscopia: [
      [
        "¿Qué es una cistoscopia?",
        "Es un procedimiento que permite observar la uretra y la vejiga con una cámara especializada.",
      ],
      [
        "¿La cistoscopia duele?",
        "Generalmente produce molestias leves. Puede realizarse con anestesia local o sedación según el caso y criterio médico.",
      ],
      [
        "¿Cuándo puede indicarse?",
        "Puede considerarse ante sangre en la orina, síntomas urinarios persistentes, sospecha de estrechez, seguimiento de vejiga u otros hallazgos.",
      ],
      [
        "¿Qué síntomas debo vigilar después?",
        "Ardor leve o aumento de frecuencia puede ocurrir. Fiebre, dolor intenso, sangrado importante o incapacidad para orinar requieren valoración.",
      ],
      [
        "¿Qué debo llevar?",
        "Lleve exámenes de orina, urocultivos, imágenes, informes previos y lista de medicamentos, especialmente anticoagulantes.",
      ],
    ],
    ureteroscopiaFlexible: [
      [
        "¿Para qué sirve la ureteroscopia flexible?",
        "Permite acceder al riñón por vía endoscópica para evaluar o tratar cálculos seleccionados sin incisiones externas.",
      ],
      [
        "¿Siempre se coloca doble J?",
        "No siempre. La decisión depende de inflamación, manipulación, obstrucción, seguridad del drenaje y criterio médico.",
      ],
      [
        "¿Qué molestias puede causar el doble J?",
        "Puede causar ardor, urgencia, frecuencia urinaria, sangre leve en la orina y molestias lumbares temporales.",
      ],
      [
        "¿Cuándo se retira el doble J?",
        "El tiempo varía según el caso. Debe retirarse en el plazo indicado para evitar infección, incrustación o complicaciones.",
      ],
      [
        "¿Qué síntomas son urgentes?",
        "Fiebre, dolor intenso, vómitos persistentes, sangrado abundante o imposibilidad de orinar requieren atención inmediata.",
      ],
    ],
    ureteroscopiaSemirrigida: [
      [
        "¿Para qué casos se usa la ureteroscopia semirrígida?",
        "Suele conversarse para cálculos ubicados en el uréter o situaciones donde el acceso endoscópico al uréter es adecuado.",
      ],
      [
        "¿Es igual que la flexible?",
        "No. Ambas son endoscópicas, pero usan instrumentos y escenarios distintos según ubicación, anatomía y objetivo del procedimiento.",
      ],
      [
        "¿Puede aliviar dolor por cálculo?",
        "Puede ser parte del manejo si hay cálculo u obstrucción que lo justifique, pero primero se revisan estudios y seguridad del paciente.",
      ],
      [
        "¿Qué debo vigilar después?",
        "Dolor que no cede, fiebre, escalofríos, sangrado importante o imposibilidad de orinar requieren atención urgente.",
      ],
    ],
    disfuncionErectil: [
      [
        "¿La disfunción eréctil tiene tratamiento?",
        "Sí. Muchas veces puede mejorar con evaluación adecuada, cambios de hábitos, medicamentos, terapias especializadas o tratamientos avanzados según la causa.",
      ],
      [
        "¿La diabetes puede afectar la erección?",
        "Sí. Puede afectar circulación y nervios relacionados con la erección, por lo que la salud metabólica y cardiovascular debe revisarse.",
      ],
      [
        "¿Qué causa la disminución del deseo sexual?",
        "Puede relacionarse con estrés, hormonas, medicamentos, diabetes, hipertensión, dislipidemia, ansiedad u otras condiciones.",
      ],
      [
        "¿Debo consultar aunque me dé vergüenza?",
        "Sí. La consulta es confidencial y se enfoca en identificar causas y opciones seguras para cada paciente.",
      ],
    ],
    vasectomia: [
      [
        "¿La vasectomía afecta la vida sexual?",
        "No. La vasectomía no afecta la erección, el deseo sexual ni la producción hormonal.",
      ],
      [
        "¿La vasectomía es reversible?",
        "En algunos casos sí, aunque el éxito depende del tiempo transcurrido, técnica previa y características de cada paciente.",
      ],
      [
        "¿Es inmediata la protección anticonceptiva?",
        "No. Se requiere seguimiento y confirmación según indicación médica antes de considerarla efectiva.",
      ],
      [
        "¿Qué debo conversar antes de decidir?",
        "Conviene revisar expectativas, carácter permanente del método, recuperación, seguimiento y cualquier duda personal o de pareja.",
      ],
    ],
  },
  en: {
    ureteroscopia: [
      [
        "What is ureteroscopy?",
        "It is an endoscopic procedure used to evaluate or treat selected conditions of the ureter and urinary tract, including some stones, without external incisions.",
      ],
      [
        "Is laser always used?",
        "No. Laser use depends on stone type, location, size, hardness, available equipment, and medical judgment.",
      ],
      [
        "What is a double-J stent?",
        "It is an internal tube placed between the kidney and bladder to help urine drain after certain procedures or during obstruction.",
      ],
      [
        "Can the double-J cause discomfort?",
        "It may cause burning, urgency, increased urinary frequency, flank discomfort, or mild blood in the urine while in place.",
      ],
      [
        "When should I seek urgent care after the procedure?",
        "Fever, severe pain, inability to urinate, heavy bleeding, persistent vomiting, or worsening general condition require immediate medical attention.",
      ],
      [
        "What should I bring to the visit?",
        "Bring CT scans, ultrasound, labs, urine cultures, emergency reports, current medications, and allergy information.",
      ],
    ],
    laserCalculos: [
      [
        "How are stones removed with laser?",
        "Laser can fragment stones during an endoscopic procedure to help manage them. The indication depends on size, hardness, and location.",
      ],
      [
        "Does laser work for every stone?",
        "No. Some stones may require observation, shock wave lithotripsy, percutaneous nephrolithotomy, or another strategy.",
      ],
      [
        "Can stones come back?",
        "Yes. Some patients tend to form new stones, so hydration, diet, history, and prevention are reviewed.",
      ],
      [
        "When should I go to urgent care?",
        "Severe pain, fever, persistent vomiting, chills, inability to urinate, or suspected infection require immediate care.",
      ],
      [
        "Which studies help decide?",
        "CT scan, ultrasound, labs, urine testing, and urine culture can help define the best option.",
      ],
    ],
    cistoscopia: [
      [
        "What is cystoscopy?",
        "It is a procedure that allows the urethra and bladder to be viewed with a specialized camera.",
      ],
      [
        "Does cystoscopy hurt?",
        "It usually causes mild discomfort. It may be performed with local anesthesia or sedation depending on the case and medical judgment.",
      ],
      [
        "When may it be indicated?",
        "It may be considered for blood in the urine, persistent urinary symptoms, suspected narrowing, bladder follow-up, or other findings.",
      ],
      [
        "What symptoms should I watch afterward?",
        "Mild burning or increased frequency may occur. Fever, severe pain, significant bleeding, or inability to urinate require evaluation.",
      ],
      [
        "What should I bring?",
        "Bring urine tests, cultures, imaging, prior reports, and a medication list, especially blood thinners.",
      ],
    ],
    ureteroscopiaFlexible: [
      [
        "What is flexible ureteroscopy used for?",
        "It allows endoscopic access to the kidney to evaluate or treat selected stones without external incisions.",
      ],
      [
        "Is a double-J stent always placed?",
        "Not always. The decision depends on inflammation, manipulation, obstruction, drainage safety, and medical judgment.",
      ],
      [
        "What discomfort can a double-J cause?",
        "It may cause burning, urgency, urinary frequency, mild blood in the urine, and temporary flank discomfort.",
      ],
      [
        "When is the double-J removed?",
        "Timing varies by case. It should be removed within the indicated timeframe to avoid infection, encrustation, or complications.",
      ],
      [
        "Which symptoms are urgent?",
        "Fever, severe pain, persistent vomiting, heavy bleeding, or inability to urinate require immediate attention.",
      ],
    ],
    ureteroscopiaSemirrigida: [
      [
        "When is semi-rigid ureteroscopy used?",
        "It is commonly discussed for stones located in the ureter or situations where endoscopic access to the ureter is appropriate.",
      ],
      [
        "Is it the same as flexible ureteroscopy?",
        "No. Both are endoscopic, but they use different instruments and scenarios depending on location, anatomy, and procedural goal.",
      ],
      [
        "Can it relieve stone pain?",
        "It can be part of treatment when a stone or obstruction justifies it, but studies and patient safety are reviewed first.",
      ],
      [
        "What should I watch afterward?",
        "Pain that does not improve, fever, chills, significant bleeding, or inability to urinate require urgent attention.",
      ],
    ],
    disfuncionErectil: [
      [
        "Does erectile dysfunction have treatment?",
        "Yes. Many cases can improve with proper evaluation, lifestyle changes, medications, specialized therapies, or advanced treatments depending on the cause.",
      ],
      [
        "Can diabetes affect erections?",
        "Yes. It can affect circulation and nerves involved in erections, so metabolic and cardiovascular health should be reviewed.",
      ],
      [
        "What causes low sexual desire?",
        "It may be related to stress, hormones, medications, diabetes, hypertension, dyslipidemia, anxiety, or other conditions.",
      ],
      [
        "Should I consult even if I feel embarrassed?",
        "Yes. The visit is confidential and focused on identifying causes and safe options for each patient.",
      ],
    ],
    vasectomia: [
      [
        "Does vasectomy affect sexual life?",
        "No. Vasectomy does not affect erections, sexual desire, or hormone production.",
      ],
      [
        "Is vasectomy reversible?",
        "In some cases, yes, although success depends on time since vasectomy, prior technique, and patient-specific factors.",
      ],
      [
        "Is contraception immediate after vasectomy?",
        "No. Follow-up and confirmation are required according to medical instructions before considering it effective.",
      ],
      [
        "What should I discuss before deciding?",
        "It is useful to review expectations, the permanent nature of the method, recovery, follow-up, and any personal or partner questions.",
      ],
    ],
  },
};
