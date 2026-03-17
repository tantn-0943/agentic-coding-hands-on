import { NextResponse } from 'next/server'
import { createClient } from '@/libs/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('departments')
      .select('id, name')
      .order('name')

    if (error) throw new Error(`Failed to fetch departments: ${error.message}`)

    return NextResponse.json({ data: data ?? [] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
