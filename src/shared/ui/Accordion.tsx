export interface AccordionItem {
  question: string
  answer: string
}

export interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export function Accordion({ items, className = '' }: AccordionProps) {
  return (
    <div className={`divide-y divide-bordure border-y border-bordure ${className}`}>
      {items.map((item) => (
        <details key={item.question} className="group py-3">
          <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-encre">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="text-encre-douce transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-2 text-encre-douce">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}