import { z } from 'zod'

export const FaqItemSchema = z.object({
  id: z.string(),
  question: z.string().min(5),
  answer: z.string().min(10),
  position: z.number().int(),
  isPublished: z.boolean(),
})
export type FaqItem = z.infer<typeof FaqItemSchema>