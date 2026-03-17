import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/libs/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, name, avatar_url, title, star_count, kudos_received_count, department:departments(name)')
      .eq('id', id)
      .single()

    if (error) throw new Error(`User not found: ${error.message}`)

    return NextResponse.json({ data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
