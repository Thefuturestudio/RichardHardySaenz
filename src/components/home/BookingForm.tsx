import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, Lock, MessageCircle, Send } from "lucide-react";
import { concernFromPath, intakeFlow } from "../../data/intakeFlow";
import { useLanguage } from "../../i18n/LanguageContext";
import { refinementCopy } from "../../i18n/refinementCopy";
import { cn } from "../../lib/cn";
import type { IntakeLead, PatientConcern } from "../../types/intake";
import { generateLeadSummary } from "../../utils/leadSummary";
import { hasUrgentLanguage } from "../../utils/medicalSafety";
import { trackEvent } from "../../utils/analytics";
import { createWhatsAppLink } from "../../utils/whatsapp";
import {
  submitIntakeLead,
  type IntakeSubmissionResult,
} from "../../utils/intakeSubmission";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  reason: string;
  schedule: string;
  firstVisit: string;
  message: string;
  consent: boolean;
};

const requiredFields: Array<keyof FormValues> = ["name", "phone", "reason"];

export function BookingForm({
  compact = false,
  variant = "default",
}: {
  compact?: boolean;
  variant?: "default" | "dark";
}) {
  const { language, t } = useLanguage();
  const location = useLocation();
  const bookingCopy = refinementCopy[language].booking;
  const flow = intakeFlow[language];
  const initialValues = useMemo<FormValues>(
    () => ({
      name: "",
      phone: "",
      email: "",
      reason: "",
      schedule: "",
      firstVisit: t.forms.firstVisitOptions[0],
      message: "",
      consent: false,
    }),
    [t.forms.firstVisitOptions],
  );
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>(
    {},
  );
  const [submittedLead, setSubmittedLead] = useState<IntakeLead | null>(null);
  const [submissionResult, setSubmissionResult] =
    useState<IntakeSubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const leadSummary = submittedLead
    ? generateLeadSummary(submittedLead, language)
    : null;

  function updateField(field: keyof FormValues, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmittedLead(null);
    setSubmissionResult(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};

    requiredFields.forEach((field) => {
      const value = values[field];
      if (typeof value === "string" && !value.trim()) {
        nextErrors[field] = flow.validation.required;
      }
    });

    if (values.phone.trim() && !isValidPhone(values.phone)) {
      nextErrors.phone = flow.validation.phone;
    }

    if (values.email.trim() && !isValidEmail(values.email)) {
      nextErrors.email = flow.validation.email;
    }

    if (!values.consent) {
      nextErrors.consent = bookingCopy.consentRequired || flow.validation.consent;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      const lead = buildBookingLead(values, language, location.pathname);
      setIsSubmitting(true);
      const result = await submitIntakeLead(lead);
      setSubmissionResult(result);
      setSubmittedLead(lead);
      setIsSubmitting(false);
      trackEvent("booking_form_submit", {
        concern: lead.concern,
        language,
        sourcePage: location.pathname,
        urgentFlag: lead.urgentFlag,
        delivered: result.delivered,
      });
    }
  }

  const fieldClass =
    "mt-2 min-h-12 w-full rounded-xl border border-borderblue bg-white/82 px-4 py-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-medical focus:ring-4 focus:ring-softblue";

  if (submittedLead && leadSummary) {
    return (
      <div className="premium-card rounded-[1.35rem] p-8">
        <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-cyan" />
        <h3 className="mt-5 font-heading text-4xl leading-tight text-navy">
          {t.forms.successTitle}
        </h3>
        <p className="mt-3 text-sm leading-7 text-muted">{t.forms.successBody}</p>
        <div className="mt-5 rounded-2xl border border-borderblue bg-softblue/62 p-4">
          <p className="text-sm font-semibold text-navy">{leadSummary.title}</p>
          <p className="mt-2 text-sm leading-7 text-muted">
            {leadSummary.summaryText}
          </p>
          <p className="mt-2 text-sm font-semibold leading-7 text-navy">
            {leadSummary.recommendedNextAction}
          </p>
        </div>
        {submissionResult && (
          <p
            className={cn(
              "mt-4 rounded-2xl border px-4 py-3 text-xs font-semibold leading-6",
              submissionResult.delivered
                ? "border-cyan/30 bg-cyan/10 text-navy"
                : "border-amber-100 bg-amber-50/90 text-muted",
            )}
          >
            {submissionResult.message}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={createWhatsAppLink({
              language,
              sourcePage: location.pathname,
              leadData: submittedLead,
            })}
            onClick={() =>
              trackEvent("whatsapp_click", {
                source: "booking_success",
                concern: submittedLead.concern,
                path: location.pathname,
              })
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-navy-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            {flow.summary.sendWhatsapp}
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmittedLead(null);
              setSubmissionResult(null);
              setValues(initialValues);
            }}
            className="rounded-full border border-borderblue px-5 py-3 text-sm font-semibold text-navy transition hover:bg-softblue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            {t.cta.again}
          </button>
        </div>
      </div>
    );
  }

  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "rounded-[1.35rem] p-5 sm:p-7",
        isDark
          ? "border border-white/10 bg-navy text-white shadow-[0_28px_90px_rgba(6,27,51,0.24)]"
          : "premium-card text-navy",
        compact && "shadow-soft",
      )}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className={cn("font-heading text-4xl leading-none", isDark ? "text-white" : "text-navy")}>
            {t.forms.title}
          </h3>
          <p className={cn("mt-3 max-w-md text-sm leading-6", isDark ? "text-white/76" : "text-muted")}>
            {t.forms.subtitle}
          </p>
        </div>
        <div
          className={cn(
            "hidden h-12 w-12 place-items-center rounded-2xl sm:grid",
            isDark ? "bg-white/10 text-white" : "bg-softblue text-navy",
          )}
        >
          <MessageCircle aria-hidden="true" className="h-5 w-5" />
        </div>
      </div>

      <form
        name="booking-request"
        method="POST"
        data-netlify="true"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* TODO: Connect this Netlify Forms-ready structure to Netlify Forms,
            an email API, CRM, calendar booking, or secure backend endpoint. */}
        <input type="hidden" name="form-name" value="booking-request" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.forms.fields.name} required error={errors.name} id="name">
            <input
              id="name"
              name="name"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              className={cn(fieldClass, errors.name && "border-red-300")}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </Field>
          <Field label={t.forms.fields.phone} required error={errors.phone} id="phone">
            <input
              id="phone"
              name="phone"
              value={values.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className={cn(fieldClass, errors.phone && "border-red-300")}
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
          </Field>
          <Field label={t.forms.fields.reason} required error={errors.reason} id="reason">
            <select
              id="reason"
              name="reason"
              value={values.reason}
              onChange={(event) => updateField("reason", event.target.value)}
              className={cn(fieldClass, errors.reason && "border-red-300")}
              aria-invalid={Boolean(errors.reason)}
              aria-describedby={errors.reason ? "reason-error" : undefined}
            >
              <option value="">{t.forms.fields.reasonPlaceholder}</option>
              {t.forms.reasons.map((reason) => (
                <option key={reason}>{reason}</option>
              ))}
            </select>
          </Field>
          <Field label={t.forms.fields.schedule} id="schedule">
            <input
              id="schedule"
              name="preferredTime"
              value={values.schedule}
              onChange={(event) => updateField("schedule", event.target.value)}
              className={fieldClass}
              placeholder={t.forms.fields.schedulePlaceholder}
            />
          </Field>
          <Field label={t.forms.fields.email} error={errors.email} id="email">
            <input
              id="email"
              name="email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              className={cn(fieldClass, errors.email && "border-red-300")}
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </Field>
          <Field label={t.forms.fields.firstVisit} id="firstVisit">
            <select
              id="firstVisit"
              name="firstVisit"
              value={values.firstVisit}
              onChange={(event) => updateField("firstVisit", event.target.value)}
              className={fieldClass}
            >
              {t.forms.firstVisitOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label={t.forms.fields.message} id="message" className="mt-4">
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            className="mt-2 min-h-28 w-full resize-y rounded-xl border border-borderblue bg-white/82 px-4 py-3 text-sm text-navy outline-none transition placeholder:text-slate-400 focus:border-medical focus:ring-4 focus:ring-softblue"
            placeholder={t.forms.fields.messagePlaceholder}
          />
        </Field>

        <label
          className={cn(
            "mt-4 flex cursor-pointer gap-3 rounded-2xl border p-4 text-xs leading-6 transition hover:border-medical",
            isDark
              ? "border-white/12 bg-white/8 text-white/76"
              : "border-borderblue bg-white/76 text-muted",
          )}
        >
          <input
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(event) => updateField("consent", event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-borderblue text-medical focus:ring-cyan"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span>
            {bookingCopy.consent}
            {errors.consent && (
              <span id="consent-error" className="mt-2 block font-semibold text-red-600">
                {errors.consent}
              </span>
            )}
          </span>
        </label>

        <div
          className={cn(
            "mt-4 flex gap-3 rounded-2xl p-4 text-xs leading-6",
            isDark ? "bg-white/8 text-white/76" : "bg-softblue/70 text-muted",
          )}
        >
          <Lock aria-hidden="true" className={cn("mt-0.5 h-4 w-4 flex-none", isDark ? "text-cyan" : "text-medical")} />
          <span>{bookingCopy.privacyBody}</span>
        </div>

        <p className={cn("mt-3 text-xs font-semibold leading-6", isDark ? "text-white/72" : "text-muted")}>
          {flow.summary.emergencyNote}
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-soft transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan sm:w-auto",
            isDark
              ? "bg-white text-navy hover:bg-softblue"
              : "bg-navy text-white hover:bg-navy-2",
          )}
        >
          {isSubmitting ? (language === "es" ? "Enviando..." : "Sending...") : t.forms.submit}
          <Send aria-hidden="true" className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;
  id: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
};

function Field({
  label,
  id,
  children,
  required = false,
  error,
  className,
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-[0.12em] text-current">
        {label}
        {required && <span className="text-medical"> *</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}

function buildBookingLead(
  values: FormValues,
  language: "es" | "en",
  sourcePage: string,
): IntakeLead {
  const concern = concernFromReason(values.reason, sourcePage);
  const urgentFlag = hasUrgentLanguage(
    [values.reason, values.message, values.schedule],
    language,
  );

  return {
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    concern,
    preferredTime: values.schedule.trim(),
    isFirstVisit: parseFirstVisit(values.firstVisit, language),
    hasStudies: null,
    studyTypes: [],
    message: values.message.trim(),
    language,
    sourcePage,
    createdAt: new Date().toISOString(),
    urgentFlag,
    consentAccepted: values.consent,
  };
}

function concernFromReason(reason: string, sourcePage: string): PatientConcern {
  const value = reason.toLocaleLowerCase();

  if (value.includes("cálculo") || value.includes("calculo") || value.includes("stone")) {
    return "kidney_stones";
  }

  if (value.includes("próstata") || value.includes("prostate") || value.includes("psa")) {
    return "prostate";
  }

  if (value.includes("onco") || value.includes("cáncer") || value.includes("cancer")) {
    return "uro_oncology";
  }

  if (value.includes("segunda") || value.includes("second")) {
    return "second_opinion";
  }

  if (value.includes("ureterosc")) {
    return "ureteroscopy";
  }

  if (value.includes("masculina") || value.includes("men")) {
    return "male_health";
  }

  return concernFromPath(sourcePage);
}

function parseFirstVisit(value: string, language: "es" | "en") {
  const normalized = value.toLocaleLowerCase();

  if (language === "es") {
    if (normalized.startsWith("s")) {
      return true;
    }
    if (normalized.startsWith("n")) {
      return false;
    }
  }

  if (normalized.startsWith("y")) {
    return true;
  }

  if (normalized.startsWith("n")) {
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
