import { Button } from '../../shared/ui/Button'
import { Badge } from '../../shared/ui/Badge'
import { EmergencyNotice } from '../../shared/ui/EmergencyNotice'
import { Field } from '../../shared/ui/Field'
import { Accordion } from '../../shared/ui/Accordion'
import { site } from '../../config/site'
import { useEffect, useState } from 'react'
import { getContentRepository } from '../../data'
import type { Service, TeamMember, Axe } from '../../data/contracts'
import { AxisBlock } from '../../shared/ui/AxisBlock'
import { TeamCard } from '../../shared/ui/TeamCard'
import { ServiceCard } from '../../shared/ui/ServiceCard'

export function DesignPage() {
  const [services, setServices] = useState<Service[]>([])
const [team, setTeam] = useState<TeamMember[]>([])
const [axes, setAxes] = useState<Axe[]>([])

useEffect(() => {
  const repo = getContentRepository()
  repo.listServices().then(setServices)
  repo.listTeam().then(setTeam)
  repo.listAxes().then(setAxes)
}, [])
  return (
    <div
      className="p-8 space-y-12 bg-papier text-encre"
      style={{ maxWidth: 'var(--largeur-page)' }}
    >
      <header className="space-y-2">
        <h1 className="text-h1 font-titre text-encre">Design system — CAP-MARJ</h1>
        <p className="text-lead text-encre-douce">
          Page de démonstration des composants partagés de la V0. Visible uniquement en
          développement.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-h2 font-titre text-marine">Boutons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Nous contacter</Button>
          <Button variant="secondary">Découvrir nos services</Button>
          <Button variant="link">En savoir plus</Button>
          <Button disabled>Désactivé</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-h2 font-titre text-marine">Champs</h2>
        <div className="max-w-md space-y-4">
          <Field label="Courriel" type="email" placeholder="vous@exemple.com" help="Nous ne partagerons jamais votre adresse." />
          <Field label="Nom" error="Ce champ est obligatoire." />
          <Field as="textarea" label="Message" help="10 à 4000 caractères." />
          <Field as="select" label="Service concerné">
            <option value="">— Choisir —</option>
            <option value="consultation">Consultation psychologique</option>
            <option value="recherche">Recherche intégrée</option>
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-h2 font-titre text-marine">Badge « Bientôt »</h2>
        <Badge>Bientôt</Badge>
      </section>

      <section className="space-y-4">
        <h2 className="text-h2 font-titre text-marine">Mention d'urgence</h2>
        <EmergencyNotice phones={[...site.phones]} />
      </section>

      <section className="space-y-4">
        <h2 className="text-h2 font-titre text-marine">Questions fréquentes</h2>
        <Accordion
          items={[
            { question: 'Comment prendre contact avec le CAP-MARJ ?', answer: 'Via le formulaire de contact, par téléphone ou par WhatsApp.' },
            { question: 'Quels services propose le centre ?', answer: 'Cinq services : consultation, accompagnement académique, recherche, formation, engagement communautaire.' },
          ]}
        />
      </section>

      <section className="space-y-4">
  <h2 className="text-h2 font-titre text-marine">Axes (seed)</h2>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {axes.map((a) => <AxisBlock key={a.id} axe={a} />)}
  </div>
</section>

<section className="space-y-4">
  <h2 className="text-h2 font-titre text-marine">Fiches équipe (seed)</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {team.map((m) => (
      <TeamCard key={m.id} member={m} onReadMore={(mm) => alert(`Ouvrir ${mm.fullName}`)} />
    ))}
  </div>
</section>

<section className="space-y-4">
  <h2 className="text-h2 font-titre text-marine">Fiches service (seed)</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {services.map((s) => (
      <ServiceCard key={s.id} service={s} onAction={(ss) => alert(`Action ${ss.name}`)} />
    ))}
  </div>
</section>
    </div>
  )
}