import { cookies } from "next/headers";
import { DEV_PREVIEW_COOKIE, isDevPreviewEnabled } from "@/lib/dev-preview";

export async function hasDevPreviewSession() {
  if (!isDevPreviewEnabled()) return false;

  const cookieStore = await cookies();
  return cookieStore.get(DEV_PREVIEW_COOKIE)?.value === "1";
}
