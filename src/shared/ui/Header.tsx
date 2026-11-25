import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './Button'
import { Badge } from './Badge'
import { features, hasAnyRubrique } from '../../config/features'
import logoUrl from '/images/equipe/capmarjlogo.webp'
import { useActiveSection } from '../../shared/hooks/useActiveSection'

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true'

type SubItem = { kind: 'link'; label: string; to: string } | { kind: 'soon'; label: string }

const rubriques: SubItem[] = [
  features.blog
    ? { kind: 'link', label: 'Blog', to: '/blog' }
    : isDemo
      ? { kind: 'soon', label: 'Blog' }
      : null,
  features.tests
    ? { kind: 'link', label: 'Tests', to: '/tests' }
    : isDemo
      ? { kind: 'soon', label: 'Tests' }
      : null,
  features.qa
    ? { kind: 'link', label: 'Q/R', to: '/questions-reponses' }
    : isDemo
      ? { kind: 'soon', label: 'Q/R' }
      : null,
].filter(Boolean) as SubItem[]

const showRubriques = hasAnyRubrique || (isDemo && rubriques.length > 0)

type NavItem =
  | { kind: 'link'; label: string; to: string }
  | { kind: 'rubriques' }

const navItems: NavItem[] = [
  { kind: 'link', label: 'Accueil', to: '/' },
  { kind: 'link', label: 'Le centre', to: '/a-propos' },
  { kind: 'link', label: 'Services', to: '/#services' },
  { kind: 'link', label: 'FAQ', to: '/#faq' },
  ...(showRubriques ? [{ kind: 'rubriques' as const }] : []),
]

function isLinkActive(
  pathname: string,
  hash: string,
  to: string,
  activeSection: string | null,
) {
  const [toPath, toHash] = to.split('#')

  // Lien à ancre (ex. /#services)
  if (toHash) {
    // On n'est pas sur la bonne page → inactif
    if (pathname !== toPath) return false
    // L'URL garde l'ancre de navigation, mais le défilement décide de l'état actif.
    return activeSection === toHash
  }

  // Lien simple (ex. / ou /a-propos)
  // Actif si le chemin correspond ET qu'on n'est pas dans une section d'ancre
  if (pathname !== to) return false
  // Sur l'accueil, le lien racine est actif quand aucune ancre n'est active.
  if (to === '/') return activeSection === null
  return hash === ''
}

export function Header() {
  const location = useLocation()
  const activeSection = useActiveSection(['services', 'faq'])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [rubriquesOpen, setRubriquesOpen] = useState(false)
  const [mobileRubriquesOpen, setMobileRubriquesOpen] = useState(false)
  const rubriquesRef = useRef<HTMLDivElement | null>(null)

  // Fermeture du sous-menu desktop au clic extérieur et à Échap
  useEffect(() => {
    if (!rubriquesOpen) return
    const onClick = (e: MouseEvent) => {
      if (rubriquesRef.current && !rubriquesRef.current.contains(e.target as Node)) {
        setRubriquesOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRubriquesOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [rubriquesOpen])

  // Fermeture du menu mobile à Échap
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const accountLink = features.accountArea
    ? { label: 'Mon espace', to: '/mon-espace' }
    : isDemo
      ? { label: 'Se connecter', soon: true as const }
      : null

  return (
    <header className="bg-papier/50 backdrop-blur-md border-b border-vert-cap sticky top-0 z-50">
      <div
        className="mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4"
        style={{ maxWidth: 'var(--largeur-page)' }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
          aria-label="CAP-MARJ — Accueil"
        >
          <img src={logoUrl} alt="" className="h-11 w-auto" width={44} height={44} />
          <span className="font-titre text-h3 text-encre">CAP-MARJ</span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Navigation principale">
          {navItems.map((item) =>
            item.kind === 'link' ? (
              <Link
                key={item.label}
                to={item.to}
                className={`text-petit font-semibold ${
                  isLinkActive(location.pathname, location.hash, item.to, activeSection)
                    ? 'text-vert-cap'
                    : 'text-encre hover:text-vert-cap'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <div key="rubriques" className="relative" ref={rubriquesRef}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-petit font-semibold text-encre hover:text-vert-cap"
                  aria-expanded={rubriquesOpen}
                  aria-haspopup="true"
                  onClick={() => setRubriquesOpen((v) => !v)}
                >
                  Ressources
                  <ChevronDown className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
                {rubriquesOpen && (
                  <div className="absolute left-0 top-full mt-2 min-w-[14rem] bg-papier border border-bordure rounded-[var(--rayon-fiche)] py-2 shadow-[var(--ombre-superposition)]">
                    {rubriques.map((sub) =>
                      sub.kind === 'link' ? (
                        <Link
                          key={sub.label}
                          to={sub.to}
                          onClick={() => setRubriquesOpen(false)}
                          className="block px-4 py-2 text-petit text-encre hover:bg-brume"
                        >
                          {sub.label}
                        </Link>
                      ) : (
                        <span key={sub.label} className="flex items-center gap-2 px-4 py-2">
                          <span className="text-petit text-encre-douce">{sub.label}</span>
                          <Badge>Bientôt</Badge>
                        </span>
                      ),
                    )}
                  </div>
                )}
              </div>
            ),
          )}

          {accountLink && (
            accountLink.soon ? (
              <span className="flex items-center gap-2">
                <span className="text-petit text-encre-douce">{accountLink.label}</span>
                <Badge>Bientôt</Badge>
              </span>
            ) : (
              <Link
                to={accountLink.to}
                className={`text-petit font-semibold ${
                  isLinkActive(location.pathname, location.hash, accountLink.to, activeSection)
                    ? 'text-vert-cap'
                    : 'text-encre hover:text-vert-cap'
                }`}
              >
                {accountLink.label}
              </Link>
            )
          )}

          <Button>Nous contacter</Button>
        </nav>

        {/* Bouton mobile */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-[var(--rayon-controle)] text-encre hover:bg-brume"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-bordure bg-papier">
          <nav
            className="mx-auto px-4 md:px-6 py-4 flex flex-col gap-1"
            style={{ maxWidth: 'var(--largeur-page)' }}
            aria-label="Navigation mobile"
          >
            {navItems.map((item) =>
              item.kind === 'link' ? (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 text-corps font-semibold ${
                    isLinkActive(location.pathname, location.hash, item.to, activeSection)
                      ? 'text-vert-cap'
                      : 'text-encre'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <details
                  key="rubriques"
                  open={mobileRubriquesOpen}
                  onToggle={(e) =>
                    setMobileRubriquesOpen((e.target as HTMLDetailsElement).open)
                  }
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between py-3 text-corps font-semibold text-encre">
                    Rubriques
                    <ChevronDown className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                  </summary>
                  <div className="pl-4 pb-2 space-y-1">
                    {rubriques.map((sub) =>
                      sub.kind === 'link' ? (
                        <Link
                          key={sub.label}
                          to={sub.to}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 text-corps text-encre"
                        >
                          {sub.label}
                        </Link>
                      ) : (
                        <span key={sub.label} className="flex items-center gap-2 py-2">
                          <span className="text-corps text-encre-douce">{sub.label}</span>
                          <Badge>Bientôt</Badge>
                        </span>
                      ),
                    )}
                  </div>
                </details>
              ),
            )}

            {accountLink && (
              accountLink.soon ? (
                <span className="flex items-center gap-2 py-3">
                  <span className="text-corps text-encre-douce">{accountLink.label}</span>
                  <Badge>Bientôt</Badge>
                </span>
              ) : (
                <Link
                  to={accountLink.to}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 text-corps font-semibold ${
                    isLinkActive(location.pathname, location.hash, accountLink.to, activeSection)
                      ? 'text-vert-cap'
                      : 'text-encre'
                  }`}
                >
                  {accountLink.label}
                </Link>
              )
            )}

            <div className="pt-3">
              <Button onClick={() => setMobileOpen(false)}>Nous contacter</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}