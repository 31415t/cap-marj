Il reste **Contact** pour clore V0-D. C'est la page la plus sensible : formulaire, anti-spam, fonction serveur, Resend. Je vous donne tout en une session, avec les choix par défaut documentés.

## Deux décisions par défaut (à valider)

1. **TRD-Q01 (domaine)** : sans domaine vérifié chez Resend, le formulaire n'envoie qu'à l'adresse du développeur. On part là-dessus, avec une variable `CONTACT_TO_EMAIL` qui permettra de basculer vers l'adresse du centre quand le domaine sera prêt.
2. **Turnstile** : on part sur le **repli honeypot + limitation de débit** (prévu par le TRD §8), et on ajoutera Turnstile quand vous aurez les clés. Le code est structuré pour que l'ajout soit trivial.

---

## 1. Contrat du formulaire

**`src/data/contracts/contactRequest.ts`**

```ts
import { z } from 'zod'

export const ContactRequestSchema = z.object({
  name: z.string().min(2, 'Indiquez votre nom.').max(120),
  email: z.string().email('Adresse courriel invalide.').optional().or(z.literal('')),
  phone: z.string().min(6, 'Numéro trop court.').max(40).optional().or(z.literal('')),
  serviceId: z.string().uuid().optional().or(z.literal('')),
  message: z.string().min(10, 'Message trop court (10 caractères minimum).').max(4000, 'Message trop long (4000 caractères maximum).'),
  // honeypot : doit rester vide
  website: z.string().max(200).optional(),
}).refine((d) => d.email || d.phone, {
  message: 'Indiquez au moins un courriel ou un téléphone.',
  path: ['email'],
})

export type ContactRequest = z.infer<typeof ContactRequestSchema>
```

Ajoutez `export * from './contactRequest'` dans `src/data/contracts/index.ts`.

---

## 2. Formulaire — `src/features/contact/ContactForm.tsx`

```tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactRequestSchema, type ContactRequest } from '../../data/contracts'
import type { Service } from '../../data/contracts'
import { Field } from '../../shared/ui/Field'
import { Button } from '../../shared/ui/Button'

type Props = { services: Service[] }

export function ContactForm({ services }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactRequest>({
    resolver: zodResolver(ContactRequestSchema),
    defaultValues: { name: '', email: '', phone: '', serviceId: '', message: '', website: '' },
  })

  const onSubmit = async (data: ContactRequest) => {
    setStatus('sending')
    setServerError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setServerError(body.error ?? 'Envoi impossible. Réessayez.')
        setStatus('error')
        return
      }
      reset()
      setStatus('success')
    } catch {
      setServerError('Connexion interrompue. Vérifiez votre réseau puis réessayez.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="border border-bordure rounded-[var(--rayon-fiche)] p-6">
        <p className="font-semibold text-encre">Votre message est envoyé.</p>
        <p className="mt-2 text-petit text-encre-douce">
          Nous vous répondrons dans les meilleurs délais.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-petit text-vert-cap underline underline-offset-[3px]"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 max-w-xl">
      <p className="text-petit text-attention-texte bg-attention-fond p-3 rounded-[var(--rayon-fiche)]">
        Ne décrivez pas votre situation personnelle dans ce formulaire. Nous en parlerons lors de notre échange.
      </p>

      <Field label="Nom" error={errors.name?.message} {...register('name')} autoComplete="name" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Courriel"
          type="email"
          autoComplete="email"
          help="Laissez vide si vous préférez le téléphone."
          error={errors.email?.message}
          {...register('email')}
        />
        <Field
          label="Téléphone"
          type="tel"
          autoComplete="tel"
          help="Laissez vide si vous préférez le courriel."
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <Field as="select" label="Service concerné" error={errors.serviceId?.message} {...register('serviceId')}>
        <option value="">— Choisir —</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </Field>

      <Field as="textarea" label="Message" error={errors.message?.message} {...register('message')} />

      {/* honeypot invisible */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label>
          Site web
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      {serverError && (
        <p role="alert" className="text-petit text-erreur">{serverError}</p>
      )}

      <Button type="submit" disabled={isSubmitting || status === 'sending'}>
        {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
      </Button>
    </form>
  )
}
```

> Installez `react-hook-form` et `@hookform/resolvers` :
> ```bash
> npm install react-hook-form @hookform/resolvers
> ```

---

## 3. `src/features/contact/ContactPage.tsx`

```tsx
import { useEffect, useState } from 'react'
import { getContentRepository } from '../../data'
import type { Service } from '../../data/contracts'
import { EmergencyNotice } from '../../shared/ui/EmergencyNotice'
import { ContactForm } from './ContactForm'
import { site } from '../../config/site'

export function ContactPage() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    getContentRepository().listServices().then(setServices)
  }, [])

  return (
    <article className="py-8 space-y-10">
      <header className="space-y-4">
        <h1 className="text-h1 font-titre text-encre">Contact</h1>
        <p className="text-lead text-encre-douce max-w-[var(--mesure)]">
          Écrivez-nous pour toute question, prise de rendez-vous ou demande d'information.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6">
          <section className="space-y-2">
            <h2 className="text-h2 font-titre text-marine">Coordonnées</h2>
            <p className="text-corps text-encre-douce">
              {site.address}<br />
              <a href={`mailto:${site.contactEmail}`} className="text-vert-cap underline underline-offset-[3px]">
                {site.contactEmail}
              </a><br />
              {site.phones.map((p, i) => (
                <span key={p}>
                  <a href={`tel:${p}`} className="text-vert-cap underline underline-offset-[3px]">{p}</a>
                  {i < site.phones.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </p>
          </section>

          <EmergencyNotice phones={[...site.phones]} />
        </div>

        <div className="md:col-span-7">
          <h2 className="text-h2 font-titre text-marine mb-4">Formulaire de contact</h2>
          <ContactForm services={services} />
        </div>
      </div>
    </article>
  )
}
```

---

## 4. Fonction serveur — `api/contact.ts`

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ContactRequestSchema } from '../src/data/contracts/contactRequest'

const RATE_LIMIT = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

function rateLimited(ip: string) {
  const now = Date.now()
  const arr = (RATE_LIMIT.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (arr.length >= MAX_PER_WINDOW) return true
  arr.push(now)
  RATE_LIMIT.set(ip, arr)
  return false
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Méthode non autorisée.' })
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Trop de demandes. Réessayez plus tard.' })
  }

  const parsed = ContactRequestSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Formulaire invalide.', details: parsed.error.flatten() })
  }

  const { website, ...data } = parsed.data
  if (website) return res.status(200).json({ ok: true }) // honeypot : on ignore silencieusement

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
  ].filter(Boolean).join('\n')

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, text, reply_to: data.email || undefined }),
    })
    if (!r.ok) {
      const detail = await r.text()
      console.error('Resend error', r.status, detail)
      return res.status(502).json({ error: 'Envoi impossible pour le moment.' })
    }
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('Contact handler error', e)
    return res.status(500).json({ error: 'Erreur interne.' })
  }
}
```

> Installez `@vercel/node` en dev :
> ```bash
> npm install -D @vercel/node
> ```

---

## 5. `.env.example`

```bash
# Source de données : mock (V0) | supabase (V1)
VITE_DATA_SOURCE=mock

# Mode démo : true affiche les rubriques futures en « Bientôt »
VITE_DEMO_MODE=false

# Clés publiques (Supabase, Turnstile) — V1
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_TURNSTILE_SITE_KEY=

# Secrets serveur — NE JAMAIS préfixer par VITE_
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
TURNSTILE_SECRET_KEY=
```

---

## 6. Route et tests

Dans `src/App.tsx`, remplacez le placeholder Contact par `ContactPage` :

```tsx
import { ContactPage } from './features/contact/ContactPage'
// ...
{ path: 'contact', Component: ContactPage },
```

**`src/features/contact/__tests__/ContactForm.test.tsx`** (minimum) :

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../ContactForm'

beforeEach(() => {
  global.fetch = vi.fn()
})

describe('ContactForm', () => {
  it('affiche une erreur si message trop court', async () => {
    render(<ContactForm services={[]} />)
    await userEvent.type(screen.getByLabelText('Nom'), 'Jean')
    await userEvent.type(screen.getByLabelText('Courriel'), 'jean@example.com')
    await userEvent.type(screen.getByLabelText('Message'), 'court')
    await userEvent.click(screen.getByRole('button', { name: /envoyer/i }))
    expect(await screen.findByText(/message trop court/i)).toBeInTheDocument()
  })

  it('exige au moins un courriel ou un téléphone', async () => {
    render(<ContactForm services={[]} />)
    await userEvent.type(screen.getByLabelText('Nom'), 'Jean')
    await userEvent.type(screen.getByLabelText('Message'), 'Bonjour, je voudrais des informations.')
    await userEvent.click(screen.getByRole('button', { name: /envoyer/i }))
    expect(await screen.findByText(/indiquez au moins un courriel ou un téléphone/i)).toBeInTheDocument()
  })

  it('affiche le succès quand le serveur répond ok', async () => {
    (global.fetch as any).mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
    render(<ContactForm services={[]} />)
    await userEvent.type(screen.getByLabelText('Nom'), 'Jean')
    await userEvent.type(screen.getByLabelText('Courriel'), 'jean@example.com')
    await userEvent.type(screen.getByLabelText('Message'), 'Bonjour, je voudrais des informations.')
    await userEvent.click(screen.getByRole('button', { name: /envoyer/i }))
    await waitFor(() => expect(screen.getByText(/votre message est envoyé/i)).toBeInTheDocument())
  })
})
```

---

## 7. Vérification

```bash
npm run test
npm run build
npm run dev
```

**Attendu** :
- `/contact` : coordonnées, mention d'urgence, formulaire.
- Sans `RESEND_API_KEY` ni `CONTACT_TO_EMAIL` dans `.env`, l'envoi renvoie une erreur 503 claire.
- Avec les variables (en local, `.env` non versionné), l'envoi part vers `CONTACT_TO_EMAIL`.
- `npm run test` : 3 tests `ContactForm` + les existants.