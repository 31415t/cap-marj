import { z } from 'zod'
import { SlugSchema, CurrencySchema } from './common'

export const WorkflowType = z.enum(['request', 'appointment', 'registration', 'test'])

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  slug: SlugSchema,
  name: z.string().min(2),
  summary: z.string().min(10),
  audience: z.string().nullable(),
  inclusions: z.array(z.string()).default([]),
  isPaid: z.boolean(),
  priceAmount: z.number().nonnegative().nullable(),
  priceCurrency: CurrencySchema,
  priceNote: z.string().nullable(),
  workflowType: WorkflowType,
  ctaLabel: z.string(),
  position: z.number().int(),
  isPublished: z.boolean(),
})
export type Service = z.infer<typeof ServiceSchema>