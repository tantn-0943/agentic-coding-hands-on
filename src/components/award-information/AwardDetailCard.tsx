import Image from "next/image";
import type { Award } from "@/types/awards";
import { formatAwardQuantity } from "@/lib/awards";

function TargetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6 shrink-0">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6 shrink-0">
      <path d="M6 3H18L21 8L12 21L3 8L6 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 21L9 8L12 3L15 8L12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function LicenseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6 shrink-0">
      <circle cx="12" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 14.5V21L12 19L16 21V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

type Props = {
  award: Award;
  sectionId: string;
};

export function AwardDetailCard({ award, sectionId }: Props) {
  const imageOnRight = award.imagePosition === "right";

  const imageBlock = (
    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-[#09131C] lg:w-[336px] lg:shrink-0">
      <Image
        src="/images/awards/award-background.png"
        alt=""
        aria-hidden={true}
        fill
        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 40vw, 336px"
        className="object-cover"
      />
      <Image
        src={award.artworkUrl}
        alt={award.name}
        width={award.artworkWidth}
        height={award.artworkHeight}
        className="relative z-[1] max-h-[60%] w-auto max-w-[65%] object-contain"
      />
    </div>
  );

  const contentBlock = (
    <div className="flex flex-1 flex-col gap-8">
      {/* Title + Description */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="text-[#FFEA9E]">
            <TargetIcon />
          </span>
          <h2
            id={`${sectionId}-title`}
            className="font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#FFEA9E]"
          >
            {award.name}
          </h2>
        </div>
        <p className="break-words whitespace-pre-line font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white">
          {award.description}
        </p>
      </div>

      {/* Separator */}
      <div className="h-px w-full bg-[#2E3940]" />

      {/* Quantity row */}
      <div className="flex items-center gap-4">
        <span className="text-[#FFEA9E]">
          <DiamondIcon />
        </span>
        <span className="font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#FFEA9E]">
          Số lượng giải thưởng:
        </span>
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-montserrat)] text-4xl font-bold leading-[44px] text-white">
            {formatAwardQuantity(award.quantity)}
          </span>
          <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold leading-5 tracking-[0.1px] text-white">
            {award.unit}
          </span>
        </div>
      </div>

      {/* Separator */}
      <div className="h-px w-full bg-[#2E3940]" />

      {/* Prize value(s) */}
      {award.prizeEntries && award.prizeEntries.length > 1 ? (
        <div className="flex flex-col gap-6">
          {award.prizeEntries.map((entry, index) => (
            <div key={entry.value + index}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-[#FFEA9E]">
                    <LicenseIcon />
                  </span>
                  <span className="font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#FFEA9E]">
                    Giá trị giải thưởng:
                  </span>
                </div>
                <span className="font-[family-name:var(--font-montserrat)] text-4xl font-bold leading-[44px] text-white">
                  {entry.value}
                </span>
                {entry.label ? (
                  <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold leading-5 tracking-[0.1px] text-white">
                    {entry.label}
                  </span>
                ) : null}
              </div>
              {index < award.prizeEntries!.length - 1 ? (
                <div className="relative my-6">
                  <div className="h-px w-full bg-[#2E3940]" />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#00101A] pr-4 font-[family-name:var(--font-montserrat)] text-sm text-[#B9C2CC]">
                    Hoặc
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[#FFEA9E]">
              <LicenseIcon />
            </span>
            <span className="font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-[#FFEA9E]">
              Giá trị giải thưởng:
            </span>
          </div>
          <span className="font-[family-name:var(--font-montserrat)] text-4xl font-bold leading-[44px] text-white">
            {award.prizeValue}
          </span>
          {award.note ? (
            <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold leading-5 tracking-[0.1px] text-white">
              {award.note}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );

  return (
    <article
      id={sectionId}
      data-testid="award-detail-card"
      className="scroll-mt-32 py-10"
      aria-labelledby={`${sectionId}-title`}
    >
      <div className={`flex flex-col gap-10 lg:flex-row lg:items-start ${imageOnRight ? "lg:flex-row-reverse" : ""}`}>
        {imageBlock}
        {contentBlock}
      </div>
      {/* Bottom separator */}
      <div className="mt-20 h-px w-full bg-[#2E3940]" />
    </article>
  );
}
