import type { LoginPageProps } from "@/types/auth";
import { LoginContent } from "@/components/auth/LoginContent";

function getSafeReturnTo(returnTo: string | undefined): string | undefined {
  if (!returnTo) return undefined;
  if (!returnTo.startsWith("/")) return undefined;
  if (returnTo.startsWith("//")) return undefined;
  if (returnTo.startsWith("/auth/")) return undefined;
  if (returnTo === "/login") return undefined;
  return returnTo;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, returnTo } = await searchParams;
  const safeReturnTo = getSafeReturnTo(returnTo);

  return <LoginContent error={error} returnTo={safeReturnTo} />;
}
