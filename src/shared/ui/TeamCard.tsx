import type { TeamMember } from '../../data/contracts'

export interface TeamCardProps {
  member: TeamMember
  onReadMore?: (member: TeamMember) => void
}

function initials(fullName: string) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

export function TeamCard({ member, onReadMore }: TeamCardProps) {
  return (
    <article className="flex flex-col">
      <div className="aspect-4/5 w-full bg-seve overflow-hidden rounded-(--rayon-fiche)">
        {member.photoPath ? (
          <img
            src={member.photoPath}
            alt={`Portrait de ${member.fullName}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-h2 font-titre text-marine"
            aria-hidden="true"
          >
            {initials(member.fullName)}
          </div>
        )}
      </div>
      <h3 className="mt-4 text-h3 font-titre text-encre">{member.fullName}</h3>
      <p className="text-petit text-encre-douce">{member.displayTitle}</p>
      <p className="mt-2 text-corps text-encre-douce line-clamp-2">{member.shortBio}</p>
      {member.fullBio && onReadMore && (
        <button
          type="button"
          onClick={() => onReadMore(member)}
          className="mt-3 self-start text-petit font-semibold text-vert-cap underline underline-offset-[3px] hover:text-vert-cap-fonce"
        >
          Lire la présentation
        </button>
      )}
    </article>
  )
}