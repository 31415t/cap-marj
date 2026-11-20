import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './App'
import '@fontsource-variable/literata/wght.css'
import '@fontsource-variable/public-sans/wght.css'
import './index.css'

export const createRoot = ViteReactSSG({ routes })