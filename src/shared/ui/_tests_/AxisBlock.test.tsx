import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AxisBlock } from '../AxisBlock'
import type { Axe } from '../../../data/contracts'

const axe: Axe = {
  id: 'axe-1',
  slug: 'sante-globale',
  name: 'Santé globale',
  summary: 'Accompagnement psychologique et psychosocial.',
  position: 1,
  isPublished: true,
}

describe('AxisBlock', () => {
  it('affiche le nom et le résumé', () => {
    render(<AxisBlock axe={axe} />)
    expect(screen.getByRole('heading', { name: 'Santé globale' })).toBeInTheDocument()
    expect(screen.getByText('Accompagnement psychologique et psychosocial.')).toBeInTheDocument()
  })
})