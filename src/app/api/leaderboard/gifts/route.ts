import { NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/kudos/queries'

export async function GET() {
  try {
    const entries = await getLeaderboard()
    return NextResponse.json({ data: entries })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
