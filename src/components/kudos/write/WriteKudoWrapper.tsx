'use client'

import { useCallback, useState } from 'react'
import { useWriteKudo } from '@/hooks/useWriteKudo'
import { WriteKudoModal } from './WriteKudoModal'
import { WriteKudoForm } from './WriteKudoForm'
import { RecipientField } from './RecipientField'
import { CategoryField } from './CategoryField'
import { RichTextEditor } from './RichTextEditor'
import { HashtagSection } from './HashtagSection'
import { ImageSection } from './ImageSection'
import { AnonymousToggle } from './AnonymousToggle'

interface WriteKudoWrapperProps {
  children: (props: { onOpenWriteKudo: () => void }) => React.ReactNode
}

export function WriteKudoWrapper({ children }: WriteKudoWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpen = useCallback(() => setIsModalOpen(true), [])
  const handleClose = useCallback(() => {
    setIsModalOpen(false)
    form.reset()
  }, [])

  const form = useWriteKudo({ onClose: () => setIsModalOpen(false) })

  return (
    <>
      {children({ onOpenWriteKudo: handleOpen })}

      <WriteKudoModal isOpen={isModalOpen} onClose={handleClose}>
        <WriteKudoForm
          recipientSlot={
            <RecipientField
              selectedId={form.recipientId}
              selectedName={form.recipientName}
              error={form.errors.recipient}
              onSelect={form.selectRecipient}
              onClear={form.clearRecipient}
            />
          }
          categorySlot={
            <CategoryField
              value={form.categoryTitle}
              error={form.errors.category}
              onChange={form.setCategoryTitle}
            />
          }
          editorSlot={
            <RichTextEditor
              onChange={form.setEditorContent}
              error={form.errors.content}
            />
          }
          hashtagSlot={
            <HashtagSection
              selectedHashtags={form.selectedHashtags}
              error={form.errors.hashtags}
              onAdd={form.addHashtag}
              onRemove={form.removeHashtag}
            />
          }
          imageSlot={
            <ImageSection
              images={form.attachedImages}
              onUpload={form.addImage}
              onRemove={form.removeImage}
            />
          }
          anonymousSlot={
            <AnonymousToggle
              isChecked={form.isAnonymous}
              name={form.anonymousName}
              onToggle={form.toggleAnonymous}
              onNameChange={form.setAnonymousName}
            />
          }
          isSubmitDisabled={!form.isValid}
          isSubmitting={form.isSubmitting}
          onSubmit={form.submit}
          onCancel={handleClose}
        />
      </WriteKudoModal>
    </>
  )
}
