import { z } from 'zod'

export const OrganisationSchema = z.object({
  legalName: z.string().min(2),
  shortName: z.string().min(2),
  email: z.string().email(),
  phones: z.array(z.string()).min(1),
  address: z.string(),
  taxId: z.string(),
  foundedOn: z.string().date(),
  history: z.string().min(50),
})
export type Organisation = z.infer<typeof OrganisationSchema>