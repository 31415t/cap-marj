import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../Header'

const renderHeader = (initialEntry = '/') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Header />
    </MemoryRouter>,
  )

let emitIntersection: (target: Element, isIntersecting: boolean) => void = () => undefined

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        emitIntersection = (target, isIntersecting) =>
          callback(
            [
              {
                target,
                isIntersecting,
                boundingClientRect: target.getBoundingClientRect(),
              } as IntersectionObserverEntry,
            ],
            this as unknown as IntersectionObserver,
          )
      }

      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Header', () => {
  it('suit le défilement même si le hash FAQ reste dans l’URL', () => {
    const faqSection = document.createElement('section')
    faqSection.id = 'faq'
    document.body.append(faqSection)

    const { unmount } = renderHeader('/#faq')
    const homeLink = screen.getByRole('link', { name: 'Accueil' })
    const faqLink = screen.getByRole('link', { name: 'FAQ' })

    expect(faqLink).toHaveAttribute('href', '/#faq')
    expect(homeLink).toHaveClass('text-vert-cap')
    expect(faqLink).not.toHaveClass('text-vert-cap')

    act(() => emitIntersection(faqSection, true))
    expect(homeLink).not.toHaveClass('text-vert-cap')
    expect(faqLink).toHaveClass('text-vert-cap')

    act(() => emitIntersection(faqSection, false))
    expect(homeLink).toHaveClass('text-vert-cap')
    expect(faqLink).not.toHaveClass('text-vert-cap')

    unmount()
    faqSection.remove()
  })

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
