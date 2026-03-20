import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { LocaleProvider, useLocale } from "@/hooks/useLocale";
import { useTranslations } from "@/hooks/useTranslations";
import type { ReactNode } from "react";

function wrapper({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}

describe("useTranslations", () => {
  beforeEach(() => {
    document.cookie = "NEXT_LOCALE=; Max-Age=0; Path=/";
  });

  it("returns Vietnamese messages by default", () => {
    const { result } = renderHook(() => useTranslations(), { wrapper });
    expect(result.current.login_hero_line1).toBe(
      "Bắt đầu hành trình của bạn cùng SAA 2025.",
    );
    expect(result.current.footer_copyright).toBe(
      "Bản quyền thuộc về Sun* © 2025",
    );
  });

  it("returns English messages when locale is en", () => {
    document.cookie = "NEXT_LOCALE=en; Path=/";
    const { result } = renderHook(() => useTranslations(), { wrapper });
    expect(result.current.login_hero_line1).toBe(
      "Start your journey with SAA 2025.",
    );
    expect(result.current.footer_copyright).toBe("Copyright © Sun* 2025");
  });

  it("updates messages when locale changes", () => {
    const { result } = renderHook(
      () => {
        const t = useTranslations();
        const { setLocale } = useLocale();
        return { t, setLocale };
      },
      { wrapper },
    );

    expect(result.current.t.login_hero_line1).toBe(
      "Bắt đầu hành trình của bạn cùng SAA 2025.",
    );

    act(() => {
      result.current.setLocale("en");
    });

    expect(result.current.t.login_hero_line1).toBe(
      "Start your journey with SAA 2025.",
    );
    expect(result.current.t.login_button).toBe("LOGIN With Google");
  });

  it("has all required translation keys", () => {
    const { result } = renderHook(() => useTranslations(), { wrapper });
    const keys = Object.keys(result.current);
    expect(keys).toContain("nav_about");
    expect(keys).toContain("nav_awards");
    expect(keys).toContain("nav_kudos");
    expect(keys).toContain("login_hero_line1");
    expect(keys).toContain("login_hero_line2");
    expect(keys).toContain("login_button");
    expect(keys).toContain("login_button_loading");
    expect(keys).toContain("footer_copyright");
    expect(keys).toContain("go_to_homepage");
  });
});
