import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from './Button'
import { Badge } from './Badge'
import { features } from '../../config/features'
import logoUrl from '/images/equipe/capmarjlogo.webp'

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true'

type NavItem =
  | { kind: 'link'; label: string; to: string }
  | { kind: 'soon'; label: string }

const navItems: NavItem[] = [
  { kind: 'link', label: 'Le centre', to: '/a-propos' },
  { kind: 'link', label: 'Services', to: '/#services' },
  { kind: 'link', label: 'FAQ', to: '/#faq' },
  { kind: 'link', label: 'Contact', to: '/contact' },
  ...(features.blog ? [{ kind: 'link' as const, label: 'Blog', to: '/blog' }] : []),
  ...(isDemo && !features.blog ? [{ kind: 'soon' as const, label: 'Blog' }] : []),
]

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="bg-papier/50 border-b border-vert-cap backdrop-blur-sm sticky top-0 z-50">
      <div
        className="mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4"
        style={{ maxWidth: 'var(--largeur-page)' }}
      >
        <Link
          to="/"
          className="inline-flex items-center"
          onClick={() => setOpen(false)}
          aria-label="CAP-MARJ — Accueil"
        >
          <img src={logoUrl} alt="" className="h-11 w-auto" width={44} height={44} />
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Navigation principale">
          {navItems.map((item) =>
            item.kind === 'link' ? (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `text-petit font-semibold ${
                    isActive ? 'text-vert-cap' : 'text-encre hover:text-vert-cap'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span key={item.label} className="flex items-center gap-2">
                <span className="text-petit text-encre-douce">{item.label}</span>
                <Badge>Bientôt</Badge>
              </span>
            ),
          )}
          <Button>Nous contacter</Button>
        </nav>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-(--rayon-controle) text-encre hover:bg-brume"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Menu className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-bordure bg-papier"
        >
          <nav
            className="mx-auto px-4 md:px-6 py-4 flex flex-col gap-1"
            style={{ maxWidth: 'var(--largeur-page)' }}
            aria-label="Navigation mobile"
          >
            {navItems.map((item) =>
              item.kind === 'link' ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-3 text-corps font-semibold ${
                      isActive ? 'text-vert-cap' : 'text-encre'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <span key={item.label} className="flex items-center gap-2 py-3">
                  <span className="text-corps text-encre-douce">{item.label}</span>
                  <Badge>Bientôt</Badge>
                </span>
              ),
            )}
            <div className="pt-3">
              <Button onClick={() => setOpen(false)}>Nous contacter</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}