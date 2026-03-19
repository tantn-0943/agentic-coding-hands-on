'use client'

import { useState } from 'react'
import Image from 'next/image'

interface WidgetButtonProps {
  onOpenWriteKudo?: () => void
}

export function WidgetButton({ onOpenWriteKudo }: WidgetButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleWriteKudo = () => {
    setIsOpen(false)
    onOpenWriteKudo?.()
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <ul className="bg-[#0F1923] border border-[#FFEA9E]/20 rounded-lg shadow-lg overflow-hidden w-40">
          <li>
            <button
              type="button"
              onClick={handleWriteKudo}
              className="w-full px-4 py-3 text-left text-sm font-bold text-white hover:bg-[#FFEA9E]/10 transition-colors"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Viết Kudo
            </button>
          </li>
        </ul>
      )}
      <button
        aria-label="Quick actions"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-[106px] h-16 bg-[#FFEA9E] rounded-full cursor-pointer flex items-center justify-center gap-2 px-4 hover:scale-105 active:scale-[0.97] transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#00101A] focus-visible:outline-offset-2"
      >
        <Image src="/images/widget-pen-icon.svg" alt="Kudos" width={24} height={24} />
        <span className="font-[family-name:var(--font-montserrat)] font-bold text-[#00101A] text-sm leading-none">/</span>
        <Image src="/images/widget-kudos-logo.svg" alt="Kudos logo" width={20} height={19} />
      </button>
    </div>
  )
}
