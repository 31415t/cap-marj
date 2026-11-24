import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '../ContactForm'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
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
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    )
    render(<ContactForm services={[]} />)
    await userEvent.type(screen.getByLabelText('Nom'), 'Jean')
    await userEvent.type(screen.getByLabelText('Courriel'), 'jean@example.com')
    await userEvent.type(screen.getByLabelText('Message'), 'Bonjour, je voudrais des informations.')
    await userEvent.click(screen.getByRole('button', { name: /envoyer/i }))
    await waitFor(() => expect(screen.getByText(/votre message est envoyé/i)).toBeInTheDocument())
  })
})
