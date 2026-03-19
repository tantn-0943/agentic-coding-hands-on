import { z } from 'zod'

export const heartToggleSchema = z.object({
  kudosId: z.string().min(1, 'kudosId is required'),
})

export const searchQuerySchema = z.object({
  q: z.string().trim().max(100, 'Search query too long'),
})

export const filterParamsSchema = z.object({
  hashtag: z.string().optional(),
  department: z.string().optional(),
})

export const feedPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
})

// Viết Kudo schemas

export const createKudoSchema = z.object({
  receiver_id: z.string().uuid('Invalid receiver ID'),
  category_tag: z.string().min(1, 'Category is required').max(100, 'Category too long'),
  content: z.string().min(1, 'Content is required'),
  hashtag_ids: z.array(z.string().uuid()).min(1, 'At least 1 hashtag required').max(5, 'Maximum 5 hashtags'),
  media_urls: z.array(z.string().url()).max(5, 'Maximum 5 images').default([]),
  is_anonymous: z.boolean().default(false),
  anonymous_name: z.string().max(50, 'Anonymous name too long').optional(),
})

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

export const uploadImageSchema = z.object({
  file: z.instanceof(File)
    .refine((f) => ALLOWED_IMAGE_TYPES.includes(f.type), 'Only JPEG, PNG, GIF, and WebP images are allowed')
    .refine((f) => f.size <= MAX_IMAGE_SIZE, 'Image must be under 5MB'),
})

export type HeartToggleInput = z.infer<typeof heartToggleSchema>
export type SearchQueryInput = z.infer<typeof searchQuerySchema>
export type FilterParamsInput = z.infer<typeof filterParamsSchema>
export type FeedPaginationInput = z.infer<typeof feedPaginationSchema>
export type CreateKudoInput = z.infer<typeof createKudoSchema>
export type UploadImageInput = z.infer<typeof uploadImageSchema>
