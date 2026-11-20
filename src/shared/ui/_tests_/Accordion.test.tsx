import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion } from '../Accordion'

const items = [
  { question: 'Comment prendre contact ?', answer: 'Via le formulaire.' },
  { question: 'Quels services ?', answer: 'Cinq services.' },
]

describe('Accordion', () => {
  it('affiche toutes les questions', () => {
    render(<Accordion items={items} />)
    expect(screen.getByText('Comment prendre contact ?')).toBeInTheDocument()
    expect(screen.getByText('Quels services ?')).toBeInTheDocument()
  })

  it('ouvre et ferme au clic sur le résumé', async () => {
    render(<Accordion items={items} />)
    const summary = screen.getByText('Comment prendre contact ?')
    const details = summary.closest('details') as HTMLDetailsElement
    expect(details.open).toBe(false)
    await userEvent.click(summary)
    expect(details.open).toBe(true)
    await userEvent.click(summary)
    expect(details.open).toBe(false)
  })
})