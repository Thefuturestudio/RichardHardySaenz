import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isDevLoginEnabled() {
  return process.env.NODE_ENV !== "production";
}

export async function POST(request: Request) {
  if (!isDevLoginEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect_to") ?? "/dashboard");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}

export async function GET(request: Request) {
  if (!isDevLoginEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const requestUrl = new URL(request.url);
  const email = requestUrl.searchParams.get("email")?.trim() ?? "";
  const password = requestUrl.searchParams.get("password") ?? "";
  const redirectTo = requestUrl.searchParams.get("redirect_to") ?? "/dashboard";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
