import { useId } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

type CommonProps = {
  label: string
  help?: string
  error?: string
  className?: string
}

type InputProps = CommonProps & InputHTMLAttributes<HTMLInputElement> & { as?: 'input' }
type TextareaProps = CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' }
type SelectProps = CommonProps & SelectHTMLAttributes<HTMLSelectElement> & {
  as: 'select'
  children: ReactNode
}

export type FieldProps = InputProps | TextareaProps | SelectProps

export function Field(props: FieldProps) {
  const { label, help, error, className = '', as = 'input', id: idProp, ...rest } = props as any
  const reactId = useId()
  const id = idProp ?? reactId
  const helpId = help ? `${id}-help` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined

  const controlCls =
    'w-full h-12 px-3 rounded-[var(--rayon-controle)] border bg-papier text-encre ' +
    (error ? 'border-erreur' : 'border-[var(--bordure-champ)]') +
    ' focus:outline-none focus:ring-2 focus:ring-marine focus:border-marine ' +
    (as === 'textarea' ? 'h-auto min-h-32 py-3' : '')

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={id} className="block text-petit font-semibold text-encre">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          className={controlCls}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === 'select' ? (
        <select
          id={id}
          className={controlCls}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {(props as SelectProps).children}
        </select>
      ) : (
        <input
          id={id}
          className={controlCls}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {help && !error && (
        <p id={helpId} className="text-petit text-encre-douce">{help}</p>
      )}
      {error && (
        <p id={errorId} className="text-petit text-erreur" role="alert">{error}</p>
      )}
    </div>
  )
}