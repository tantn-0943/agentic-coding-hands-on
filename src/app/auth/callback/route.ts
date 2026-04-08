import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";

function getSafeReturnTo(returnTo: string | null): string {
  if (!returnTo) return "/";
  if (!returnTo.startsWith("/")) return "/";
  if (returnTo.startsWith("//")) return "/";
  if (returnTo.startsWith("/auth/")) return "/";
  if (returnTo === "/login") return "/";
  return returnTo;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const returnTo = searchParams.get("returnTo");

  const safeReturnTo = getSafeReturnTo(returnTo);

  if (errorParam) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(safeReturnTo, origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
}
