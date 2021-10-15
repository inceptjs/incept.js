import { CacheProvider } from '@emotion/react'
import { ChakraProvider } from '@chakra-ui/react'

import theme from './theme'
import createEmotionCache from './createEmotionCache'

export default function ShhakraLayout({ children }) {
  const cache = createEmotionCache()
  return (
    <CacheProvider value={cache}>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}