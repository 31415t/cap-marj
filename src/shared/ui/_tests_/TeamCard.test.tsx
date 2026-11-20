import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TeamCard } from '../TeamCard'
import type { TeamMember } from '../../../data/contracts'

const base: TeamMember = {
  id: 'm1',
  fullName: 'Jean Renold Alphonse',
  displayTitle: 'Fondateur',
  shortBio: 'Psychologue et professeur.',
  fullBio: 'Biographie complète.',
  photoPath: null,
  position: 1,
  isPublished: true,
}

describe('TeamCard', () => {
  it('affiche nom, fonction, résumé', () => {
    render(<TeamCard member={base} />)
    expect(screen.getByRole('heading', { name: 'Jean Renold Alphonse' })).toBeInTheDocument()
    expect(screen.getByText('Fondateur')).toBeInTheDocument()
    expect(screen.getByText('Psychologue et professeur.')).toBeInTheDocument()
  })

  it('affiche un placeholder initiale quand photoPath est null', () => {
    render(<TeamCard member={base} />)
    expect(screen.getByText('JR', { selector: 'div' })).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('affiche une image quand photoPath est fourni', () => {
    render(<TeamCard member={{ ...base, photoPath: '/photo.jpg' }} />)
    const img = screen.getByRole('img', { name: /portrait de jean renold alphonse/i })
    expect(img).toHaveAttribute('src', '/photo.jpg')
  })

  it('appelle onReadMore au clic sur le lien', async () => {
    const onReadMore = vi.fn()
    render(<TeamCard member={base} onReadMore={onReadMore} />)
    await userEvent.click(screen.getByRole('button', { name: /lire la présentation/i }))
    expect(onReadMore).toHaveBeenCalledOnce()
  })
})