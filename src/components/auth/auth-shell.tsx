"use client";

import {
  BarChart3,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { PointerEvent } from "react";
import { BrandMark } from "@/components/ui/brand-mark";
import { MeshGradient } from "@/components/ui/mesh-gradient";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  const features = [
    { label: "AI-Powered Intelligence", icon: Sparkles },
    { label: "Operational Excellence", icon: BarChart3 },
    { label: "Enterprise Security", icon: ShieldCheck },
    { label: "Built for Scale", icon: UsersRound },
  ];

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
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
    <main
      className="viva-auth-page relative min-h-screen overflow-hidden bg-viva-bg"
      onPointerMove={handlePointerMove}
    >
      <div className="viva-auth-grid" />
      <MeshGradient />
      <div className="viva-auth-aurora viva-auth-aurora-one" />
      <div className="viva-auth-aurora viva-auth-aurora-two" />
      <div className="viva-auth-aurora viva-auth-aurora-three" />
      <div className="viva-auth-arc viva-auth-arc-one" />
      <div className="viva-auth-arc viva-auth-arc-two" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[92rem] grid-cols-1 items-center gap-12 px-6 py-10 lg:grid-cols-[0.9fr_1.15fr] lg:px-10 xl:gap-16">
        <div className="absolute right-6 top-5 z-20">
          <ThemeToggle />
        </div>

        <section className="flex justify-center pt-14 lg:pt-0">
          <div className="viva-auth-card w-full max-w-[23.5rem] rounded-[1.7rem] px-9 py-10 sm:px-10">
            <div className="mx-auto mb-9 w-[13.5rem]">
              <BrandMark lockup />
            </div>

            <div className="mb-7">
              <h1 className="font-display text-[1.45rem] font-extrabold leading-tight text-viva-ink">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-viva-muted">
                {subtitle}
              </p>
            </div>

            <div>{children}</div>
          </div>
        </section>

        <aside className="mx-auto w-full max-w-[32rem] py-8 lg:mx-0">
          <h2 className="font-display text-7xl font-black leading-[0.95] tracking-normal text-viva-ink sm:text-8xl xl:text-[6.4rem]">
            Attention
            <br />
            that
            <br />
            <span className="viva-gradient-text">Converts</span>
          </h2>

          <div className="viva-gradient-rule mt-9 h-1 w-14 rounded-full" />

          <p className="mt-8 max-w-[28rem] text-lg leading-8 text-viva-muted">
            Viva is the AI-powered business operations platform for Reserva Viva
            Venta Viva, and Viva Med.
          </p>

          <div className="mt-11 grid grid-cols-2 gap-y-7 sm:grid-cols-4 sm:divide-x sm:divide-viva-line/80">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.label}
                  className="viva-auth-feature px-2 text-center first:pl-0 last:pr-0"
                >
                  <Icon className="mx-auto h-8 w-8 text-viva-blue" strokeWidth={1.8} />
                  <div className="mx-auto mt-3 max-w-24 text-xs font-medium leading-5 text-viva-muted">
                    {feature.label}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </main>
  );
}
