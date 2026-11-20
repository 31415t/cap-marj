import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  it('affiche le libellé et applique la variante primary par défaut', () => {
    render(<Button>Nous contacter</Button>)
    const btn = screen.getByRole('button', { name: 'Nous contacter' })
    expect(btn).toBeInTheDocument()
    expect(btn.className).toContain('bg-vert-cap')
  })

  it('applique la variante secondary', () => {
    render(<Button variant="secondary">Découvrir</Button>)
    const btn = screen.getByRole('button', { name: 'Découvrir' })
    expect(btn.className).toContain('border-marine')
  })

  it('applique la variante link', () => {
    render(<Button variant="link">En savoir plus</Button>)
    const btn = screen.getByRole('button', { name: 'En savoir plus' })
    expect(btn.className).toContain('text-vert-cap')
  })

  it('déclenche onClick quand cliqué', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Cliquer</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('ne déclenche pas onClick quand désactivé', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick} disabled>Cliquer</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('a type="button" par défaut (évite la soumission implicite)', () => {
    render(<Button>OK</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})