import type { AwardNavigationItem } from "@/types/awards";

type Props = {
  item: AwardNavigationItem;
  isActive: boolean;
  onSelect: (targetSectionId: string) => void;
};

export function AwardsMenuItem({ item, isActive, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.targetSectionId)}
      aria-current={isActive ? "location" : undefined}
      className={[
        "group inline-flex min-h-11 items-center gap-3 rounded-full border px-4 py-3 text-left transition-all duration-150",
        "focus-visible:outline-2 focus-visible:outline-[#FFEA9E] focus-visible:outline-offset-2",
        isActive
          ? "border-[#FFEA9E] bg-[#FFEA9E]/10 text-[#FFEA9E]"
          : "border-[#2E3940] bg-white/[0.03] text-white hover:border-[#FFEA9E]/70 hover:text-[#FFEA9E]",
      ].join(" ")}
    >
      <span className="font-[family-name:var(--font-montserrat)] text-xs font-bold tracking-[0.24em] text-inherit/80">
        {item.order.toString().padStart(2, "0")}
      </span>
      <span className="font-[family-name:var(--font-montserrat)] text-base font-bold md:text-lg">
        {item.label}
      </span>
    </button>
  );
}
