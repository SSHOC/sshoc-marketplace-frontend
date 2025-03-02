/** Needs to be imported in `src/pages/_app.tsx` so we can overwrite custom properties. */
// import 'react-toastify/dist/ReactToastify.css'

// import { useTheme } from '@stefanprobst/next-theme'
import { ToastContainer as ToastifyContainer } from 'react-toastify'

import { toastAutoCloseDelay } from '~/config/site.config'

export function ToastContainer(): JSX.Element {
  // const { theme } = useTheme()

  return (
    <ToastifyContainer
      autoClose={toastAutoCloseDelay}
      position="bottom-left"
      /** Theme colors are adjusted via css custom properties in `@/styles/toasts.css`. */
      // theme={theme ?? undefined}
      /** Use color theme, instead of light and dark themes. */
      theme="colored"
    />
  )
}
