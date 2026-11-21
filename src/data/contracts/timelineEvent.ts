import { z } from 'zod'

export const TimelineEventSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string().min(2),
  description: z.string().min(10),
  isMilestone: z.boolean(),
})
export type TimelineEvent = z.infer<typeof TimelineEventSchema>