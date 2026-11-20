import type { ReactNode } from 'react'

export interface BadgeProps {
  children: ReactNode
  className?: string
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={
        'inline-block bg-seve text-marine text-petit px-3 py-1 rounded-(--rayon-fiche) ' +
        className
      }
    >
      {children}
    </span>
  )
}