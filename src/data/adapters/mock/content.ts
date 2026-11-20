import type { ContentRepository } from '../../ports/content'
import {
  OrganisationSchema, AxeSchema, TeamMemberSchema, ServiceSchema, FaqItemSchema,
} from '../../contracts'
import organisationRaw from '../../seed/organisation.json'
import axesRaw from '../../seed/axes.json'
import teamRaw from '../../seed/equipe.json'
import servicesRaw from '../../seed/services.json'
import faqRaw from '../../seed/faq.json'

const organisation = OrganisationSchema.parse(organisationRaw)
const axes = axesRaw.map((x) => AxeSchema.parse(x))
const team = teamRaw.map((x) => TeamMemberSchema.parse(x))
const services = servicesRaw.map((x) => ServiceSchema.parse(x))
const faq = faqRaw.map((x) => FaqItemSchema.parse(x))

export function createMockContentRepository(): ContentRepository {
  return {
    getOrganisation: async () => organisation,
    listAxes: async () => axes.filter((a) => a.isPublished).sort((a, b) => a.position - b.position),
    listTeam: async () => team.filter((m) => m.isPublished).sort((a, b) => a.position - b.position),
    listServices: async () => services.filter((s) => s.isPublished).sort((a, b) => a.position - b.position),
    listFaq: async () => faq.filter((f) => f.isPublished).sort((a, b) => a.position - b.position),
  }
}