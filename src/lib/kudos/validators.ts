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

export type HeartToggleInput = z.infer<typeof heartToggleSchema>
export type SearchQueryInput = z.infer<typeof searchQuerySchema>
export type FilterParamsInput = z.infer<typeof filterParamsSchema>
export type FeedPaginationInput = z.infer<typeof feedPaginationSchema>
