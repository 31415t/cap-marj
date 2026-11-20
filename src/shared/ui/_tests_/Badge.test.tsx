import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'

describe('Badge', () => {
  it('affiche son contenu', () => {
    render(<Badge>Bientôt</Badge>)
    expect(screen.getByText('Bientôt')).toBeInTheDocument()
  })
  it('applique les classes de style attendues', () => {
    render(<Badge>Bientôt</Badge>)
    const el = screen.getByText('Bientôt')
    expect(el.className).toContain('bg-seve')
    expect(el.className).toContain('text-marine')
  })
})