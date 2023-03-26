import Footer from "@/components/footer";
import Header from "@/components/header";
import { GlobalStyle } from "@/styles/global";
import THEME from "@/styles/theme/theme";
import { getCookie } from "@/utils/cookie";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "styled-components";

const Qclient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // TODO: this will be login popup soon
    // setTimeout(() => {
    //   if (getCookie()?.noCookie) {
    //     setPopup(true);
    //   }
    // }, 10000);

    const essentialCookie = async () => {
      if (getCookie()?.noCookie && !pageProps.session) {
        try {
          await (await fetch("/api/new-user")).json();
        } catch (error) {
          alert(
            "FATAL: maybe you don't have internet connection. Please, try reloading the page. If error persists plase report it to pymanuz@gmail.com. I'll reply ASAP."
          );
        }
      }
    };

    essentialCookie();
  }, []);

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={Qclient}>
          <ThemeProvider theme={THEME["light"]}>
            <GlobalStyle />
            <Header />
            <Component {...pageProps} />
            <Footer />
          </ThemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
