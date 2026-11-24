import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

const SHOW_AFTER = 600 // px de défilement avant apparition

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center justify-center w-12 h-12 rounded-full bg-marine text-papier shadow-[var(--ombre-superposition)] hover:bg-encre focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-papier focus-visible:ring-offset-2 focus-visible:ring-offset-marine"
    >
      <ArrowUp className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
    </button>
  )
}