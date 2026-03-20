import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWriteKudo } from '@/hooks/useWriteKudo'

// Mock next/navigation
const mockRefresh = vi.fn()
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh, push: mockPush }),
}))

// Mock createKudo
const mockCreateKudo = vi.fn().mockResolvedValue({ success: true, kudosId: '123' })
vi.mock('@/lib/kudos/actions', () => ({
  createKudo: (...args: unknown[]) => mockCreateKudo(...args),
}))

// Mock DOMPurify
vi.mock('dompurify', () => ({
  default: {
    sanitize: (html: string) => html,
  },
}))

describe('useWriteKudo', () => {
  const defaultProps = {
    onClose: vi.fn(),
    showToast: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateKudo.mockResolvedValue({ success: true, kudosId: '123' })
  })

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useWriteKudo(defaultProps))
    expect(result.current.recipientId).toBeNull()
    expect(result.current.categoryTitle).toBe('')
    expect(result.current.editorContent).toBe('')
    expect(result.current.selectedHashtags).toEqual([])
    expect(result.current.attachedImages).toEqual([])
    expect(result.current.isAnonymous).toBe(false)
    expect(result.current.anonymousName).toBe('')
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.errors).toEqual({})
    expect(result.current.isValid).toBe(false)
  })

  it('validates required fields', () => {
    const { result } = renderHook(() => useWriteKudo(defaultProps))

    act(() => { result.current.submit() })

    expect(result.current.errors.recipient).toBeDefined()
    expect(result.current.errors.category).toBeDefined()
    expect(result.current.errors.content).toBeDefined()
    expect(result.current.errors.hashtags).toBeDefined()
  })

  it('isValid becomes true when all required fields filled', () => {
    const { result } = renderHook(() => useWriteKudo(defaultProps))

    act(() => {
      result.current.selectRecipient('user-1', 'User One')
      result.current.setCategoryTitle('Hero')
      result.current.setEditorContent('<p>Thank you!</p>')
      result.current.addHashtag({ id: 'h1', name: 'teamwork' })
    })

    expect(result.current.isValid).toBe(true)
  })

  it('submit calls createKudo with sanitized HTML', async () => {
    const { result } = renderHook(() => useWriteKudo(defaultProps))

    act(() => {
      result.current.selectRecipient('user-1', 'User One')
      result.current.setCategoryTitle('Hero')
      result.current.setEditorContent('<p>Thank you!</p>')
      result.current.addHashtag({ id: 'h1', name: 'teamwork' })
    })

    await act(async () => { await result.current.submit() })

    expect(mockCreateKudo).toHaveBeenCalledWith({
      receiver_id: 'user-1',
      category_tag: 'Hero',
      content: '<p>Thank you!</p>',
      hashtag_ids: ['h1'],
      media_urls: [],
      is_anonymous: false,
      anonymous_name: undefined,
    })
  })

  it('submit calls onClose and router.refresh on success', async () => {
    const onClose = vi.fn()
    const { result } = renderHook(() => useWriteKudo({ ...defaultProps, onClose }))

    act(() => {
      result.current.selectRecipient('user-1', 'User One')
      result.current.setCategoryTitle('Hero')
      result.current.setEditorContent('<p>Thanks!</p>')
      result.current.addHashtag({ id: 'h1', name: 'teamwork' })
    })

    await act(async () => { await result.current.submit() })

    expect(onClose).toHaveBeenCalled()
  })

  it('submit shows toast on error and preserves form data', async () => {
    mockCreateKudo.mockRejectedValueOnce(new Error('Network error'))
    const showToast = vi.fn()
    const { result } = renderHook(() => useWriteKudo({ ...defaultProps, showToast }))

    act(() => {
      result.current.selectRecipient('user-1', 'User One')
      result.current.setCategoryTitle('Hero')
      result.current.setEditorContent('<p>Thanks!</p>')
      result.current.addHashtag({ id: 'h1', name: 'teamwork' })
    })

    await act(async () => { await result.current.submit() })

    expect(showToast).toHaveBeenCalledWith('Network error')
    expect(result.current.errors.submit).toBe('Network error')
    // Form data preserved
    expect(result.current.categoryTitle).toBe('Hero')
  })

  it('submit redirects to login on Unauthorized error', async () => {
    mockCreateKudo.mockRejectedValueOnce(new Error('Unauthorized'))
    const { result } = renderHook(() => useWriteKudo(defaultProps))

    act(() => {
      result.current.selectRecipient('user-1', 'User One')
      result.current.setCategoryTitle('Hero')
      result.current.setEditorContent('<p>Thanks!</p>')
      result.current.addHashtag({ id: 'h1', name: 'teamwork' })
    })

    await act(async () => { await result.current.submit() })

    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('reset clears all state', () => {
    const { result } = renderHook(() => useWriteKudo(defaultProps))

    act(() => {
      result.current.selectRecipient('user-1', 'User One')
      result.current.setCategoryTitle('Hero')
      result.current.setEditorContent('<p>Thanks!</p>')
      result.current.addHashtag({ id: 'h1', name: 'teamwork' })
      result.current.addImage('https://example.com/img.jpg')
      result.current.toggleAnonymous(true)
      result.current.setAnonymousName('Anon')
    })

    act(() => { result.current.reset() })

    expect(result.current.recipientId).toBeNull()
    expect(result.current.categoryTitle).toBe('')
    expect(result.current.editorContent).toBe('')
    expect(result.current.selectedHashtags).toEqual([])
    expect(result.current.attachedImages).toEqual([])
    expect(result.current.isAnonymous).toBe(false)
    expect(result.current.anonymousName).toBe('')
  })

  it('addHashtag enforces max 5', () => {
    const { result } = renderHook(() => useWriteKudo(defaultProps))
    act(() => {
      for (let i = 0; i < 6; i++) {
        result.current.addHashtag({ id: `h${i}`, name: `tag${i}` })
      }
    })
    expect(result.current.selectedHashtags).toHaveLength(5)
  })

  it('addImage enforces max 5', () => {
    const { result } = renderHook(() => useWriteKudo(defaultProps))
    act(() => {
      for (let i = 0; i < 6; i++) {
        result.current.addImage(`https://example.com/${i}.jpg`)
      }
    })
    expect(result.current.attachedImages).toHaveLength(5)
  })

  it('toggleAnonymous clears name when unchecked', () => {
    const { result } = renderHook(() => useWriteKudo(defaultProps))
    act(() => {
      result.current.toggleAnonymous(true)
      result.current.setAnonymousName('Secret')
    })
    expect(result.current.anonymousName).toBe('Secret')

    act(() => { result.current.toggleAnonymous(false) })
    expect(result.current.anonymousName).toBe('')
  })
})
