'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import DOMPurify from 'dompurify'
import { createKudo } from '@/lib/kudos/actions'
import type { Hashtag } from '@/types/kudos'

interface UseWriteKudoProps {
  onClose: () => void
  showToast?: (message: string) => void
}

export function useWriteKudo({ onClose, showToast }: UseWriteKudoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Form state
  const [recipientId, setRecipientId] = useState<string | null>(null)
  const [recipientName, setRecipientName] = useState<string | null>(null)
  const [categoryTitle, setCategoryTitle] = useState('')
  const [editorContent, setEditorContent] = useState('')
  const [selectedHashtags, setSelectedHashtags] = useState<Hashtag[]>([])
  const [attachedImages, setAttachedImages] = useState<string[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [anonymousName, setAnonymousName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validation
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!recipientId) newErrors.recipient = 'Vui lòng chọn người nhận'
    if (!categoryTitle.trim()) newErrors.category = 'Vui lòng nhập danh hiệu'
    if (!editorContent.trim() || editorContent === '<p></p>') newErrors.content = 'Vui lòng nhập nội dung'
    if (selectedHashtags.length === 0) newErrors.hashtags = 'Vui lòng chọn ít nhất 1 hashtag'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [recipientId, categoryTitle, editorContent, selectedHashtags])

  const isValid = useMemo(() => {
    return (
      recipientId !== null &&
      categoryTitle.trim() !== '' &&
      editorContent.trim() !== '' &&
      editorContent !== '<p></p>' &&
      selectedHashtags.length >= 1
    )
  }, [recipientId, categoryTitle, editorContent, selectedHashtags])

  // Submit
  const submit = useCallback(async () => {
    if (!validate()) return
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const sanitizedContent = DOMPurify.sanitize(editorContent)

      await createKudo({
        receiver_id: recipientId!,
        category_tag: categoryTitle.trim(),
        content: sanitizedContent,
        hashtag_ids: selectedHashtags.map(h => h.id),
        media_urls: attachedImages,
        is_anonymous: isAnonymous,
        anonymous_name: isAnonymous ? (anonymousName.trim() || undefined) : undefined,
      })

      onClose()
      startTransition(() => {
        router.refresh()
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gửi thất bại, vui lòng thử lại'
      if (message === 'Unauthorized') {
        router.push('/login')
        return
      }
      showToast?.(message)
      setErrors(prev => ({ ...prev, submit: message }))
    } finally {
      setIsSubmitting(false)
    }
  }, [
    validate, isSubmitting, editorContent, recipientId, categoryTitle,
    selectedHashtags, attachedImages, isAnonymous, anonymousName, onClose, router,
  ])

  // Reset
  const reset = useCallback(() => {
    setRecipientId(null)
    setRecipientName(null)
    setCategoryTitle('')
    setEditorContent('')
    setSelectedHashtags([])
    setAttachedImages([])
    setIsAnonymous(false)
    setAnonymousName('')
    setIsSubmitting(false)
    setErrors({})
  }, [])

  // Hashtag handlers
  const addHashtag = useCallback((hashtag: Hashtag) => {
    setSelectedHashtags(prev => {
      if (prev.length >= 5) return prev
      if (prev.some(h => h.id === hashtag.id)) return prev
      return [...prev, hashtag]
    })
    setErrors(prev => {
      const { hashtags, ...rest } = prev
      return rest
    })
  }, [])

  const removeHashtag = useCallback((id: string) => {
    setSelectedHashtags(prev => prev.filter(h => h.id !== id))
  }, [])

  // Image handlers
  const addImage = useCallback((url: string) => {
    setAttachedImages(prev => {
      if (prev.length >= 5) return prev
      return [...prev, url]
    })
  }, [])

  const removeImage = useCallback((index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  // Recipient handler
  const selectRecipient = useCallback((id: string, name: string) => {
    setRecipientId(id)
    setRecipientName(name)
    setErrors(prev => {
      const { recipient, ...rest } = prev
      return rest
    })
  }, [])

  const clearRecipient = useCallback(() => {
    setRecipientId(null)
    setRecipientName(null)
  }, [])

  // Anonymous handler
  const toggleAnonymous = useCallback((checked: boolean) => {
    setIsAnonymous(checked)
    if (!checked) setAnonymousName('')
  }, [])

  return {
    // State
    recipientId,
    recipientName,
    categoryTitle,
    editorContent,
    selectedHashtags,
    attachedImages,
    isAnonymous,
    anonymousName,
    isSubmitting: isSubmitting || isPending,
    errors,
    isValid,

    // Actions
    selectRecipient,
    clearRecipient,
    setCategoryTitle,
    setEditorContent,
    addHashtag,
    removeHashtag,
    addImage,
    removeImage,
    toggleAnonymous,
    setAnonymousName,
    submit,
    reset,
  }
}
