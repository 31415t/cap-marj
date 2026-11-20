import type { ButtonHTMLAttributes, ReactNode } from 'react'

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

export function Button({
  variant = 'primary',
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`.trim()
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  )
}