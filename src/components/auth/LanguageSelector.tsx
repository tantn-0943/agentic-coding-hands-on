'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from '@/hooks/useLocale'
import { LOCALES } from '@/types/locale'
import type { LocaleCode } from '@/types/locale'
import { LanguageDropdown } from './LanguageDropdown'

export function LanguageSelector() {
  const { locale, setLocale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  const openDropdown = useCallback(() => {
    const selectedIdx = LOCALES.findIndex((l) => l.code === locale)
    setFocusedIndex(selectedIdx >= 0 ? selectedIdx : 0)
    setIsOpen(true)
  }, [locale])

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  const handleToggle = useCallback(() => {
    if (isOpen) {
      closeDropdown()
    } else {
      openDropdown()
    }
  }, [isOpen, openDropdown, closeDropdown])

  const handleSelect = useCallback((code: LocaleCode) => {
    if (code !== locale) {
      setLocale(code)
    }
    closeDropdown()
  }, [locale, setLocale, closeDropdown])

  // Click-outside handler
  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Keyboard handler (Escape + Arrow keys + Enter)
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case 'Escape':
          closeDropdown()
          break
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex((prev) => (prev + 1) % LOCALES.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex((prev) => (prev - 1 + LOCALES.length) % LOCALES.length)
          break
        case 'Enter':
          event.preventDefault()
          handleSelect(LOCALES[focusedIndex].code)
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, focusedIndex, handleSelect, closeDropdown])

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select language: ${currentLocale.label}`}
        onClick={handleToggle}
        className="
          flex items-center gap-1
          p-4 rounded
          font-[family-name:var(--font-montserrat)] font-bold
          text-base leading-6 tracking-[0.15px]
          text-white
          hover:bg-white/10 transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-offset-2
        "
      >
        <Image
          src={currentLocale.flagSrc}
          alt={`${currentLocale.label} flag`}
          width={24}
          height={24}
        />
        <span>{currentLocale.label}</span>
        <Image
          src="/icons/chevron-down.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <LanguageDropdown
          selectedLocale={locale}
          focusedIndex={focusedIndex}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}
