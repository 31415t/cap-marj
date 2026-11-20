import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ServiceCard } from '../ServiceCard'
import type { Service } from '../../../data/contracts'

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
    render(<ServiceCard service={base} />)
    expect(screen.getByRole('heading', { name: 'Consultation psychologique' })).toBeInTheDocument()
    expect(screen.getByText('Consultation, évaluation et psychothérapie.')).toBeInTheDocument()
    expect(screen.getByText('Enfants, adolescents, adultes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nous contacter/i })).toBeInTheDocument()
  })

  it('n\'affiche ni inclusions, ni prix quand vides', () => {
    render(<ServiceCard service={base} />)
    expect(screen.queryByText(/ce qui est inclus/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/G$|\\$$/)).not.toBeInTheDocument()
  })

  it('affiche les inclusions quand renseignées', () => {
    render(<ServiceCard service={{ ...base, inclusions: ['Entretien initial', 'Suivi'] }} />)
    expect(screen.getByText(/ce qui est inclus/i)).toBeInTheDocument()
    expect(screen.getByText('Entretien initial')).toBeInTheDocument()
    expect(screen.getByText('Suivi')).toBeInTheDocument()
  })

  it('affiche le prix quand payant avec montant', () => {
    render(<ServiceCard service={{ ...base, isPaid: true, priceAmount: 1500 }} />)
    expect(screen.getByText('1 500 G')).toBeInTheDocument()
  })

  it('affiche la note de prix (sur devis) quand non payant', () => {
    render(<ServiceCard service={{ ...base, priceNote: 'Sur devis' }} />)
    expect(screen.getByText('Sur devis')).toBeInTheDocument()
  })

  it('appelle onAction au clic sur le bouton', async () => {
    const onAction = vi.fn()
    render(<ServiceCard service={base} onAction={onAction} />)
    await userEvent.click(screen.getByRole('button', { name: /nous contacter/i }))
    expect(onAction).toHaveBeenCalledWith(base)
  })
})