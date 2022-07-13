import "../styles/globals.css";
import "../firebase";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { NextUIProvider } from "@nextui-org/react";


function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
