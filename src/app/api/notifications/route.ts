import { NextResponse } from 'next/server'
import { createClient } from '@/libs/supabase/server'
import type { NotificationsResponse } from '@/types/notifications'

export async function GET(): Promise<NextResponse<NotificationsResponse>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ unreadCount: 0 })
    }

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    if (error) {
      return NextResponse.json({ unreadCount: 0 })
    }

    return NextResponse.json({ unreadCount: count ?? 0 })
  } catch {
    return NextResponse.json({ unreadCount: 0 })
  }
}
