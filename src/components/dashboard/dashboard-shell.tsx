"use client";

import type { PointerEvent } from "react";
import { ShieldCheck } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MeshGradient } from "@/components/ui/mesh-gradient";

type DashboardShellProps = {
  tenantName: string;
  userEmail?: string | null;
  role: string;
  children: React.ReactNode;
};

export function DashboardShell({
  tenantName,
  userEmail,
  role,
  children,
}: DashboardShellProps) {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const normalizedX = (x - 0.5) * 2;
    const normalizedY = (y - 0.5) * 2;

    event.currentTarget.style.setProperty(
      "--viva-cyan-x",
      `${normalizedX * 92}px`,
    );
    event.currentTarget.style.setProperty(
      "--viva-cyan-y",
      `${normalizedY * 68}px`,
    );
    event.currentTarget.style.setProperty(
      "--viva-blue-x",
      `${normalizedX * -86}px`,
    );
    event.currentTarget.style.setProperty(
      "--viva-blue-y",
      `${normalizedY * -62}px`,
    );
    event.currentTarget.style.setProperty(
      "--viva-pink-x",
      `${normalizedX * 148}px`,
    );
    event.currentTarget.style.setProperty(
      "--viva-pink-y",
      `${normalizedY * 124}px`,
    );
  }

  return (
    <div
      className="viva-auth-page viva-dashboard-page relative min-h-screen overflow-hidden bg-viva-bg lg:flex"
      onPointerMove={handlePointerMove}
    >
      <div className="viva-auth-grid" />
      <MeshGradient className="viva-dashboard-mesh" />
      <div className="viva-auth-aurora viva-auth-aurora-one" />
      <div className="viva-auth-aurora viva-auth-aurora-two" />
      <div className="viva-auth-aurora viva-auth-aurora-three" />
      <div className="viva-auth-arc viva-auth-arc-one" />
      <div className="viva-auth-arc viva-auth-arc-two" />

      <Sidebar tenantName={tenantName} userEmail={userEmail} role={role} />
      <main className="relative z-10 min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="viva-glass mb-6 flex flex-col gap-3 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-viva-gradient-soft text-viva-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-viva-ink">
                  Test mode active
                </div>
                <p className="text-xs leading-5 text-viva-muted">
                  Workflows are internal previews only. No live messages, calls,
                  charges, or provider writes are sent from this environment.
                </p>
              </div>
            </div>
            <span className="w-fit rounded-full border border-viva-line bg-viva-elevated/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-viva-muted">
              Safe build lane
            </span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
