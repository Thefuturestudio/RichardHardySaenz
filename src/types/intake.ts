import type { Language } from "../i18n/translations";

export type PatientConcern =
  | "general"
  | "kidney_stones"
  | "prostate"
  | "uro_oncology"
  | "second_opinion"
  | "ureteroscopy"
  | "male_health"
  | "location"
  | "speak_to_team";

export type IntakeLead = {
  name: string;
  phone: string;
  email: string;
  concern: PatientConcern;
  preferredTime: string;
  isFirstVisit: boolean | null;
  hasStudies: boolean | null;
  studyTypes: string[];
  message: string;
  conversationSummary?: string;
  language: Language;
  sourcePage: string;
  createdAt: string;
  urgentFlag: boolean;
  consentAccepted: boolean;
};

export type LeadSummary = {
  title: string;
  patientName: string;
  phone: string;
  concernLabel: string;
  summaryText: string;
  recommendedNextAction: string;
  whatsappMessage: string;
};
