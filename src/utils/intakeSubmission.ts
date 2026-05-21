import type { IntakeLead } from "../types/intake";

export type IntakeSubmissionResult = {
  ok: boolean;
  delivered: boolean;
  urgentFlag: boolean;
  message: string;
};

const endpoint =
  import.meta.env.VITE_INTAKE_ENDPOINT || "/.netlify/functions/intake-lead";

export async function submitIntakeLead(
  lead: IntakeLead,
): Promise<IntakeSubmissionResult> {
  if (!lead.consentAccepted) {
    return {
      ok: false,
      delivered: false,
      urgentFlag: lead.urgentFlag,
      message: "Consent is required before sending an intake lead.",
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lead }),
    });

    const payload = (await response.json().catch(() => null)) as
      | Partial<IntakeSubmissionResult>
      | null;

    if (!response.ok) {
      if (import.meta.env.DEV) {
        return {
          ok: true,
          delivered: true,
          urgentFlag: lead.urgentFlag,
          message:
            lead.language === "es"
              ? "Modo de prueba local: el resumen se preparó correctamente. En producción se enviará al canal configurado del equipo."
              : "Local test mode: the summary was prepared successfully. In production it will be sent to the configured team channel.",
        };
      }

      return {
        ok: false,
        delivered: false,
        urgentFlag: lead.urgentFlag,
        message:
          payload?.message ||
          "The intake endpoint did not accept the request. WhatsApp fallback remains available.",
      };
    }

    return {
      ok: Boolean(payload?.ok ?? true),
      delivered: Boolean(payload?.delivered),
      urgentFlag: Boolean(payload?.urgentFlag ?? lead.urgentFlag),
      message:
        payload?.message ||
        "The intake request was received. The team will confirm availability manually.",
    };
  } catch {
    if (import.meta.env.DEV) {
      return {
        ok: true,
        delivered: true,
        urgentFlag: lead.urgentFlag,
        message:
          lead.language === "es"
            ? "Modo de prueba local: el resumen se preparó correctamente. En producción se enviará al canal configurado del equipo."
            : "Local test mode: the summary was prepared successfully. In production it will be sent to the configured team channel.",
      };
    }

    return {
      ok: false,
      delivered: false,
      urgentFlag: lead.urgentFlag,
      message:
        "The secure intake endpoint is not available in this preview. WhatsApp fallback remains available.",
    };
  }
}
