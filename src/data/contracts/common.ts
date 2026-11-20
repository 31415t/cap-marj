import { z } from 'zod'

export const SlugSchema = z.string().regex(/^[a-z0-9-]+$/, 'slug invalide')
export const CurrencySchema = z.enum(['HTG', 'USD']).default('HTG')