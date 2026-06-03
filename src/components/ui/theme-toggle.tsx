"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(
    (callback) => {
      window.addEventListener("viva-theme-change", callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener("viva-theme-change", callback);
        window.removeEventListener("storage", callback);
      };
    },
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => "light",
  );

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("viva-theme", next);
    window.dispatchEvent(new Event("viva-theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "viva-button-ghost h-10 px-3 text-sm font-semibold",
        className,
      )}
      suppressHydrationWarning
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-viva-warning" />
      ) : (
        <Moon className="h-4 w-4 text-viva-primary" />
      )}
      <span className="hidden sm:inline">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
