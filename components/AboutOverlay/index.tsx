import React, { useEffect, useRef } from "react";
import classNames from "classnames";

import styles from "./AboutOverlay.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../AppContext";
import { clickOutside } from "../../utils/utils";
import { basicFadeQuick } from "../../utils/animations";
import { ReactComponent as LogoSvg } from "../../assets/logo.svg";

const AboutInner = () => {
  const { setAboutOpen } = useApp();
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return clickOutside(aboutRef.current, () => {
      setAboutOpen(false);
    });
  });

  return (
    <motion.div {...basicFadeQuick} ref={aboutRef} className={styles.about}>
      <button className={styles.close} onClick={() => setAboutOpen(false)}>
        Close
      </button>
      <LogoSvg className={styles.svg} />
      <p>
        An app that takes your photos, makes them all vintage-like, then gives
        them to you weeks later. Sounds exciting right?
      </p>
      <h3>Privacy</h3>
      <p>
        By supplying your e-mail you are agreeing to the secure storage of it
        along with the photos that you take. If you want to remove any data,
        don't hesitate to get in touch with me and tell me the data you want
        removing - hi@jthaw.me
      </p>
    </motion.div>
  );
};

const AboutOverlay = () => {
  const { aboutOpen } = useApp();

  return <AnimatePresence>{aboutOpen && <AboutInner />}</AnimatePresence>;
};

export { AboutOverlay };
