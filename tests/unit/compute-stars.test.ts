import { describe, expect, it } from 'vitest'
import { computeStars } from '@/lib/utils/compute-stars'

describe('computeStars', () => {
  it('returns 0 stars for 0 kudos received', () => {
    expect(computeStars(0)).toBe(0)
  })

  it('returns 0 stars for fewer than 10 kudos', () => {
    expect(computeStars(5)).toBe(0)
    expect(computeStars(9)).toBe(0)
  })

  it('returns 1 star for 10+ kudos received', () => {
    expect(computeStars(10)).toBe(1)
    expect(computeStars(15)).toBe(1)
    expect(computeStars(19)).toBe(1)
  })

  it('returns 2 stars for 20+ kudos received', () => {
    expect(computeStars(20)).toBe(2)
    expect(computeStars(30)).toBe(2)
    expect(computeStars(49)).toBe(2)
  })

  it('returns 3 stars for 50+ kudos received', () => {
    expect(computeStars(50)).toBe(3)
    expect(computeStars(100)).toBe(3)
    expect(computeStars(999)).toBe(3)
  })

  it('handles negative input gracefully', () => {
    expect(computeStars(-1)).toBe(0)
  })
})
