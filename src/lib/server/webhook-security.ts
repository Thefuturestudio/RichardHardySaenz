import { createHmac, timingSafeEqual } from "crypto";

type WebhookVerificationResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

type RequiredSecretResult =
  | { ok: true; secret: string }
  | { ok: false; status: number; error: string };

const STRIPE_SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

function getRequiredSecret(envName: string): RequiredSecretResult {
  const secret = process.env[envName]?.trim();

  if (!secret) {
    return {
      ok: false,
      status: 503,
      error: `${envName} is not configured.`,
    };
  }

  return { ok: true, secret };
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export async function readJsonWebhookPayload(request: Request) {
  const rawBody = await request.text();

  try {
    return {
      rawBody,
      payload: JSON.parse(rawBody),
    };
  } catch {
    return {
      rawBody,
      payload: null,
    };
  }
}

export function verifySharedWebhookSecret(
  request: Request,
  envName: string,
  headerNames: string[],
): WebhookVerificationResult {
  const secretResult = getRequiredSecret(envName);
  if (!secretResult.ok) return secretResult;

  const headerSecret = headerNames
    .map((headerName) => request.headers.get(headerName))
    .find((value): value is string => Boolean(value));

  if (!headerSecret || !safeCompare(headerSecret, secretResult.secret)) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  return { ok: true };
}

function parseStripeSignature(signatureHeader: string) {
  const signatures: string[] = [];
  let timestamp: string | null = null;

  for (const part of signatureHeader.split(",")) {
    const separatorIndex = part.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();

    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }

  return { timestamp, signatures };
}

export function verifyStripeWebhookSignature(
  request: Request,
  rawBody: string,
): WebhookVerificationResult {
  const secretResult = getRequiredSecret("STRIPE_WEBHOOK_SECRET");
  if (!secretResult.ok) return secretResult;

  const internalSecret = request.headers.get("x-viva-webhook-secret");
  if (internalSecret && safeCompare(internalSecret, secretResult.secret)) {
    return { ok: true };
  }

  const signatureHeader = request.headers.get("stripe-signature");
  if (!signatureHeader) {
    return { ok: false, status: 401, error: "Missing Stripe signature." };
  }

  const { timestamp, signatures } = parseStripeSignature(signatureHeader);
  const timestampSeconds = Number(timestamp);

  if (
    !timestamp ||
    !Number.isFinite(timestampSeconds) ||
    signatures.length === 0
  ) {
    return { ok: false, status: 401, error: "Invalid Stripe signature." };
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - timestampSeconds);
  if (ageSeconds > STRIPE_SIGNATURE_TOLERANCE_SECONDS) {
    return { ok: false, status: 401, error: "Expired Stripe signature." };
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expectedSignature = createHmac("sha256", secretResult.secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const isValid = signatures.some((signature) =>
    safeCompare(signature, expectedSignature),
  );

  if (!isValid) {
    return { ok: false, status: 401, error: "Invalid Stripe signature." };
  }

  return { ok: true };
}
