import { z } from 'zod'
import { SlugSchema } from './common'

export const AxeSchema = z.object({
  id: z.string(),
  slug: SlugSchema,
  name: z.string().min(2),
  summary: z.string().min(10),
  position: z.number().int(),
  isPublished: z.boolean(),
})
export type Axe = z.infer<typeof AxeSchema>