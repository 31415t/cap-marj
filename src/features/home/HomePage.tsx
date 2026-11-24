import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getContentRepository } from '../../data'
import type { Axe, FaqItem, Service, TeamMember, Organisation } from '../../data/contracts'
import { Button } from '../../shared/ui/Button'
import { AxisBlock } from '../../shared/ui/AxisBlock'
import { ServiceCard } from '../../shared/ui/ServiceCard'
import { TeamCard } from '../../shared/ui/TeamCard'
import { Accordion } from '../../shared/ui/Accordion'
import { EmergencyNotice } from '../../shared/ui/EmergencyNotice'

interface HomePageData {
  org: Organisation | null
  axes: Axe[]
  services: Service[]
  team: TeamMember[]
  faq: FaqItem[]
}

const emptyHomePageData: HomePageData = {
  org: null,
  axes: [],
  services: [],
  team: [],
  faq: [],
}

let cachedHomePageData: HomePageData | undefined

export function HomePage() {
  const [data, setData] = useState<HomePageData>(
    () => cachedHomePageData ?? emptyHomePageData,
  )

  useEffect(() => {
    const repo = getContentRepository()
    Promise.all([
      repo.getOrganisation(),
      repo.listAxes(),
      repo.listServices(),
      repo.listTeam(),
      repo.listFaq(),
    ]).then(([org, axes, services, team, faq]) => {
      const loadedData = { org, axes, services, team, faq }
      cachedHomePageData = loadedData
      setData(loadedData)
    })
  }, [])

  return (
    <>
      <Hero />
      <AxesSection axes={data.axes} />
      <ServicesSection services={data.services} />
      <AboutSection org={data.org} />
      <TeamPreview team={data.team.slice(0, 4)} />
      <FaqSection faq={data.faq} />
      <ContactSection />
    </>
  )
}

function Hero() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-4 md:py-8">
      <div className="md:col-span-7 space-y-6">
        <h1 className="text-h1 font-titre text-encre">
          Centre d'Appui Psycho-Médical
        </h1>
        <p className="text-lead text-encre-douce max-w-(--mesure)">
          Depuis 2017, le CAP-MARJ accompagne les personnes et les communautés du
          Nord-Ouest : santé globale, recherche, entrepreneuriat social et engagement
          communautaire.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/contact"><Button>Nous contacter</Button></Link>
          <Link to="/#services"><Button variant="secondary">Découvrir nos services</Button></Link>
        </div>
      </div>
      <div className="md:col-span-5">
        <div className="aspect-16/10 bg-marine rounded-(--rayon-fiche) overflow-hidden">
          <img src="/images/equipe/Eventpicture1.jpg" alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  )
}

function AxesSection({ axes }: { axes: Axe[] }) {
  if (axes.length === 0) return null
  return (
    <section className="py-12 border-t border-bordure">
      <h2 className="text-h2 font-titre text-marine mb-6">Les quatre axes du centre</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {axes.map((a) => <AxisBlock key={a.id} axe={a} />)}
      </div>
    </section>
  )
}

function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="services" className="py-12 bg-brume -mx-4 md:-mx-6 px-4 md:px-6">
      <div className="mx-auto" style={{ maxWidth: 'var(--largeur-page)' }}>
        <h2 className="text-h2 font-titre text-marine mb-6">Nos services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
          <div className="border border-bordure rounded-(--rayon-fiche) p-6 flex flex-col justify-center">
            <p className="text-corps text-encre-douce">
              Vous ne savez pas quel service choisir ? Écrivez-nous, nous vous orienterons.
            </p>
            <Link to="/contact" className="mt-3">
              <Button variant="secondary">Nous contacter</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutSection({ org }: { org: Organisation | null }) {
  if (!org) return null
  return (
    <section className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-7 space-y-4">
        <h2 className="text-h2 font-titre text-marine">Le centre en bref</h2>
        <p className="text-corps text-encre-douce max-w-(--mesure)">
          Fondé le 10 octobre 2017 à Port-de-Paix, le CAP-MARJ accompagne les personnes et
          les communautés du Nord-Ouest autour de quatre axes : santé globale, recherche
          intégrée, entrepreneuriat social et engagement communautaire. Le centre réunit
          une équipe pluridisciplinaire au service du bien-être individuel et collectif.
        </p>
        <Link to="/a-propos">
          <Button variant="secondary">En savoir plus sur le centre</Button>
        </Link>
      </div>
      <div className="md:col-span-5">
        <div className="aspect-4/3 bg-seve rounded-(--rayon-fiche) flex items-center justify-center">
          <span className="text-marine text-petit">Photo du centre (à venir)</span>
        </div>
      </div>
    </section>
  )
}

function TeamPreview({ team }: { team: TeamMember[] }) {
  if (team.length === 0) return null
  return (
    <section className="py-12 border-t border-bordure">
      <h2 className="text-h2 font-titre text-marine mb-6">L'équipe</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((m) => <TeamCard key={m.id} member={m} />)}
      </div>
      <div className="mt-8">
        <Link to="/equipe">
          <Button variant="secondary">Voir toute l'équipe</Button>
        </Link>
      </div>
    </section>
  )
}

function FaqSection({ faq }: { faq: FaqItem[] }) {
  if (faq.length === 0) return null
  return (
    <section id="faq" className="py-12">
      <h2 className="text-h2 font-titre text-marine mb-6">Questions fréquentes</h2>
      <Accordion items={faq.map((f) => ({ question: f.question, answer: f.answer }))} />
    </section>
  )
}

function ContactSection() {
  return (
    <section className="py-12 border-t border-bordure grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-5 space-y-4">
        <h2 className="text-h2 font-titre text-marine">Contact</h2>
        <p className="text-corps text-encre-douce">
          Écrivez-nous pour toute question, prise de rendez-vous ou demande d'information.
        </p>
        <EmergencyNotice phones={[]} />
        <Link to="/contact"><Button>Nous contacter</Button></Link>
      </div>
      <div className="md:col-span-7">
        <div className="border border-bordure rounded-(--rayon-fiche) p-6 text-encre-douce text-petit">
          Le formulaire de contact complet est disponible sur la page{' '}
          <Link to="/contact" className="text-vert-cap underline underline-offset-[3px]">Contact</Link>.
        </div>
      </div>
    </section>
  )
}