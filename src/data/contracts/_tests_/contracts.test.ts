import { describe, it, expect } from 'vitest'
import {
  ServiceSchema,
  OrganisationSchema,
  AxeSchema,
  TeamMemberSchema,
  FaqItemSchema,
} from '..'
import services from '../../seed/services.json'
import organisation from '../../seed/organisation.json'
import axes from '../../seed/axes.json'
import equipe from '../../seed/equipe.json'
import faq from '../../seed/faq.json'

describe('contrats — validation du seed', () => {
  it("valide l'organisation", () => {
    expect(() => OrganisationSchema.parse(organisation)).not.toThrow()
  })

  it('valide les 4 axes', () => {
    expect(axes).toHaveLength(4)
    axes.forEach((a) => expect(() => AxeSchema.parse(a)).not.toThrow())
  })

  it('valide les 9 membres de l\'équipe', () => {
    expect(equipe).toHaveLength(9)
    equipe.forEach((m) => expect(() => TeamMemberSchema.parse(m)).not.toThrow())
  })

  it('valide les 5 services', () => {
    expect(services).toHaveLength(5)
    services.forEach((s) => expect(() => ServiceSchema.parse(s)).not.toThrow())
  })

  it('valide les questions de la FAQ', () => {
    expect(faq.length).toBeGreaterThan(0)
    faq.forEach((f) => expect(() => FaqItemSchema.parse(f)).not.toThrow())
  })

  it('les positions sont uniques et croissantes par collection', () => {
    const positions = (arr: { position: number }[]) => arr.map((x) => x.position).sort((a, b) => a - b)
    expect(new Set(positions(axes)).size).toBe(axes.length)
    expect(new Set(positions(equipe)).size).toBe(equipe.length)
    expect(new Set(positions(services)).size).toBe(services.length)
  })

  it('les slugs de services sont uniques et valides', () => {
    const slugs = services.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/))
  })

  it('tous les services V0 sont de type "request"', () => {
    services.forEach((s) => expect(s.workflowType).toBe('request'))
  })
})