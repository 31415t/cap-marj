import type { TimelineEvent } from '../../data/contracts'

export interface TimelineProps {
  events: TimelineEvent[]
}

function formatDate(iso: string) {
  // ISO partiel : "2017-10-10", "2018", "2020-03"
  const parts = iso.split('-')
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) {
    const [y, m] = parts
    const date = new Date(Number(y), Number(m) - 1)
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  }
  const [y, m, d] = parts
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) return null
  return (
    <ol className="relative border-l border-bordure ml-3 space-y-6">
      {events.map((e) => (
        <li key={e.id} className="pl-6 relative">
          <span
            aria-hidden="true"
            className={
              'absolute -left-[7px] top-1.5 rounded-full ' +
              (e.isMilestone
                ? 'w-3.5 h-3.5 bg-vert-cap'
                : 'w-2.5 h-2.5 mt-0.5 bg-bordure')
            }
          />
          <p className="text-petit text-encre-douce">{formatDate(e.date)}</p>
          <h3 className="text-h3 font-titre text-encre">{e.title}</h3>
          <p className="mt-1 text-corps text-encre-douce">{e.description}</p>
        </li>
      ))}
    </ol>
  )
}