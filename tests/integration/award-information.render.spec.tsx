import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AwardsInfoPageContent } from "@/components/award-information/AwardsInfoPageContent";
import { awards } from "@/lib/awards";
import { awardNavigationItems, awardsKudosPromo } from "@/lib/awards-menu";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt?: string }) => (
    <span data-testid="next-image" aria-label={alt ?? ""} />
  ),
}));

describe("AwardsInfoPageContent rendering", () => {
  it("renders the reviewed awards information screen with menu and six detail cards", () => {
    render(
      <AwardsInfoPageContent
        awards={awards}
        menuItems={awardNavigationItems}
        kudosPromo={awardsKudosPromo}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Hệ thống giải thưởng SAA 2025" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Danh mục giải thưởng" }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("award-detail-card")).toHaveLength(6);
    expect(
      screen.getByRole("heading", { name: "Top Talent" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Top Project Leader" }),
    ).toBeInTheDocument();
    expect(screen.getByText("20.000.000 VNĐ")).toBeInTheDocument();
    expect(screen.getByText("Sun* Kudos")).toBeInTheDocument();
  });
});
