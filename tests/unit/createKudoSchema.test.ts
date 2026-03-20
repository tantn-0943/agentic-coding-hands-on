import { describe, expect, it } from 'vitest'
import { createKudoSchema } from '@/lib/kudos/validators'

const validUuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

const validInput = {
  receiver_id: validUuid,
  category_tag: 'Người truyền động lực',
  content: '<p>Cảm ơn bạn!</p>',
  hashtag_ids: [validUuid],
  media_urls: [],
  is_anonymous: false,
}

describe('createKudoSchema', () => {
  it('accepts valid input', () => {
    const result = createKudoSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('rejects missing receiver_id', () => {
    const { receiver_id, ...rest } = validInput
    const result = createKudoSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects invalid receiver_id (not uuid)', () => {
    const result = createKudoSchema.safeParse({ ...validInput, receiver_id: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('rejects missing category_tag', () => {
    const { category_tag, ...rest } = validInput
    const result = createKudoSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects empty category_tag', () => {
    const result = createKudoSchema.safeParse({ ...validInput, category_tag: '' })
    expect(result.success).toBe(false)
  })

  it('rejects category_tag over 100 chars', () => {
    const result = createKudoSchema.safeParse({ ...validInput, category_tag: 'a'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('rejects missing content', () => {
    const { content, ...rest } = validInput
    const result = createKudoSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects empty content', () => {
    const result = createKudoSchema.safeParse({ ...validInput, content: '' })
    expect(result.success).toBe(false)
  })

  // Hashtag count boundaries
  it('rejects 0 hashtags', () => {
    const result = createKudoSchema.safeParse({ ...validInput, hashtag_ids: [] })
    expect(result.success).toBe(false)
  })

  it('accepts 1 hashtag', () => {
    const result = createKudoSchema.safeParse({ ...validInput, hashtag_ids: [validUuid] })
    expect(result.success).toBe(true)
  })

  it('accepts 5 hashtags', () => {
    const ids = Array.from({ length: 5 }, () => validUuid)
    const result = createKudoSchema.safeParse({ ...validInput, hashtag_ids: ids })
    expect(result.success).toBe(true)
  })

  it('rejects 6 hashtags', () => {
    const ids = Array.from({ length: 6 }, () => validUuid)
    const result = createKudoSchema.safeParse({ ...validInput, hashtag_ids: ids })
    expect(result.success).toBe(false)
  })

  it('rejects non-uuid hashtag_ids', () => {
    const result = createKudoSchema.safeParse({ ...validInput, hashtag_ids: ['not-uuid'] })
    expect(result.success).toBe(false)
  })

  // media_urls
  it('accepts 0 media_urls (default)', () => {
    const { media_urls, ...rest } = validInput
    const result = createKudoSchema.safeParse(rest)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.media_urls).toEqual([])
    }
  })

  it('accepts up to 5 media_urls', () => {
    const urls = Array.from({ length: 5 }, (_, i) => `https://example.com/img${i}.jpg`)
    const result = createKudoSchema.safeParse({ ...validInput, media_urls: urls })
    expect(result.success).toBe(true)
  })

  it('rejects more than 5 media_urls', () => {
    const urls = Array.from({ length: 6 }, (_, i) => `https://example.com/img${i}.jpg`)
    const result = createKudoSchema.safeParse({ ...validInput, media_urls: urls })
    expect(result.success).toBe(false)
  })

  it('rejects invalid media_urls', () => {
    const result = createKudoSchema.safeParse({ ...validInput, media_urls: ['not-a-url'] })
    expect(result.success).toBe(false)
  })

  // Anonymous fields
  it('defaults is_anonymous to false', () => {
    const { is_anonymous, ...rest } = validInput
    const result = createKudoSchema.safeParse(rest)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.is_anonymous).toBe(false)
    }
  })

  it('accepts anonymous_name when provided', () => {
    const result = createKudoSchema.safeParse({
      ...validInput,
      is_anonymous: true,
      anonymous_name: 'Người ẩn danh',
    })
    expect(result.success).toBe(true)
  })

  it('rejects anonymous_name over 50 chars', () => {
    const result = createKudoSchema.safeParse({
      ...validInput,
      anonymous_name: 'a'.repeat(51),
    })
    expect(result.success).toBe(false)
  })

  it('accepts omitted anonymous_name', () => {
    const result = createKudoSchema.safeParse(validInput)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.anonymous_name).toBeUndefined()
    }
  })
})
