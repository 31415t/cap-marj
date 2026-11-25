import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useActiveSection } from '../useActiveSection'

describe('useActiveSection', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
  })

  it('observe les sections ajoutées après le montage', async () => {
    const observedTargets: Element[] = []

    class TestIntersectionObserver {
      constructor(private callback: IntersectionObserverCallback) {}

      observe(target: Element) {
        observedTargets.push(target)
        this.callback(
          [
            {
              target,
              isIntersecting: true,
              boundingClientRect: target.getBoundingClientRect(),
            } as IntersectionObserverEntry,
          ],
          this as unknown as IntersectionObserver,
        )
      }

      unobserve() {}
      disconnect() {}
    }

    vi.stubGlobal('IntersectionObserver', TestIntersectionObserver)

    const services = document.createElement('section')
    services.id = 'services'
    services.getBoundingClientRect = () => ({ top: -200 }) as DOMRect
    document.body.append(services)

    const { result } = renderHook(() => useActiveSection(['services', 'faq']))
    await waitFor(() => expect(result.current).toBe('services'))

    const faq = document.createElement('section')
    faq.id = 'faq'
    faq.getBoundingClientRect = () => ({ top: 100 }) as DOMRect
    await act(async () => {
      document.body.append(faq)
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    await waitFor(() => expect(result.current).toBe('faq'))
    expect(observedTargets).toContain(faq)
  })
})
