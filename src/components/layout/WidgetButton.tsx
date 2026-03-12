'use client'

import { useState } from 'react'

export function WidgetButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <ul className="bg-[#0F1923] border border-[#FFEA9E]/20 rounded-lg shadow-lg overflow-hidden w-40">
          {/* TODO: populate menu items */}
        </ul>
      )}
      <button
        aria-label="Quick actions"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-[106px] h-16 bg-[#FFEA9E] rounded-full cursor-pointer font-[family-name:var(--font-montserrat)] font-bold text-[#00101A] text-sm flex items-center justify-center hover:scale-105 active:scale-[0.97] transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#00101A] focus-visible:outline-offset-2"
      >
        Menu
      </button>
    </div>
  )
}
