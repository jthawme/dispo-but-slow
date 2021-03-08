import { AnimatePresence, motion } from "framer-motion";
import { PageState, useApp } from "../components/AppContext";

import { IntroAnimation } from "../components/IntroAnimation";
import { CameraPage } from "../components/CameraPage";
import { DevelopPage } from "../components/DevelopPage";
import styles from "../styles/pages/Home.module.scss";

export default function Home() {
  const { pageState } = useApp();

  return (
    <main className={styles.main}>
      <AnimatePresence>
        {pageState === PageState.Intro && <IntroAnimation key="intro" />}
        {pageState === PageState.Main && <CameraPage key="camera" />}
        {pageState === PageState.Develop && <DevelopPage key="develop" />}
      </AnimatePresence>
    </main>
  );
}
