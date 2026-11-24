import { Link } from 'react-router-dom'
import { site } from '../../config/site'
import logoUrl from '/images/equipe/capmarjlogo.webp'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-marine text-papier mt-16">
      <div
        className="mx-auto px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        style={{ maxWidth: 'var(--largeur-page)' }}
      >
        <div>
  <div className="inline-flex items-center justify-center bg-papier rounded-(--rayon-fiche) p-2 mb-3">
    <img
      src={logoUrl}
      alt=""
      className="h-11 w-auto"
      width={44}
      height={44}
    />
  </div>
  <p className="font-titre text-h3">{site.legalName}</p>
  <p className="mt-2 text-petit text-papier/80">{site.address}</p>
</div>

        <div>
          <p className="font-semibold text-petit mb-2">Contact</p>
          <ul className="space-y-1 text-petit">
            <li>
              <a href={`mailto:${site.contactEmail}`} className="underline underline-offset-[3px]">
                {site.contactEmail}
              </a>
            </li>
            {site.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p}`} className="underline underline-offset-[3px]">{p}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-petit mb-2">Informations</p>
          <ul className="space-y-1 text-petit">
            <li><Link to="/mentions-legales" className="underline underline-offset-[3px]">Mentions légales</Link></li>
            <li><Link to="/confidentialite" className="underline underline-offset-[3px]">Politique de confidentialité</Link></li>
            <li><Link to="/contact" className="underline underline-offset-[3px]">Nous contacter</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto px-4 md:px-6 pb-8" style={{ maxWidth: 'var(--largeur-page)' }}>
        <p className="text-petit text-papier/80">
          Les tarifs et les modalités varient selon la situation. Pour toute information non présente sur le site (tarifs, disponibilité, cas particulier),{' '}
          <Link to="/contact" className="underline underline-offset-[3px]">contactez directement le centre</Link>.
        </p>
        <p className="mt-4 text-petit text-papier/70">
          © {year} {site.name}. Tous droits réservés. Numéro fiscal : {site.taxId}.
        </p>
      </div>
    </footer>
  )
}