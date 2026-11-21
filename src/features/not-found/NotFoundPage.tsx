import { Link } from 'react-router-dom'
import { Button } from '../../shared/ui/Button'

export function NotFoundPage() {
  return (
    <div className="py-16 text-center space-y-6">
      <h1 className="text-h1 font-titre text-encre">Page introuvable</h1>
      <p className="text-lead text-encre-douce">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/"><Button>Retour à l'accueil</Button></Link>
        <Link to="/#services"><Button variant="secondary">Voir les services</Button></Link>
      </div>
    </div>
  )
}