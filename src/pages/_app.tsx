import type { AppProps } from "next/app";
import THEME from "@/styles/theme/theme";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "@/styles/global";
import Header from "@/components/header";
import Cookie from "@/components/cookie-popup";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookie";
import { QueryClient, QueryClientProvider } from "react-query";
import Footer from "@/components/footer";

const Qclient = new QueryClient();

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
    <QueryClientProvider client={Qclient}>
      <ThemeProvider theme={THEME["light"]}>
          <GlobalStyle />
          <Header />
          <Component {...pageProps} />
          {popup && <Cookie />}
          <Footer />
      </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
