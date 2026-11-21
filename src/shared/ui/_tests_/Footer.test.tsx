import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Footer } from '../Footer'
import { site } from '../../../config/site'

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  )

describe('Footer', () => {
  it("affiche le nom complet et l'adresse", () => {
    renderFooter()
    expect(screen.getByText(site.legalName)).toBeInTheDocument()
    expect(screen.getByText(site.address)).toBeInTheDocument()
  })

  it('affiche les liens légaux et le lien contact', () => {
    renderFooter()
    expect(screen.getByRole('link', { name: /mentions légales/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /politique de confidentialité/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /nous contacter/i })).toBeInTheDocument()
  })

  it('oriente vers le contact direct pour les informations et tarifs', () => {
    renderFooter()
    expect(screen.getByText(/les tarifs et les modalités varient/i)).toBeInTheDocument()
  })

  it("n'affiche pas de mention d'urgence (réservée aux pages Contact et Rendez-vous)", () => {
    renderFooter()
    expect(screen.queryByText(/en cas d'urgence/i)).not.toBeInTheDocument()
  })
})