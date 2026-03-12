import Image from 'next/image'
import Link from 'next/link'
import { CountdownSection } from '@/components/homepage/CountdownSection'

const EVENT_DATE = '14/06/2025'
const EVENT_VENUE = 'Gem Center, TP. HCM'

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#00101A]" aria-label="Hero">
      {/* Background image */}
      <Image
        src="/images/login-bg.jpg"
        alt=""
        aria-hidden={true}
        fill
        sizes="100vw"
        className="object-cover z-0"
        priority
      />

      {/* Gradient overlay */}
      <div
        aria-hidden={true}
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'var(--gradient-overlay-homepage)' }}
      />

      {/* Content */}
      <div className="relative z-[2] flex flex-col items-start gap-[40px] lg:gap-[120px] px-4 md:px-10 lg:px-36 py-[100px] md:py-[120px] lg:py-24">
        {/* Countdown + ROOT FURTHER image */}
        <CountdownSection />

        {/* Event Info + CTA */}
        <div className="flex flex-col gap-8">
          {/* Event info block */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <div className="flex flex-col gap-1">
              <span className="font-[family-name:var(--font-montserrat)] font-bold text-base text-white">
                📅 Thời gian
              </span>
              <span className="font-[family-name:var(--font-montserrat)] font-bold text-[24px] text-[#FFEA9E]">
                {EVENT_DATE}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-[family-name:var(--font-montserrat)] font-bold text-base text-white">
                📍 Địa điểm
              </span>
              <span className="font-[family-name:var(--font-montserrat)] font-bold text-[24px] text-[#FFEA9E]">
                {EVENT_VENUE}
              </span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/award-information"
              className="inline-flex items-center justify-center bg-[#FFEA9E] text-[#00101A] font-[family-name:var(--font-montserrat)] font-bold text-[22px] py-4 px-6 rounded-lg hover:opacity-90 active:opacity-80 transition-opacity duration-150 focus-visible:outline-2 focus-visible:outline-[#FFEA9E] focus-visible:outline-offset-2"
            >
              ABOUT AWARDS
            </Link>
            <Link
              href="/sun-kudos"
              className="inline-flex items-center justify-center bg-[#FFEA9E]/10 border border-[#998C5F] text-white font-[family-name:var(--font-montserrat)] font-bold text-[22px] py-4 px-6 rounded-lg hover:bg-[#FFEA9E]/15 active:bg-[#FFEA9E]/20 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#FFEA9E] focus-visible:outline-offset-2"
            >
              ABOUT KUDOS
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
