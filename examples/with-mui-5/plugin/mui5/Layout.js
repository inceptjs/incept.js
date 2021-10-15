import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'

import theme from './theme'
import createEmotionCache from './createEmotionCache'

export default function MUI5Layout({ children }) {
  const cache = createEmotionCache()
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}