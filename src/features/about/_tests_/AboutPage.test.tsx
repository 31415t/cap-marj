import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AboutPage } from '../AboutPage'

const renderPage = () =>
  render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>,
  )

describe('AboutPage', () => {
  it('affiche le titre et le chapeau', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: /à propos du cap-marj/i })).toBeInTheDocument()
    expect(screen.getByText(/fondé le 10 octobre 2017/i)).toBeInTheDocument()
  })

  it('affiche les six sections en accordéon', () => {
    renderPage()
    const titles = [
      'Identité et mission',
      'Les quatre axes',
      'Services',
      'Organisation et branches',
      'Historique',
      'Chiffres clés',
    ]
    titles.forEach((t) => expect(screen.getByText(t)).toBeInTheDocument())
  })

  it('la section « Identité et mission » est ouverte par défaut', () => {
    renderPage()
    const details = screen.getByText('Identité et mission').closest('details') as HTMLDetailsElement
    expect(details.open).toBe(true)
  })

  it('la section « Historique » est fermée par défaut', () => {
    renderPage()
    const details = screen.getByText('Historique').closest('details') as HTMLDetailsElement
    expect(details.open).toBe(false)
  })

  it('affiche les 4 axes après chargement', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Santé globale')).toBeInTheDocument()
    })
  })

  it('affiche la timeline après chargement', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Fondation du CAP-MARJ')).toBeInTheDocument()
    })
  })
})