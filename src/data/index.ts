import { createMockContentRepository } from './adapters/mock/content'

export function getContentRepository() {
  if (import.meta.env.VITE_DATA_SOURCE === 'supabase') {
    throw new Error('Adaptateur Supabase non encore implémenté (V1.0)')
  }
  return createMockContentRepository()
}