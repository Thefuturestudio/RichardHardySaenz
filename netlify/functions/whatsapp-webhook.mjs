import {
  getStaffEmail,
  hasUrgentLanguage,
  jsonResponse,
  sendClinicEmail,
} from "./intake-core.mjs";
import { getRelevantFaqContext } from "./assistant-faq-knowledge.mjs";
import { sendVapiAssistantMessage } from "./vapi-chat-core.mjs";

const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 30;
const requestLog = new Map();
const chatSessions = new Map();
const sessionTtlMs = 30 * 60 * 1000;

const whatsappKnowledge = [
  "WhatsApp channel for UroPanama.",
  "Main language: Spanish for Latin America. Use English only if the patient writes in English or asks for English.",
  "Help with general clinic questions, services, preparation for consultation, and appointment coordination.",
  "Collect appointment details only when needed: name, phone, general reason, preferred time, first visit status, and whether studies are available.",
  "Do not diagnose, interpret studies as a final conclusion, prescribe, change medication, make treatment decisions, or confirm appointment availability automatically.",
  "If urgent symptoms appear, tell the patient to seek urgent medical care and offer staff follow-up.",
].join(" ");

const unavailableReply =
  "Gracias por escribir a UroPanama. En este momento el asistente automatico no esta disponible. El equipo revisara su mensaje. Si presenta dolor fuerte, fiebre, sangrado, no puede orinar, vomitos, escalofrios o una preocupacion postoperatoria, busque atencion medica urgente.";

const textOnlyReply =
  "Por ahora puedo ayudar mejor por mensaje de texto. Escriba el motivo general de su consulta y, si desea coordinar una cita, comparta su nombre, telefono y horario de preferencia.";

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, "");
  }

  if (event.httpMethod === "GET") {
    return handleMetaVerification(event);
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, message: "Method not allowed." });
  }

  const inbound = parseInboundMessage(event);

  if (!inbound.provider || inbound.ignored) {
    return jsonResponse(200, {
      ok: true,
      ignored: true,
      message: "WhatsApp event acknowledged.",
    });
  }

  if (isRateLimited(inbound.from || clientIp(event))) {
    return respondToProvider(inbound, {
      replyText:
        "Hemos recibido varios mensajes seguidos. Por favor intente nuevamente en unos minutos.",
      metadata: { ok: false, message: "Rate limited." },
    });
  }

  if (!inbound.messageText) {
    return respondToProvider(inbound, {
      replyText: textOnlyReply,
      metadata: {
        ok: true,
        liveVapi: false,
        message: "Non-text WhatsApp message acknowledged.",
      },
    });
  }

  const sessionKey = `${inbound.provider}:${inbound.from}`;
  const previousChatId = getSessionChatId(sessionKey);
  const faqKnowledge = getRelevantFaqContext(inbound.messageText, 6);
  const vapiResult = await sendVapiAssistantMessage({
    input: inbound.messageText,
    previousChatId,
    sourcePage: `whatsapp:${inbound.provider}`,
    assistantKnowledge: [whatsappKnowledge, faqKnowledge].filter(Boolean).join("\n"),
    channel: "whatsapp",
  });

  if (vapiResult.ok && vapiResult.chatId) {
    setSessionChatId(sessionKey, vapiResult.chatId);
  }

  const urgentFlag =
    Boolean(vapiResult.urgentFlag) || hasUrgentLanguage(inbound.messageText);
  const replyText =
    vapiResult.ok && vapiResult.response ? vapiResult.response : unavailableReply;
  const notification = await notifyUrgentIfNeeded({
    inbound,
    urgentFlag,
    assistantReply: replyText,
    vapiResult,
  });

  return respondToProvider(inbound, {
    replyText,
    metadata: {
      ok: true,
      provider: inbound.provider,
      liveVapi: vapiResult.ok,
      vapiCode: vapiResult.code || "",
      urgentFlag,
      staffNotificationDelivered: notification.delivered,
      message: vapiResult.ok
        ? "WhatsApp message routed through the Vapi assistant."
        : vapiResult.message,
    },
  });
}

function handleMetaVerification(event) {
  const params = event.queryStringParameters || {};
  const mode = params["hub.mode"];
  const token = params["hub.verify_token"];
  const challenge = params["hub.challenge"] || "";
  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || "";

  if (mode === "subscribe" && expectedToken && token === expectedToken) {
    return textResponse(200, challenge);
  }

  return textResponse(403, "Forbidden");
}

function parseInboundMessage(event) {
  const contentType = getHeader(event, "content-type").toLocaleLowerCase();

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return parseTwilioMessage(readBody(event));
  }

  let payload;
  try {
    payload = JSON.parse(readBody(event) || "{}");
  } catch {
    return { provider: "", ignored: true };
  }

  return parseMetaMessage(payload);
}

function parseMetaMessage(payload) {
  const values = Array.isArray(payload?.entry)
    ? payload.entry.flatMap((entry) =>
        Array.isArray(entry?.changes)
          ? entry.changes.map((change) => change?.value).filter(Boolean)
          : [],
      )
    : [];
  const value = values.find(
    (entryValue) =>
      Array.isArray(entryValue?.messages) && entryValue.messages.length > 0,
  );

  if (!value) {
    return { provider: "meta", ignored: true };
  }

  const message = value.messages[0] || {};
  const messageText = extractMetaText(message);

  return {
    provider: "meta",
    from: stringValue(message.from),
    to: stringValue(value.metadata?.display_phone_number),
    phoneNumberId: stringValue(value.metadata?.phone_number_id),
    messageId: stringValue(message.id),
    profileName: stringValue(value.contacts?.[0]?.profile?.name),
    messageText,
  };
}

function parseTwilioMessage(body) {
  const params = new URLSearchParams(body);
  const from = params.get("From") || "";
  const bodyText = params.get("Body") || "";

  if (!from && !bodyText) {
    return { provider: "twilio", ignored: true };
  }

  return {
    provider: "twilio",
    from,
    to: params.get("To") || "",
    messageId: params.get("MessageSid") || "",
    profileName: params.get("ProfileName") || "",
    messageText: bodyText.trim(),
  };
}

function extractMetaText(message) {
  if (typeof message?.text?.body === "string") {
    return message.text.body.trim();
  }

  if (typeof message?.button?.text === "string") {
    return message.button.text.trim();
  }

  if (typeof message?.interactive?.button_reply?.title === "string") {
    return message.interactive.button_reply.title.trim();
  }

  if (typeof message?.interactive?.list_reply?.title === "string") {
    return message.interactive.list_reply.title.trim();
  }

  return "";
}

async function respondToProvider(inbound, { replyText, metadata, statusCode = 200 }) {
  const cleanReply = limitReply(replyText);

  if (inbound.provider === "twilio") {
    return twilioResponse(statusCode, cleanReply);
  }

  const delivery = await sendMetaTextReply(inbound, cleanReply);

  return jsonResponse(statusCode, {
    ...metadata,
    delivered: delivery.delivered,
    deliveryMessage: delivery.message,
  });
}

async function sendMetaTextReply(inbound, body) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN || "";
  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID || inbound.phoneNumberId || "";
  const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || "";

  if (!token || !phoneNumberId || !graphVersion || !inbound.from) {
    return {
      delivered: false,
      message:
        "Meta WhatsApp credentials are not configured yet. Set WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_GRAPH_VERSION before live activation.",
    };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: inbound.from,
          type: "text",
          text: {
            preview_url: false,
            body,
          },
        }),
      },
    );

    const data = await response.json().catch(() => null);

    return {
      delivered: response.ok,
      message: response.ok
        ? "WhatsApp reply sent through Meta Cloud API."
        : data?.error?.message || "Meta WhatsApp send failed.",
    };
  } catch {
    return {
      delivered: false,
      message: "Meta WhatsApp send failed.",
    };
  }
}

async function notifyUrgentIfNeeded({ inbound, urgentFlag, assistantReply, vapiResult }) {
  if (!urgentFlag) {
    return { delivered: false };
  }

  const staffEmail = getStaffEmail(true);

  if (!staffEmail) {
    return { delivered: false };
  }

  const delivered = await sendClinicEmail({
    to: staffEmail,
    subject: "[Urgent review] UroPanama WhatsApp message",
    text: [
      "URGENT LANGUAGE FLAGGED: Review promptly.",
      "Source: WhatsApp assistant",
      "",
      `Provider: ${inbound.provider}`,
      `Patient WhatsApp: ${inbound.from || "Not provided"}`,
      `Profile name: ${inbound.profileName || "Not provided"}`,
      `Message ID: ${inbound.messageId || "Not provided"}`,
      "",
      "Patient message:",
      inbound.messageText || "No text message provided.",
      "",
      "Assistant reply:",
      assistantReply || "No assistant reply provided.",
      "",
      "Routing state:",
      vapiResult.ok
        ? "Routed through Vapi assistant."
        : `Vapi unavailable: ${vapiResult.message || "Unknown error."}`,
      "",
      "Safety note: This WhatsApp summary is for coordination only. No diagnosis, treatment decision, medication instruction, or appointment confirmation should be automated.",
    ].join("\n"),
  });

  return { delivered };
}

function getSessionChatId(key) {
  pruneSessions();
  const session = chatSessions.get(key);
  return session?.chatId || undefined;
}

function setSessionChatId(key, chatId) {
  chatSessions.set(key, {
    chatId,
    updatedAt: Date.now(),
  });
}

function pruneSessions() {
  const now = Date.now();
  for (const [key, session] of chatSessions.entries()) {
    if (now - session.updatedAt > sessionTtlMs) {
      chatSessions.delete(key);
    }
  }
}

function isRateLimited(key) {
  const now = Date.now();
  const normalizedKey = String(key || "unknown").split(",")[0].trim();
  const current = requestLog.get(normalizedKey) || [];
  const recent = current.filter((timestamp) => now - timestamp < rateLimitWindowMs);
  recent.push(now);
  requestLog.set(normalizedKey, recent);
  return recent.length > maxRequestsPerWindow;
}

function readBody(event) {
  if (event.isBase64Encoded) {
    return Buffer.from(event.body || "", "base64").toString("utf8");
  }

  return event.body || "";
}

function getHeader(event, name) {
  const lowerName = name.toLocaleLowerCase();
  const headers = event.headers || {};
  const key = Object.keys(headers).find(
    (headerName) => headerName.toLocaleLowerCase() === lowerName,
  );

  return key ? headers[key] : "";
}

function clientIp(event) {
  return (
    getHeader(event, "x-nf-client-connection-ip") ||
    getHeader(event, "client-ip") ||
    getHeader(event, "x-forwarded-for") ||
    "unknown"
  );
}

function limitReply(value) {
  const text = typeof value === "string" && value.trim() ? value.trim() : unavailableReply;
  return text.length > 1500 ? `${text.slice(0, 1497)}...` : text;
}

function twilioResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/xml",
    },
    body: `<Response><Message>${escapeXml(body)}</Message></Response>`,
  };
}

function textResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "text/plain",
    },
    body,
  };
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function stringValue(value) {
  return typeof value === "string" ? value.trim() : "";
}
