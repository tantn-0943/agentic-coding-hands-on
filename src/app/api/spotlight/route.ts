import { NextResponse } from 'next/server'
import { createClient } from '@/libs/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Aggregate kudos by receiver to create spotlight nodes
    const { data, error } = await supabase
      .from('kudos')
      .select('receiver_id, receiver:user_profiles!kudos_receiver_id_user_profiles_fkey(id, name)')

    if (error) throw new Error(`Failed to fetch spotlight data: ${error.message}`)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const grouped = (data ?? []).reduce<Record<string, { name: string; count: number }>>((acc, row: any) => {
      const id = row.receiver_id as string
      const name = row.receiver?.name as string ?? 'Unknown'
      if (!acc[id]) {
        acc[id] = { name, count: 0 }
      }
      acc[id].count++
      return acc
    }, {})

    const totalKudos = Object.values(grouped).reduce((sum, v) => sum + v.count, 0)

    const nodes = Object.entries(grouped).map(([id, { name, count }]) => ({
      id,
      name,
      kudos_count: count,
      x: Math.random() * 800,
      y: Math.random() * 400,
      size: Math.max(12, Math.min(40, count * 4)),
    }))

    return NextResponse.json({ data: nodes, totalKudos })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
