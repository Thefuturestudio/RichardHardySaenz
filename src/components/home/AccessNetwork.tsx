import type { ReactNode } from "react";
import { ArrowRight, ChevronDown, ClipboardCheck, Globe2 } from "lucide-react";
import { CTAButton } from "../shared/CTAButton";
import { useLanguage } from "../../i18n/LanguageContext";

type HospitalPartner = {
  name: string;
  location: string;
  image: string;
  href: string;
};

type InsurancePartner = {
  name: string;
  domain?: string;
  logoSrc?: string;
  category: "national" | "international";
};

const hospitals: HospitalPartner[] = [
  {
    name: "Hospiten Paitilla",
    location: "Paitilla, Ciudad de Panama",
    image: "/images/hospitals/hospital-hospiten-paitilla-generated.webp",
    href: "https://hospitenpaitilla.com/nuestro-centro",
  },
  {
    name: "Pacifica Salud Costa del Este",
    location: "Costa del Este, Ciudad de Panama",
    image: "/images/hospitals/hospital-pacifica-costa-del-este-generated.webp",
    href: "https://www.pacificasalud.com/",
  },
  {
    name: "The Panama Clinic",
    location: "Pacific Center, Ciudad de Panama",
    image: "/images/hospitals/hospital-panama-clinic-generated.webp",
    href: "https://thepanamaclinic.com/",
  },
  {
    name: "Hospital San Fernando",
    location: "Via Espana, Ciudad de Panama",
    image: "/images/hospitals/hospital-san-fernando-generated.webp",
    href: "https://www.hospitalsanfernando.com/",
  },
];

const insurancePartners: InsurancePartner[] = [
  { name: "SURA", domain: "segurossura.com.pa", category: "national" },
  { name: "MAPFRE", domain: "mapfre.com.pa", logoSrc: "https://www.mapfre.com.pa/media/logo-mapfre.png", category: "national" },
  { name: "Blue Cross Blue Shield", domain: "bcbs.com", category: "national" },
  { name: "Acerta", domain: "acertaseguros.com", logoSrc: "https://acertaseguros.com/wp-content/uploads/2024/07/acerta-logo-nuevo.png", category: "national" },
  { name: "Ancon", domain: "asegurancon.com", category: "national" },
  { name: "ASSA", domain: "assanet.com", category: "national" },
  { name: "AXA", domain: "axa.com", logoSrc: "https://www.axa.com/images/logo.png?version=4.21.2", category: "national" },
  { name: "Bupa", domain: "bupaglobal.com", logoSrc: "https://www.bupaglobal.com/-/media/Icons/Bupa-logo-2022.png?h=945&iar=0&w=945&hash=65FADCE73E46357E3B45963271F4A33C", category: "national" },
  { name: "WorldWide", domain: "wwmedicalassurance.com", category: "national" },
  { name: "Unir Vivir", category: "national" },
  { name: "Sagicor", domain: "sagicor.com", category: "national" },
  { name: "Pan American Life", domain: "palig.com", category: "national" },
  { name: "La Regional de Seguros", domain: "laregionaldeseguros.com", logoSrc: "https://www.laregionaldeseguros.com/lrds/wp-content/uploads/2017/06/logo.png", category: "national" },
  { name: "Mercantil de Seguros", category: "national" },
  { name: "Aetna", domain: "aetna.com", category: "international" },
  { name: "Afspa", domain: "afspa.org", logoSrc: "https://www.afspa.org/wp-content/uploads/2021/08/Logo_AFSPA.png", category: "international" },
  { name: "AEG", logoSrc: "https://country.aeg.com/static/media/logo2.svg", category: "international" },
  { name: "Allianz", domain: "allianz.com", category: "international" },
  { name: "Assist Card", domain: "assistcard.com", category: "international" },
  { name: "Cigna", domain: "cigna.com", category: "international" },
  { name: "Argos Assistance", domain: "argosassistance.com", logoSrc: "https://www.argosassistance.com/wp-content/uploads/2025/05/Argos_logo_340x156.png", category: "international" },
  { name: "Euro-Center", domain: "euro-center.com", logoSrc: "https://www.euro-center.com/wp-content/themes/eurocenter/assets/logo.7bc95fb9.svg", category: "international" },
  { name: "Redbridge", logoSrc: "https://api.naascorp.cc/uploads/img_328x64px_providers_logo_redbridge_d71f570f47.svg", category: "international" },
  { name: "Sagicor Life", domain: "sagicor.com", category: "international" },
  { name: "Vumi", domain: "vumigroup.com", logoSrc: "https://www.vumigroup.com/wp-content/uploads/2019/11/logo-myVumi.png", category: "international" },
  { name: "Geo Blue", domain: "geo-blue.com", logoSrc: "https://c8s387h5.media.zestyio.com/logo-geo-blue-main.svg", category: "international" },
  { name: "Optima", category: "international" },
  { name: "Europ Assistance", domain: "europ-assistance.com", logoSrc: "https://www.europ-assistance.com/wp-content/uploads/2025/07/logo-ea.svg", category: "international" },
  { name: "GMC", category: "international" },
  { name: "United Health Care", domain: "uhc.com", category: "international" },
  { name: "Trawick", domain: "trawickinternational.com", category: "international" },
  { name: "IMC Insurance Brokers", category: "international" },
  { name: "Global Excel", domain: "globalexcel.com", logoSrc: "https://globalexcel.com/wp-content/uploads/gemLogoColor.svg", category: "international" },
  { name: "Continental Assist", domain: "continentalassist.com", logoSrc: "https://eva.continentalassist.com/assets/images/logoconti.png", category: "international" },
  { name: "Claria", category: "international" },
  { name: "DKV", domain: "dkv.com", category: "international" },
  { name: "Best Doctor Insurance", domain: "bestdoctorsinsurance.com", category: "international" },
  { name: "April International", domain: "april-international.com", category: "international" },
];

const copy = {
  es: {
    eyebrow: "Acceso y coordinación",
    title: "Seguros y hospitales para una atención mejor coordinada.",
    body:
      "El equipo orienta la coordinación de citas, procedimientos y validación de cobertura según la aseguradora y la sede correspondiente.",
    insuranceTitle: "Seguros aceptados",
    insurancePrompt:
      "Seleccione una categoría para ver aseguradoras aceptadas. La cobertura y los requisitos se confirman antes de la cita.",
    national: "Nacionales",
    international: "Internacionales",
    viewList: "Ver lista",
    hideList: "Ocultar lista",
    insurersLabel: "aseguradoras",
    cta: "Confirmar cobertura",
    secondaryCta: "Agendar consulta",
  },
  en: {
    eyebrow: "Access and coordination",
    title: "Insurance and hospitals for better coordinated care.",
    body:
      "The team helps coordinate visits, procedures, and coverage validation according to the insurer and care location.",
    insuranceTitle: "Accepted insurance",
    insurancePrompt:
      "Select a category to view accepted insurers. Coverage and requirements are confirmed before the visit.",
    national: "National",
    international: "International",
    viewList: "View list",
    hideList: "Hide list",
    insurersLabel: "insurers",
    cta: "Confirm coverage",
    secondaryCta: "Book visit",
  },
} as const;

export function AccessNetwork() {
  const { language } = useLanguage();
  const t = copy[language] ?? copy.es;
  const nationalInsurance = insurancePartners.filter((item) => item.category === "national");
  const internationalInsurance = insurancePartners.filter((item) => item.category === "international");

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
          {t.eyebrow}
        </p>
        <h2 className="mx-auto mt-4 max-w-4xl font-heading text-5xl leading-[0.98] text-navy text-balance sm:text-6xl">
          {t.title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.75] text-muted">
          {t.body}
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {hospitals.map((hospital) => (
          <a
            key={hospital.name}
            href={hospital.href}
            target="_blank"
            rel="noreferrer"
            className="brugiati-card group"
          >
            <div className="aspect-square overflow-hidden bg-softblue">
              <img
                src={hospital.image}
                alt={hospital.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="text-base font-semibold text-navy">{hospital.name}</h3>
              <p className="mt-1 text-xs leading-5 text-muted">{hospital.location}</p>
              <span className="mt-4 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-medical transition group-hover:text-navy">
                Ver sede
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>

      <article className="brugiati-card mt-8 p-4 sm:p-6">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="font-heading text-4xl leading-none text-navy">
            {t.insuranceTitle}
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted">
            {t.insurancePrompt}
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <InsuranceGroup
            icon={<ClipboardCheck aria-hidden="true" className="h-4 w-4" />}
            title={t.national}
            items={nationalInsurance}
            viewLabel={t.viewList}
            hideLabel={t.hideList}
            countLabel={t.insurersLabel}
            columns="lg:grid-cols-7"
          />
          <InsuranceGroup
            icon={<Globe2 aria-hidden="true" className="h-4 w-4" />}
            title={t.international}
            items={internationalInsurance}
            viewLabel={t.viewList}
            hideLabel={t.hideList}
            countLabel={t.insurersLabel}
            columns="lg:grid-cols-6"
          />
        </div>
      </article>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <CTAButton to="/agendar-cita">{t.cta}</CTAButton>
        <CTAButton to="/agendar-cita" variant="secondary">
          {t.secondaryCta}
        </CTAButton>
      </div>
    </div>
  );
}

function InsuranceLogo({ partner }: { partner: InsurancePartner }) {
  const src = partner.logoSrc
    ? partner.logoSrc
    : partner.domain
      ? `https://www.google.com/s2/favicons?domain=${partner.domain}&sz=128`
      : undefined;
  const initials = getPartnerInitials(partner.name);

  return (
    <div className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-borderblue bg-white px-3 py-4 text-center shadow-[0_10px_30px_rgba(6,27,51,0.045)]">
      <div className="flex h-12 w-full max-w-[9.5rem] items-center justify-center overflow-hidden rounded-xl bg-white">
        {src ? (
          <img
            src={src}
            alt={`${partner.name} logo`}
            loading="lazy"
            decoding="async"
            className={partner.logoSrc ? "max-h-9 max-w-[8rem] object-contain" : "h-7 w-7 object-contain"}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-medical">
            {initials}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold leading-4 text-navy">{partner.name}</p>
    </div>
  );
}

function InsuranceGroup({
  icon,
  title,
  items,
  viewLabel,
  hideLabel,
  countLabel,
  columns,
}: {
  icon: ReactNode;
  title: string;
  items: InsurancePartner[];
  viewLabel: string;
  hideLabel: string;
  countLabel: string;
  columns: string;
}) {
  return (
    <details className="group rounded-2xl border border-borderblue bg-softblue/35">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl border border-borderblue bg-white text-medical">
            {icon}
          </span>
          <span className="min-w-0">
            <span className="block break-words text-[13px] font-bold uppercase leading-4 tracking-[0.08em] text-medical sm:text-sm sm:tracking-[0.14em]">
              {title}
            </span>
            <span className="mt-1 block text-xs font-semibold text-muted">
              {items.length} {countLabel}
            </span>
          </span>
        </span>
        <span className="flex flex-none items-center gap-2 rounded-full border border-borderblue bg-white px-3 py-2 text-xs font-semibold text-navy shadow-sm">
          <span className="group-open:hidden">{viewLabel}</span>
          <span className="hidden group-open:inline">{hideLabel}</span>
          <ChevronDown aria-hidden="true" className="h-4 w-4 transition group-open:rotate-180" />
        </span>
      </summary>
      <div className="border-t border-borderblue p-4 sm:p-5">
        <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 ${columns}`}>
          {items.map((item) => (
            <InsuranceLogo key={`${item.category}-${item.name}`} partner={item} />
          ))}
        </div>
      </div>
    </details>
  );
}

function getPartnerInitials(name: string) {
  const words = name.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
