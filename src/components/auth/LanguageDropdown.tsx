'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { LOCALES } from '@/types/locale'
import type { LocaleCode } from '@/types/locale'

interface LanguageDropdownProps {
  selectedLocale: LocaleCode
  focusedIndex: number
  onSelect: (code: LocaleCode) => void
}

export function LanguageDropdown({ selectedLocale, focusedIndex, onSelect }: LanguageDropdownProps) {
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    optionRefs.current[focusedIndex]?.focus()
  }, [focusedIndex])

  return (
    <ul
      role="listbox"
      aria-label="Select language"
      className="absolute right-0 top-full mt-2 z-50 flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg"
    >
      {LOCALES.map((locale, index) => {
        const isSelected = locale.code === selectedLocale
        const isFocused = index === focusedIndex
        return (
          <li key={locale.code}>
            <button
              ref={(el) => { optionRefs.current[index] = el }}
              type="button"
              role="option"
              aria-selected={isSelected}
              tabIndex={isFocused ? 0 : -1}
              onClick={() => onSelect(locale.code)}
              className={`w-full h-14 px-4 rounded flex items-center gap-1 font-[family-name:var(--font-montserrat)] font-bold text-base leading-6 tracking-[0.15px] text-white transition-colors duration-150 ease-in-out ${
                isSelected
                  ? 'bg-[rgba(255,234,158,0.20)] cursor-default'
                  : 'bg-transparent hover:bg-[rgba(255,234,158,0.10)] cursor-pointer'
              }`}
            >
              <Image
                src={locale.flagSrc}
                alt={`${locale.label} flag`}
                width={24}
                height={24}
              />
              <span>{locale.label}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
