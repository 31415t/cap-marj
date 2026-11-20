export interface EmergencyNoticeProps {
  phones?: string[]
}

export function EmergencyNotice({ phones = [] }: EmergencyNoticeProps) {
  return (
    <aside
      role="note"
      aria-label="Mention d'urgence"
      className="border border-marine bg-brume text-encre p-4 rounded-(--rayon-fiche) text-petit space-y-2"
    >
      <p className="font-semibold text-marine">En cas d'urgence</p>
      <p>
        Le CAP-MARJ ne peut pas répondre aux urgences par le site. En cas de danger
        immédiat, contactez les secours ou rendez-vous au service d'urgence le plus
        proche.
      </p>
      {phones.length > 0 && (
        <p>
          Numéros du centre :{' '}
          {phones.map((p, i) => (
            <span key={p}>
              <a href={`tel:${p}`} className="text-vert-cap underline underline-offset-[3px]">
                {p}
              </a>
              {i < phones.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </p>
      )}
    </aside>
  )
}