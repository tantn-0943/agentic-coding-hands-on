import { createClient } from '@/libs/supabase/server'
import type { KudoWithDetails, UserStats, LeaderboardEntry, FilterParams, UserProfile, KudosMedia, Hashtag } from '@/types/kudos'

/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase query results lack generated types until `supabase gen types` is run */

function mapUserProfile(raw: any): UserProfile {
  if (!raw) return { id: '', name: '', avatar_url: null, department_id: null, title: null, star_count: 0, kudos_received_count: 0, kudos_sent_count: 0, hearts_received_count: 0 }
  return {
    id: raw.id ?? '',
    name: raw.name ?? '',
    avatar_url: raw.avatar_url ?? null,
    title: raw.title ?? null,
    star_count: raw.star_count ?? 0,
    kudos_received_count: raw.kudos_received_count ?? 0,
    kudos_sent_count: 0,
    hearts_received_count: 0,
    department_id: null,
    department_name: raw.department?.name ?? undefined,
  }
}

export async function getKudosFeed(
  cursor?: string,
  limit = 10,
  filters?: FilterParams
): Promise<{ data: KudoWithDetails[]; nextCursor: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  let query = supabase
    .from('kudos')
    .select(`
      id, content, category_tag, created_at,
      sender:user_profiles!kudos_sender_id_user_profiles_fkey(id, name, avatar_url, title, star_count, kudos_received_count, department:departments(name)),
      receiver:user_profiles!kudos_receiver_id_user_profiles_fkey(id, name, avatar_url, title, star_count, kudos_received_count, department:departments(name)),
      media:kudos_media(id, media_type, url, sort_order),
      hashtags:kudos_hashtags(hashtag:hashtags(id, name)),
      hearts(id, user_id)
    `)
    .order('created_at', { ascending: false })
    .limit(limit + 1)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  // Note: Supabase doesn't easily filter on nested joins (hashtags, department).
  // For hashtag/department filtering, we fetch a larger set and filter in-memory.
  // In production, use a database function or view for better performance.
  const fetchLimit = filters?.hashtag || filters?.department ? (limit + 1) * 5 : limit + 1
  query = query.limit(fetchLimit)

  const { data, error } = await query

  if (error) throw new Error(`Failed to fetch kudos feed: ${error.message}`)

  const allItems = data ?? []

  const mapped: KudoWithDetails[] = allItems.map((k: any) => {
    const hearts = (k.hearts ?? []) as Array<{ id: string; user_id: string }>
    const media = (k.media ?? []) as Array<any>
    const hashtags = (k.hashtags ?? []) as Array<any>

    return {
      id: k.id,
      content: k.content,
      category_tag: k.category_tag,
      created_at: k.created_at,
      heart_count: hearts.length,
      sender: mapUserProfile(k.sender),
      receiver: mapUserProfile(k.receiver),
      media: media.map((m: any): KudosMedia => ({
        id: m.id,
        kudos_id: k.id,
        media_type: m.media_type,
        url: m.url,
        sort_order: m.sort_order ?? 0,
      })),
      hashtags: hashtags.map((h: any): Hashtag => ({
        id: h.hashtag?.id ?? '',
        name: h.hashtag?.name ?? '',
      })),
      has_hearted: hearts.some((h) => h.user_id === currentUserId),
      is_own_kudos: k.sender?.id === currentUserId,
    }
  })

  // Apply client-side filters (hashtag, department)
  let filtered = mapped
  if (filters?.hashtag) {
    filtered = filtered.filter((k) =>
      k.hashtags.some((h) => h.name === filters.hashtag)
    )
  }
  if (filters?.department) {
    filtered = filtered.filter((k) =>
      k.sender.department_name === filters.department ||
      k.receiver.department_name === filters.department
    )
  }

  const hasMore = filtered.length > limit
  const page = filtered.slice(0, limit)

  const nextCursor = hasMore && page.length > 0
    ? page[page.length - 1].created_at
    : null

  return { data: page, nextCursor }
}

export async function getKudosHighlights(filters?: FilterParams): Promise<KudoWithDetails[]> {
  const { data } = await getKudosFeed(undefined, 100, filters)
  return data
    .sort((a, b) => b.heart_count - a.heart_count)
    .slice(0, 5)
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('kudos_received_count, kudos_sent_count, hearts_received_count')
    .eq('id', userId)
    .single()

  const { count: openedCount } = await supabase
    .from('secret_boxes')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_opened', true)

  const { count: unopenedCount } = await supabase
    .from('secret_boxes')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_opened', false)

  return {
    kudos_received_count: profile?.kudos_received_count ?? 0,
    kudos_sent_count: profile?.kudos_sent_count ?? 0,
    hearts_received_count: profile?.hearts_received_count ?? 0,
    secret_boxes_opened: openedCount ?? 0,
    secret_boxes_unopened: unopenedCount ?? 0,
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('secret_boxes')
    .select(`
      gift_description,
      user:user_profiles(id, name, avatar_url, title, star_count, kudos_received_count)
    `)
    .eq('is_opened', true)
    .not('gift_description', 'is', null)
    .order('opened_at', { ascending: false })
    .limit(10)

  if (error) throw new Error(`Failed to fetch leaderboard: ${error.message}`)

  return (data ?? []).map((entry: any, index: number) => ({
    rank: index + 1,
    user: mapUserProfile(entry.user),
    gift_description: entry.gift_description ?? '',
  }))
}
