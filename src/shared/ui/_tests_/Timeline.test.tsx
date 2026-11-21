import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Timeline } from '../Timeline'
import type { TimelineEvent } from '../../../data/contracts'

const events: TimelineEvent[] = [
  { id: 'e1', date: '2017-10-10', title: 'Fondation', description: 'Création du centre.', isMilestone: true },
  { id: 'e2', date: '2020', title: 'Développement', description: 'À compléter.', isMilestone: false },
]

describe('Timeline', () => {
  it('affiche tous les événements', () => {
    render(<Timeline events={events} />)
    expect(screen.getByText('Fondation')).toBeInTheDocument()
    expect(screen.getByText('Développement')).toBeInTheDocument()
  })

  it('formate les dates en français', () => {
    render(<Timeline events={events} />)
    expect(screen.getByText('10 octobre 2017')).toBeInTheDocument()
    expect(screen.getByText('2020')).toBeInTheDocument()
  })

  it("n'affiche rien si la liste est vide", () => {
    const { container } = render(<Timeline events={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('distingue visuellement les jalons', () => {
    const { container } = render(<Timeline events={events} />)
    const dots = container.querySelectorAll('span[aria-hidden="true"]')
    expect(dots[0].className).toContain('bg-vert-cap')
    expect(dots[1].className).toContain('bg-bordure')
  })
})