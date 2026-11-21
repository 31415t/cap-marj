import type { RouteRecord } from 'vite-react-ssg'
import { Outlet } from 'react-router-dom'
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
import { ScrollToTop } from './shared/ui/ScrollToTop'

const Placeholder = ({ title }: { title: string }) => (
  <>
    <h1 className="text-h1 font-titre text-encre">{title}</h1>
    <p className="mt-4 text-lead text-encre-douce">Page à construire en V0-D.</p>
  </>
)

function RootLayout() {
  return (
    <PageLayout>
      <ScrollToTop />
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
      { path: 'contact', Component: () => <Placeholder title="Contact" /> },
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