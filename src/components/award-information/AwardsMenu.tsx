import type { AwardNavigationItem } from "@/types/awards";
import { AwardsMenuItem } from "@/components/award-information/AwardsMenuItem";

type Props = {
  items: AwardNavigationItem[];
  activeId: string;
  onSelect: (targetSectionId: string) => void;
};

export function AwardsMenu({ items, activeId, onSelect }: Props) {
  return (
    <nav aria-label="Danh mục giải thưởng" className="w-full lg:w-[178px]">
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <AwardsMenuItem
            key={item.id}
            item={item}
            isActive={item.id === activeId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </nav>
  );
}
