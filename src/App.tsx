import type { RouteRecord } from 'vite-react-ssg'
import { DesignPage } from './features/dev/DesignPage'

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: () => (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>CAP-MARJ — V0</h1>
        <p>Codespaces + vite-react-ssg : le pré-rendu statique fonctionne.</p>
      </div>
    ),
  },
  { path: '/', Component: () => <div>...</div> },
  ...(import.meta.env.DEV ? [{ path: '/dev/design', Component: DesignPage }] : []),
]