// src/features/team/TeamPage.tsx
import { useEffect, useState } from 'react'
import { getContentRepository } from '../../data'
import type { TeamMember } from '../../data/contracts'
import { TeamCard } from '../../shared/ui/TeamCard'

export function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    getContentRepository().listTeam().then(setTeam)
  }, [])

  return (
    <section className="py-8 space-y-6">
      <h1 className="text-h1 font-titre text-encre">L'équipe</h1>
      Derrière le CAP-MARJ, il y a une équipe de cadres et de professionnels issus de la psychologie, de la médecine, de la recherche, du droit, de l'éducation et de l'action communautaire. Leurs parcours et leurs fonctions se complètent : c'est cette diversité qui permet au centre de proposer un accompagnement à la fois psychologique, académique, scientifique et communautaire.
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((m) => <TeamCard key={m.id} member={m} />)}
      </div>
    </section>
  )
}