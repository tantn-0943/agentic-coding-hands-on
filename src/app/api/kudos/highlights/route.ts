import { NextRequest, NextResponse } from 'next/server'
import { getKudosHighlights } from '@/lib/kudos/queries'
import { filterParamsSchema } from '@/lib/kudos/validators'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const filterResult = filterParamsSchema.safeParse({
      hashtag: searchParams.get('hashtag') ?? undefined,
      department: searchParams.get('department') ?? undefined,
    })

    if (!filterResult.success) {
      return NextResponse.json({ error: 'Invalid filter params' }, { status: 400 })
    }

    const highlights = await getKudosHighlights(filterResult.data)
    return NextResponse.json({ data: highlights })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
