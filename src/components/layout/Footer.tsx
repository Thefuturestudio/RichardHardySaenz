import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { contact } from "../../data/contact";
import { optionalImages } from "../../data/images";
import { specialtyRouteByKey, type SpecialtyKey } from "../../i18n/translations";
import { useLanguage } from "../../i18n/LanguageContext";
import { MedicalDisclaimer } from "../shared/MedicalDisclaimer";

const footerSpecialtyKeys: SpecialtyKey[] = [
  "prostata",
  "calculosRenales",
  "uroOncologia",
  "endourologia",
  "cirugiaLaparoscopica",
  "saludMasculina",
  "segundaOpinion",
];

const contactItems = [
  {
    key: "WhatsApp",
    value: contact.whatsappDisplay,
    href: contact.whatsappHref,
    icon: MessageCircle,
  },
  {
    key: "Phone",
    value: contact.phoneDisplay,
    href: contact.phoneHref,
    icon: Phone,
  },
  {
    key: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
    icon: Mail,
  },
  {
    key: "Instagram",
    value: contact.instagram,
    href: contact.instagramUrl,
    icon: Instagram,
  },
  {
    key: "Location",
    value: contact.location,
    href: "/agendar-cita",
    icon: MapPin,
  },
];

export function Footer() {
  const { language, t } = useLanguage();
  const labels =
    language === "es"
      ? ["WhatsApp", "Teléfono", "Email", "Instagram", "Ubicación"]
      : ["WhatsApp", "Phone", "Email", "Instagram", "Location"];
  const navItems = [
    t.header.nav.home,
    t.header.nav.specialties,
    t.header.nav.procedures,
    t.header.nav.secondOpinion,
    t.header.nav.contact,
  ];

  return (
    <footer className="navy-panel px-4 pb-24 pt-14 text-white sm:px-6 md:pb-8 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[1.15fr_0.72fr_0.85fr_0.95fr]">
        <div className="min-w-0">
          <img
            src={optionalImages.doctorLogo.src}
            alt={optionalImages.doctorLogo.alt}
            className="h-24 w-full max-w-[18rem] object-contain object-left brightness-0 invert sm:h-32 sm:max-w-[28.75rem]"
            loading="lazy"
            decoding="async"
          />
          <p className="mt-4 text-sm text-blue-100">{t.footer.body}</p>
          <p className="mt-5 text-xs text-blue-200">{t.footer.credit}</p>
        </div>

        <div className="min-w-0">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-cyan">
            {t.footer.navigation}
          </p>
          <nav className="grid gap-2.5" aria-label="Footer">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm text-blue-100 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="min-w-0">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-cyan">
            {t.footer.contact}
          </p>
          <div className="grid gap-3.5">
            {contactItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  className="group flex items-start gap-3 text-sm text-blue-100 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                >
                  <Icon
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 flex-none text-cyan transition group-hover:text-white"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs leading-5 text-blue-200">
                      {labels[index]}
                    </span>
                    <span className="break-words font-medium leading-6">
                      {item.value}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-cyan">
            {t.header.specialtiesLabel}
          </p>
          <nav className="grid gap-2.5" aria-label={t.header.specialtiesLabel}>
            {footerSpecialtyKeys.map((key) => (
              <Link
                key={key}
                to={specialtyRouteByKey[key]}
                className="text-sm text-blue-100 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                {t.specialties[key].title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-9 max-w-7xl">
        <MedicalDisclaimer className="border-white/10 bg-white/10 text-xs leading-6 text-blue-100" />
      </div>
    </footer>
  );
}
