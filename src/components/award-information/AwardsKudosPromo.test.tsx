import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AwardsKudosPromo } from "./AwardsKudosPromo";
import type { KudosPromo } from "@/types/awards";

const basePromo: KudosPromo = {
  label: "Phong trào ghi nhận",
  title: "Sun* Kudos",
  subtitle: "Gửi lời cảm ơn",
  description: "Ghi nhận đồng nghiệp của bạn ngay hôm nay!",
  ctaLabel: "Chi tiết",
  ctaRoute: "/sun-kudos",
};

describe("AwardsKudosPromo", () => {
  it("renders CTA as a link when ctaRoute is provided", () => {
    render(<AwardsKudosPromo promo={basePromo} />);

    const link = screen.getByRole("link", { name: /sun\* kudos/i });
    expect(link).toHaveAttribute("href", "/sun-kudos");
    expect(screen.getByText("Chi tiết")).toBeTruthy();
    expect(screen.getByText("Phong trào ghi nhận")).toBeTruthy();
  });

  it("renders CTA as disabled span when ctaRoute is empty", () => {
    const disabledPromo: KudosPromo = { ...basePromo, ctaRoute: "" };
    render(<AwardsKudosPromo promo={disabledPromo} />);

    expect(screen.queryByRole("link", { name: /sun\* kudos/i })).toBeNull();

    const disabledCta = screen.getByText("Chi tiết");
    expect(disabledCta.closest("[aria-disabled]")).toBeTruthy();
    expect(disabledCta.closest("[aria-disabled]")?.getAttribute("aria-disabled")).toBe("true");
  });

  it("renders CTA as disabled span when ctaRoute is undefined", () => {
    const noRoutePromo: KudosPromo = { ...basePromo, ctaRoute: undefined as unknown as string };
    render(<AwardsKudosPromo promo={noRoutePromo} />);

    expect(screen.queryByRole("link", { name: /sun\* kudos/i })).toBeNull();
    const cta = screen.getByText("Chi tiết");
    expect(cta.closest("[aria-disabled]")).toBeTruthy();
  });

  it("renders promo content correctly", () => {
    render(<AwardsKudosPromo promo={basePromo} />);

    expect(screen.getByText("Sun* Kudos")).toBeTruthy();
    expect(screen.getByText("Gửi lời cảm ơn")).toBeTruthy();
    expect(screen.getByText(/Ghi nhận đồng nghiệp/)).toBeTruthy();
  });
});
