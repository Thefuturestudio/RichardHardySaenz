export type VapiChatResult = {
  ok: boolean;
  live: boolean;
  chatId?: string;
  response?: string;
  urgentFlag?: boolean;
  message?: string;
};

const endpoint =
  import.meta.env.VITE_VAPI_CHAT_ENDPOINT || "/.netlify/functions/vapi-chat";

export async function sendVapiChatMessage({
  input,
  previousChatId,
  sourcePage,
  assistantKnowledge,
}: {
  input: string;
  previousChatId?: string;
  sourcePage: string;
  assistantKnowledge?: string;
}): Promise<VapiChatResult> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input,
        previousChatId,
        sourcePage,
        assistantKnowledge,
      }),
    });

    const payload = (await response.json().catch(() => null)) as
      | Partial<VapiChatResult>
      | null;

    if (!response.ok || !payload?.ok || !payload.response) {
      return {
        ok: false,
        live: false,
        message:
          payload?.message ||
          "The live Vapi assistant is not available in this preview.",
      };
    }

    return {
      ok: true,
      live: true,
      chatId: payload.chatId,
      response: payload.response,
      urgentFlag: Boolean(payload.urgentFlag),
    };
  } catch {
    return {
      ok: false,
      live: false,
      message: "The live Vapi assistant is not available in this preview.",
    };
  }
}
