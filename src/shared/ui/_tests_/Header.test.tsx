import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../Header'

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )

describe('Header', () => {
  it('pointe le bouton de navigation vers la page contact', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: /nous contacter/i })).toHaveAttribute(
      'href',
      '/contact',
    )
  })

  it('pointe le bouton du menu mobile vers la page contact', async () => {
    renderHeader()
    await userEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))

    const contactLink = screen.getAllByRole('link', { name: /nous contacter/i }).at(-1)
    expect(contactLink).toHaveAttribute('href', '/contact')
  })
})
