interface RankIndicatorProps {
  rank: number
}

function getRankColor(rank: number): string {
  switch (rank) {
    case 1: return 'var(--color-error)' // #D4271D
    case 2: return 'var(--color-heart-red)' // #F17676
    case 3:
    case 4: return 'var(--color-primary-gold)' // #FFEA9E
    default: return 'var(--color-border-gold)' // #998C5F
  }
}

export function RankIndicator({ rank }: RankIndicatorProps) {
  return (
    <span
      className="h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: getRankColor(rank) }}
      aria-label={`Rank ${rank}`}
    />
  )
}
