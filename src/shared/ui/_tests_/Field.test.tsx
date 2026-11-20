import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Field } from '../Field'

describe('Field', () => {
  it('affiche le label et associe le champ', () => {
    render(<Field label="Courriel" />)
    const input = screen.getByLabelText('Courriel')
    expect(input).toBeInTheDocument()
  })

  it('affiche l\'aide et l\'annonce aux lecteurs d\'écran', () => {
    render(<Field label="Nom" help="Prénom et nom" />)
    const input = screen.getByLabelText('Nom')
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('-help'))
    expect(screen.getByText('Prénom et nom')).toBeInTheDocument()
  })

  it('affiche l\'erreur, la signale et la lie au champ', () => {
    render(<Field label="Courriel" error="Format invalide" />)
    const input = screen.getByLabelText('Courriel')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input.getAttribute('aria-describedby')).toContain('-error')
    expect(screen.getByRole('alert')).toHaveTextContent('Format invalide')
  })

  it('accepte la saisie', async () => {
    render(<Field label="Nom" />)
    const input = screen.getByLabelText('Nom') as HTMLInputElement
    await userEvent.type(input, 'Jean')
    expect(input.value).toBe('Jean')
  })

  it('supporte textarea', () => {
    render(<Field as="textarea" label="Message" />)
    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA')
  })
})