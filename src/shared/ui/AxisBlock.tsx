import type { Axe } from '../../data/contracts'

export interface AxisBlockProps {
  axe: Axe
}

export function AxisBlock({ axe }: AxisBlockProps) {
  return (
    <div className="px-4 md:px-6 md:border-l md:border-bordure first:md:border-l-0 first:md:pl-0">
      <h3 className="text-h3 font-titre text-encre">{axe.name}</h3>
      <p className="mt-2 text-corps text-encre-douce">{axe.summary}</p>
    </div>
  )
}