import { awards } from '@/lib/awards'
import { AwardCard } from '@/components/homepage/AwardCard'

export function AwardsSection() {
  return (
    <section className="flex flex-col gap-12 py-16 lg:py-24 bg-[#00101A]" aria-label="Awards">
      {/* Section header */}
      <div className="flex flex-col gap-3 px-4 md:px-10 lg:px-36">
        <p className="font-[family-name:var(--font-montserrat)] font-bold text-[24px] text-white">
          Sun* annual awards 2025
        </p>
        <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-[32px] md:text-[42px] lg:text-[57px] leading-tight lg:leading-[64px] tracking-[-0.25px] text-[#FFEA9E]">
          Hệ thống giải thưởng
        </h2>
      </div>

      {/* Awards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-10 lg:px-36">
        {awards.map((award) => (
          <AwardCard key={award.id} award={award} />
        ))}
      </div>
    </section>
  )
}
