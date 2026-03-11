'use client'

import Image from 'next/image'

export default function LanguageSelector() {
  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-label="Select language: Vietnamese"
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
        src="/icons/vn-flag.svg"
        alt="Vietnam flag"
        width={24}
        height={24}
      />
      <span>VN</span>
      <Image
        src="/icons/chevron-down.svg"
        alt=""
        width={24}
        height={24}
        aria-hidden="true"
      />
    </button>
  )
}
