import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-papier focus:text-encre focus:px-4 focus:py-2 focus:rounded-[var(--rayon-controle)] focus:ring-2 focus:ring-marine"
      >
        Aller au contenu principal
      </a>
      <Header />
      <main id="main" className="min-h-[60vh]">
        <div className="mx-auto px-4 md:px-6 py-12" style={{ maxWidth: 'var(--largeur-page)' }}>
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}