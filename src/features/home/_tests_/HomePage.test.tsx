import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from '../HomePage'

const renderHome = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )

describe('HomePage', () => {
  it('affiche le titre principal', () => {
    renderHome()
    expect(
      screen.getByRole('heading', { level: 1, name: /centre d'appui psycho-médical/i }),
    ).toBeInTheDocument()
  })

  it('affiche les quatre axes après chargement', async () => {
    renderHome()
    await waitFor(() => {
      expect(screen.getByText('Santé globale')).toBeInTheDocument()
      expect(screen.getByText('Recherche intégrée')).toBeInTheDocument()
      expect(screen.getByText('Entrepreneuriat social')).toBeInTheDocument()
      expect(screen.getByText('Engagement communautaire')).toBeInTheDocument()
    })
  })

  it('affiche les 5 services après chargement', async () => {
    renderHome()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /consultation, évaluation/i })).toBeInTheDocument()
    })
  })

  it('affiche la section FAQ', async () => {
    renderHome()
    await waitFor(() => {
      expect(screen.getByText('Questions fréquentes')).toBeInTheDocument()
    })
  })

  it("contient les ancres #services et #faq", async () => {
    const { container } = renderHome()
    await waitFor(() => {
      expect(container.querySelector('#services')).not.toBeNull()
      expect(container.querySelector('#faq')).not.toBeNull()
    })
  })
})