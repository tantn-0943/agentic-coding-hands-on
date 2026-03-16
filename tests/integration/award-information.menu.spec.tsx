import { fireEvent, render, screen, within } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AwardsInfoPageContent } from "@/components/award-information/AwardsInfoPageContent";
import { awards } from "@/lib/awards";
import { awardNavigationItems, awardsKudosPromo } from "@/lib/awards-menu";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt?: string }) =>
    createElement("span", {
      "data-testid": "next-image",
      "aria-label": alt ?? "",
    }),
}));

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();

  constructor() {}
}

describe("AwardsInfoPageContent interactions", () => {
  const scrollToMock = vi.fn();
  const replaceStateMock = vi.spyOn(window.history, "replaceState");

  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("scrollTo", scrollToMock);
    scrollToMock.mockClear();
    replaceStateMock.mockClear();
    window.history.pushState({}, "", "/award-information");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("scrolls to target section and updates active menu item when a menu button is clicked", () => {
    render(
      <AwardsInfoPageContent
        awards={awards}
        menuItems={awardNavigationItems}
        kudosPromo={awardsKudosPromo}
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Danh mục giải thưởng",
    });
    const menuButton = within(navigation).getByRole("button", {
      name: /^Top Project$/i,
    });
    fireEvent.click(menuButton);

    expect(scrollToMock).toHaveBeenCalledTimes(1);
    expect(replaceStateMock).toHaveBeenCalledWith(null, "", "#top-project");
    expect(menuButton).toHaveAttribute("aria-current", "location");
  });

  it("honors the initial hash on page load", async () => {
    window.history.pushState({}, "", "/award-information#best-manager");

    render(
      <AwardsInfoPageContent
        awards={awards}
        menuItems={awardNavigationItems}
        kudosPromo={awardsKudosPromo}
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: "Danh mục giải thưởng",
    });
    const activeButton = within(navigation).getByRole("button", {
      name: /Best Manager/i,
    });
    expect(activeButton).toHaveAttribute("aria-current", "location");
  });
});
