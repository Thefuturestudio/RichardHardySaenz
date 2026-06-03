"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("full_name") ?? "").trim();

    const result = isSignup
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}/auth/callback`
                : undefined,
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    setIsLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (isSignup && !result.data.session) {
      setNotice("Check your email to confirm your account, then log in.");
      return;
    }

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {isSignup ? (
        <label className="block">
          <span className="text-xs font-bold text-viva-ink">Full name</span>
          <span className="viva-field-shell relative mt-2 block">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-viva-subtle" />
            <input
              name="full_name"
              type="text"
              autoComplete="name"
              className="viva-field py-3 pl-10 pr-4"
              placeholder="Richard Hardy"
            />
          </span>
        </label>
      ) : null}

      <label className="block">
        <span className="text-xs font-bold text-viva-ink">Email</span>
        <span className="viva-field-shell relative mt-2 block">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-viva-subtle" />
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="viva-field py-3 pl-10 pr-4"
            placeholder="you@business.com"
          />
        </span>
      </label>

      <label className="block">
        <span className="text-xs font-bold text-viva-ink">Password</span>
        <span className="viva-field-shell relative mt-2 block">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-viva-subtle" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="viva-field py-3 pl-10 pr-10"
            placeholder="At least 6 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-viva-subtle transition hover:text-viva-blue"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </span>
      </label>

      {error ? (
        <div className="rounded-xl border border-viva-error/30 bg-viva-error/10 px-4 py-3 text-sm text-viva-error">
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="rounded-xl border border-viva-success/30 bg-viva-success/10 px-4 py-3 text-sm text-viva-success">
          {notice}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="viva-button-primary mt-2 h-12 w-full px-4 text-sm font-bold"
      >
        {isLoading ? "Working..." : isSignup ? "Create account" : "Log in"}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="text-center text-sm text-viva-muted">
        {isSignup ? "Already have an account?" : "New to Viva?"}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-viva-primary hover:text-viva-blue"
        >
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
