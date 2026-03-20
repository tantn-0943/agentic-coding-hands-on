import { describe, expect, it, vi, beforeEach } from 'vitest'

// Mock Supabase client
const mockInsert = vi.fn()
const mockSelect = vi.fn()
const mockSingle = vi.fn()
const mockGetUser = vi.fn()

const mockSupabase = {
  auth: { getUser: mockGetUser },
  from: vi.fn(() => ({
    insert: mockInsert,
    select: mockSelect,
  })),
}

vi.mock('@/libs/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase),
}))

// Import after mocking
const { createKudo } = await import('@/lib/kudos/actions')

const validUuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

const validInput = {
  receiver_id: validUuid,
  category_tag: 'Người truyền động lực',
  content: '<p>Cảm ơn bạn!</p>',
  hashtag_ids: [validUuid],
  media_urls: ['https://example.com/img.jpg'],
  is_anonymous: false,
}

describe('createKudo Server Action (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } })
    // Default: insert kudos returns success
    mockInsert.mockReturnValue({ select: mockSelect })
    mockSelect.mockReturnValue({ single: mockSingle })
    mockSingle.mockResolvedValue({ data: { id: 'kudos-456' }, error: null })
    // For hashtags and media inserts
    mockInsert.mockResolvedValue({ error: null })
    // Re-setup chain for kudos insert
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'kudos') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'kudos-456' }, error: null }),
            }),
          }),
        }
      }
      return {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }
    })
  })

  it('creates kudos with hashtags and media successfully', async () => {
    const result = await createKudo(validInput)
    expect(result).toEqual({ success: true, kudosId: 'kudos-456' })

    // Verify kudos table was called
    expect(mockSupabase.from).toHaveBeenCalledWith('kudos')
    // Verify hashtags table was called
    expect(mockSupabase.from).toHaveBeenCalledWith('kudos_hashtags')
    // Verify media table was called
    expect(mockSupabase.from).toHaveBeenCalledWith('kudos_media')
  })

  it('rejects unauthenticated requests', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    await expect(createKudo(validInput)).rejects.toThrow('Unauthorized')
  })

  it('rejects invalid input', async () => {
    await expect(
      createKudo({ ...validInput, receiver_id: 'invalid' })
    ).rejects.toThrow()
  })

  it('rejects empty hashtag_ids', async () => {
    await expect(
      createKudo({ ...validInput, hashtag_ids: [] })
    ).rejects.toThrow()
  })

  it('handles anonymous kudos with custom name', async () => {
    const result = await createKudo({
      ...validInput,
      is_anonymous: true,
      anonymous_name: 'Người ẩn danh',
    })
    expect(result.success).toBe(true)
  })

  it('handles kudos without media', async () => {
    const result = await createKudo({
      ...validInput,
      media_urls: [],
    })
    expect(result.success).toBe(true)
    // kudos_media should NOT be called when no media
    const mediaCalls = mockSupabase.from.mock.calls.filter(
      (call: string[]) => call[0] === 'kudos_media'
    )
    expect(mediaCalls).toHaveLength(0)
  })
})
