import { describe, expect, it } from 'vitest'
import {
  heartToggleSchema,
  searchQuerySchema,
  filterParamsSchema,
  feedPaginationSchema,
} from '@/lib/kudos/validators'

describe('heartToggleSchema', () => {
  it('validates a valid kudos ID', () => {
    const result = heartToggleSchema.safeParse({ kudosId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
    expect(result.success).toBe(true)
  })

  it('rejects empty kudos ID', () => {
    const result = heartToggleSchema.safeParse({ kudosId: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing kudos ID', () => {
    const result = heartToggleSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('searchQuerySchema', () => {
  it('validates a valid search query', () => {
    const result = searchQuerySchema.safeParse({ q: 'Huynh' })
    expect(result.success).toBe(true)
  })

  it('rejects query over 100 characters', () => {
    const result = searchQuerySchema.safeParse({ q: 'a'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('trims whitespace', () => {
    const result = searchQuerySchema.safeParse({ q: '  Huynh  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.q).toBe('Huynh')
    }
  })
})

describe('filterParamsSchema', () => {
  it('validates with both hashtag and department', () => {
    const result = filterParamsSchema.safeParse({ hashtag: 'Dedicated', department: 'Engineering' })
    expect(result.success).toBe(true)
  })

  it('validates with only hashtag', () => {
    const result = filterParamsSchema.safeParse({ hashtag: 'Inspiring' })
    expect(result.success).toBe(true)
  })

  it('validates with no filters (empty)', () => {
    const result = filterParamsSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('strips unknown fields', () => {
    const result = filterParamsSchema.safeParse({ hashtag: 'Test', unknown: 'bad' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect('unknown' in result.data).toBe(false)
    }
  })
})

describe('feedPaginationSchema', () => {
  it('validates with cursor', () => {
    const result = feedPaginationSchema.safeParse({ cursor: 'abc123', limit: 10 })
    expect(result.success).toBe(true)
  })

  it('defaults limit to 10 when not provided', () => {
    const result = feedPaginationSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.limit).toBe(10)
    }
  })

  it('rejects limit over 50', () => {
    const result = feedPaginationSchema.safeParse({ limit: 51 })
    expect(result.success).toBe(false)
  })
})
