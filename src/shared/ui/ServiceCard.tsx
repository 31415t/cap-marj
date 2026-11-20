import type { Service } from '../../data/contracts'
import { Button } from './Button'

export interface ServiceCardProps {
  service: Service
  onAction?: (service: Service) => void
}

function formatPrice(amount: number, currency: 'HTG' | 'USD') {
  const n = new Intl.NumberFormat('fr-FR').format(amount)
  return currency === 'HTG' ? `${n} G` : `${n} $`
}

export function ServiceCard({ service, onAction }: ServiceCardProps) {
  const hasInclusions = service.inclusions.length > 0
  const hasPrice = service.isPaid && service.priceAmount != null
  const hasPriceNote = !service.isPaid && service.priceNote != null

  return (
    <article className="border border-bordure rounded-(--rayon-fiche) p-6 flex flex-col gap-3">
      <h3 className="text-h3 font-titre text-encre">{service.name}</h3>
      <p className="text-corps text-encre-douce">{service.summary}</p>
      {service.audience && (
        <p className="text-petit text-encre-douce">
          <span className="font-semibold text-encre">Pour : </span>
          {service.audience}
        </p>
      )}
      {hasInclusions && (
        <div>
          <p className="text-petit font-semibold text-encre">Ce qui est inclus :</p>
          <ul className="mt-1 space-y-1 text-petit text-encre-douce list-disc list-inside">
            {service.inclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {(hasPrice || hasPriceNote) && (
        <p className="text-h3 font-titre text-encre">
          {hasPrice
            ? formatPrice(service.priceAmount as number, service.priceCurrency)
            : service.priceNote}
        </p>
      )}
      <div className="mt-auto pt-2">
        <Button
          onClick={() => onAction?.(service)}
          aria-label={`${service.ctaLabel} — ${service.name}`}
        >
          {service.ctaLabel}
        </Button>
      </div>
    </article>
  )
}