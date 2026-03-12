import Image from 'next/image'
import Link from 'next/link'
import type { Award } from '@/types/awards'

type Props = {
  award: Award
}

export function AwardCard({ award }: Props) {
  return (
    <Link
      href={`/award-information#${award.linkSlug}`}
      className="flex flex-col gap-6 cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#FFEA9E] focus-visible:outline-offset-4 rounded"
      aria-label={`${award.name} — Chi tiết`}
    >
      <div className="relative w-full aspect-square overflow-hidden border border-[#FFEA9E] transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_8px_24px_rgba(255,234,158,0.25)]">
        <Image
          src={award.imageUrl}
          alt={award.name}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 336px"
          className="object-cover transition-transform duration-200 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-[family-name:var(--font-montserrat)] font-normal text-[24px] text-[#FFEA9E]">
          {award.name}
        </h3>
        <p className="font-[family-name:var(--font-montserrat)] font-normal text-base text-white tracking-[0.5px] line-clamp-2">
          {award.description}
        </p>
        <span className="font-[family-name:var(--font-montserrat)] font-medium text-base text-white group-hover:underline group-hover:text-[#FFEA9E] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#FFEA9E]">
          Chi tiết →
        </span>
      </div>
    </Link>
  )
}
