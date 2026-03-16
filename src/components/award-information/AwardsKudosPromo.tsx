import Image from "next/image";
import Link from "next/link";
import type { KudosPromo } from "@/types/awards";

type Props = {
  promo: KudosPromo;
};

function ArrowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6">
      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AwardsKudosPromo({ promo }: Props) {
  const ctaClassName =
    "inline-flex min-h-14 items-center gap-2 rounded px-4 py-4 font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#FFEA9E] focus-visible:outline-offset-2";

  return (
    <section
      className="relative overflow-hidden bg-[#0F0F0F]"
      aria-label="Sun* Kudos"
    >
      <div className="relative z-[1] flex flex-col gap-8 p-6 md:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
        {/* Content */}
        <div className="flex flex-col gap-8 lg:max-w-[470px]">
          <div className="flex flex-col gap-4">
            <p className="font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-white">
              {promo.label}
            </p>
            <h2 className="font-[family-name:var(--font-montserrat)] text-[32px] font-bold leading-tight text-[#FFEA9E] md:text-[42px] lg:text-[57px] lg:leading-[64px] lg:tracking-[-0.25px]">
              {promo.title}
            </h2>
            <div className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white">
              <p className="mb-1">{promo.subtitle}</p>
              <p>{promo.description}</p>
            </div>
          </div>

          <div>
            {promo.ctaRoute ? (
              <Link
                href={promo.ctaRoute}
                aria-label="Xem chi tiết Sun* Kudos"
                className={`${ctaClassName} w-fit bg-[#FFEA9E] text-[#00101A] hover:opacity-90 active:opacity-80`}
              >
                {promo.ctaLabel}
                <ArrowIcon />
              </Link>
            ) : (
              <span
                aria-disabled="true"
                title="Sun* Kudos sẽ sớm được cập nhật"
                className={`${ctaClassName} w-fit cursor-not-allowed bg-[#FFEA9E]/45 text-[#00101A]/60`}
              >
                {promo.ctaLabel}
                <ArrowIcon />
              </span>
            )}
          </div>
        </div>

        {/* Kudos Logo */}
        <div className="hidden lg:block lg:shrink-0">
          <Image
            src="/icons/kudos-logo.svg"
            alt="Sun* Kudos"
            width={272}
            height={219}
            className="h-auto w-[200px] object-contain lg:w-[272px]"
          />
        </div>
      </div>
    </section>
  );
}
