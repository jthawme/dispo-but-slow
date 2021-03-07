import { PageState, useApp } from "../components/AppContext";

import { IntroAnimation } from "../components/IntroAnimation";
import { CameraPage } from "../components/CameraPage";
import { DevelopPage } from "../components/DevelopPage";
import styles from "../styles/pages/Home.module.scss";

export default function Home() {
  const { pageState } = useApp();

  return (
    <main className={styles.main}>
      {pageState === PageState.Intro && <IntroAnimation />}
      {pageState === PageState.Main && <CameraPage />}
      {pageState === PageState.Develop && <DevelopPage />}
    </main>
  );
}
