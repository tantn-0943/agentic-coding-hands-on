'use server'

import { createClient } from '@/libs/supabase/server'
import { heartToggleSchema, createKudoSchema } from './validators'
import type { CreateKudoInput, UploadResult } from '@/types/kudos'

export async function toggleHeart(kudosId: string): Promise<{ success: boolean; hearted: boolean; heartCount: number }> {
  const parsed = heartToggleSchema.safeParse({ kudosId })
  if (!parsed.success) {
    throw new Error('Invalid kudos ID')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check if already hearted
  const { data: existing } = await supabase
    .from('hearts')
    .select('id')
    .eq('kudos_id', kudosId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    // Remove heart
    const { error } = await supabase
      .from('hearts')
      .delete()
      .eq('id', existing.id)

    if (error) throw new Error(`Failed to remove heart: ${error.message}`)

    const { count } = await supabase
      .from('hearts')
      .select('id', { count: 'exact', head: true })
      .eq('kudos_id', kudosId)

    return { success: true, hearted: false, heartCount: count ?? 0 }
  } else {
    // Check if special day
    const today = new Date().toISOString().split('T')[0]
    const { data: config } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'special_days')
      .maybeSingle()

    const specialDays = (config?.value as string[]) ?? []
    const isSpecialDay = specialDays.includes(today)
    const points = isSpecialDay ? 2 : 1

    // Add heart (RLS will block if own kudos)
    const { error } = await supabase
      .from('hearts')
      .insert({
        kudos_id: kudosId,
        user_id: user.id,
        is_special_day: isSpecialDay,
        points,
      })

    if (error) throw new Error(`Failed to add heart: ${error.message}`)

    const { count } = await supabase
      .from('hearts')
      .select('id', { count: 'exact', head: true })
      .eq('kudos_id', kudosId)

    return { success: true, hearted: true, heartCount: count ?? 0 }
  }
}

export async function createKudo(input: CreateKudoInput): Promise<{ success: boolean; kudosId: string }> {
  const parsed = createKudoSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map(e => e.message).join(', '))
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { receiver_id, category_tag, content, hashtag_ids, media_urls, is_anonymous, anonymous_name } = parsed.data

  // Insert kudos row
  const { data: kudos, error: kudosError } = await supabase
    .from('kudos')
    .insert({
      sender_id: user.id,
      receiver_id,
      content,
      category_tag,
      is_anonymous,
      anonymous_name: is_anonymous ? (anonymous_name || 'Ẩn danh') : null,
    })
    .select('id')
    .single()

  if (kudosError) throw new Error(`Failed to create kudos: ${kudosError.message}`)

  // Insert kudos_hashtags rows
  if (hashtag_ids.length > 0) {
    const hashtagRows = hashtag_ids.map(hashtag_id => ({
      kudos_id: kudos.id,
      hashtag_id,
    }))
    const { error: hashtagError } = await supabase
      .from('kudos_hashtags')
      .insert(hashtagRows)

    if (hashtagError) throw new Error(`Failed to add hashtags: ${hashtagError.message}`)
  }

  // Insert kudos_media rows
  if (media_urls.length > 0) {
    const mediaRows = media_urls.map((url, index) => ({
      kudos_id: kudos.id,
      media_type: 'image' as const,
      url,
      sort_order: index,
    }))
    const { error: mediaError } = await supabase
      .from('kudos_media')
      .insert(mediaRows)

    if (mediaError) throw new Error(`Failed to add media: ${mediaError.message}`)
  }

  return { success: true, kudosId: kudos.id }
}

export async function uploadKudoImage(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file') as File | null
  if (!file) throw new Error('No file provided')

  // Validate file type and size
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed')
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image must be under 5MB')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const path = `${user.id}/${timestamp}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('kudos-images')
    .upload(path, file, { contentType: file.type })

  if (uploadError) throw new Error(`Failed to upload image: ${uploadError.message}`)

  const { data: { publicUrl } } = supabase.storage
    .from('kudos-images')
    .getPublicUrl(path)

  return { url: publicUrl }
}

export async function openSecretBox(boxId: string): Promise<{ success: boolean; giftDescription: string }> {
  if (!boxId) throw new Error('Invalid box ID')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('secret_boxes')
    .update({ is_opened: true, opened_at: new Date().toISOString() })
    .eq('id', boxId)
    .eq('user_id', user.id)
    .eq('is_opened', false)
    .select('gift_description')
    .single()

  if (error) throw new Error(`Failed to open secret box: ${error.message}`)

  return { success: true, giftDescription: data.gift_description ?? '' }
}
