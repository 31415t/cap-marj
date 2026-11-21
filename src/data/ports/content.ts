import type { Organisation, Axe, TeamMember, Service, FaqItem, TimelineEvent } from '../contracts'

export interface ContentRepository {
  getOrganisation(): Promise<Organisation>
  listAxes(): Promise<Axe[]>
  listTeam(): Promise<TeamMember[]>
  listServices(): Promise<Service[]>
  listFaq(): Promise<FaqItem[]>
  listTimeline(): Promise<TimelineEvent[]>
}