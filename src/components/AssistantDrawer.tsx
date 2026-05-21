import {
  Bot,
  CalendarDays,
  CheckCircle2,
  Mic,
  MicOff,
  MessageCircle,
  Send,
  ShieldAlert,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getAssistantKnowledgeContext,
  getAssistantKnowledgeReply,
} from "../data/assistantKnowledge";
import { concernFromPath, intakeFlow } from "../data/intakeFlow";
import { useLanguage } from "../i18n/LanguageContext";
import { cn } from "../lib/cn";
import type { IntakeLead, LeadSummary, PatientConcern } from "../types/intake";
import { generateLeadSummary } from "../utils/leadSummary";
import { hasUrgentLanguage } from "../utils/medicalSafety";
import { trackEvent } from "../utils/analytics";
import { createWhatsAppLink } from "../utils/whatsapp";
import {
  submitIntakeLead,
  type IntakeSubmissionResult,
} from "../utils/intakeSubmission";
import { sendVapiChatMessage } from "../utils/vapiChat";

type AssistantDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type AssistantFormValues = {
  name: string;
  phone: string;
  email: string;
  preferredTime: string;
  isFirstVisit: "" | "yes" | "no";
  hasStudies: "" | "yes" | "no";
  studyTypes: string;
  message: string;
  consentAccepted: boolean;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  urgent?: boolean;
};

type TextAssistantReply = {
  text: string;
  language: "es" | "en";
  concern: PatientConcern;
  urgent?: boolean;
};

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

const emptyValues: AssistantFormValues = {
  name: "",
  phone: "",
  email: "",
  preferredTime: "",
  isFirstVisit: "",
  hasStudies: "",
  studyTypes: "",
  message: "",
  consentAccepted: false,
};

type AssistantErrors = Partial<Record<keyof AssistantFormValues, string>>;

export function AssistantDrawer({ open, onClose }: AssistantDrawerProps) {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const flow = intakeFlow[language];
  const [concern, setConcern] = useState<PatientConcern>(() =>
    concernFromPath(location.pathname),
  );
  const [values, setValues] = useState<AssistantFormValues>(emptyValues);
  const [errors, setErrors] = useState<AssistantErrors>({});
  const [summary, setSummary] = useState<LeadSummary | null>(null);
  const [submissionResult, setSubmissionResult] =
    useState<IntakeSubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isChatSubmitting, setIsChatSubmitting] = useState(false);
  const [vapiChatId, setVapiChatId] = useState<string | undefined>();
  const [chatMode, setChatMode] = useState<"live" | "fallback" | null>(null);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    createAssistantMessage(
      "Hola, soy Ariel, asistente digital de UroPanama. Puede escribirme una pregunta o dictarla con el micrófono. Puedo orientarle sobre síntomas, preparación para la consulta, ubicación, estudios y citas. No doy diagnósticos ni reemplazo una evaluación médica.",
    ),
  ]);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const chatLogRef = useRef<HTMLDivElement | null>(null);
  const speechRecognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      setConcern(concernFromPath(location.pathname));
    }
  }, [location.pathname, open]);

  useEffect(() => {
    if (open) {
      return;
    }

    speechRecognitionRef.current?.stop();
    setIsListening(false);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDrawerAndRestoreFocus();
      }

      if (event.key === "Tab" && drawerRef.current) {
        trapFocus(event, drawerRef.current);
      }
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => {
      chatInputRef.current?.focus();
    });
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const selectedConcern = flow.concerns[concern];
  const assistantQuickActions = useMemo(
    () =>
      language === "es"
        ? [
            { concern: "general" as PatientConcern, label: "Síntomas urinarios" },
            { concern: "kidney_stones" as PatientConcern, label: "Cálculos renales" },
            { concern: "prostate" as PatientConcern, label: "Próstata / PSA" },
            { concern: "second_opinion" as PatientConcern, label: "Segunda opinión" },
            { concern: "male_health" as PatientConcern, label: "Salud masculina" },
            { concern: "speak_to_team" as PatientConcern, label: "Dolor o urgencia" },
          ]
        : [
            { concern: "general" as PatientConcern, label: "Urinary symptoms" },
            { concern: "kidney_stones" as PatientConcern, label: "Kidney stones" },
            { concern: "prostate" as PatientConcern, label: "Prostate / PSA" },
            { concern: "second_opinion" as PatientConcern, label: "Second opinion" },
            { concern: "male_health" as PatientConcern, label: "Men's health" },
            { concern: "speak_to_team" as PatientConcern, label: "Pain or urgent" },
          ],
    [language],
  );
  const urgentFlag = useMemo(
    () =>
      hasUrgentLanguage(
        [
          values.message,
          values.studyTypes,
          values.preferredTime,
          selectedConcern.safeResponse,
        ],
        language,
      ),
    [language, selectedConcern.safeResponse, values.message, values.preferredTime, values.studyTypes],
  );

  const lead = useMemo(
    () =>
      buildLead({
        values,
        concern,
        language,
        sourcePage: location.pathname,
        urgentFlag,
        conversationSummary: summarizeConversation(chatMessages),
      }),
    [chatMessages, concern, language, location.pathname, urgentFlag, values],
  );

  const whatsappHref = useMemo(
    () =>
      createWhatsAppLink({
        language,
        sourcePage: location.pathname,
        concern,
        leadData: summary ? lead : undefined,
      }),
    [concern, language, lead, location.pathname, summary],
  );
  const speechSupported =
    typeof window !== "undefined" &&
    Boolean(getSpeechRecognitionConstructor());

  function closeDrawerAndRestoreFocus() {
    onClose();
    requestAnimationFrame(() => {
      previouslyFocusedRef.current?.focus();
    });
  }

  function selectConcern(nextConcern: PatientConcern) {
    setConcern(nextConcern);
    setSummary(null);
    setErrors({});
    if (nextConcern === "speak_to_team") {
      openHandoffForm(nextConcern);
    }
    trackEvent("assistant_concern_selected", {
      concern: nextConcern,
      path: location.pathname,
    });
  }

  function openHandoffForm(nextConcern = concern, reasonText = "") {
    setHandoffOpen(true);
    setConcern(nextConcern);
    if (!values.message.trim()) {
      const conversationSummary = [
        reasonText,
        ...chatMessages
          .filter((message) => message.role === "user")
          .map((message) => message.text),
      ]
        .filter(Boolean)
        .join(" / ");

      if (conversationSummary) {
        setValues((current) => ({
          ...current,
          message: conversationSummary.slice(0, 600),
        }));
      }
    }
    requestAnimationFrame(() => {
      document.getElementById("assistant-name")?.focus();
    });
  }

  function toggleVoiceInput() {
    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = getSpeechRecognitionConstructor();

    if (!SpeechRecognition) {
      setVoiceNotice(
        language === "es"
          ? "El dictado no está disponible en este navegador. Puede escribir su pregunta."
          : "Voice input is not available in this browser. You can type your question.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === "es" ? "es-PA" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();

      if (transcript) {
        setChatInput((current) =>
          current ? `${current.trim()} ${transcript}` : transcript,
        );
        setVoiceNotice(
          language === "es"
            ? "Dictado listo. Revise el texto y envíelo cuando quiera."
            : "Voice note ready. Review the text and send it when ready.",
        );
      }
    };
    recognition.onerror = () => {
      setVoiceNotice(
        language === "es"
          ? "No se pudo capturar el audio. Intente de nuevo o escriba su pregunta."
          : "Audio could not be captured. Try again or type your question.",
      );
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    speechRecognitionRef.current = recognition;
    setVoiceNotice(
      language === "es"
        ? "Escuchando... hable con calma. Ariel responderá por texto."
        : "Listening... speak clearly. Ariel will reply by text.",
    );
    setIsListening(true);
    recognition.start();
  }

  function updateField(
    field: keyof AssistantFormValues,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const value =
      field === "consentAccepted"
        ? (event.target as HTMLInputElement).checked
        : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSummary(null);
    setSubmissionResult(null);
  }

  async function submitChatMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = chatInput.trim();

    if (!message || isChatSubmitting) {
      return;
    }

    setChatMessages((current) => [
      ...current,
      createUserMessage(message),
    ]);
    setChatInput("");
    setSubmissionResult(null);
    setSummary(null);
    setIsChatSubmitting(true);

    const language = detectTextAssistantLanguage(message);
    const concernGuess = detectTextAssistantConcern(message);
    const urgentGuess =
      hasUrgentLanguage([message], "es") || hasUrgentLanguage([message], "en");
    const liveReply = await sendVapiChatMessage({
      input: message,
      previousChatId: vapiChatId,
      sourcePage: location.pathname,
      assistantKnowledge: getAssistantKnowledgeContext(language, message),
    });

    const reply = liveReply.ok
      ? {
          text: liveReply.response || "",
          language,
          concern: urgentGuess ? "speak_to_team" : concernGuess,
          urgent: Boolean(liveReply.urgentFlag || urgentGuess),
        }
      : getTextAssistantReply(message);

    setChatMessages((current) => [
      ...current,
      createAssistantMessage(reply.text, reply.urgent),
    ]);
    setConcern(reply.concern);
    if (
      reply.urgent ||
      reply.concern === "speak_to_team" ||
      wantsAppointmentHandoff(message)
    ) {
      openHandoffForm(reply.concern, message);
    }
    setChatMode(liveReply.ok ? "live" : "fallback");
    setVapiChatId(liveReply.chatId || vapiChatId);
    setIsChatSubmitting(false);
    trackEvent("assistant_chat_submit", {
      concern: reply.concern,
      language: reply.language,
      urgentFlag: Boolean(reply.urgent),
      liveVapi: liveReply.ok,
      path: location.pathname,
    });
    requestAnimationFrame(() => {
      chatLogRef.current?.scrollTo({
        top: chatLogRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }

  function validate() {
    const nextErrors: AssistantErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = flow.validation.required;
    }

    if (!isValidPhone(values.phone)) {
      nextErrors.phone = flow.validation.phone;
    }

    if (!values.email.trim()) {
      nextErrors.email = flow.validation.required;
    } else if (!isValidEmail(values.email)) {
      nextErrors.email = flow.validation.email;
    }

    if (!values.consentAccepted) {
      nextErrors.consentAccepted = flow.validation.consent;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function prepareSummary() {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    const result = await submitIntakeLead(lead);
    setSubmissionResult(result);
    setSummary(generateLeadSummary(lead, language));
    setIsSubmitting(false);
    trackEvent("assistant_intake_submit", {
      concern,
      path: location.pathname,
      urgentFlag,
      delivered: result.delivered,
    });
  }

  if (!open) {
    return null;
  }

  return (
    <div
      data-assistant-overlay
      className="fixed inset-0 z-[120] bg-navy/24 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeDrawerAndRestoreFocus();
        }
      }}
    >
      <div
        data-assistant-panel
        className="absolute inset-x-3 bottom-3 max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-[1.65rem] border border-white/70 bg-white shadow-[0_30px_100px_rgba(6,27,51,0.22)] md:bottom-5 md:left-5 md:right-auto md:top-5 md:w-[min(31rem,calc(100vw-2.5rem))]"
        ref={drawerRef}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 border-b border-white/20 bg-navy px-5 py-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12 text-cyan">
                <Bot aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 id="assistant-title" className="text-base font-semibold">
                  {flow.assistantTitle}
                </h2>
                <p className="mt-1 text-xs leading-5 text-blue-100">
                  {flow.diagnosticDisclaimer}
                </p>
              </div>
            </div>
            <button
              data-assistant-close
              ref={closeButtonRef}
              type="button"
              onClick={closeDrawerAndRestoreFocus}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/15 px-3 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              aria-label={t.home.floating.closeAssistant}
            >
              <span className="hidden text-xs font-semibold sm:inline">
                {t.home.floating.closeAssistant}
              </span>
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <div
            className="mt-3 inline-flex rounded-full border border-white/15 bg-white/10 p-1"
            aria-label={language === "es" ? "Idioma del asistente" : "Assistant language"}
          >
            {(["es", "en"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setLanguage(option);
                  setChatMessages((messages) => [
                    ...messages,
                    createAssistantMessage(
                      option === "es"
                        ? "Idioma cambiado a español. Puede seguir escribiendo o dictando su consulta."
                        : "Language switched to English. You can continue typing or dictating your question.",
                    ),
                  ]);
                }}
                className={cn(
                  "min-h-8 rounded-full px-3 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
                  language === option
                    ? "bg-white text-navy shadow-sm"
                    : "text-blue-100 hover:bg-white/10 hover:text-white",
                )}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-b from-softblue/75 to-white p-5">
          <div className="rounded-[1.35rem] bg-white/75 p-4 shadow-sm">
            <div
              ref={chatLogRef}
              className="max-h-80 space-y-3 overflow-y-auto pr-1"
              aria-live="polite"
            >
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[92%] rounded-2xl p-4 text-sm leading-7 shadow-sm",
                    message.role === "assistant"
                      ? "rounded-tl-sm bg-white text-navy"
                      : "ml-auto rounded-tr-sm bg-navy text-white",
                    message.urgent && "border border-amber-200 bg-amber-50 text-navy",
                  )}
                >
                  {message.text}
                </div>
              ))}
              {isChatSubmitting && (
                <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-7 text-muted shadow-sm">
                  {language === "es" ? "Ariel está revisando su pregunta..." : "Ariel is reviewing your question..."}
                </div>
              )}
            </div>
            <form onSubmit={submitChatMessage} className="mt-4 grid gap-2">
              <input
                ref={chatInputRef}
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder={language === "es" ? "Escriba su pregunta o motivo de consulta" : "Write your question or reason for consultation"}
                disabled={isChatSubmitting}
                className="min-h-12 w-full rounded-2xl border border-borderblue bg-white px-4 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-medical focus:ring-4 focus:ring-softblue"
                aria-label={language === "es" ? "Mensaje para el asistente" : "Message for the assistant"}
              />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1.1fr]">
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={!speechSupported || isChatSubmitting}
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
                    isListening
                      ? "border-cyan bg-softblue text-navy"
                      : "border-borderblue bg-white text-navy hover:border-medical",
                    (!speechSupported || isChatSubmitting) &&
                      "cursor-not-allowed opacity-55",
                  )}
                  aria-label={language === "es" ? "Dictar pregunta" : "Dictate question"}
                >
                  {isListening ? (
                    <MicOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Mic aria-hidden="true" className="h-4 w-4" />
                  )}
                  {isListening ? (language === "es" ? "Detener" : "Stop") : (language === "es" ? "Dictar" : "Dictate")}
                </button>
                <button
                  type="submit"
                  disabled={isChatSubmitting || !chatInput.trim()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy px-3 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-navy-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                  aria-label={language === "es" ? "Enviar mensaje" : "Send message"}
                >
                  <Send aria-hidden="true" className="h-4 w-4" />
                  {language === "es" ? "Enviar" : "Send"}
                </button>
                <button
                  type="button"
                  onClick={() => openHandoffForm("general")}
                  className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-cyan/45 bg-cyan/10 px-3 text-xs font-semibold text-navy transition hover:border-medical hover:bg-softblue sm:col-span-1"
                >
                  <CalendarDays aria-hidden="true" className="h-4 w-4" />
                  {language === "es" ? "Solicitar cita" : "Request visit"}
                </button>
              </div>
              <button
                type="submit"
                disabled={isChatSubmitting}
                className="hidden"
                aria-label={language === "es" ? "Enviar mensaje" : "Send message"}
              >
                <Send aria-hidden="true" className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-3 text-[11px] font-semibold leading-5 text-muted">
              {isChatSubmitting
                ? (language === "es" ? "Consultando el asistente..." : "Consulting the assistant...")
                : chatMode === "live"
                  ? (language === "es" ? "Conectado al asistente publicado de Vapi." : "Connected to the published Vapi assistant.")
                  : chatMode === "fallback"
                    ? (language === "es" ? "Modo de vista previa local: falta conectar la llave privada de Vapi en el servidor." : "Local preview mode: the private Vapi key is not connected on the server.")
                    : voiceNotice || (language === "es" ? "Puede conversar primero. Solo pediremos datos personales si desea cita o contacto del equipo." : "You can chat first. We only ask for personal details if you want a visit or team contact.")}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {assistantQuickActions.map((action) => (
              <button
                key={action.concern}
                type="button"
                onClick={() => selectConcern(action.concern)}
                className={cn(
                  "min-h-11 rounded-full border px-3 py-2 text-center text-xs font-semibold leading-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
                  concern === action.concern
                    ? "border-navy bg-white text-navy shadow-sm"
                    : "border-borderblue bg-white/78 text-muted hover:border-cyan hover:text-navy",
                )}
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-[1.25rem] border border-borderblue bg-white/82 p-4">
            <p className="text-sm font-semibold text-navy">
              {selectedConcern.label}
            </p>
            <p className="mt-2 text-sm leading-7 text-muted">
              {selectedConcern.safeResponse}
            </p>
            <p className="mt-3 rounded-2xl bg-softblue/65 px-4 py-3 text-xs leading-6 text-muted">
              {selectedConcern.intakePrompt}
            </p>
          </div>

          {(urgentFlag || selectedConcern.emergencyWarning) && (
            <div className="mt-4 flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/85 p-4 text-xs leading-5 text-muted">
              <ShieldAlert
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 flex-none text-amber-600"
              />
              <p>{flow.urgentGuidance}</p>
            </div>
          )}

          {handoffOpen ? (
            <>
          <div className="mt-4 rounded-[1.25rem] border border-cyan/25 bg-white/86 p-4">
            <p className="text-sm font-semibold text-navy">
              Solicitud para el equipo
            </p>
            <p className="mt-2 text-xs leading-6 text-muted">
              Complete solo lo necesario para que el equipo pueda revisar la
              solicitud y confirmar disponibilidad manualmente.
            </p>
          </div>

          <div className="mt-4 grid gap-3">
            <AssistantField
              label={flow.fields.name}
              id="assistant-name"
              error={errors.name}
              required
            >
              <input
                id="assistant-name"
                value={values.name}
                onChange={(event) => updateField("name", event)}
                placeholder={flow.placeholders.name}
                className={fieldClass(Boolean(errors.name))}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "assistant-name-error" : undefined}
              />
            </AssistantField>

            <div className="grid gap-3 sm:grid-cols-2">
              <AssistantField
                label={flow.fields.phone}
                id="assistant-phone"
                error={errors.phone}
                required
              >
                <input
                  id="assistant-phone"
                  value={values.phone}
                  onChange={(event) => updateField("phone", event)}
                  placeholder={flow.placeholders.phone}
                  className={fieldClass(Boolean(errors.phone))}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "assistant-phone-error" : undefined}
                />
              </AssistantField>
              <AssistantField
                label={flow.fields.email}
                id="assistant-email"
                error={errors.email}
                required
              >
                <input
                  id="assistant-email"
                  type="email"
                  value={values.email}
                  onChange={(event) => updateField("email", event)}
                  placeholder={flow.placeholders.email}
                  className={fieldClass(Boolean(errors.email))}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "assistant-email-error" : undefined}
                />
              </AssistantField>
            </div>

            <textarea
              value={values.message}
              onChange={(event) => updateField("message", event)}
              placeholder={flow.placeholders.message}
              className="min-h-24 resize-y rounded-xl border border-borderblue bg-white/90 px-4 py-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-medical focus:ring-4 focus:ring-softblue"
              aria-label={flow.fields.message}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={values.isFirstVisit}
                onChange={(event) => updateField("isFirstVisit", event)}
                className="min-h-11 rounded-xl border border-borderblue bg-white/90 px-4 text-sm text-navy outline-none transition focus:border-medical focus:ring-4 focus:ring-softblue"
                aria-label={flow.fields.isFirstVisit}
              >
                <option value="">{flow.fields.isFirstVisit}</option>
                <option value="yes">{flow.options.yes}</option>
                <option value="no">{flow.options.no}</option>
              </select>
              <select
                value={values.hasStudies}
                onChange={(event) => updateField("hasStudies", event)}
                className="min-h-11 rounded-xl border border-borderblue bg-white/90 px-4 text-sm text-navy outline-none transition focus:border-medical focus:ring-4 focus:ring-softblue"
                aria-label={flow.fields.hasStudies}
              >
                <option value="">{flow.fields.hasStudies}</option>
                <option value="yes">{flow.options.yes}</option>
                <option value="no">{flow.options.no}</option>
              </select>
            </div>

            <input
              value={values.preferredTime}
              onChange={(event) => updateField("preferredTime", event)}
              placeholder={flow.placeholders.preferredTime}
              className="min-h-11 rounded-xl border border-borderblue bg-white/90 px-4 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-medical focus:ring-4 focus:ring-softblue"
              aria-label={flow.fields.preferredTime}
            />
            <input
              value={values.studyTypes}
              onChange={(event) => updateField("studyTypes", event)}
              placeholder={flow.placeholders.studyTypes}
              className="min-h-11 rounded-xl border border-borderblue bg-white/90 px-4 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-medical focus:ring-4 focus:ring-softblue"
              aria-label={flow.fields.studyTypes}
            />
          </div>

          <label className="mt-4 flex cursor-pointer gap-3 rounded-2xl border border-borderblue bg-white/80 p-4 text-xs leading-6 text-muted transition hover:border-medical">
            <input
              type="checkbox"
              checked={values.consentAccepted}
              onChange={(event) => updateField("consentAccepted", event)}
              className="mt-1 h-4 w-4 rounded border-borderblue text-medical focus:ring-cyan"
              aria-invalid={Boolean(errors.consentAccepted)}
              aria-describedby={
                errors.consentAccepted ? "assistant-consent-error" : undefined
              }
            />
            <span>
              {flow.fields.consent}
              {errors.consentAccepted && (
                <span
                  id="assistant-consent-error"
                  className="mt-2 block font-semibold text-red-600"
                >
                  {errors.consentAccepted}
                </span>
              )}
            </span>
          </label>

          {summary && (
            <div className="mt-4 rounded-2xl border border-borderblue bg-white/88 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 flex-none text-cyan"
                />
                <div>
                  <p className="text-sm font-semibold text-navy">
                    {urgentFlag ? flow.summary.urgentTitle : flow.summary.title}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-muted">
                    {urgentFlag ? flow.summary.urgentBody : flow.summary.body}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-muted">
                    {summary.summaryText}
                  </p>
                  <p className="mt-2 text-xs font-semibold leading-6 text-navy">
                    {summary.recommendedNextAction}
                  </p>
                  {submissionResult && (
                    <p
                      className={cn(
                        "mt-3 rounded-2xl border px-4 py-3 text-xs font-semibold leading-5",
                        submissionResult.delivered
                          ? "border-cyan/30 bg-cyan/10 text-navy"
                          : "border-amber-100 bg-amber-50/90 text-muted",
                      )}
                    >
                      {submissionResult.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={prepareSummary}
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-borderblue bg-white px-4 py-3 text-sm font-semibold text-navy shadow-sm transition hover:-translate-y-0.5 hover:border-medical hover:bg-softblue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              {isSubmitting
                ? language === "es"
                  ? "Enviando..."
                  : "Sending..."
                : flow.summary.prepare}
            </button>
            <Link
              to="/agendar-cita"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-navy-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              {flow.summary.book}
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a
              href={whatsappHref}
              onClick={(event) => {
                if (!summary) {
                  event.preventDefault();
                  prepareSummary();
                } else {
                  trackEvent("whatsapp_click", {
                    source: "assistant_summary",
                    concern,
                    path: location.pathname,
                  });
                }
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-borderblue bg-white px-4 py-3 text-sm font-semibold text-navy shadow-sm transition hover:-translate-y-0.5 hover:border-medical hover:bg-softblue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            >
              {flow.summary.sendWhatsapp}
              <Send aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
            </>
          ) : (
            <div className="mt-5 rounded-[1.25rem] border border-borderblue bg-white/78 p-4">
              <p className="text-sm font-semibold text-navy">
                {language === "es"
                  ? "Converse primero, sin dejar datos personales."
                  : "Chat first, without sharing personal details."}
              </p>
              <p className="mt-2 text-xs leading-6 text-muted">
                {language === "es"
                  ? "Cuando quiera una cita, seguimiento del equipo o ayuda para una posible urgencia, abriremos un formulario corto."
                  : "When you want a visit, team follow-up, or help with a possible urgent concern, we will open a short form."}
              </p>
              <button
                type="button"
                onClick={() => openHandoffForm("general")}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-navy-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                <CalendarDays aria-hidden="true" className="h-4 w-4" />
                {language === "es" ? "Solicitar cita o contacto" : "Request visit or contact"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function trapFocus(event: KeyboardEvent, container: HTMLElement) {
  const focusable = Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("disabled"));

  if (!focusable.length) {
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function buildLead({
  values,
  concern,
  language,
  sourcePage,
  urgentFlag,
  conversationSummary = "",
}: {
  values: AssistantFormValues;
  concern: PatientConcern;
  language: "es" | "en";
  sourcePage: string;
  urgentFlag: boolean;
  conversationSummary?: string;
}): IntakeLead {
  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    concern,
    preferredTime: values.preferredTime.trim(),
    isFirstVisit: parseBoolean(values.isFirstVisit),
    hasStudies: parseBoolean(values.hasStudies),
    studyTypes: values.studyTypes
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    message: values.message.trim(),
    conversationSummary,
    language,
    sourcePage,
    createdAt: new Date().toISOString(),
    urgentFlag,
    consentAccepted: values.consentAccepted,
  };
}

function parseBoolean(value: "" | "yes" | "no") {
  if (value === "yes") {
    return true;
  }

  if (value === "no") {
    return false;
  }

  return null;
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function fieldClass(hasError: boolean) {
  return cn(
    "min-h-11 w-full rounded-xl border border-borderblue bg-white/90 px-4 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-medical focus:ring-4 focus:ring-softblue",
    hasError && "border-red-300 focus:border-red-400 focus:ring-red-100",
  );
}

function createAssistantMessage(text: string, urgent = false): ChatMessage {
  return {
    id: createMessageId("assistant"),
    role: "assistant",
    text,
    urgent,
  };
}

function createUserMessage(text: string): ChatMessage {
  return {
    id: createMessageId("user"),
    role: "user",
    text,
  };
}

function summarizeConversation(messages: ChatMessage[]) {
  return messages
    .slice(-8)
    .map((message) => `${message.role === "user" ? "Patient" : "Ariel"}: ${message.text}`)
    .join("\n")
    .slice(0, 1600);
}

function createMessageId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getTextAssistantReply(message: string): TextAssistantReply {
  const language = detectTextAssistantLanguage(message);
  const concern = detectTextAssistantConcern(message);
  const urgent =
    hasUrgentLanguage([message], "es") || hasUrgentLanguage([message], "en");
  const normalized = normalizeAssistantText(message);

  if (urgent) {
    return {
      language,
      concern: "speak_to_team",
      urgent: true,
      text:
        language === "en"
          ? "Based on what you wrote, please seek urgent medical care or contact the team immediately at +507 6314-5514. This chat does not replace emergency care. If you want the team to follow up, share your name and phone number in the form below."
          : "Por lo que menciona, debe buscar atención médica urgente o contactar al equipo de inmediato al +507 6314-5514. Este chat no reemplaza una urgencia médica. Si desea seguimiento del equipo, comparta su nombre y teléfono en el formulario de abajo.",
    };
  }

  if (
    includesAny(normalized, [
      "medicamento",
      "medicamentos",
      "medicina",
      "dosis",
      "antibiotico",
      "analgesico",
      "ibuprofeno",
      "pastilla",
      "que tomo",
      "medicine",
      "medication",
      "dose",
      "dosage",
      "antibiotic",
      "painkiller",
      "ibuprofen",
      "what should i take",
    ])
  ) {
    return {
      language,
      concern,
      text:
        language === "en"
          ? "I cannot recommend medicines, doses, or treatment changes through this chat. Dr. Brugiati should evaluate the case first. If this is urgent or symptoms are worsening, contact the team at +507 6314-5514 or seek urgent care."
          : "No puedo recomendar medicamentos, dosis ni cambios de tratamiento por este chat. El Dr. Brugiati debe evaluar el caso primero. Si es urgente o los síntomas empeoran, contacte al equipo al +507 6314-5514 o acuda a urgencias.",
    };
  }

  const symptomGuidance = getSymptomGuidanceReply(normalized, language);

  if (symptomGuidance) {
    return symptomGuidance;
  }

  const knowledgeReply = getAssistantKnowledgeReply(language, message);

  if (knowledgeReply) {
    return {
      language,
      concern,
      text: knowledgeReply,
    };
  }

  if (
    includesAny(normalized, [
      "seguro",
      "aseguradora",
      "cobertura",
      "cubren",
      "precio",
      "costo",
      "insurance",
      "coverage",
      "covered",
      "cost",
      "price",
    ])
  ) {
    return {
      language,
      concern: "general",
      text:
        language === "en"
          ? "Insurance, coverage, and exact pricing should be confirmed manually by the team. You can leave your name, WhatsApp, and the type of visit below, or contact UroPanama at +507 6314-5514."
          : "La cobertura, seguro y precios exactos deben confirmarse manualmente con el equipo. Puede dejar su nombre, WhatsApp y tipo de consulta abajo, o contactar a UroPanama al +507 6314-5514.",
    };
  }

  if (
    includesAny(normalized, [
      "humano",
      "persona",
      "equipo",
      "llamar",
      "telefono",
      "whatsapp",
      "hablar con alguien",
      "human",
      "person",
      "team",
      "call",
      "phone",
      "speak to someone",
    ])
  ) {
    return {
      language,
      concern: "speak_to_team",
      text:
        language === "en"
          ? "Of course. You can contact the team by phone or WhatsApp at +507 6314-5514, or leave your details below so the team can review the request and follow up manually."
          : "Claro. Puede comunicarse con el equipo por teléfono o WhatsApp al +507 6314-5514, o dejar sus datos abajo para que el equipo revise la solicitud y le dé seguimiento manualmente.",
    };
  }

  if (concern === "location") {
    return {
      language,
      concern,
      text:
        language === "en"
          ? "Care is coordinated in Panama City, Panama. For exact address details, parking, and availability, contact the team at +507 6314-5514 or leave your WhatsApp below."
          : "La atención se coordina en Ciudad de Panamá, Panamá. Para detalles exactos de dirección, estacionamiento y disponibilidad, contacte al equipo al +507 6314-5514 o deje su WhatsApp abajo.",
    };
  }

  if (concern === "kidney_stones") {
    return {
      language,
      concern,
      text:
        language === "en"
          ? "For kidney stones, the doctor usually needs to review symptoms and available imaging such as CT scan, ultrasound, or labs. Bring any studies to the visit. If there is fever, vomiting, severe pain, bleeding, or trouble urinating, seek urgent care."
          : "Para cálculos renales, normalmente se revisan síntomas y estudios disponibles como tomografía, ultrasonido o laboratorios. Lleve sus estudios a la consulta. Si hay fiebre, vómitos, dolor intenso, sangrado o dificultad para orinar, busque atención urgente.",
    };
  }

  if (
    includesAny(normalized, [
      "dolor al orinar",
      "ardor al orinar",
      "quemazon",
      "ardor",
      "orina con dolor",
      "dolor urinario",
      "burning urination",
      "painful urination",
      "burns when i pee",
    ])
  ) {
    return {
      language,
      concern: "general",
      text:
        language === "en"
          ? "Pain or burning with urination can have different causes, such as urinary infection, inflammation, stones, prostate irritation, or other urinary tract conditions. I cannot diagnose it here. If there is fever, back pain, blood in urine, vomiting, severe pain, or trouble urinating, seek urgent care. For a visit, you can share your details and the team will follow up manually."
          : "El dolor o ardor al orinar puede tener varias causas, como infección urinaria, inflamación, cálculos, irritación prostática u otras condiciones de las vías urinarias. No puedo diagnosticarlo por este chat. Si hay fiebre, dolor en la espalda, sangre en la orina, vómitos, dolor fuerte o dificultad para orinar, busque atención urgente. Si desea consulta, puede compartir sus datos y el equipo le dará seguimiento manualmente.",
    };
  }

  if (concern === "prostate") {
    return {
      language,
      concern,
      text:
        language === "en"
          ? "For prostate symptoms or PSA questions, this chat can help coordinate an evaluation, but it cannot interpret results or diagnose. Bring PSA results, imaging, and prior reports if available."
          : "Para síntomas de próstata o preguntas sobre PSA, este chat puede ayudarle a coordinar una evaluación, pero no interpreta resultados ni diagnostica. Lleve PSA, imágenes e informes previos si los tiene disponibles.",
    };
  }

  if (concern === "uro_oncology" || concern === "second_opinion") {
    return {
      language,
      concern,
      text:
        language === "en"
          ? "For uro-oncology or a second opinion, the best next step is a consultation where Dr. Brugiati can review reports, biopsy or pathology results, imaging, labs, and prior recommendations."
          : "Para uro-oncología o segunda opinión, lo ideal es una consulta donde el Dr. Brugiati pueda revisar informes, biopsia o patología, imágenes, laboratorios y recomendaciones previas.",
    };
  }

  if (concern === "male_health") {
    return {
      language,
      concern,
      text:
        language === "en"
          ? "You can coordinate a private urology visit for men's health concerns, including urinary symptoms, sexual health, fertility, or prevention. Leave your details below and the team will confirm availability manually."
          : "Puede coordinar una consulta urológica privada para salud masculina, síntomas urinarios, salud sexual, fertilidad o prevención. Deje sus datos abajo y el equipo confirmará disponibilidad manualmente.",
    };
  }

  if (
    includesAny(normalized, [
      "cita",
      "agendar",
      "reservar",
      "consulta",
      "disponibilidad",
      "appointment",
      "book",
      "schedule",
      "visit",
      "availability",
    ])
  ) {
    return {
      language,
      concern: "general",
      text:
        language === "en"
          ? "I can help start the appointment request. Please share your name, WhatsApp, preferred time, whether this is your first visit, and whether you have studies or reports. The team confirms availability manually."
          : "Puedo ayudarle a iniciar la solicitud de cita. Comparta su nombre, WhatsApp, horario preferido, si es primera consulta y si tiene estudios o informes disponibles. El equipo confirma la disponibilidad manualmente.",
    };
  }

  return {
    language,
    concern,
    text:
      language === "en"
        ? "I can help with appointment requests, UroPanama location, what to prepare for the visit, and general urology questions. I do not provide diagnoses. If you want to book, leave your name, WhatsApp, preferred time, and reason for the visit below."
        : "Puedo ayudarle con solicitudes de cita, ubicación de UroPanama, qué preparar para la consulta y preguntas generales de urología. No doy diagnósticos. Si desea agendar, deje abajo su nombre, WhatsApp, horario preferido y motivo de consulta.",
  };
}

function detectTextAssistantLanguage(message: string): "es" | "en" {
  const normalized = normalizeAssistantText(message);

  if (includesAny(normalized, ["english", "in english"])) {
    return "en";
  }

  const englishScore = countMatches(normalized, [
    "hello",
    "hi",
    "appointment",
    "book",
    "schedule",
    "kidney",
    "stone",
    "prostate",
    "pain",
    "bleeding",
    "fever",
    "location",
    "located",
    "where are",
    "your office",
    "do you",
    "can you",
    "how can",
    "what is",
    "where",
    "insurance",
    "coverage",
    "medicine",
    "medication",
    "doctor",
    "visit",
    "can i",
    "i need",
    "i want",
  ]);
  const spanishScore = countMatches(normalized, [
    "hola",
    "cita",
    "agendar",
    "consulta",
    "calculo",
    "rinon",
    "prostata",
    "dolor",
    "sangrado",
    "fiebre",
    "ubicacion",
    "seguro",
    "cobertura",
    "medicamento",
    "doctor",
    "quiero",
    "necesito",
  ]);

  return englishScore >= 2 && spanishScore === 0 ? "en" : "es";
}

function detectTextAssistantConcern(message: string): PatientConcern {
  const normalized = normalizeAssistantText(message);

  if (
    includesAny(normalized, [
      "segunda opinion",
      "second opinion",
      "otra opinion",
      "revisar estudios",
      "prior recommendation",
    ])
  ) {
    return "second_opinion";
  }

  if (
    includesAny(normalized, [
      "cancer",
      "oncologia",
      "oncologico",
      "tumor",
      "biopsia",
      "patologia",
      "pathology",
      "biopsy",
      "oncology",
    ])
  ) {
    return "uro_oncology";
  }

  if (
    includesAny(normalized, [
      "calculo",
      "calculos",
      "piedra",
      "piedras",
      "rinon",
      "renal",
      "colico",
      "tomografia",
      "kidney",
      "stone",
      "stones",
      "flank",
      "ct scan",
    ])
  ) {
    return "kidney_stones";
  }

  if (
    includesAny(normalized, [
      "prostata",
      "psa",
      "urinario",
      "orinar",
      "orina",
      "prostate",
      "urinary",
      "urinate",
      "pee",
    ])
  ) {
    return "prostate";
  }

  if (
    includesAny(normalized, [
      "ureteroscopia",
      "ureteroscopia laser",
      "ureteroscopy",
    ])
  ) {
    return "ureteroscopy";
  }

  if (
    includesAny(normalized, [
      "disfuncion",
      "erectil",
      "fertilidad",
      "vasectomia",
      "salud masculina",
      "sexual",
      "fertility",
      "vasectomy",
      "men's health",
      "mens health",
    ])
  ) {
    return "male_health";
  }

  if (
    includesAny(normalized, [
      "ubicacion",
      "direccion",
      "donde estan",
      "donde queda",
      "panama",
      "location",
      "address",
      "where are",
      "where is",
    ])
  ) {
    return "location";
  }

  return "general";
}

function normalizeAssistantText(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getSymptomGuidanceReply(
  normalized: string,
  language: "es" | "en",
): TextAssistantReply | null {
  if (
    includesAny(normalized, [
      "dolor testicular",
      "testiculo",
      "testicular pain",
      "swollen testicle",
      "testicle swelling",
    ])
  ) {
    return {
      language,
      concern: "speak_to_team",
      urgent: true,
      text:
        language === "en"
          ? "Sudden or intense testicular pain can require urgent evaluation. I cannot diagnose the cause here. Possible causes include inflammation, infection, trauma, or conditions that need immediate care. If the pain is sudden, severe, associated with swelling, nausea, fever, or a testicle sitting higher than usual, seek urgent medical care now. The team can also receive a short summary if you leave your contact details."
          : "El dolor testicular repentino o intenso puede requerir evaluación urgente. No puedo diagnosticar la causa por este chat. Algunas posibilidades incluyen inflamación, infección, trauma o condiciones que necesitan atención inmediata. Si el dolor es súbito, fuerte, hay aumento de volumen, náuseas, fiebre o el testículo está más alto de lo normal, acuda a urgencias ahora. El equipo también puede recibir un resumen si deja sus datos.",
    };
  }

  if (
    includesAny(normalized, [
      "sangre en la orina",
      "orina con sangre",
      "hematuria",
      "blood in urine",
      "bloody urine",
    ])
  ) {
    return {
      language,
      concern: "uro_oncology",
      text:
        language === "en"
          ? "Blood in the urine can have several causes, including infection, stones, prostate conditions, urinary tract inflammation, trauma, or tumors. It should be reviewed by a urologist, especially if it repeats or appears without pain. If bleeding is heavy, there are clots, fever, severe pain, weakness, or difficulty urinating, seek urgent care. For a non-emergency review, share your details and the team can follow up."
          : "La sangre en la orina puede tener varias causas, como infección, cálculos, condiciones de próstata, inflamación de las vías urinarias, trauma o tumores. Debe revisarse con un urólogo, especialmente si se repite o aparece sin dolor. Si el sangrado es abundante, hay coágulos, fiebre, dolor fuerte, debilidad o dificultad para orinar, busque atención urgente. Para una revisión no urgente, comparta sus datos y el equipo puede darle seguimiento.",
    };
  }

  if (
    includesAny(normalized, [
      "dolor al orinar",
      "ardor al orinar",
      "quemazon",
      "ardor",
      "orina con dolor",
      "dolor urinario",
      "burning urination",
      "painful urination",
      "burns when i pee",
    ])
  ) {
    return {
      language,
      concern: "general",
      text:
        language === "en"
          ? "Pain or burning with urination can have different causes, such as urinary infection, inflammation, stones, prostate irritation, or other urinary tract conditions. I cannot diagnose it here. Helpful details are when it started, whether there is fever, blood, back pain, discharge, or trouble urinating. If those warning signs are present, seek urgent care. Otherwise, the team can help coordinate a urology visit."
          : "El dolor o ardor al orinar puede tener varias causas, como infección urinaria, inflamación, cálculos, irritación prostática u otras condiciones de las vías urinarias. No puedo diagnosticarlo por este chat. Ayuda saber desde cuándo empezó, si hay fiebre, sangre, dolor de espalda, secreción o dificultad para orinar. Si aparecen esas señales, busque atención urgente. Si no, el equipo puede coordinar una consulta urológica.",
    };
  }

  if (
    includesAny(normalized, [
      "psa alto",
      "psa elevado",
      "antigeno prostatico",
      "elevated psa",
      "high psa",
    ])
  ) {
    return {
      language,
      concern: "prostate",
      text:
        language === "en"
          ? "An elevated PSA does not automatically mean prostate cancer. It can be related to prostate enlargement, inflammation, infection, recent procedures, ejaculation, cycling, or cancer, among other causes. A urologist usually reviews the PSA trend, age, symptoms, exam findings, MRI or other studies when appropriate. Bring prior PSA results if available."
          : "Un PSA elevado no significa automáticamente cáncer de próstata. Puede relacionarse con crecimiento prostático, inflamación, infección, procedimientos recientes, eyaculación, bicicleta o cáncer, entre otras causas. El urólogo suele revisar la tendencia del PSA, edad, síntomas, hallazgos del examen, resonancia u otros estudios cuando corresponda. Lleve resultados previos de PSA si los tiene.",
    };
  }

  if (
    includesAny(normalized, [
      "disfuncion erectil",
      "ereccion",
      "erectil",
      "erectile dysfunction",
      "erection",
    ])
  ) {
    return {
      language,
      concern: "male_health",
      text:
        language === "en"
          ? "Erectile dysfunction can be related to circulation, hormones, diabetes, blood pressure, medications, stress, sleep, prostate treatments, or other health factors. I cannot prescribe medication or diagnose the cause here. A private urology visit can review history, risk factors, safety, and options."
          : "La disfunción eréctil puede relacionarse con circulación, hormonas, diabetes, presión arterial, medicamentos, estrés, sueño, tratamientos prostáticos u otros factores de salud. No puedo recetar medicamentos ni diagnosticar la causa por este chat. Una consulta urológica privada puede revisar antecedentes, riesgos, seguridad y opciones.",
    };
  }

  return null;
}

function wantsAppointmentHandoff(message: string) {
  const normalized = normalizeAssistantText(message);
  return includesAny(normalized, [
    "cita",
    "agendar",
    "reservar",
    "consulta",
    "disponibilidad",
    "whatsapp",
    "telefono",
    "contacto",
    "equipo",
    "appointment",
    "book",
    "schedule",
    "visit",
    "availability",
    "contact",
    "team",
    "phone",
  ]);
}

function getSpeechRecognitionConstructor() {
  const browserWindow = window as Window &
    typeof globalThis & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

  return (
    browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition
  );
}

function includesAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

function countMatches(value: string, terms: string[]) {
  return terms.reduce((count, term) => count + (value.includes(term) ? 1 : 0), 0);
}

function AssistantField({
  label,
  id,
  children,
  error,
  required = false,
}: {
  label: string;
  id: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-[11px] font-bold uppercase tracking-[0.12em] text-navy"
      >
        {label}
        {required && <span className="text-medical"> *</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}



