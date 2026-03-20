'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { useWriteKudo } from '@/hooks/useWriteKudo'
import { useToast } from '@/hooks/useToast'
import { WriteKudoModal } from './WriteKudoModal'
import { WriteKudoForm } from './WriteKudoForm'
import { RecipientField } from './RecipientField'
import { CategoryField } from './CategoryField'
import { RichTextEditor } from './RichTextEditor'
import { HashtagSection } from './HashtagSection'
import { ImageSection } from './ImageSection'
import { AnonymousToggle } from './AnonymousToggle'
import { Toast } from '@/components/ui/Toast'

// Context to provide onOpenWriteKudo to any descendant
const WriteKudoContext = createContext<(() => void) | null>(null)

export function useOpenWriteKudo(): (() => void) | null {
  return useContext(WriteKudoContext)
}

interface WriteKudoWrapperProps {
  children: React.ReactNode
}

export function WriteKudoWrapper({ children }: WriteKudoWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toast = useToast()

  const handleOpen = useCallback(() => setIsModalOpen(true), [])
  const handleClose = useCallback(() => {
    setIsModalOpen(false)
    form.reset()
  }, [])

  const form = useWriteKudo({ onClose: () => setIsModalOpen(false), showToast: toast.showToast })

  return (
    <WriteKudoContext.Provider value={handleOpen}>
      {children}

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
              onUploadError={toast.showToast}
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

      <Toast message={toast.message} visible={toast.visible} onDismiss={toast.hideToast} />
    </WriteKudoContext.Provider>
  )
}
