import { jsonResponse } from "./intake-core.mjs";
import { sendVapiAssistantMessage } from "./vapi-chat-core.mjs";

const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 20;
const requestLog = new Map();

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, "");
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      ok: false,
      message: "Method not allowed.",
    });
  }

  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["client-ip"] ||
    event.headers["x-forwarded-for"] ||
    "unknown";

  if (isRateLimited(ip)) {
    return jsonResponse(429, {
      ok: false,
      message: "Too many chat requests. Please try again later.",
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, {
      ok: false,
      message: "Invalid JSON payload.",
    });
  }

  const input = typeof payload.input === "string" ? payload.input.trim() : "";
  const assistantKnowledge =
    typeof payload.assistantKnowledge === "string"
      ? payload.assistantKnowledge.slice(0, 6000)
      : "";
  const previousChatId =
    typeof payload.previousChatId === "string" && payload.previousChatId.trim()
      ? payload.previousChatId.trim()
      : undefined;

  if (!input) {
    return jsonResponse(400, {
      ok: false,
      message: "Missing chat input.",
    });
  }

  const result = await sendVapiAssistantMessage({
    input,
    previousChatId,
    sourcePage: payload.sourcePage || "website",
    assistantKnowledge,
    channel: "website_text_chat",
  });

  if (!result.ok) {
    return jsonResponse(result.statusCode || 502, {
      ok: false,
      ...(result.code ? { code: result.code } : {}),
      message: result.message,
    });
  }

  return jsonResponse(200, {
    ok: true,
    chatId: result.chatId,
    assistantId: result.assistantId,
    response: result.response,
    urgentFlag: result.urgentFlag,
  });
}

function isRateLimited(ip) {
  const now = Date.now();
  const key = String(ip).split(",")[0].trim();
  const current = requestLog.get(key) || [];
  const recent = current.filter((timestamp) => now - timestamp < rateLimitWindowMs);
  recent.push(now);
  requestLog.set(key, recent);
  return recent.length > maxRequestsPerWindow;
}
