import type { AppProps } from "next/app";
import THEME from "@/styles/theme/theme";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "@/styles/global";
import Header from "@/components/header";
import Cookie from "@/components/cookie-popup";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookie";
import StoreProvider from "@/GlobalRedux/provider";

export default function App({ Component, pageProps }: AppProps) {
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (!getCookie()) {
        setPopup(true);
      }
    }, 10000);
  }, []);

  return (
    <>
      <ThemeProvider theme={THEME["light"]}>
        <StoreProvider>
          <GlobalStyle />
          <Header />
          <Component {...pageProps} />
          {/* {popup && <Cookie />} */}
        </StoreProvider>
      </ThemeProvider>
    </>
  );
}
