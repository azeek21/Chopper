import type { AppProps } from 'next/app'
import THEME from '@/styles/theme/theme'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from '@/styles/global'
import Header from '@/components/header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <ThemeProvider theme={THEME['light']}>
      <GlobalStyle />
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
    </>
  )
}
