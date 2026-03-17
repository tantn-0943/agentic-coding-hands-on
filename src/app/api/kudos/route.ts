import { NextRequest, NextResponse } from 'next/server'
import { getKudosFeed } from '@/lib/kudos/queries'
import { feedPaginationSchema, filterParamsSchema } from '@/lib/kudos/validators'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const paginationResult = feedPaginationSchema.safeParse({
      cursor: searchParams.get('cursor') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    })

    if (!paginationResult.success) {
      return NextResponse.json(
        { error: 'Invalid pagination params', details: paginationResult.error.flatten() },
        { status: 400 }
      )
    }

    const filterResult = filterParamsSchema.safeParse({
      hashtag: searchParams.get('hashtag') ?? undefined,
      department: searchParams.get('department') ?? undefined,
    })

    if (!filterResult.success) {
      return NextResponse.json(
        { error: 'Invalid filter params', details: filterResult.error.flatten() },
        { status: 400 }
      )
    }

    const { cursor, limit } = paginationResult.data
    const filters = filterResult.data

    const result = await getKudosFeed(cursor, limit, filters)

    return NextResponse.json({
      data: result.data,
      nextCursor: result.nextCursor,
      hasMore: result.nextCursor !== null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
