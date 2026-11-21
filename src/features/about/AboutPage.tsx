import { useEffect, useState } from 'react'
import { getContentRepository } from '../../data'
import type { Axe, Organisation, Service, TimelineEvent } from '../../data/contracts'
import { AxisBlock } from '../../shared/ui/AxisBlock'
import { Timeline } from '../../shared/ui/Timeline'

function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <details open={defaultOpen} className="group border-b border-bordure py-4">
      <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-h2 font-titre text-marine">
        <span>{title}</span>
        <span aria-hidden="true" className="text-encre-douce transition-transform group-open:rotate-45 text-h3">+</span>
      </summary>
      <div className="mt-4 space-y-4">{children}</div>
    </details>
  )
}

export function AboutPage() {
  const [org, setOrg] = useState<Organisation | null>(null)
  const [axes, setAxes] = useState<Axe[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])

  useEffect(() => {
    const repo = getContentRepository()
    repo.getOrganisation().then(setOrg)
    repo.listAxes().then(setAxes)
    repo.listServices().then(setServices)
    repo.listTimeline().then(setTimeline)
  }, [])

  return (
    <article className="py-8 space-y-8">
      <header className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 space-y-4">
          <h1 className="text-h1 font-titre text-encre">À propos du CAP-MARJ</h1>
          <p className="text-lead text-encre-douce max-w-[var(--mesure)]">
            Centre d'Appui Psycho-Médical Jean Renold Alphonse, fondé le 10 octobre 2017 à
            Port-de-Paix, dans le département du Nord-Ouest. Le centre intervient autour de
            quatre axes complémentaires : santé globale, recherche intégrée,
            entrepreneuriat social et engagement communautaire.
          </p>
        </div>
        <div className="md:col-span-5">
          <div className="aspect-[4/3] bg-seve rounded-[var(--rayon-fiche)] flex items-center justify-center">
            <span className="text-marine text-petit">Photo du centre (à venir)</span>
          </div>
        </div>
      </header>

      <div>
        <Section title="Identité et mission" defaultOpen>
          {org && (
            <p className="text-corps text-encre-douce max-w-[var(--mesure)]">{org.history}</p>
          )}
        </Section>

        <Section title="Les quatre axes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {axes.map((a) => <AxisBlock key={a.id} axe={a} />)}
          </div>
        </Section>

        <Section title="Services">
          <ul className="space-y-2 text-corps text-encre-douce max-w-[var(--mesure)]">
            {services.map((s) => (
              <li key={s.id}>
                <span className="font-semibold text-encre">{s.name}</span> — {s.summary}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Organisation et branches">
          <p className="text-corps text-encre-douce max-w-[var(--mesure)]">
            Le centre s'organise en branches complémentaires : Santé mentale, Recherche,
            Affaires sanitaires, et fonctions support (logistique et finances, communication
            et numérique, relations publiques, archives et documentation). Les membres de
            l'équipe et leurs fonctions sont présentés sur la page Équipe.
          </p>
        </Section>

        <Section title="Historique">
          <Timeline events={timeline} />
        </Section>

        <Section title="Chiffres clés">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[var(--mesure)]">
            <div>
              <dt className="text-petit text-encre-douce">Date de création</dt>
              <dd className="text-h3 font-titre text-encre">10 octobre 2017</dd>
            </div>
            <div>
              <dt className="text-petit text-encre-douce">Membres de l'équipe</dt>
              <dd className="text-h3 font-titre text-encre">9</dd>
            </div>
            <div>
              <dt className="text-petit text-encre-douce">Axes d'intervention</dt>
              <dd className="text-h3 font-titre text-encre">4</dd>
            </div>
          </dl>
        </Section>
      </div>
    </article>
  )
}