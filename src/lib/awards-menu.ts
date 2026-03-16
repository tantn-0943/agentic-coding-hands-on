import { awards } from "@/lib/awards";
import type { AwardNavigationItem, KudosPromo } from "@/types/awards";

const MENU_LABEL_OVERRIDES: Record<string, string> = {
  mvp: "MVP",
  "signature-2025-creator": "Signature 2025 Creator",
};

export const awardNavigationItems: AwardNavigationItem[] = awards.map(
  (award, index) => ({
    id: award.linkSlug,
    label: MENU_LABEL_OVERRIDES[award.linkSlug] ?? award.name,
    targetSectionId: award.linkSlug,
    order: index + 1,
  }),
);

export const awardsKudosPromo: KudosPromo = {
  label: "Phong trào ghi nhận",
  title: "Sun* Kudos",
  subtitle: "ĐIỂM MỚI CỦA SAA 2025",
  description:
    "Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.",
  ctaLabel: "Chi tiết",
  ctaRoute: null,
};
