import Image from 'next/image'
import { VideoOverlay } from './VideoOverlay'
import type { KudosMedia } from '@/types/kudos'

interface ImageGalleryProps {
  media: KudosMedia[]
}

export function ImageGallery({ media }: ImageGalleryProps) {
  if (media.length === 0) return null

  const visible = media.slice(0, 5)

  return (
    <div className="flex gap-2">
      {visible.map((item) => (
        <div
          key={item.id}
          className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded transition-all hover:scale-[1.02] hover:opacity-80"
        >
          <Image
            src={item.url}
            alt=""
            fill
            className="object-cover"
            sizes="80px"
          />
          {item.media_type === 'video' && <VideoOverlay />}
        </div>
      ))}
    </div>
  )
}
