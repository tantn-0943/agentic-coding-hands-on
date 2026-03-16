import type { AwardNavigationItem } from "@/types/awards";

function TargetIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="size-6 shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

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
        "group flex items-center gap-1 rounded p-4 text-left transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-[#FFEA9E] focus-visible:outline-offset-2",
        isActive
          ? "text-[#FFEA9E] underline decoration-[#FFEA9E] decoration-2 underline-offset-4"
          : "text-white hover:text-[#FFEA9E]/90",
      ].join(" ")}
    >
      <TargetIcon />
      <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold leading-5 tracking-[0.25px]">
        {item.label}
      </span>
    </button>
  );
}
