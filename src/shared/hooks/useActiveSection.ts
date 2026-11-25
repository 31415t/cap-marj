import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds: string[], options?: { rootMargin?: string }) {
  const idsKey = sectionIds.join(',')
  const [activeSection, setActiveSection] = useState<{
    idsKey: string
    id: string | null
  }>({ idsKey: '', id: null })

  useEffect(() => {
    if (!idsKey) return

    const activationOffset = 64
    const observed = new Map<HTMLElement, boolean>()
    const updateActiveSection = () => {
      const visible = [...observed]
        .filter(([, isIntersecting]) => isIntersecting)
        .map(([element]) => element)
        .sort(
          (a, b) =>
            Math.abs(a.getBoundingClientRect().top - activationOffset) -
            Math.abs(b.getBoundingClientRect().top - activationOffset),
        )

      setActiveSection({ idsKey, id: visible[0]?.id ?? null })
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement
        if (observed.has(element)) observed.set(element, entry.isIntersecting)
      })

      updateActiveSection()
    }, {
      threshold: 0,
      rootMargin: options?.rootMargin ?? `-${activationOffset}px 0px -50% 0px`,
    })

    const syncObservedSections = () => {
      const currentElements = new Set(
        idsKey
          .split(',')
          .map((id) => document.getElementById(id))
          .filter((element): element is HTMLElement => element !== null),
      )

      let removedElement = false
      for (const element of observed.keys()) {
        if (!currentElements.has(element)) {
          observer.unobserve(element)
          observed.delete(element)
          removedElement = true
        }
      }

      if (removedElement) updateActiveSection()

      currentElements.forEach((element) => {
        if (!observed.has(element)) {
          observed.set(element, false)
          observer.observe(element)
        }
      })
    }

    const mutationObserver = new MutationObserver(syncObservedSections)
    mutationObserver.observe(document.body, { childList: true, subtree: true })
    syncObservedSections()

    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [idsKey, options?.rootMargin])

  return activeSection.idsKey === idsKey ? activeSection.id : null
}