import { describe, expect, it } from "vitest";
import { awards, formatAwardQuantity } from "@/lib/awards";

describe("awards data", () => {
  it("contains the 6 award categories for the awards information screen", () => {
    expect(awards).toHaveLength(6);
    expect(awards.map((award) => award.linkSlug)).toEqual([
      "top-talent",
      "top-project",
      "top-project-leader",
      "best-manager",
      "signature-2025-creator",
      "mvp",
    ]);
  });

  it("provides detail-screen metadata for each award", () => {
    awards.forEach((award) => {
      expect(award.quantity).toBeGreaterThan(0);
      expect(award.unit).toBeTruthy();
      expect(award.prizeValue).toContain("VNĐ");
      expect(award.imageUrl).toContain("/images/awards/");
      expect(award.artworkUrl).toContain("/images/awards/");
    });
  });

  it("formats quantity with leading zero for single-digit values", () => {
    expect(formatAwardQuantity(1)).toBe("01");
    expect(formatAwardQuantity(10)).toBe("10");
  });
});
