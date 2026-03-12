import Link from "next/link";
import type { KudosPromo } from "@/types/awards";

type Props = {
  promo: KudosPromo;
};

export function AwardsKudosPromo({ promo }: Props) {
  const ctaClassName =
    "inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 font-[family-name:var(--font-montserrat)] text-base font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#FFEA9E] focus-visible:outline-offset-2";

  return (
    <section
      className="rounded-[28px] border border-[#2E3940] bg-[#0B151E] p-6 md:p-8"
      aria-label="Sun* Kudos"
    >
      <div className="flex flex-col gap-4 lg:max-w-[70%]">
        <p className="font-[family-name:var(--font-montserrat)] text-sm font-bold uppercase tracking-[0.2em] text-white/75">
          {promo.subtitle}
        </p>
        <h2 className="font-[family-name:var(--font-montserrat)] text-[32px] font-bold leading-tight text-[#FFEA9E] md:text-[42px] lg:text-[57px] lg:leading-[64px]">
          {promo.title}
        </h2>
        <p className="font-[family-name:var(--font-montserrat)] text-base leading-7 text-white/90">
          {promo.description}
        </p>

        {promo.ctaRoute ? (
          <Link
            href={promo.ctaRoute}
            aria-label="Xem chi tiết Sun* Kudos"
            className={`${ctaClassName} w-fit bg-[#FFEA9E] text-[#00101A] hover:opacity-90 active:opacity-80`}
          >
            {promo.ctaLabel}
            <span aria-hidden="true">↗</span>
          </Link>
        ) : (
          <span
            aria-disabled="true"
            title="Sun* Kudos sẽ sớm được cập nhật"
            className={`${ctaClassName} w-fit cursor-not-allowed border border-[#FFEA9E]/25 bg-[#FFEA9E]/10 text-[#FFEA9E]/60`}
          >
            {promo.ctaLabel}
            <span aria-hidden="true">↗</span>
          </span>
        )}
      </div>
    </section>
  );
}
