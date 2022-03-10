/** Needs to be imported in `src/pages/_app.page.tsx` so we can overwrite custom properties. */
// import 'react-toastify/dist/ReactToastify.css'

// import { useTheme } from '@stefanprobst/next-theme'
import { ToastContainer as ToastifyContainer } from 'react-toastify'

export function ToastContainer(): JSX.Element {
  // const { theme } = useTheme()

  return (
    <ToastifyContainer
      /** Theme colors are adjusted via css custom properties in `@/styles/toasts.css`. */
      // theme={theme ?? undefined}
      /** Use color theme, instead of light and dark themes. */
      theme="colored"
      // toastClassName={({ type }) => {}}
      // bodyClassName={() => {}}
    />
  )
}
