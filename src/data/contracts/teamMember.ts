import { z } from 'zod'
import { SlugSchema } from './common'

export const TeamMemberSchema = z.object({
  id: z.string(),
  slug: SlugSchema,
  fullName: z.string().min(2),
  displayTitle: z.string().min(2),
  shortBio: z.string().min(10),
  fullBio: z.string().nullable(),
  photoPath: z.string().nullable(),
  position: z.number().int(),
  isPublished: z.boolean(),
})
export type TeamMember = z.infer<typeof TeamMemberSchema>