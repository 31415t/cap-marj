import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { TeamMember } from '../../data/contracts'

function initials(fullName: string) {
  return fullName.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('')
}

export interface TeamCardProps {
  member: TeamMember
}

export function TeamCard({ member }: TeamCardProps) {
  return (
    <Link
      to={`/equipe/${member.slug}`}
      className="flex flex-col group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine focus-visible:ring-offset-2 focus-visible:ring-offset-papier rounded-[var(--rayon-fiche)]"
    >
      <div className="aspect-[4/5] w-full bg-seve overflow-hidden rounded-[var(--rayon-fiche)]">
        {member.photoPath ? (
          <img src={member.photoPath} alt={`Portrait de ${member.fullName}`} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-h2 font-titre text-marine" aria-hidden="true">
            {initials(member.fullName)}
          </div>
        )}
      </div>
      <h3 className="mt-4 text-h3 font-titre text-encre group-hover:text-vert-cap">{member.fullName}</h3>
      <p className="text-petit text-encre-douce">{member.displayTitle}</p>
      <p className="mt-2 text-corps text-encre-douce line-clamp-2">{member.shortBio}</p>
      <span className="mt-3 inline-flex items-center gap-2 text-petit font-semibold text-vert-cap group-hover:text-vert-cap-fonce">
        Voir le profil complet
        <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
      </span>
    </Link>
  )
}