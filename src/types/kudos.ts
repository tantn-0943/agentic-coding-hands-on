export interface UserProfile {
  id: string
  name: string
  avatar_url: string | null
  department_id: string | null
  department_name?: string
  title: string | null
  star_count: number
  kudos_received_count: number
  kudos_sent_count: number
  hearts_received_count: number
}

export interface Hashtag {
  id: string
  name: string
}

export interface Department {
  id: string
  name: string
}

export interface KudosMedia {
  id: string
  kudos_id: string
  media_type: 'image' | 'video'
  url: string
  sort_order: number
}

export interface Heart {
  id: string
  kudos_id: string
  user_id: string
  is_special_day: boolean
  points: number
  created_at: string
}

export interface Kudos {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  category_tag: string | null
  created_at: string
}

export interface KudoWithDetails {
  id: string
  content: string
  category_tag: string | null
  created_at: string
  heart_count: number
  sender: UserProfile
  receiver: UserProfile
  media: KudosMedia[]
  hashtags: Hashtag[]
  has_hearted: boolean
  is_own_kudos: boolean
}

export interface SecretBox {
  id: string
  user_id: string
  is_opened: boolean
  gift_description: string | null
  opened_at: string | null
}

export interface UserStats {
  kudos_received_count: number
  kudos_sent_count: number
  hearts_received_count: number
  secret_boxes_opened: number
  secret_boxes_unopened: number
}

export interface SpotlightNode {
  id: string
  name: string
  kudos_count: number
  x: number
  y: number
  size: number
}

export interface LeaderboardEntry {
  rank: number
  user: UserProfile
  gift_description: string
}

export interface KudosFeedResponse {
  data: KudoWithDetails[]
  nextCursor: string | null
  hasMore: boolean
}

export interface FilterParams {
  hashtag?: string | null
  department?: string | null
}
