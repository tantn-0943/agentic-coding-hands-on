/**
 * Compute star badge count from kudos received count.
 * 1 star = 10 kudos, 2 stars = 20 kudos, 3 stars = 50 kudos.
 */
export function computeStars(kudosReceivedCount: number): number {
  if (kudosReceivedCount >= 50) return 3
  if (kudosReceivedCount >= 20) return 2
  if (kudosReceivedCount >= 10) return 1
  return 0
}
