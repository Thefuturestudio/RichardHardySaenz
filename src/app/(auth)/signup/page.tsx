import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getUser } from "@/lib/data/tenant";

export default async function SignupPage() {
  const user = await getUser();
  if (user) redirect("/dashboard");

  return (
    <AuthShell
      title="Create account"
      subtitle="Start your Viva dashboard and set up your business operations workspace."
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
