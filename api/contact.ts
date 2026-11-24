import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ContactRequestSchema } from '../src/data/contracts/contactRequest'

const RATE_LIMIT = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

function rateLimited(ip: string) {
  const now = Date.now()
  const requests = (RATE_LIMIT.get(ip) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS)
  if (requests.length >= MAX_PER_WINDOW) return true
  requests.push(now)
  RATE_LIMIT.set(ip, requests)
  return false
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Méthode non autorisée.' })
  }

  const forwardedFor = req.headers['x-forwarded-for']
  const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)
    ?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Trop de demandes. Réessayez plus tard.' })
  }

  const body = req.body
  if (
    typeof body === 'object' &&
    body !== null &&
    !Array.isArray(body) &&
    typeof body.website === 'string' &&
    body.website
  ) {
    return res.status(200).json({ ok: true })
  }

  const parsed = ContactRequestSchema.safeParse(body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Formulaire invalide.', details: parsed.error.flatten() })
  }

  const data = parsed.data

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL ?? 'CAP-MARJ <onboarding@resend.dev>'

  if (!apiKey || !to) {
    return res.status(503).json({ error: 'Le service de courriel n’est pas configuré.' })
  }

  const subject = `Nouvelle demande de contact — ${data.name}`
  const text = [
    `Nom : ${data.name}`,
    data.email ? `Courriel : ${data.email}` : null,
    data.phone ? `Téléphone : ${data.phone}` : null,
    data.serviceId ? `Service : ${data.serviceId}` : null,
    '',
    data.message,
  ].filter((line): line is string => line !== null).join('\n')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject,
        text,
        reply_to: data.email || undefined,
      }),
    })
    if (!response.ok) {
      const detail = await response.text()
      console.error('Resend error', response.status, detail)
      return res.status(502).json({ error: 'Envoi impossible pour le moment.' })
    }
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Contact handler error', error)
    return res.status(500).json({ error: 'Erreur interne.' })
  }
}
