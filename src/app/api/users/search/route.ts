import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/libs/supabase/server'
import { searchQuerySchema } from '@/lib/kudos/validators'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const result = searchQuerySchema.safeParse({ q: searchParams.get('q') ?? '' })

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid search query' }, { status: 400 })
    }

    const { q } = result.data
    if (!q) {
      return NextResponse.json({ data: [] })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, name, avatar_url, title, department:departments(name)')
      .ilike('name', `%${q}%`)
      .limit(10)

    if (error) throw new Error(`Search failed: ${error.message}`)

    return NextResponse.json({ data: data ?? [] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
