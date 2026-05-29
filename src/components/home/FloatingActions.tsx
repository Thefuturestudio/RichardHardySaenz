import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { getWhatsAppHref } from "../../lib/whatsapp";
import { trackEvent } from "../../utils/analytics";
import { KidneyIcon } from "../shared/KidneyIcon";

const AssistantDrawer = lazy(() =>
  import("../AssistantDrawer").then((module) => ({
    default: module.AssistantDrawer,
  })),
);

export function FloatingActions() {
  const { language, t } = useLanguage();
  const location = useLocation();
  const isBookingPage = location.pathname === "/agendar-cita";
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [mobileActionsVisible, setMobileActionsVisible] = useState(false);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  const whatsappHref = useMemo(
    () => getWhatsAppHref(location.pathname, language),
    [language, location.pathname],
  );

  useEffect(() => {
    function openAssistant() {
      setAssistantOpen(true);
      trackEvent("assistant_open", { source: "custom_event", path: location.pathname });
    }

    window.addEventListener("uropanama:open-assistant", openAssistant);
    return () => window.removeEventListener("uropanama:open-assistant", openAssistant);
  }, [location.pathname]);

  function openAssistant(source: string, trigger?: HTMLElement | null) {
    lastFocusedElement.current =
      trigger ?? (document.activeElement as HTMLElement | null);
    setAssistantOpen(true);
    trackEvent("assistant_open", { source, path: location.pathname });
  }

  function closeAssistant() {
    setAssistantOpen(false);
    requestAnimationFrame(() => {
      lastFocusedElement.current?.focus();
    });
  }

  useEffect(() => {
    if (!assistantOpen) {
      return;
    }

    function closeFromDrawerTarget(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const clickedCloseButton = Boolean(target.closest("[data-assistant-close]"));
      const clickedBackdrop = target.hasAttribute("data-assistant-overlay");

      if (!clickedCloseButton && !clickedBackdrop) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      window.setTimeout(() => {
        setAssistantOpen(false);
        requestAnimationFrame(() => {
          lastFocusedElement.current?.focus();
        });
      }, 0);
    }

    document.addEventListener("click", closeFromDrawerTarget, true);
    return () =>
      document.removeEventListener("click", closeFromDrawerTarget, true);
  }, [assistantOpen]);

  useEffect(() => {
    function handleScroll() {
      setMobileActionsVisible(window.scrollY > 560);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {mobileActionsVisible && (
        <>
          {!isBookingPage && (
            <button
              type="button"
              onClick={(event) => openAssistant("floating_mobile", event.currentTarget)}
              className="fixed bottom-4 left-4 z-40 flex h-12 items-center gap-2 rounded-full border border-borderblue bg-white p-1.5 pr-4 text-navy shadow-[0_18px_54px_rgba(6,27,51,0.14)] transition hover:-translate-y-0.5 hover:border-navy/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan md:hidden"
              aria-label={t.home.floating.assistantLabel}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-white">
                <KidneyIcon aria-hidden="true" className="h-[18px] w-[18px]" />
              </span>
              <span className="text-xs font-semibold">{t.home.floating.assistantLabel}</span>
            </button>
          )}

          <a
            href={whatsappHref}
            className="fixed bottom-4 right-4 z-40 flex h-12 items-center gap-2 rounded-full border border-borderblue bg-white p-1.5 pr-4 text-navy shadow-[0_18px_54px_rgba(6,27,51,0.14)] transition hover:-translate-y-0.5 hover:border-navy/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan md:hidden"
            aria-label={t.home.floating.whatsappLabel}
            onClick={() => trackEvent("whatsapp_click", { path: location.pathname, source: "floating_mobile" })}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-medical text-white">
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold">{t.home.floating.whatsappLabel}</span>
          </a>
        </>
      )}

      {!isBookingPage && (
        <div className="fixed bottom-5 left-5 z-40 hidden xl:block">
          <button
            type="button"
            onClick={(event) => openAssistant("floating_desktop", event.currentTarget)}
            className="group flex h-14 items-center gap-2 rounded-full border border-borderblue bg-white p-2 pr-5 text-navy shadow-[0_18px_54px_rgba(6,27,51,0.12)] transition hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-[0_24px_70px_rgba(6,27,51,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            aria-label={t.home.floating.assistantLabel}
            title={t.home.floating.assistantLabel}
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-white">
              <KidneyIcon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="whitespace-nowrap text-sm font-semibold">
              {t.home.floating.assistantLabel}
            </span>
          </button>
        </div>
      )}

      <div className="fixed bottom-5 right-5 z-40 hidden xl:block">
        <a
          href={whatsappHref}
          className="group flex h-14 items-center gap-2 rounded-full border border-borderblue bg-white p-2 pr-5 text-navy shadow-[0_18px_54px_rgba(6,27,51,0.12)] transition hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-[0_24px_70px_rgba(6,27,51,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          aria-label={t.home.floating.whatsappLabel}
          title={t.home.floating.whatsappLabel}
          onClick={() => trackEvent("whatsapp_click", { path: location.pathname, source: "floating_desktop" })}
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-medical text-white">
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="whitespace-nowrap text-sm font-semibold">
            {t.home.floating.whatsappLabel}
          </span>
        </a>
      </div>

      {assistantOpen && (
        <Suspense fallback={null}>
          <AssistantDrawer
            open={assistantOpen}
            onClose={closeAssistant}
          />
        </Suspense>
      )}
    </>
  );
}
