import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { CalendarDays, ChevronDown, Menu, X } from "lucide-react";
import { optionalImages } from "../../data/images";
import {
  specialtyRouteByKey,
  type SpecialtyKey,
} from "../../i18n/translations";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  procedureNavigationKeys,
  procedurePages,
  procedureRoutes,
} from "../../i18n/procedurePages";
import { cn } from "../../lib/cn";
import { CTAButton } from "../shared/CTAButton";
import { LanguageToggle } from "../shared/LanguageToggle";

type DropdownId = "specialties" | "procedures";

type DropdownItem = {
  key: string;
  href: string;
  title: string;
  description: string;
};

type HeaderDropdownProps = {
  id: DropdownId;
  label: string;
  intro: string;
  hint: string;
  href: string;
  items: DropdownItem[];
  isActive: boolean;
  isOpen: boolean;
  onOpenChange: (id: DropdownId | null) => void;
};

const specialtyKeys: SpecialtyKey[] = [
  "prostata",
  "calculosRenales",
  "uroOncologia",
  "endourologia",
  "cirugiaLaparoscopica",
  "saludMasculina",
  "segundaOpinion",
];

function HeaderDropdown({
  id,
  label,
  intro,
  hint,
  href,
  items,
  isActive,
  isOpen,
  onOpenChange,
}: HeaderDropdownProps) {
  return (
    <div
      className="relative"
      onMouseEnter={() => onOpenChange(id)}
      onMouseLeave={() => onOpenChange(null)}
    >
      <div className="group relative inline-flex items-center py-4">
        <Link
          to={href}
          onFocus={() => onOpenChange(id)}
          className={cn(
            "relative whitespace-nowrap px-1 text-[13.5px] font-medium text-muted transition hover:text-medical focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan 2xl:text-[14.5px]",
            isActive && "text-navy",
          )}
        >
          {label}
          <span
            className={cn(
              "absolute -bottom-3 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-medical opacity-0 transition duration-200 group-hover:scale-x-100 group-hover:opacity-80",
              isActive && "opacity-100 group-hover:opacity-100",
            )}
          />
        </Link>
        <button
          type="button"
          onClick={() => onOpenChange(isOpen ? null : id)}
          onFocus={() => onOpenChange(id)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              onOpenChange(null);
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              onOpenChange(id);
            }
          }}
          className="ml-1 grid h-7 w-7 place-items-center rounded-full text-muted transition hover:bg-softblue hover:text-medical focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={label}
        >
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-3.5 w-3.5 transition duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </div>

      {isOpen && (
        <div
          role="menu"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              onOpenChange(null);
            }
          }}
          className="absolute left-1/2 top-full z-[120] w-[min(680px,calc(100vw-2rem))] -translate-x-1/2 pt-3"
        >
          <div className="rounded-[1.6rem] border border-navy/10 bg-white p-5 shadow-[0_34px_100px_rgba(6,27,51,0.18)]">
          <div className="mb-4 flex items-end justify-between gap-5 px-1">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-medical">
                {intro}
              </p>
              <p className="mt-1 text-sm leading-5 text-muted">{hint}</p>
            </div>
            <Link
              to={href}
              role="menuitem"
              className="shrink-0 text-xs font-semibold text-navy underline decoration-navy/70 underline-offset-4 transition hover:text-medical focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              {label}
            </Link>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                role="menuitem"
                className="group rounded-[1.05rem] px-3.5 py-3 transition hover:bg-softblue/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-navy">
                    {item.title}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-navy opacity-0 transition group-hover:opacity-100" />
                </span>
                <span className="mt-1 block truncate text-xs leading-5 text-muted">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const { language, t } = useLanguage();
  const procedureCopy = procedurePages[language] ?? procedurePages.es;

  const specialtyRoutes = useMemo(
    () =>
      new Set([
        "/especialidades",
        ...specialtyKeys
          .filter((key) => key !== "segundaOpinion")
          .map((key) => specialtyRouteByKey[key]),
      ]),
    [],
  );
  const isSpecialtiesActive = specialtyRoutes.has(location.pathname);
  const procedureRoutesSet = useMemo(
    () => new Set(["/procedimientos", ...Object.values(procedureRoutes)]),
    [],
  );
  const isProceduresActive = procedureRoutesSet.has(location.pathname);

  const specialtyDropdownItems: DropdownItem[] = specialtyKeys.map((key) => ({
    key,
    href: specialtyRouteByKey[key],
    title: t.specialties[key].title,
    description: t.specialties[key].subtitle,
  }));

  const procedureDropdownItems: DropdownItem[] = procedureNavigationKeys.map((key) => {
    const procedure = procedureCopy[key] ?? procedurePages.es[key];

    return {
      key,
      href: procedureRoutes[key],
      title: procedure.title,
      description: procedure.cardText,
    };
  });

  const mainNav = [
    t.header.nav.home,
    t.header.nav.specialties,
    t.header.nav.procedures,
    t.header.nav.secondOpinion,
    t.header.nav.blog,
    t.header.nav.contact,
  ];

  const mobilePrimaryNav = [
    t.header.nav.home,
    t.header.nav.secondOpinion,
    t.header.nav.blog,
    t.header.nav.contact,
  ];

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 18);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-[100] border-b transition-[background,border-color,box-shadow] duration-300",
          isScrolled
            ? "border-navy/10 bg-white/90 shadow-[0_12px_40px_rgba(6,27,51,0.06)] backdrop-blur-[22px]"
            : "border-navy/5 bg-mist/70 backdrop-blur-[18px]",
        )}
      >
        <div className="relative mx-auto grid h-[82px] max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:h-[88px] sm:px-5 xl:h-[96px] xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-4 xl:px-6 2xl:gap-5 2xl:px-8">
          <NavLink
            to="/"
            aria-label={t.header.homeLabel}
            className="flex min-w-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
          >
            <span
              role="img"
              aria-label={optionalImages.doctorLogo.alt}
              className="block h-[4rem] w-[min(15.5rem,calc(100vw-6rem))] shrink-0 bg-contain bg-left bg-no-repeat sm:h-[4.6rem] sm:w-[18.5rem] xl:h-[4.35rem] xl:w-[15.75rem] 2xl:h-[4.9rem] 2xl:w-[18.5rem]"
              style={{ backgroundImage: `url(${optionalImages.doctorLogo.src})` }}
            />
          </NavLink>

          <nav
            className="hidden min-w-0 items-center justify-center gap-3 xl:flex 2xl:gap-4"
            aria-label={t.header.navLabel}
          >
            {mainNav.map((item) => {
              if (item.href === t.header.nav.specialties.href) {
                return (
                  <HeaderDropdown
                    key={item.href}
                    id="specialties"
                    label={item.label}
                    intro={t.header.specialtiesIntro}
                    hint={t.header.specialtiesHint}
                    href={item.href}
                    items={specialtyDropdownItems}
                    isActive={isSpecialtiesActive}
                    isOpen={openDropdown === "specialties"}
                    onOpenChange={setOpenDropdown}
                  />
                );
              }

              if (item.href === t.header.nav.procedures.href) {
                return (
                  <HeaderDropdown
                    key={item.href}
                    id="procedures"
                    label={item.label}
                    intro={t.header.proceduresIntro}
                    hint={t.header.proceduresHint}
                    href={item.href}
                    items={procedureDropdownItems}
                    isActive={isProceduresActive}
                    isOpen={openDropdown === "procedures"}
                    onOpenChange={setOpenDropdown}
                  />
                );
              }

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "group relative whitespace-nowrap px-1 py-4 text-[13.5px] font-medium text-muted transition hover:text-medical focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan 2xl:text-[14.5px]",
                      isActive && "text-navy",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span
                        className={cn(
                          "absolute bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-medical opacity-0 transition duration-200 group-hover:scale-x-100 group-hover:opacity-80",
                          isActive && "opacity-100 group-hover:opacity-100",
                        )}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden min-w-max items-center justify-end gap-2 xl:flex 2xl:gap-3">
            <LanguageToggle />
            <CTAButton
              to="/agendar-cita"
              icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
              className="min-h-0 h-11 whitespace-nowrap px-4 py-0 text-[13px] shadow-[0_10px_30px_rgba(6,27,51,0.12)] 2xl:px-5 2xl:text-[14px]"
            >
              {t.cta.book}
            </CTAButton>
          </div>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center justify-self-end rounded-full border border-navy/10 bg-white/70 text-navy shadow-[0_12px_32px_rgba(6,27,51,0.075)] backdrop-blur transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan xl:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
            aria-label={isOpen ? t.header.closeMenu : t.header.openMenu}
          >
            {isOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[82px] z-[90] overflow-y-auto border-t border-navy/5 bg-mist/95 px-4 py-6 shadow-[0_28px_90px_rgba(6,27,51,0.16)] backdrop-blur-2xl sm:top-[88px] xl:hidden">
          <nav
            className="mx-auto max-w-[35rem]"
            aria-label={t.header.mobileNavLabel}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-heading text-4xl leading-none tracking-[-0.03em] text-navy">
                  {t.header.menuTitle}
                </p>
                <p className="mt-2 max-w-[18rem] text-xs font-semibold uppercase tracking-[0.18em] text-medical">
                  {t.brand.doctor}
                </p>
              </div>
              <LanguageToggle />
            </div>

            <div className="grid gap-1">
              {mobilePrimaryNav.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-2xl px-4 py-3 text-base font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
                      isActive
                        ? "bg-white text-navy shadow-sm"
                        : "text-muted hover:bg-white/75 hover:text-navy",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-6 rounded-[1.45rem] border border-navy/10 bg-white/75 p-4 shadow-[0_18px_46px_rgba(6,27,51,0.075)] backdrop-blur">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-medical">
                {t.header.specialtiesIntro}
              </p>
              <div className="mt-3 grid gap-1">
                <Link
                  to={t.header.nav.specialties.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-softblue px-3 py-2.5 text-sm font-bold text-navy transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                >
                  {t.header.nav.specialties.label}
                </Link>
                {specialtyDropdownItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-navy transition hover:bg-softblue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[1.45rem] border border-navy/10 bg-white/75 p-4 shadow-[0_18px_46px_rgba(6,27,51,0.075)] backdrop-blur">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-medical">
                {t.header.proceduresIntro}
              </p>
              <div className="mt-3 grid gap-1">
                <Link
                  to={t.header.nav.procedures.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-softblue px-3 py-2.5 text-sm font-bold text-navy transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                >
                  {t.header.nav.procedures.label}
                </Link>
                {procedureDropdownItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-navy transition hover:bg-softblue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <p className="mt-5 rounded-2xl border border-borderblue bg-white/60 px-4 py-3 text-sm leading-6 text-muted">
              {t.home.hero.microcopy}
            </p>

            <div className="mt-5">
              <CTAButton
                to="/agendar-cita"
                className="w-full"
                icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
              >
                {t.cta.book}
              </CTAButton>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
