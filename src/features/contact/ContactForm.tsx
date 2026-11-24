import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactRequestSchema, type ContactRequest, type Service } from '../../data/contracts'
import { Button } from '../../shared/ui/Button'
import { Field } from '../../shared/ui/Field'

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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body: { error?: string } = await response.json().catch(() => ({}))
      if (!response.ok) {
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
        {services.map((service) => (
          <option key={service.id} value={service.id}>{service.name}</option>
        ))}
      </Field>

      <Field as="textarea" label="Message" error={errors.message?.message} {...register('message')} />

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
