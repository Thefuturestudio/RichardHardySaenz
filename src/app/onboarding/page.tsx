import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { BrandMark } from "@/components/ui/brand-mark";
import { MeshGradient } from "@/components/ui/mesh-gradient";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getTenantContext, requireUser } from "@/lib/data/tenant";

export default async function OnboardingPage() {
  await requireUser();
  const tenantContext = await getTenantContext();

  if (tenantContext) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-viva-bg px-6 py-8">
      <MeshGradient />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <BrandMark />
          <ThemeToggle />
        </div>

        <div className="viva-glow-card mb-8 rounded-[2rem] p-7 sm:p-9">
          <div className="mb-4 inline-flex rounded-full border border-viva-line bg-viva-card/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-viva-primary shadow-card backdrop-blur-xl">
            Step 1 foundation
          </div>
          <h1 className="max-w-2xl font-display text-4xl font-black tracking-normal text-viva-ink sm:text-5xl">
            Create your first tenant
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-viva-muted">
            Add the business profile Viva will use later for Reserva Viva,
            Venta Viva, or the combined Viva Platform offer.
          </p>
        </div>

        <section className="viva-auth-card rounded-[1.7rem] p-6 sm:p-8">
          <OnboardingForm />
        </section>
      </div>
    </main>
  );
}
