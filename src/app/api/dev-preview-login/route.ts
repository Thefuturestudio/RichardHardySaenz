import { NextResponse } from "next/server";
import { DEV_PREVIEW_COOKIE, isDevPreviewEnabled } from "@/lib/dev-preview";

export function GET(request: Request) {
  if (!isDevPreviewEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const requestUrl = new URL(request.url);
  const redirectTo = requestUrl.searchParams.get("redirect_to") ?? "/dashboard/privacy";
  const response = new NextResponse(null, {
    status: 307,
    headers: {
      Location: redirectTo,
    },
  });

  response.cookies.set(DEV_PREVIEW_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
