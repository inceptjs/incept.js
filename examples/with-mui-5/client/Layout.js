import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'

import theme from './theme'
import createEmotionCache from './createEmotionCache'

export default function Layout({ children }) {
  const cache = createEmotionCache()
  return (
    <div>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </div>
  )
}