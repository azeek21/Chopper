import type { AppProps } from 'next/app'
import THEME from '@/styles/theme/theme'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from '@/styles/global'
import Header from '@/components/header'
import Cookie from '@/components/cookie-popup'
import { useEffect, useState } from 'react'
import Cookies from "js-cookie";

export default function App({ Component, pageProps }: AppProps) {
  const [popup, setPopup] = useState(false);


  useEffect(() => {
  
    setTimeout( () => {
      const showCookie = () => {
        const noCookie = Cookies.get('no-cookie');
        const uid = Cookies.get('weak-uid');
        if (uid || noCookie) {
          return false;
        }
        return true;
      };
      if (showCookie()) {
        setPopup(true);
      }
    }  ,10000)
  
  }, [])

  return (
    <>
    <ThemeProvider theme={THEME['light']}>
      <GlobalStyle />
      <Header />
      <Component {...pageProps} />
      {popup && <Cookie />}
    </ThemeProvider>
    </>
  )
}
