import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarDays, MessageCircle, X } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { refinementCopy } from "../../i18n/refinementCopy";
import { getWhatsAppHref } from "../../lib/whatsapp";
import { CTAButton } from "../shared/CTAButton";

export function StickyBookingBar() {
  const { language, t } = useLanguage();
  const location = useLocation();
  const copy = refinementCopy[language].concierge;
  const isBookingPage = location.pathname === "/agendar-cita";
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 620);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isBookingPage || !isVisible || isDismissed) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-3 bottom-3 z-50 hidden rounded-[1.25rem] border border-navy/10 bg-white/70 px-3 py-2.5 text-navy shadow-[0_20px_70px_rgba(6,27,51,0.13)] backdrop-blur-2xl xl:left-1/2 xl:right-auto xl:block xl:w-[min(61rem,calc(100vw-2rem))] xl:-translate-x-1/2 xl:rounded-full xl:px-5"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="min-w-0 sm:hidden">
          <p className="text-sm font-semibold text-navy">{copy.shortTitle}</p>
        </div>
        <div className="hidden min-w-0 flex-1 items-center justify-between gap-5 sm:flex">
          <p className="min-w-0 font-heading text-[1.45rem] leading-none text-navy">
            {copy.title}
          </p>
          <p className="shrink-0 rounded-full bg-softblue px-3 py-1.5 text-xs font-semibold text-medical">
            {copy.note}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <CTAButton
            to="/agendar-cita"
            icon={<CalendarDays aria-hidden="true" className="h-4 w-4" />}
            className="min-h-10 px-4 py-2 text-xs shadow-[0_10px_28px_rgba(6,27,51,0.12)] sm:text-sm"
            analyticsEvent="sticky_bar_cta_click"
            analyticsPayload={{ action: "book", path: location.pathname }}
          >
            <span className="hidden sm:inline">{t.cta.book}</span>
            <span className="sm:hidden">{copy.bookShort}</span>
          </CTAButton>
          <CTAButton
            href={getWhatsAppHref(location.pathname, language)}
            variant="secondary"
            icon={<MessageCircle aria-hidden="true" className="h-4 w-4" />}
            className="min-h-10 px-4 py-2 text-xs sm:text-sm"
            analyticsEvent="sticky_bar_cta_click"
            analyticsPayload={{ action: "whatsapp", path: location.pathname }}
          >
            {t.cta.whatsapp}
          </CTAButton>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="grid h-10 w-10 flex-none place-items-center rounded-full border border-borderblue text-muted transition hover:bg-softblue hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            aria-label={t.home.stickyBooking.minimize}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
