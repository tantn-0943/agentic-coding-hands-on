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
      "Giải thưởng Top Talent vinh danh những cá nhân xuất sắc toàn diện – những người không ngừng khẳng định năng lực chuyên môn vững vàng, hiệu suất công việc vượt trội, luôn mang lại giá trị vượt kỳ vọng, được đánh giá cao bởi khách hàng và đồng đội. Với tinh thần sẵn sàng nhận mọi nhiệm vụ tổ chức giao phó, họ luôn là nguồn cảm hứng, thúc đẩy động lực và tạo ảnh hưởng tích cực đến cả tập thể.",
    imageUrl: "/images/awards/top-talent.png",
    artworkUrl: "/images/awards/top-talent-artwork.png",
    artworkWidth: 222,
    artworkHeight: 36,
    linkSlug: "top-talent",
    quantity: 10,
    unit: "Đơn vị",
    prizeValue: "7.000.000 VNĐ",
    note: "cho mỗi giải thưởng",
  },
  {
    id: "top-project",
    slug: "top-project",
    name: "Top Project",
    description:
      "Giải thưởng Top Project vinh danh các tập thể dự án xuất sắc với kết quả kinh doanh vượt kỳ vọng. Hiệu quả vận hành tối ưu và sự tin tưởng từ khách hàng. Đây là các dự án có độ phức tạp kỹ thuật cao, hiệu quả lao động tối ưu và nhận được phản hồi tích cực từ khách hàng. Giải thưởng này là sự ghi nhận cho những tập thể sáng tạo đã biết chuẩn hoá quy trình phát triển dự án, tạo nên mô hình mẫu về sự xuất sắc và chuyên nghiệp.",
    imageUrl: "/images/awards/top-project.png",
    artworkUrl: "/images/awards/top-project-artwork.png",
    artworkWidth: 232,
    artworkHeight: 35,
    linkSlug: "top-project",
    quantity: 2,
    unit: "Tập thể",
    prizeValue: "15.000.000 VNĐ",
    note: "cho mỗi giải thưởng",
  },
  {
    id: "top-project-leader",
    slug: "top-project-leader",
    name: "Top Project Leader",
    description:
      "Giải thưởng Top Project Leader vinh danh những nhà quản lý dự án xuất sắc – những người luôn sẵn sàng tiến lên, dám nhận trách nhiệm, và tự dặn \"Aim High – Be Agile\" trong mỗi bài toán, mỗi quyết định hàng ngày. Họ là những người không chỉ cùng nhau vượt qua thử thách và đạt được mục tiêu đặt ra, mà còn đi vào gốc vấn đề tạo ra giải pháp, tinh thần Mastery, và chuẩn hoá để tạo nền tảng bền vững – hạnh phúc của chính đội ngũ.",
    imageUrl: "/images/awards/top-project-leader.png",
    artworkUrl: "/images/awards/top-project-leader-artwork.png",
    artworkWidth: 232,
    artworkHeight: 64,
    linkSlug: "top-project-leader",
    quantity: 3,
    unit: "Cá nhân",
    prizeValue: "7.000.000 VNĐ",
    note: "cho mỗi giải thưởng",
  },
  {
    id: "best-manager",
    slug: "best-manager",
    name: "Best Manager",
    description:
      "Giải thưởng Best Manager vinh danh những nhà lãnh đạo tiêu biểu – người đã dẫn dắt đội ngũ của mình tạo ra kết quả vượt kỳ vọng, tác động nổi bật đến hiệu quả kinh doanh và sự phát triển bền vững của tổ chức. Dưới sự lãnh đạo của họ, đội ngũ luôn chinh phục và làm chủ mọi mục tiêu bằng năng lực đa nhiệm, khả năng phối hợp hiệu quả, và tư duy ứng dụng công nghệ linh hoạt trong kỷ nguyên số. Họ truyền cảm hứng để tập thể trở nên tự tin tràn đầy năng lượng, sẵn sàng đón nhận, thậm chí dẫn dắt tạo ra những thay đổi có tính cách mạng.",
    imageUrl: "/images/awards/best-manager.png",
    artworkUrl: "/images/awards/best-manager-artwork.png",
    artworkWidth: 232,
    artworkHeight: 30,
    linkSlug: "best-manager",
    quantity: 1,
    unit: "Cá nhân",
    prizeValue: "10.000.000 VNĐ",
    imagePosition: "right",
  },
  {
    id: "signature-creator",
    slug: "signature-creator",
    name: "Signature 2025 - Creator",
    description:
      "Giải thưởng Signature vinh danh cá nhân hoặc tập thể thể hiện tinh thần đặc trưng mà Sun* hướng tới trong từng thời kỳ.\n\nTrong năm 2025, giải thưởng Signature vinh danh Creator - cá nhân/tập thể mang tư duy chủ động và nhạy bén, luôn nhìn thấy cơ hội trong thách thức và tiên phong trong hành động. Họ là những người nhạy bén với vấn đề, nhanh chóng nhận diện và đưa ra những giải pháp thực tiễn, mang lại giá trị rõ rệt cho dự án, khách hàng hoặc tổ chức. Với tư duy kiến tạo và tinh thần \"Creator\" đặc trưng của Sun*, họ không chỉ phản ứng tích cực trước sự thay đổi mà còn chủ động tạo ra cải tiến, góp phần định hình chuẩn mực mới cho cách mà người Sun* tạo giá trị.",
    imageUrl: "/images/awards/signature-creator.png",
    artworkUrl: "/images/awards/signature-creator-artwork.png",
    artworkWidth: 232,
    artworkHeight: 54,
    linkSlug: "signature-2025-creator",
    quantity: 1,
    unit: "Cá nhân hoặc tập thể",
    prizeValue: "5.000.000 VNĐ",
    prizeEntries: [
      { value: "5.000.000 VNĐ", label: "cho giải cá nhân" },
      { value: "8.000.000 VNĐ", label: "cho giải tập thể" },
    ],
  },
  {
    id: "mvp",
    slug: "mvp",
    name: "MVP (Most Valuable Person)",
    description:
      "Giải thưởng MVP vinh danh cá nhân xuất sắc nhất năm – gương mặt tiêu biểu đại diện cho toàn bộ tập thể Sun*.\nHọ là người đã thể hiện năng lực vượt trội, tinh thần cống hiến bền bỉ, và tầm ảnh hưởng sâu rộng, để lại dấu ấn mạnh mẽ trong hành trình của Sun* suốt năm qua.\n\nKhông chỉ nổi bật bởi hiệu suất và kết quả công việc, họ còn là nguồn cảm hứng lan tỏa – thông qua suy nghĩ, hành động và ảnh hưởng tích cực của mình đối với tập thể.\nMVP là người hội tụ đầy đủ phẩm chất của người Sun* ưu tú, đồng thời mang trên mình trọng trách lớn lao: trở thành hình mẫu đại diện cho con người và tinh thần Sun*, góp phần dẫn dắt tập thể vươn tới những đỉnh cao mới.",
    imageUrl: "/images/awards/mvp.png",
    artworkUrl: "/images/awards/mvp-artwork.png",
    artworkWidth: 116,
    artworkHeight: 52,
    linkSlug: "mvp",
    quantity: 1,
    unit: "Cá nhân",
    prizeValue: "15.000.000 VNĐ",
    imagePosition: "right",
  },
];

export const awardBackgroundImage = AWARD_BG;
