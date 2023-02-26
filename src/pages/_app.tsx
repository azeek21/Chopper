import type { AppProps } from 'next/app'
import THEME from '@/styles/theme/theme'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from '@/styles/global'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <ThemeProvider theme={THEME['light']}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
    </>
  )
}
