import { describe, expect, it } from 'vitest'
import { formatTimestamp } from '@/lib/utils/format-timestamp'

describe('formatTimestamp', () => {
  it('formats a date string to "HH:mm - MM/DD/YYYY"', () => {
    // Use a fixed UTC date to avoid timezone issues in tests
    const result = formatTimestamp('2025-10-30T10:00:00Z')
    // The exact output depends on the local timezone, so check format pattern
    expect(result).toMatch(/^\d{2}:\d{2} - \d{2}\/\d{2}\/\d{4}$/)
  })

  it('pads single-digit hours and minutes with zeros', () => {
    const result = formatTimestamp('2025-01-05T03:05:00Z')
    expect(result).toMatch(/^\d{2}:\d{2} - \d{2}\/\d{2}\/\d{4}$/)
  })

  it('handles ISO string with timezone offset', () => {
    const result = formatTimestamp('2025-10-30T10:00:00+07:00')
    expect(result).toMatch(/^\d{2}:\d{2} - \d{2}\/\d{2}\/\d{4}$/)
  })

  it('formats midnight correctly', () => {
    const result = formatTimestamp('2025-12-31T00:00:00Z')
    expect(result).toMatch(/^\d{2}:\d{2} - \d{2}\/\d{2}\/\d{4}$/)
  })

  it('returns empty string for invalid date', () => {
    expect(formatTimestamp('')).toBe('')
    expect(formatTimestamp('invalid')).toBe('')
  })
})
