"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/ui/brand-mark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DASHBOARD_NAV } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type SidebarProps = {
  tenantName: string;
  userEmail?: string | null;
  role: string;
};

export function Sidebar({ tenantName, userEmail, role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  async function logout() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  }

  const navSections = [
    { label: "Workspace", items: DASHBOARD_NAV.slice(0, 6) },
    { label: "AI and automation", items: DASHBOARD_NAV.slice(6, 8) },
    { label: "Channels", items: DASHBOARD_NAV.slice(8, 12) },
    { label: "Launch ops", items: DASHBOARD_NAV.slice(12, 20) },
    { label: "Control", items: DASHBOARD_NAV.slice(20, 23) },
    { label: "Account", items: DASHBOARD_NAV.slice(23) },
  ];

  const nav = (
    <nav className="space-y-5">
      {navSections.map((section) => (
        <div key={section.label}>
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-viva-subtle">
            {section.label}
          </div>
          <div className="space-y-1">
            {section.items.map((item) => {
              const isActive = item.activeExact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-viva-gradient text-white shadow-glow"
                      : "viva-sidebar-link text-viva-muted hover:text-viva-ink",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition",
                      isActive ? "text-white" : "text-viva-subtle group-hover:text-viva-primary",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const content = (
    <div className="flex h-full flex-col">
      <div className="border-b border-viva-line/70 px-5 py-5">
        <Link href="/dashboard" className="block">
          <BrandMark />
            <div className="mt-4 rounded-xl border border-viva-line/80 bg-viva-elevated/60 px-3 py-2">
            <div className="truncate text-sm font-semibold text-viva-ink">
              {tenantName}
            </div>
            <div className="mt-0.5 text-xs text-viva-muted">Tenant workspace</div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div>

      <div className="space-y-3 border-t border-viva-line/70 p-4">
        <div className="viva-gradient-border rounded-2xl bg-viva-card/70 p-4 shadow-card">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-viva-gradient-soft text-viva-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-viva-ink">Launch rails ready</div>
              <p className="mt-1 text-xs leading-5 text-viva-muted">
                Foundations plus live-ready test flows are staged without paid activation.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-viva-line/80 bg-viva-elevated/50 p-3">
          <div className="truncate text-sm font-medium text-viva-ink">
            {userEmail ?? "Signed in"}
          </div>
          <div className="mt-1 text-xs capitalize text-viva-muted">{role}</div>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            onClick={logout}
            className="viva-button-ghost h-10 px-3 text-sm font-semibold"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <ThemeToggle className="px-3" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-viva-line/80 bg-viva-card/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <BrandMark compact />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="viva-button-ghost h-10 w-10 p-0 text-viva-ink"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <aside className="relative z-10 hidden min-h-screen w-72 shrink-0 border-r border-viva-line/80 bg-viva-card/70 shadow-glass backdrop-blur-2xl lg:block">
        {content}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-viva-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="relative h-full w-80 max-w-[88vw] border-r border-viva-line bg-viva-card shadow-soft">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="viva-button-ghost absolute right-3 top-3 h-9 w-9 p-0"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}
