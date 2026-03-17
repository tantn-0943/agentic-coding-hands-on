'use server'

import { createClient } from '@/libs/supabase/server'
import { heartToggleSchema } from './validators'

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
