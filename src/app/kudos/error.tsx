'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function KudosError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-page)]">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-[var(--color-border-gold)] bg-[var(--color-card-bg)] p-8 text-center">
        <h2
          className="text-xl font-bold text-white"
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          Something went wrong
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          {error.message || 'Failed to load the Kudos page.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-[var(--color-primary-gold)] px-6 py-2.5 text-base font-bold text-[var(--color-bg-page)] transition-colors hover:bg-[var(--color-gold-hover)]"
          style={{ fontFamily: 'var(--font-gotham)' }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
