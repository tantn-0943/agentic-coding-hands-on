import type { Award } from "@/types/awards";

const AWARD_BG = "/images/awards/award-background.png";

export function formatAwardQuantity(quantity: number): string {
  return quantity.toString().padStart(2, "0");
}

export const awards: Award[] = [
  {
    id: "top-talent",
    slug: "top-talent",
    name: "Top Talent",
    description:
      "Vinh danh những cá nhân xuất sắc nhất với năng lực vượt trội và đóng góp nổi bật cho tổ chức.",
    imageUrl: "/images/awards/top-talent.png",
    artworkUrl: "/images/awards/top-talent-artwork.png",
    artworkWidth: 222,
    artworkHeight: 36,
    linkSlug: "top-talent",
    quantity: 10,
    unit: "Cá nhân",
    prizeValue: "7.000.000 VNĐ/giải",
    note: "Dành cho các cá nhân có thành tích nổi bật trong năm.",
  },
  {
    id: "top-project",
    slug: "top-project",
    name: "Top Project",
    description:
      "Ghi nhận những dự án tiêu biểu mang lại giá trị cao nhất cho khách hàng và tổ chức.",
    imageUrl: "/images/awards/top-project.png",
    artworkUrl: "/images/awards/top-project-artwork.png",
    artworkWidth: 232,
    artworkHeight: 35,
    linkSlug: "top-project",
    quantity: 2,
    unit: "Tập thể",
    prizeValue: "30.000.000 VNĐ/giải",
    note: "Áp dụng cho những dự án có tác động nổi bật tới khách hàng và tổ chức.",
  },
  {
    id: "top-project-leader",
    slug: "top-project-leader",
    name: "Top Project Leader",
    description:
      "Tôn vinh những người dẫn dắt dự án xuất sắc với khả năng lãnh đạo và quản lý hiệu quả.",
    imageUrl: "/images/awards/top-project-leader.png",
    artworkUrl: "/images/awards/top-project-leader-artwork.png",
    artworkWidth: 232,
    artworkHeight: 64,
    linkSlug: "top-project-leader",
    quantity: 3,
    unit: "Cá nhân",
    prizeValue: "15.000.000 VNĐ/giải",
    note: "Ghi nhận vai trò dẫn dắt đội ngũ và vận hành dự án hiệu quả.",
  },
  {
    id: "best-manager",
    slug: "best-manager",
    name: "Best Manager",
    description:
      "Vinh danh những nhà quản lý tài ba, truyền cảm hứng và xây dựng đội nhóm vững mạnh.",
    imageUrl: "/images/awards/best-manager.png",
    artworkUrl: "/images/awards/best-manager-artwork.png",
    artworkWidth: 232,
    artworkHeight: 30,
    linkSlug: "best-manager",
    quantity: 3,
    unit: "Cá nhân",
    prizeValue: "12.000.000 VNĐ/giải",
    note: "Tôn vinh các quản lý xây dựng đội ngũ vững mạnh và phát triển bền vững.",
  },
  {
    id: "signature-creator",
    slug: "signature-creator",
    name: "Signature 2025 - Creator",
    description:
      "Ghi nhận những cá nhân sáng tạo, đổi mới và tạo ra dấu ấn đặc biệt trong năm 2025.",
    imageUrl: "/images/awards/signature-creator.png",
    artworkUrl: "/images/awards/signature-creator-artwork.png",
    artworkWidth: 232,
    artworkHeight: 54,
    linkSlug: "signature-2025-creator",
    quantity: 5,
    unit: "Cá nhân",
    prizeValue: "8.000.000 VNĐ/giải",
    note: "Ghi nhận những sáng kiến hoặc dấu ấn mới tạo nên chất riêng của năm 2025.",
  },
  {
    id: "mvp",
    slug: "mvp",
    name: "MVP",
    description:
      "Most Valuable Player — Cầu thủ xuất sắc nhất, người đóng góp giá trị vượt trội cho toàn tổ chức.",
    imageUrl: "/images/awards/mvp.png",
    artworkUrl: "/images/awards/mvp-artwork.png",
    artworkWidth: 116,
    artworkHeight: 52,
    linkSlug: "mvp",
    quantity: 1,
    unit: "Cá nhân",
    prizeValue: "20.000.000 VNĐ",
    note: "Giải thưởng cao nhất dành cho cá nhân có đóng góp nổi bật nhất toàn chương trình.",
  },
];

export const awardBackgroundImage = AWARD_BG;
