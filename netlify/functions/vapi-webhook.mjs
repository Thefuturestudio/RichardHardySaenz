import {
  deliverLead,
  getStaffEmail,
  hasUrgentLanguage,
  jsonResponse,
  normalizeLead,
  sendClinicEmail,
} from "./intake-core.mjs";

const defaultTransferMessage =
  "I can connect you with the clinic team. If this is urgent, please seek urgent medical care immediately.";

const voiceAssistantBrief = [
  "Ariel is the UroPanama voice assistant for patient access, education, and appointment coordination.",
  "Explain general possible causes and preparation steps, but never diagnose.",
  "Do not prescribe medication, dosage, treatment decisions, or post-operative instructions.",
  "Escalate fever, severe pain, blood in urine, urinary retention, testicular pain, vomiting, chills, weakness, rapid worsening, or post-operative concerns.",
  "Collect appointment details only after the caller wants booking or staff follow-up: name, phone, email when available, reason, preferred time, first visit status, and studies available.",
  "Appointment availability must be confirmed manually by the clinic team or approved scheduling workflow.",
].join(" ");

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, "");
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, message: "Method not allowed." });
  }

  if (!isAuthorized(event)) {
    return jsonResponse(401, { ok: false, message: "Unauthorized webhook." });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { ok: false, message: "Invalid JSON payload." });
  }

  const message = payload.message || payload || {};

  if (message.type === "assistant-request") {
    return handleAssistantRequest();
  }

  if (message.type === "tool-calls" || hasToolCalls(message)) {
    return handleToolCalls(message);
  }

  if (message.type === "transfer-destination-request") {
    return handleTransferDestinationRequest();
  }

  if (message.type === "end-of-call-report") {
    const result = await handleEndOfCallReport(message);
    return jsonResponse(200, result);
  }

  return jsonResponse(200, {
    ok: true,
    message: `Vapi event acknowledged: ${message.type || "unknown"}.`,
  });
}

function handleAssistantRequest() {
  if (!process.env.VAPI_ASSISTANT_ID) {
    return jsonResponse(200, {
      error:
        "The UroPanama voice assistant is not configured yet. Please call the clinic team directly.",
    });
  }

  return jsonResponse(200, {
    assistantId: process.env.VAPI_ASSISTANT_ID,
    assistantOverrides: {
      variableValues: {
        assistantName: "Ariel",
        clinicName: "UroPanama",
        safetyPolicy: voiceAssistantBrief,
      },
    },
  });
}

async function handleToolCalls(message) {
  const calls = extractToolCalls(message);
  const results = [];

  for (const call of calls) {
    const output = await runToolCall(call, message);
    results.push({
      toolCallId: call.id,
      result: singleLineStringify(output),
    });
  }

  return jsonResponse(200, { results });
}

async function runToolCall(call, message) {
  const parameters = call.parameters || {};

  if (call.name === "createLead") {
    const lead = buildVoiceLead(parameters, message);
    return deliverLead({ lead, sourceLabel: "voice assistant intake" });
  }

  if (call.name === "sendStaffNotification") {
    const lead = buildVoiceLead(parameters, message);
    return deliverLead({ lead, sourceLabel: "voice assistant staff notification" });
  }

  if (call.name === "sendWhatsAppSummary") {
    return {
      ok: true,
      delivered: false,
      message:
        "WhatsApp summary prepared. Automatic WhatsApp sending is not enabled until the approved WhatsApp provider is configured.",
    };
  }

  if (call.name === "checkAvailability") {
    return {
      ok: true,
      message:
        "Availability must be confirmed manually by the clinic team or through the approved HuliPractice workflow. Do not confirm an appointment automatically.",
    };
  }

  if (call.name === "transferToHuman") {
    return {
      ok: true,
      message: defaultTransferMessage,
      transferPhone: process.env.CLINIC_TRANSFER_PHONE || "",
    };
  }

  return {
    ok: false,
    message: `Unsupported tool: ${call.name || "unknown"}.`,
  };
}

async function handleEndOfCallReport(message) {
  const transcript = message.artifact?.transcript || "";
  const summary =
    message.analysis?.summary ||
    message.summary ||
    "No call summary was provided by Vapi.";
  const urgentFlag = hasUrgentLanguage(`${summary}\n${transcript}`);
  const staffEmail = getStaffEmail(urgentFlag);

  if (!staffEmail) {
    return {
      ok: true,
      delivered: false,
      urgentFlag,
      message:
        "Call report acknowledged, but staff email is not configured yet.",
    };
  }

  const delivered = await sendClinicEmail({
    to: staffEmail,
    subject: urgentFlag
      ? "[Urgent review] UroPanama voice call summary"
      : "New UroPanama voice call summary",
    text: formatCallReportText(message, urgentFlag, summary, transcript),
  });

  return {
    ok: true,
    delivered,
    urgentFlag,
    message: delivered
      ? "Call summary sent to the clinic team."
      : "Call summary acknowledged, but email delivery is not configured yet.",
  };
}

function handleTransferDestinationRequest() {
  const transferPhone = process.env.CLINIC_TRANSFER_PHONE;

  if (!transferPhone) {
    return jsonResponse(200, {
      error:
        "Human transfer is not configured yet. Ask the caller to use WhatsApp or call the clinic directly.",
    });
  }

  return jsonResponse(200, {
    destination: {
      type: "number",
      number: transferPhone,
      message: defaultTransferMessage,
    },
  });
}

function buildVoiceLead(parameters, message) {
  const customerPhone =
    message.call?.customer?.number ||
    message.customer?.number ||
    message.phoneNumber?.number ||
    "";

  const leadInput = parameters.lead || parameters;

  return normalizeLead(leadInput, {
    phone: customerPhone,
    sourcePage: "vapi-call",
    language: parameters.language || "es",
  });
}

function extractToolCalls(message) {
  if (Array.isArray(message.toolCallList)) {
    return message.toolCallList.map((toolCall) => ({
      id: toolCall.id,
      name: toolCall.name || toolCall.function?.name,
      parameters: parseToolArguments(
        toolCall.arguments ||
          toolCall.parameters ||
          toolCall.function?.arguments ||
          {},
      ),
    }));
  }

  if (Array.isArray(message.toolWithToolCallList)) {
    return message.toolWithToolCallList.map((item) => ({
      id: item.toolCall?.id,
      name: item.name || item.toolCall?.name || item.tool?.function?.name,
      parameters: parseToolArguments(
        item.toolCall?.arguments ||
          item.toolCall?.parameters ||
          item.toolCall?.function?.arguments ||
          {},
      ),
    }));
  }

  if (message.toolCall) {
    return [
      {
        id: message.toolCall.id,
        name:
          message.toolCall.name ||
          message.toolCall.function?.name ||
          message.name ||
          message.function?.name,
        parameters: parseToolArguments(
          message.toolCall.arguments ||
            message.toolCall.parameters ||
            message.toolCall.function?.arguments ||
            message.arguments ||
            message.parameters ||
            {},
        ),
      },
    ];
  }

  if (message.name || message.function?.name) {
    return [
      {
        id: message.id || message.toolCallId || "tool-call",
        name: message.name || message.function?.name,
        parameters: parseToolArguments(
          message.arguments || message.parameters || message.function?.arguments || {},
        ),
      },
    ];
  }

  return [];
}

function hasToolCalls(message) {
  return Boolean(
    Array.isArray(message.toolCallList) ||
      Array.isArray(message.toolWithToolCallList) ||
      message.toolCall ||
      message.toolCallId ||
      message.function?.name,
  );
}

function parseToolArguments(value) {
  if (!value) {
    return {};
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  return typeof value === "object" ? value : {};
}

function singleLineStringify(value) {
  return JSON.stringify(value).replace(/\s*\r?\n\s*/g, " ");
}

function formatCallReportText(message, urgentFlag, summary, transcript) {
  const call = message.call || {};
  const caller =
    call.customer?.number ||
    message.customer?.number ||
    message.phoneNumber?.number ||
    "Not provided";

  return [
    urgentFlag ? "URGENT LANGUAGE FLAGGED: Review promptly." : "Routine call.",
    "Source: voice assistant call",
    "",
    `Caller: ${caller}`,
    `Call ID: ${call.id || "Not provided"}`,
    `Ended reason: ${message.endedReason || "Not provided"}`,
    "",
    "Summary:",
    summary,
    "",
    "Transcript:",
    transcript || "No transcript provided.",
    "",
    "Safety note: This call summary is for coordination only. No diagnosis, treatment decision, medication instruction, or appointment confirmation should be automated.",
  ].join("\n");
}

function isAuthorized(event) {
  const secret = process.env.VAPI_SERVER_SECRET;

  if (!secret) {
    return true;
  }

  const authorization = getHeader(event, "authorization");
  const vapiSecret = getHeader(event, "x-vapi-secret");

  return authorization === `Bearer ${secret}` || vapiSecret === secret;
}

function getHeader(event, name) {
  const lowerName = name.toLocaleLowerCase();
  const headers = event.headers || {};
  const key = Object.keys(headers).find(
    (headerName) => headerName.toLocaleLowerCase() === lowerName,
  );

  return key ? headers[key] : "";
}
