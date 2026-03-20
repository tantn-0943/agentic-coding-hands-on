'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Logo from '@/components/ui/Logo'
import { LanguageSelector } from '@/components/auth/LanguageSelector'
import type { NotificationsResponse } from '@/types/notifications'
import { createClient } from '@/libs/supabase/client'

const NAV_LINKS = [
  { label: 'About SAA 2025', href: '/' },
  { label: 'Awards Information', href: '/award-information' },
  { label: 'Sun* Kudos', href: '/kudos' },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)
  const [avatarInitial, setAvatarInitial] = useState('U')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => res.json() as Promise<NotificationsResponse>)
      .then((data) => setUnreadCount(data.unreadCount))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setAvatarInitial(user.email[0].toUpperCase())
      }
    })
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header
      className="sticky top-0 z-50 flex flex-row items-center justify-between h-20 px-4 md:px-10 lg:px-36 py-3 w-full"
      style={{ background: 'var(--color-header-bg)' }}
    >
      <Link href="/" aria-label="Go to homepage">
        <Logo />
      </Link>

      <nav className="hidden md:flex flex-row items-center gap-1" aria-label="Main navigation">
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`px-2 py-1 rounded text-sm font-bold font-[family-name:var(--font-montserrat)] transition-colors duration-150 ${
                isActive
                  ? 'text-[#FFEA9E] bg-[#FFEA9E]/10'
                  : 'text-white hover:bg-[#FFEA9E]/10'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-row items-center gap-3">
        <LanguageSelector />
        <button
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          className="relative p-1 text-white hover:bg-[#FFEA9E]/10 rounded transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#FFEA9E]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/notification.svg" alt="" aria-hidden="true" width={24} height={24} />
          {unreadCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute top-0 right-0 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            aria-label="User profile"
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-8 h-8 rounded-full bg-[#FFEA9E]/20 flex items-center justify-center text-white text-sm font-bold hover:bg-[#FFEA9E]/30 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#FFEA9E]"
          >
            <span aria-hidden="true">{avatarInitial}</span>
          </button>
          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-40 bg-[#0F1923] border border-[#FFEA9E]/20 rounded-lg shadow-lg overflow-hidden z-50"
            >
              <Link
                href="/profile"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-white font-[family-name:var(--font-montserrat)] hover:bg-[#FFEA9E]/10 transition-colors duration-150"
              >
                Profile
              </Link>
              <button
                role="menuitem"
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-white font-[family-name:var(--font-montserrat)] hover:bg-[#FFEA9E]/10 transition-colors duration-150"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
