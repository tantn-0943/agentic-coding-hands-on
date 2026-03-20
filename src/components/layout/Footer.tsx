'use client'

import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { useTranslations } from '@/hooks/useTranslations'

export function Footer() {
  const t = useTranslations()

  const NAV_LINKS = [
    { label: t.nav_about, href: '/' },
    { label: t.nav_awards, href: '/award-information' },
    { label: t.nav_kudos, href: '/sun-kudos' },
  ]

  return (
    <footer className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 py-10 px-4 md:px-10 lg:px-[90px] bg-[#00101A] border-t border-[#2E3940]">
      <Link href="/" aria-label={t.go_to_homepage}>
        <Logo />
      </Link>

      <nav className="flex flex-row flex-wrap items-center justify-center gap-2" aria-label="Footer navigation">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="px-2 py-1 text-base font-bold font-[family-name:var(--font-montserrat)] text-white hover:bg-[#FFEA9E]/10 rounded transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#FFEA9E]"
          >
            {label}
          </Link>
        ))}
      </nav>

      <span className="font-[family-name:var(--font-montserrat-alt)] font-bold text-base text-white text-center">
        {t.footer_copyright}
      </span>
    </footer>
  )
}
