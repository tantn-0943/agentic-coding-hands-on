import { awards } from "@/lib/awards";
import type { AwardNavigationItem, KudosPromo } from "@/types/awards";

export const awardNavigationItems: AwardNavigationItem[] = awards.map(
  (award, index) => ({
    id: award.linkSlug,
    label: award.name,
    targetSectionId: award.linkSlug,
    order: index + 1,
  }),
);

export const awardsKudosPromo: KudosPromo = {
  subtitle: "Điểm mới của SAA 2025",
  title: "Sun* Kudos",
  description:
    "Hoạt động ghi nhận và cảm ơn đồng nghiệp dành cho tất cả Sunner sẽ được triển khai trong tháng 11/2025. Đây là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.",
  ctaLabel: "Chi tiết",
  ctaRoute: null,
};
