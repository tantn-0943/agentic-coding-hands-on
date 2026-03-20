'use client'

import Image from 'next/image'
import Logo from '@/components/ui/Logo'
import LoginButton from '@/components/auth/LoginButton'
import { LanguageSelector } from '@/components/auth/LanguageSelector'
import { useTranslations } from '@/hooks/useTranslations'

interface LoginContentProps {
  error?: string
  returnTo?: string
}

export function LoginContent({ error, returnTo }: LoginContentProps) {
  const t = useTranslations()

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#00101A]">
      {/* Left gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'var(--gradient-left)' }}
        aria-hidden="true"
      />

      {/* Bottom gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ background: 'var(--gradient-bottom)' }}
        aria-hidden="true"
      />

      {/* Header */}
      <header
        className="
          absolute top-0 left-0 right-0 z-10
          flex items-center justify-between
          h-20 px-4 md:px-12 lg:px-36 py-3
        "
        style={{ background: 'var(--color-header-bg)' }}
      >
        <Logo />
        <LanguageSelector />
      </header>

      {/* Hero Section */}
      <section
        aria-label="Login"
        className="
          absolute top-[88px] left-0 right-0 z-[3]
          flex flex-col items-start
          gap-12 md:gap-[80px]
          px-4 md:px-12 lg:px-36
          py-12 md:py-24
        "
      >
        {/* ROOT FURTHER key visual */}
        <Image
          src="/images/root-further-logo.png"
          alt="ROOT FURTHER – SAA 2025"
          width={451}
          height={200}
          className="w-full max-w-[280px] md:max-w-[320px] lg:w-[451px] lg:max-w-none object-contain"
          priority
        />

        {/* Content block: hero text + login button */}
        <div className="pl-0 md:pl-4 flex flex-col gap-6">
          <p
            className="
              font-[family-name:var(--font-montserrat)] font-bold
              text-base leading-7 md:text-[20px] md:leading-10
              tracking-[0.5px]
              text-white
              w-full lg:w-[480px]
            "
          >
            {t.login_hero_line1}
            <br />
            {t.login_hero_line2}
          </p>

          <LoginButton initialError={error} returnTo={returnTo} />
        </div>
      </section>

      {/* Footer */}
      <footer
        className="
          absolute bottom-0 left-0 right-0 z-[3]
          flex items-center justify-center
          px-4 md:px-12 lg:px-[90px]
          py-6 lg:py-10
          border-t border-[#2E3940]
        "
      >
        <span
          className="
            font-[family-name:var(--font-montserrat-alt)] font-bold
            text-base leading-6 tracking-normal
            text-white text-center
          "
        >
          {t.footer_copyright}
        </span>
      </footer>
    </main>
  )
}
