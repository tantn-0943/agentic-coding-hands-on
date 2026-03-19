'use client'

import { useCallback, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { uploadKudoImage } from '@/lib/kudos/actions'

interface ImageSectionProps {
  images: string[]
  onUpload: (url: string) => void
  onRemove: (index: number) => void
}

export function ImageSection({ images, onUpload, onRemove }: ImageSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadKudoImage(formData)
      onUpload(result.url)
    } catch {
      // Error handled by parent via toast
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [onUpload])

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Label */}
      <span className="text-[22px] font-bold text-[#00101A] leading-[28px]" style={{ fontFamily: 'var(--font-sans)' }}>
        Image
      </span>

      {/* Thumbnails */}
      {images.map((url, index) => (
        <div key={url} className="relative">
          <img
            src={url}
            alt={`Attachment ${index + 1}`}
            className="w-20 h-20 rounded border border-[var(--color-primary-gold)] object-cover"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--color-error)] rounded-full flex items-center justify-center"
          >
            <Icon name="close-x" size={12} className="text-white" />
          </button>
        </div>
      ))}

      {/* Upload loading */}
      {isUploading && (
        <div className="w-20 h-20 rounded border border-[var(--color-primary-gold)] bg-white flex items-center justify-center">
          <span className="inline-block w-6 h-6 border-2 border-[var(--color-border-gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Add button */}
      {images.length < 5 && !isUploading && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-12 px-2 rounded-lg border border-[var(--color-border-gold)] bg-white text-[11px] font-bold text-[var(--color-text-muted)] flex items-center gap-1 hover:bg-[rgba(255,234,158,0.10)] transition-colors"
          style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}
        >
          <Icon name="plus" size={16} className="text-[var(--color-text-muted)]" />
          Image
          <span className="block text-[11px]">Tối đa 5</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
