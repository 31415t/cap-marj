import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

export type ButtonVariant = 'primary' | 'secondary' | 'link'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center font-semibold text-petit transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-papier focus-visible:ring-offset-2 focus-visible:ring-offset-marine ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary:
    'h-12 px-6 rounded-[var(--rayon-controle)] bg-vert-cap text-papier hover:bg-vert-cap-fonce',
  secondary:
    'h-12 px-6 rounded-[var(--rayon-controle)] border-[1.5px] border-marine text-marine bg-transparent hover:bg-marine/5',
  link:
    'text-vert-cap underline underline-offset-[3px] hover:text-vert-cap-fonce px-0 h-auto',
}

function getClassName(variant: ButtonVariant, className: string) {
  return `${base} ${variants[variant]} ${className}`.trim()
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const cls = getClassName(variant, className)
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  )
}

export interface ButtonLinkProps extends Omit<LinkProps, 'to'> {
  to: string
  variant?: ButtonVariant
  className?: string
  children: ReactNode
}

export function ButtonLink({
  to,
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonLinkProps) {
  const cls = getClassName(variant, className)
  return (
    <Link to={to} className={cls} {...rest}>
      {children}
    </Link>
  )
}