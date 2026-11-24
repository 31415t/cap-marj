import { z } from 'zod'

export const ContactRequestSchema = z.object({
  name: z.string().min(2, 'Indiquez votre nom.').max(120),
  email: z.string().email('Adresse courriel invalide.').optional().or(z.literal('')),
  phone: z.string().min(6, 'Numéro trop court.').max(40).optional().or(z.literal('')),
  serviceId: z.string().uuid().optional().or(z.literal('')),
  message: z.string()
    .min(10, 'Message trop court (10 caractères minimum).')
    .max(4000, 'Message trop long (4000 caractères maximum).'),
  website: z.string().max(200).optional(),
}).refine((data) => data.email || data.phone, {
  message: 'Indiquez au moins un courriel ou un téléphone.',
  path: ['email'],
})

export type ContactRequest = z.infer<typeof ContactRequestSchema>
