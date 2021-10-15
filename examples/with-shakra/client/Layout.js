import React from 'react'
import { CacheProvider } from '@emotion/react'
import { ChakraProvider } from '@chakra-ui/react'

import theme from './theme'
import createEmotionCache from './createEmotionCache'

export default function Layout({ children }) {
  const cache = createEmotionCache()
  return (
    <div>
      <CacheProvider value={cache}>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </CacheProvider>
    </div>
  )
}