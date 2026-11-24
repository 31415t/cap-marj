import { useEffect, useState } from 'react'
import { getContentRepository } from '../../data'
import type { Service } from '../../data/contracts'
import { site } from '../../config/site'
import { EmergencyNotice } from '../../shared/ui/EmergencyNotice'
import { ContactForm } from './ContactForm'

export function ContactPage() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    getContentRepository().listServices().then(setServices)
  }, [])

  return (
    <article className="py-8 space-y-10">
      <header className="space-y-4">
        <h1 className="text-h1 font-titre text-encre">Contact</h1>
        <p className="text-lead text-encre-douce max-w-[var(--mesure)]">
          Écrivez-nous pour toute question, prise de rendez-vous ou demande d'information.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

        <div className="md:col-span-7">
          <h2 className="text-h2 font-titre text-marine mb-4">Formulaire de contact</h2>
          <ContactForm services={services} />
        </div>

        <div className="md:col-span-5 space-y-6">
          <section className="space-y-2">
            <h2 className="text-h2 font-titre text-marine">Coordonnées</h2>
            <p className="text-corps text-encre-douce">
              {site.address}<br />
              <a href={`mailto:${site.contactEmail}`} className="text-vert-cap underline underline-offset-[3px]">
                {site.contactEmail}
              </a><br />
              {site.phones.map((phone, index) => (
                <span key={phone}>
                  <a href={`tel:${phone}`} className="text-vert-cap underline underline-offset-[3px]">{phone}</a>
                  {index < site.phones.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </p>
          </section>

          <EmergencyNotice phones={[...site.phones]} />
        </div>
      </div>
    </article>
  )
}
