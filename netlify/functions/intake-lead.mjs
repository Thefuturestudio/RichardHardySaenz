import { deliverLead, jsonResponse } from "./intake-core.mjs";

const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;
const requestLog = new Map();

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, "");
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      ok: false,
      delivered: false,
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
      delivered: false,
      message: "Too many requests. Please try again later.",
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, {
      ok: false,
      delivered: false,
      message: "Invalid JSON payload.",
    });
  }

  const result = await deliverLead({
    lead: payload.lead,
    sourceLabel: "website intake",
  });

  return jsonResponse(result.ok ? (result.delivered ? 200 : 202) : 400, result);
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
