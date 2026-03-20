'use client'

import Image from 'next/image'
import { KudosSearchInput } from './KudosSearchInput'
import { ProfileSearchBar } from './ProfileSearchBar'
import { useOpenWriteKudo } from '@/components/kudos/write/WriteKudoWrapper'

export function HeroBanner() {
  const onOpenWriteKudo = useOpenWriteKudo() ?? undefined

  return (
    <section
      className="relative flex h-[400px] flex-col justify-end overflow-hidden bg-[var(--color-bg-page)] px-4 pb-12 md:h-[512px] md:px-10 lg:px-[var(--spacing-page-x)]"
    >
      {/* Background image */}
      <Image
        src="/images/kudos/hero-banner-bg.png"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'var(--gradient-hero-overlay)' }}
      />

      {/* Content */}
      <div className="relative z-[2] flex max-w-3xl flex-col gap-6">
        <p
          className="text-lg text-[var(--color-primary-gold)] md:text-xl"
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          He thong ghi nhan va cam on
        </p>
        {/* KUDOS logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/kudos/kudos-logo.svg"
            alt="KUDOS"
            width={280}
            height={64}
            className="h-auto w-auto max-w-[200px] md:max-w-[280px]"
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="flex-1">
            <KudosSearchInput onOpenDialog={onOpenWriteKudo} />
          </div>
          <ProfileSearchBar />
        </div>
      </div>
    </section>
  )
}
