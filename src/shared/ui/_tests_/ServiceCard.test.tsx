import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ServiceCard } from '../ServiceCard'
import type { Service } from '../../../data/contracts'

const renderCard = (service: Service, onAction?: (service: Service) => void) =>
  render(
    <MemoryRouter>
      <ServiceCard service={service} onAction={onAction} />
    </MemoryRouter>,
  )

const base: Service = {
  id: '11111111-1111-4111-8111-111111111101',
  slug: 'consultation',
  name: 'Consultation psychologique',
  summary: 'Consultation, évaluation et psychothérapie.',
  audience: 'Enfants, adolescents, adultes',
  inclusions: [],
  isPaid: false,
  priceAmount: null,
  priceCurrency: 'HTG',
  priceNote: null,
  workflowType: 'request',
  ctaLabel: 'Nous contacter',
  position: 1,
  isPublished: true,
}

describe('ServiceCard', () => {
  it('affiche nom, résumé, audience et bouton', () => {
    renderCard(base)
    expect(screen.getByRole('heading', { name: 'Consultation psychologique' })).toBeInTheDocument()
    expect(screen.getByText('Consultation, évaluation et psychothérapie.')).toBeInTheDocument()
    expect(screen.getByText('Enfants, adolescents, adultes')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /nous contacter/i })).toBeInTheDocument()
  })

  it('n\'affiche ni inclusions, ni prix quand vides', () => {
    renderCard(base)
    expect(screen.queryByText(/ce qui est inclus/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/G$|\\$$/)).not.toBeInTheDocument()
  })

  it('affiche les inclusions quand renseignées', () => {
    renderCard({ ...base, inclusions: ['Entretien initial', 'Suivi'] })
    expect(screen.getByText(/ce qui est inclus/i)).toBeInTheDocument()
    expect(screen.getByText('Entretien initial')).toBeInTheDocument()
    expect(screen.getByText('Suivi')).toBeInTheDocument()
  })

  it('affiche le prix quand payant avec montant', () => {
    renderCard({ ...base, isPaid: true, priceAmount: 1500 })
    expect(screen.getByText('1 500 G')).toBeInTheDocument()
  })

  it('affiche la note de prix (sur devis) quand non payant', () => {
    renderCard({ ...base, priceNote: 'Sur devis' })
    expect(screen.getByText('Sur devis')).toBeInTheDocument()
  })

  it('appelle onAction au clic sur le bouton', async () => {
    const onAction = vi.fn()
    renderCard(base, onAction)
    await userEvent.click(screen.getByRole('link', { name: /nous contacter/i }))
    expect(onAction).toHaveBeenCalledWith(base)
  })

  it('pointe le bouton vers la page contact', () => {
    renderCard(base)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/contact')
  })
})