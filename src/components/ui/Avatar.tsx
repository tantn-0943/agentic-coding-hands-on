import Image from 'next/image'

interface AvatarProps {
  src: string | null
  alt: string
  size?: number
  className?: string
}

export function Avatar({ src, alt, size = 40, className = '' }: AvatarProps) {
  return (
    <div
      className={`relative shrink-0 cursor-pointer overflow-hidden rounded-full border-[1.869px] border-white ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[var(--color-card-bg)] text-xs text-[var(--color-text-muted)]">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}
