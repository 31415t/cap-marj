// src/features/team/TeamMemberPage.tsx
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getContentRepository } from '../../data'
import type { TeamMember } from '../../data/contracts'
import { ArrowLeft } from 'lucide-react'

export function TeamMemberPage() {
  const { slug } = useParams<{ slug: string }>()
  const [member, setMember] = useState<TeamMember | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    getContentRepository()
      .listTeam()
      .then((team) => {
        const found = team.find((m) => m.slug === slug)
        if (found) setMember(found)
        else setNotFound(true)
      })
  }, [slug])

  if (notFound) {
    return (
      <div className="py-12 text-center space-y-4">
        <h1 className="text-h2 font-titre text-encre">Membre introuvable</h1>
        <Link
  to="/equipe"
  className="inline-flex items-center gap-2 text-petit text-vert-cap hover:text-vert-cap-fonce"
>
  <ArrowLeft className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
  Toute l'équipe
</Link>
      </div>
    )
  }

  if (!member) return <p className="py-12 text-encre-douce">Chargement…</p>

  return (
    <article className="py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-4">
        <div className="aspect-[4/5] w-full bg-seve rounded-[var(--rayon-fiche)] overflow-hidden">
          {member.photoPath ? (
            <img src={member.photoPath} alt={`Portrait de ${member.fullName}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-h2 font-titre text-marine" aria-hidden="true">
              {member.fullName.split(' ').slice(0, 2).map((w) => w[0]).join('')}
            </div>
          )}
        </div>
      </div>
      <div className="md:col-span-8 space-y-4">
        <Link to="/equipe" className="text-petit text-vert-cap underline underline-offset-[3px]">← Toute l'équipe</Link>
        <h1 className="text-h1 font-titre text-encre">{member.fullName}</h1>
        <p className="text-lead text-encre-douce">{member.displayTitle}</p>
        {member.fullBio && <p className="text-corps text-encre-douce max-w-[var(--mesure)]">{member.fullBio}</p>}
      </div>
    </article>
  )
}