import Head from "next/head";
import classNames from "classnames";

import { AppContainer } from "../components/AppContext";
import JTLogo from "../components/Common/JTLogo";
import { Background } from "../components/Common/Background";

import "../styles/globals.scss";
import styles from "../styles/pages/Layout.module.scss";
import { LogoWrap } from "../components/Common/LogoWrap";
import { useEffect } from "react";
import { registerBootlegVH } from "../utils/utils";
import { AboutOverlay } from "../components/AboutOverlay";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    registerBootlegVH();
  }, []);

  return (
    <AppContainer>
      <Head>
        <title>Dispo-but-slow</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@500&display=swap"
          rel="stylesheet"
        />

        <meta property="og:title" content="Dispo-but-slow" />
        <meta
          property="og:description"
          content="A site that promises to develop your photos slower than other competitors"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dispo.jthaw.club" />
        <meta
          property="og:image"
          content="https://dispo.jthaw.club/social.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@jthawme" />
        <meta name="twitter:title" />
        <meta property="twitter:url" content="https://dispo.jthaw.club" />
        <meta
          name="twitter:description"
          content="A site that promises to develop your photos slower than other competitors"
        />
        <meta
          name="twitter:image"
          content="https://dispo.jthaw.club/social.png"
        />
        <script
          async
          defer
          data-domain="dispo.jthaw.club"
          src="https://plausible.io/js/plausible.js"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible = window.plausible || function() {
              (window.plausible.q = window.plausible.q || []).push(arguments)
            }`,
          }}
        />
      </Head>
      <Background />
      <AboutOverlay />

      <Component {...pageProps} />

      <LogoWrap />
    </AppContainer>
  );
}

export default MyApp;
