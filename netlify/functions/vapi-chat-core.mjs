import { hasUrgentLanguage } from "./intake-core.mjs";

export const defaultVapiAssistantId = "73bc43c1-0cb1-4734-91fd-5bf25230838c";

const defaultSafetyPolicy =
  "Ariel is a urology front-door assistant for UroPanama. The main language is Spanish for Latin America; use English only when the patient starts in English or asks for English. Explain general possibilities and preparation steps, never diagnose, never prescribe or change medication, never confirm treatment decisions, escalate urgent symptoms, and collect appointment details only when the patient asks for booking or staff follow-up.";

export async function sendVapiAssistantMessage({
  input,
  previousChatId,
  sourcePage = "website",
  assistantKnowledge = "",
  channel = "website_text_chat",
  defaultLanguage = "Spanish - Latin America",
  safetyPolicy = defaultSafetyPolicy,
} = {}) {
  const cleanInput = typeof input === "string" ? input.trim() : "";

  if (!cleanInput) {
    return {
      ok: false,
      statusCode: 400,
      message: "Missing chat input.",
    };
  }

  const privateKey = process.env.VAPI_PRIVATE_KEY || process.env.VAPI_API_KEY || "";
  const assistantId = process.env.VAPI_ASSISTANT_ID || defaultVapiAssistantId;

  if (!privateKey) {
    return {
      ok: false,
      statusCode: 503,
      code: "VAPI_NOT_CONFIGURED",
      message: "Vapi private API key is not configured on the server.",
    };
  }

  const cleanPreviousChatId =
    typeof previousChatId === "string" && previousChatId.trim()
      ? previousChatId.trim()
      : undefined;

  try {
    const response = await fetch("https://api.vapi.ai/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${privateKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId,
        input: cleanInput,
        ...(cleanPreviousChatId ? { previousChatId: cleanPreviousChatId } : {}),
        assistantOverrides: {
          variableValues: {
            channel: safeString(channel, 80),
            defaultLanguage,
            sourcePage: safeString(sourcePage, 240),
            approvedKnowledge: safeString(assistantKnowledge, 6000),
            safetyPolicy,
          },
        },
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        statusCode: response.status,
        message:
          data?.message ||
          data?.error ||
          "The Vapi assistant did not accept the chat request.",
      };
    }

    return {
      ok: true,
      statusCode: 200,
      chatId: data?.id || cleanPreviousChatId || "",
      assistantId: data?.assistantId || assistantId,
      response: extractAssistantOutput(data),
      urgentFlag: hasUrgentLanguage(cleanInput),
    };
  } catch {
    return {
      ok: false,
      statusCode: 502,
      message: "The Vapi assistant could not be reached.",
    };
  }
}

function extractAssistantOutput(data) {
  if (!data || typeof data !== "object") {
    return "";
  }

  const firstOutput = Array.isArray(data.output) ? data.output[0] : null;
  if (typeof firstOutput?.content === "string") {
    return firstOutput.content;
  }

  if (typeof data.output === "string") {
    return data.output;
  }

  return "";
}

function safeString(value, maxLength) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}
