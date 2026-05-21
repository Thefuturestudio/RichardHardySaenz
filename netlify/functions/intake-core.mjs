const defaultAllowedOrigin = "https://uropanama.com";

const allowedConcerns = new Set([
  "general",
  "kidney_stones",
  "prostate",
  "uro_oncology",
  "second_opinion",
  "ureteroscopy",
  "male_health",
  "location",
  "speak_to_team",
]);

const urgentTerms = [
  "fiebre",
  "escalofrios",
  "dolor agudo",
  "dolor intenso",
  "dolor fuerte",
  "colico renal",
  "vomitos",
  "sangrado",
  "sangre en la orina",
  "orina con sangre",
  "no puedo orinar",
  "retencion",
  "dolor testicular",
  "debilidad",
  "empeoramiento rapido",
  "post operatorio",
  "postoperatorio",
  "urgencia",
  "emergencia",
  "fever",
  "chills",
  "acute pain",
  "severe pain",
  "intense pain",
  "renal colic",
  "vomiting",
  "bleeding",
  "blood in urine",
  "cannot urinate",
  "unable to urinate",
  "urinary retention",
  "testicular pain",
  "weakness",
  "rapid worsening",
  "post-operative",
  "postoperative",
  "urgent",
  "emergency",
];

export function validateLead(lead) {
  if (!lead || typeof lead !== "object") {
    return "Missing lead payload.";
  }

  if (!lead.consentAccepted) {
    return "Consent is required before sending an intake lead.";
  }

  if (!isNonEmptyString(lead.name)) {
    return "Patient name is required.";
  }

  if (!isNonEmptyString(lead.phone) || lead.phone.replace(/\D/g, "").length < 7) {
    return "A valid phone number is required.";
  }

  if (!isNonEmptyString(lead.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return "A valid email is required.";
  }

  if (!isNonEmptyString(lead.sourcePage)) {
    return "Source page is required.";
  }

  if (!["es", "en"].includes(lead.language)) {
    return "Language must be es or en.";
  }

  if (!allowedConcerns.has(lead.concern)) {
    return "Concern is not recognized.";
  }

  return "";
}

export function normalizeLead(input = {}, defaults = {}) {
  const raw = input && typeof input === "object" ? input : {};
  const phone =
    raw.phone ||
    raw.phoneNumber ||
    raw.whatsapp ||
    defaults.phone ||
    defaults.phoneNumber ||
    "";

  return {
    name: stringValue(raw.name || raw.patientName || defaults.name || ""),
    phone: stringValue(phone),
    email: stringValue(raw.email || defaults.email || ""),
    concern: normalizeConcern(raw.concern || raw.reason || defaults.concern),
    preferredTime: stringValue(
      raw.preferredTime ||
        raw.requestedTimeWindow ||
        raw.schedule ||
        defaults.preferredTime ||
        "",
    ),
    isFirstVisit: normalizeNullableBoolean(raw.isFirstVisit ?? raw.firstVisit),
    hasStudies: normalizeNullableBoolean(raw.hasStudies),
    studyTypes: normalizeStudyTypes(raw.studyTypes),
    message: stringValue(
      raw.message || raw.summary || raw.reason || defaults.message || "",
    ),
    conversationSummary: stringValue(
      raw.conversationSummary ||
        raw.chatSummary ||
        raw.transcriptSummary ||
        defaults.conversationSummary ||
        "",
    ),
    language: normalizeLanguage(raw.language || defaults.language),
    sourcePage: stringValue(raw.sourcePage || defaults.sourcePage || "voice-agent"),
    createdAt: stringValue(raw.createdAt || new Date().toISOString()),
    urgentFlag: Boolean(raw.urgentFlag),
    consentAccepted: raw.consentAccepted === true,
  };
}

export function hasUrgentLanguage(leadOrText) {
  const values =
    typeof leadOrText === "string"
      ? [leadOrText]
      : [
          leadOrText?.message,
          leadOrText?.preferredTime,
          leadOrText?.concern,
          ...(Array.isArray(leadOrText?.studyTypes) ? leadOrText.studyTypes : []),
        ];

  const text = values.filter(Boolean).join(" ").toLocaleLowerCase();
  return urgentTerms.some((term) => text.includes(term));
}

export async function deliverLead({ lead, sourceLabel = "website intake" }) {
  if (!lead || typeof lead !== "object") {
    return {
      ok: false,
      delivered: false,
      urgentFlag: false,
      message: "Missing lead payload.",
    };
  }

  const urgentFlag = Boolean(lead?.urgentFlag) || hasUrgentLanguage(lead);
  const normalizedLead = { ...lead, urgentFlag };
  const validationError = validateLead(normalizedLead);

  if (validationError) {
    return {
      ok: false,
      delivered: false,
      urgentFlag,
      message: validationError,
    };
  }

  const staffEmail = getStaffEmail(urgentFlag);

  if (!staffEmail) {
    return {
      ok: true,
      delivered: false,
      urgentFlag,
      message:
        "The intake request was validated, but staff email is not configured yet. WhatsApp fallback remains available.",
    };
  }

  const subject = urgentFlag
    ? `[Urgent review] UroPanama ${sourceLabel}`
    : `New UroPanama ${sourceLabel}`;
  const delivered = await sendClinicEmail({
    to: staffEmail,
    subject,
    text: formatLeadText(normalizedLead, urgentFlag, sourceLabel),
  });

  return {
    ok: true,
    delivered,
    urgentFlag,
    message: delivered
      ? "The intake request was sent to the clinic team. The team will confirm availability manually."
      : "The intake request was validated, but email delivery is not configured yet. WhatsApp fallback remains available.",
  };
}

export async function sendClinicEmail({ to, subject, text }) {
  const emailApiKey = process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY;

  if (!emailApiKey) {
    return false;
  }

  const fromEmail =
    process.env.INTAKE_FROM_EMAIL || "UroPanama Intake <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${emailApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject,
      text,
    }),
  });

  return response.ok;
}

export function getStaffEmail(urgentFlag = false) {
  if (urgentFlag && process.env.URGENT_NOTIFICATION_EMAIL) {
    return process.env.URGENT_NOTIFICATION_EMAIL;
  }

  return process.env.STAFF_NOTIFICATION_EMAIL || "";
}

export function formatLeadText(lead, urgentFlag, sourceLabel = "website intake") {
  return [
    urgentFlag ? "URGENT LANGUAGE FLAGGED: Review promptly." : "Routine intake.",
    `Source: ${sourceLabel}`,
    "",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || "Not provided"}`,
    `Concern: ${lead.concern}`,
    `Preferred time: ${lead.preferredTime || "Not provided"}`,
    `First visit: ${formatNullableBoolean(lead.isFirstVisit)}`,
    `Has studies: ${formatNullableBoolean(lead.hasStudies)}`,
    `Study types: ${(lead.studyTypes || []).join(", ") || "Not provided"}`,
    `Language: ${lead.language}`,
    `Source page: ${lead.sourcePage}`,
    `Created at: ${lead.createdAt}`,
    `Consent accepted: ${lead.consentAccepted ? "Yes" : "No"}`,
    "",
    "Patient message:",
    lead.message || "No message provided.",
    "",
    "Conversation summary:",
    lead.conversationSummary || "Not provided.",
    "",
    "Safety note: This request is for coordination only. No diagnosis, treatment decision, medication instruction, or appointment confirmation should be automated.",
  ].join("\n");
}

export function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin":
        process.env.ALLOWED_ORIGIN || defaultAllowedOrigin,
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Vapi-Secret",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
}

function normalizeConcern(value) {
  const normalized = stringValue(value).toLocaleLowerCase();

  if (allowedConcerns.has(normalized)) {
    return normalized;
  }

  if (normalized.includes("stone") || normalized.includes("calculo")) {
    return "kidney_stones";
  }

  if (normalized.includes("prostate") || normalized.includes("psa")) {
    return "prostate";
  }

  if (normalized.includes("onco") || normalized.includes("cancer")) {
    return "uro_oncology";
  }

  if (normalized.includes("second") || normalized.includes("opinion")) {
    return "second_opinion";
  }

  if (normalized.includes("ureter")) {
    return "ureteroscopy";
  }

  if (normalized.includes("urgent") || normalized.includes("pain")) {
    return "speak_to_team";
  }

  return "general";
}

function normalizeLanguage(value) {
  return value === "en" ? "en" : "es";
}

function normalizeNullableBoolean(value) {
  if (value === true || value === "true" || value === "yes" || value === "si") {
    return true;
  }

  if (value === false || value === "false" || value === "no") {
    return false;
  }

  return null;
}

function normalizeStudyTypes(value) {
  if (Array.isArray(value)) {
    return value.map(stringValue).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function formatNullableBoolean(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "Not provided";
}

function stringValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
