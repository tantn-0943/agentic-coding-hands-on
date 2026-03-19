'use client'

import { FormActions } from './FormActions'

interface WriteKudoFormProps {
  recipientSlot?: React.ReactNode
  categorySlot?: React.ReactNode
  editorSlot?: React.ReactNode
  hashtagSlot?: React.ReactNode
  imageSlot?: React.ReactNode
  anonymousSlot?: React.ReactNode
  isSubmitDisabled: boolean
  isSubmitting: boolean
  onSubmit: () => void
  onCancel: () => void
}

export function WriteKudoForm({
  recipientSlot,
  categorySlot,
  editorSlot,
  hashtagSlot,
  imageSlot,
  anonymousSlot,
  isSubmitDisabled,
  isSubmitting,
  onSubmit,
  onCancel,
}: WriteKudoFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Title */}
      <h2
        id="write-kudo-title"
        className="text-[32px] font-bold text-center text-[#00101A] leading-[40px]"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        Gửi lời cám ơn và ghi nhận đến đồng đội
      </h2>

      {/* Recipient Field */}
      {recipientSlot}

      {/* Category / Danh hiệu Field */}
      {categorySlot}

      {/* Content section: editor + hashtags + images (gap: 24px) */}
      <div className="flex flex-col gap-6">
        {editorSlot}
        {hashtagSlot}
        {imageSlot}
      </div>

      {/* Anonymous Toggle */}
      {anonymousSlot}

      {/* Actions */}
      <FormActions
        isDisabled={isSubmitDisabled}
        isLoading={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  )
}
