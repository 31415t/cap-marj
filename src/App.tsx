import type { RouteRecord } from 'vite-react-ssg'
import { PageLayout } from './shared/ui/PageLayout'
import { HomePage } from './features/home/HomePage'
import { DesignPage } from './features/dev/DesignPage'
import { TeamPage } from './features/team/TeamPage'
import { TeamMemberPage } from './features/team/TeamMemberPage'
import equipeSeed from './data/seed/equipe.json'
import { AboutPage } from './features/about/AboutPage'
import { LegalPage } from './features/legal/LegalPage'
import { PrivacyPage } from './features/legal/PrivacyPage'
import { NotFoundPage } from './features/not-found/NotFoundPage'
import { ContactPage } from './features/contact/ContactPage'
import { Outlet, ScrollRestoration } from 'react-router-dom'

function RootLayout() {
  return (
    <PageLayout>
      <ScrollRestoration />
      <Outlet />
    </PageLayout>
  )
}

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'equipe', Component: TeamPage },
      {
  path: 'equipe/:slug',
  Component: TeamMemberPage,
  getStaticPaths: () => equipeSeed.map((m) => `/equipe/${m.slug}`),
},
      { path: 'contact', Component: ContactPage },
      { path: 'a-propos', Component: AboutPage },
{ path: 'mentions-legales', Component: LegalPage },
{ path: 'confidentialite', Component: PrivacyPage },
{ path: '*', Component: NotFoundPage },
    ],
  },
  ...(import.meta.env.DEV
    ? [{ path: '/dev/design', Component: DesignPage }]
    : []),
]