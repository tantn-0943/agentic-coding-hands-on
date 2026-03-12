import Image from "next/image";
import type { Award } from "@/types/awards";
import { formatAwardQuantity } from "@/lib/awards";

type Props = {
  award: Award;
  sectionId: string;
};

export function AwardDetailCard({ award, sectionId }: Props) {
  return (
    <article
      id={sectionId}
      data-testid="award-detail-card"
      className="scroll-mt-32 overflow-hidden rounded-[24px] border border-[#2E3940] bg-white/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.22)]"
      aria-labelledby={`${sectionId}-title`}
    >
      <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[minmax(0,336px)_1fr] lg:gap-8 lg:p-8">
        <div className="relative aspect-square overflow-hidden rounded-[20px] border border-[#FFEA9E]/30 bg-[#09131C]">
          <Image
            src={award.imageUrl}
            alt={award.name}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 40vw, 336px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-5 text-white">
          <div className="space-y-3">
            <p className="font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.2em] text-[#B9C2CC]">
              Hạng mục giải thưởng
            </p>
            <h2
              id={`${sectionId}-title`}
              className="font-[family-name:var(--font-montserrat)] text-[28px] font-bold leading-tight text-[#FFEA9E] md:text-[36px]"
            >
              {award.name}
            </h2>
            <p className="max-w-3xl font-[family-name:var(--font-montserrat)] text-base leading-7 text-white/90">
              {award.description}
            </p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#2E3940] bg-[#09131C] p-4">
              <dt className="font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.16em] text-[#B9C2CC]">
                Số lượng
              </dt>
              <dd className="mt-2 font-[family-name:var(--font-montserrat)] text-[28px] font-bold text-[#FFEA9E] md:text-[32px]">
                {formatAwardQuantity(award.quantity)}
              </dd>
              <p className="mt-1 font-[family-name:var(--font-montserrat)] text-sm text-white/80">
                {award.unit}
              </p>
            </div>

            <div className="rounded-2xl border border-[#2E3940] bg-[#09131C] p-4">
              <dt className="font-[family-name:var(--font-montserrat)] text-sm font-semibold uppercase tracking-[0.16em] text-[#B9C2CC]">
                Giá trị
              </dt>
              <dd className="mt-2 font-[family-name:var(--font-montserrat)] text-[24px] font-bold leading-snug text-[#FFEA9E] md:text-[28px]">
                {award.prizeValue}
              </dd>
            </div>
          </dl>

          {award.note ? (
            <p className="rounded-2xl border border-dashed border-[#FFEA9E]/30 bg-[#FFEA9E]/5 px-4 py-3 font-[family-name:var(--font-montserrat)] text-sm leading-6 text-white/85">
              {award.note}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
