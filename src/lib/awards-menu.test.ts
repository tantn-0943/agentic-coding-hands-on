import { describe, expect, it } from "vitest";
import { awards } from "@/lib/awards";
import { awardNavigationItems, awardsKudosPromo } from "@/lib/awards-menu";

describe("awardNavigationItems", () => {
  it("keeps menu labels and target section ids aligned with awards data", () => {
    expect(awardNavigationItems).toHaveLength(awards.length);

    awardNavigationItems.forEach((item, index) => {
      expect(item.label).toBeTruthy();
      expect(item.targetSectionId).toBe(awards[index]?.linkSlug);
      expect(item.order).toBe(index + 1);
    });
  });

  it("uses unique ids and target section ids", () => {
    expect(new Set(awardNavigationItems.map((item) => item.id)).size).toBe(
      awardNavigationItems.length,
    );
    expect(
      new Set(awardNavigationItems.map((item) => item.targetSectionId)).size,
    ).toBe(awardNavigationItems.length);
  });

  it("ships the kudos promo with disabled CTA fallback until the route is available", () => {
    expect(awardsKudosPromo.title).toBe("Sun* Kudos");
    expect(awardsKudosPromo.ctaRoute).toBeNull();
  });
});
