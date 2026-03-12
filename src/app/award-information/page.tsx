import type { Metadata } from "next";
import { AwardsInfoPageContent } from "@/components/award-information/AwardsInfoPageContent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WidgetButton } from "@/components/layout/WidgetButton";
import { awards } from "@/lib/awards";
import { awardNavigationItems, awardsKudosPromo } from "@/lib/awards-menu";

export const metadata: Metadata = {
  title: "Awards Information | Sun Annual Awards 2025",
  description:
    "Hệ thống giải thưởng SAA 2025 — tra cứu các hạng mục giải, số lượng, giá trị giải thưởng và thông tin liên quan.",
};

export default function AwardInformationPage() {
  return (
    <div className="min-h-screen bg-[#00101A] text-white">
      <Header />
      <main>
        <AwardsInfoPageContent
          awards={awards}
          menuItems={awardNavigationItems}
          kudosPromo={awardsKudosPromo}
        />
      </main>
      <Footer />
      <WidgetButton />
    </div>
  );
}
