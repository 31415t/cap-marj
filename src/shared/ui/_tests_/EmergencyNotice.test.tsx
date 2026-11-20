import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmergencyNotice } from '../EmergencyNotice'

describe('EmergencyNotice', () => {
  it('affiche la phrase d\'orientation', () => {
    render(<EmergencyNotice />)
    expect(screen.getByText(/ne peut pas répondre aux urgences/i)).toBeInTheDocument()
  })
  it("affiche les numéros cliquables quand fournis", () => {
    render(<EmergencyNotice phones={['33623544', '47606868']} />)
    const link = screen.getByRole('link', { name: '33623544' })
    expect(link).toHaveAttribute('href', 'tel:33623544')
  })
  it("n'affiche pas de liens quand aucun numéro", () => {
    render(<EmergencyNotice />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})