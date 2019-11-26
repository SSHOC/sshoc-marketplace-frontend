import React, { createContext, useContext } from 'react'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components/macro'
import { useLocalStorage } from '../utils'
import { theme } from './theme'

const ColorModeContext = createContext()

export const useColorMode = () => useContext(ColorModeContext)

export const ThemeProvider = ({ children }) => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
    .matches

  const [colorMode, setColorMode] = useLocalStorage(
    'colorMode',
    prefersDarkMode ? 'dark' : 'light'
  )

  const colors = theme.colors.modes && theme.colors.modes[colorMode]
  const currentTheme = { ...theme, colors: { ...theme.colors, ...colors } }

  return (
    <StyledComponentsThemeProvider theme={currentTheme}>
      <ColorModeContext.Provider value={[colorMode, setColorMode]}>
        {children}
      </ColorModeContext.Provider>
    </StyledComponentsThemeProvider>
  )
}
