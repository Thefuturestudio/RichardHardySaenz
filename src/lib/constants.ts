import {
  BarChart3,
  BookOpen,
  Bot,
  BrainCircuit,
  CalendarCheck2,
  CreditCard,
  FlaskConical,
  Home,
  Inbox,
  KeyRound,
  ClipboardCheck,
  ListChecks,
  DatabaseZap,
  MessageCircle,
  MessageSquare,
  MonitorCheck,
  Mic2,
  Package,
  RadioTower,
  Rocket,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
  Users,
  Wifi,
} from "lucide-react";

export const PRODUCT_MOTIONS = [
  {
    name: "Reserva Viva",
    description: "Reception, missed-call recovery, and booking support.",
  },
  {
    name: "Venta Viva",
    description: "WhatsApp sales, catalog support, carts, and checkout.",
  },
  {
    name: "Viva Med",
    description: "Medical operations, appointments, privacy gates, and safe handoff.",
  },
];

export const BUSINESS_TYPES = [
  { value: "clinic", label: "Clinic / medical office" },
  { value: "dental", label: "Dental office" },
  { value: "mental_health", label: "Mental health / therapy" },
  { value: "med_spa", label: "Medical spa / aesthetics" },
  { value: "home_health", label: "Home health / care services" },
  { value: "pharmacy", label: "Pharmacy / medication support" },
  { value: "beauty", label: "Beauty, spa, or wellness" },
  { value: "legal", label: "Legal services" },
  { value: "real_estate", label: "Real estate" },
  { value: "insurance", label: "Insurance" },
  { value: "auto", label: "Auto services" },
  { value: "home_services", label: "Home services" },
  { value: "retail", label: "Retail / product seller" },
  { value: "restaurant", label: "Restaurant / catering" },
  { value: "other", label: "Other" },
];

export const LANGUAGES = [
  { value: "es", label: "Spanish" },
  { value: "en", label: "English" },
  { value: "both", label: "Spanish + English" },
];

export const TONES = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "warm", label: "Warm" },
  { value: "concise", label: "Concise" },
];

export const TIMEZONES = [
  "America/Panama",
  "America/Bogota",
  "America/Mexico_City",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/Madrid",
];

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Overview", icon: Home, activeExact: true },
  { href: "/dashboard/viva-med", label: "Viva Med", icon: Stethoscope },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck2 },
  { href: "/dashboard/orders", label: "Orders", icon: Inbox },
  { href: "/dashboard/catalog", label: "Catalog", icon: Package },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/ai-tools", label: "AI tools", icon: BrainCircuit },
  { href: "/dashboard/automations", label: "Automations", icon: Bot },
  { href: "/dashboard/channels", label: "Channels", icon: BarChart3 },
  { href: "/dashboard/channels/whatsapp-beta", label: "WhatsApp beta", icon: Wifi },
  { href: "/dashboard/channels/voice", label: "Voice", icon: Mic2 },
  {
    href: "/dashboard/channels/official-whatsapp",
    label: "Official WhatsApp",
    icon: MessageCircle,
  },
  { href: "/dashboard/provider-credentials", label: "Credentials", icon: KeyRound },
  { href: "/dashboard/webhooks", label: "Webhooks", icon: RadioTower },
  { href: "/dashboard/outbox", label: "Outbox", icon: Send },
  { href: "/dashboard/go-live", label: "Go live", icon: Rocket },
  { href: "/dashboard/pilot-workflow", label: "Pilot workflow", icon: ListChecks },
  { href: "/dashboard/test-center", label: "Test center", icon: FlaskConical },
  { href: "/dashboard/test-data", label: "Test data", icon: DatabaseZap },
  { href: "/dashboard/production-qa", label: "Production QA", icon: ClipboardCheck },
  { href: "/dashboard/privacy", label: "Privacy ops", icon: ShieldCheck },
  { href: "/dashboard/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/dashboard/activation", label: "Activation", icon: SlidersHorizontal },
  { href: "/dashboard/admin", label: "Monitoring", icon: MonitorCheck },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export const FUTURE_MODULES = [
  {
    title: "Orders",
    description: "Future carts, payment links, and fulfillment states.",
    icon: Inbox,
  },
  {
    title: "AI agent tools",
    description: "Future runtime tools that use catalog and conversation data.",
    icon: Bot,
  },
  {
    title: "Automations",
    description: "Future n8n workflows, notifications, and handoff jobs.",
    icon: BookOpen,
  },
  {
    title: "Billing",
    description: "Future Stripe subscriptions, usage, and plan controls.",
    icon: CreditCard,
  },
];
