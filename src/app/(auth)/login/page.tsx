import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getUser } from "@/lib/data/tenant";

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect("/dashboard");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to access your Viva dashboard and manage your business operations."
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
