"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/libs/supabase/client";

type LoginButtonProps = {
  initialError?: string;
  returnTo?: string;
  onRedirect?: (url: string) => void;
};

const ERROR_MESSAGES: Record<string, string> = {
  auth_failed: "Authentication failed. Please try again.",
};

function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? "An error occurred. Please try again.";
}

export default function LoginButton({
  initialError,
  returnTo,
  onRedirect,
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const errorMessage = clientError
    ? getErrorMessage(clientError)
    : initialError
      ? getErrorMessage(initialError)
      : null;

  async function handleLogin() {
    setIsLoading(true);
    setClientError(null);

    const supabase = createClient();
    const siteUrl = window.location.origin;
    const callbackUrl = returnTo
      ? `${siteUrl}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`
      : `${siteUrl}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data?.url) {
      setClientError("auth_failed");
      setIsLoading(false);
      return;
    }

    if (onRedirect) {
      onRedirect(data.url);
      return;
    }

    window.location.assign(data.url);
    // On success, keep loading=true while redirect happens
  }

  return (
    <div className="flex flex-col items-start gap-3">
      {errorMessage && (
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
      <button
        onClick={handleLogin}
        disabled={isLoading}
        aria-label="Login with Google"
        className="
          relative flex items-center justify-between
          w-full md:w-[260px] lg:w-[305px] h-[60px] px-6 py-4
          bg-[#FFEA9E] rounded-lg
          font-[family-name:var(--font-montserrat)] font-bold
          text-[18px] leading-7 md:text-[22px] md:leading-[28px]
          tracking-normal text-[#00101A]
          transition-all duration-150 ease-in-out
          hover:bg-[#FFE07A] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(255,234,158,0.3)]
          active:translate-y-0 active:bg-[#FFCF4D]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFEA9E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101A]
        "
      >
        {isLoading ? (
          <span className="flex items-center justify-center w-full gap-3">
            <span
              className="inline-block w-6 h-6 border-2 border-[#00101A] border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
            <span>Signing in…</span>
          </span>
        ) : (
          <>
            <span>LOGIN With Google</span>
            <Image
              src="/icons/google.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </>
        )}
      </button>
    </div>
  );
}
