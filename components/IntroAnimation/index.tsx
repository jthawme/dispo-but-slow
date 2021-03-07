import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { ReactComponent as LogoSvg } from "../../assets/logo.svg";

import styles from "./IntroAnimation.module.scss";
import { timer } from "../../utils/promises";
import { PageState, useApp } from "../AppContext";

const IntroAnimation: React.FC = () => {
  const { setPageState } = useApp();

  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const setNext = (idx) => {
      setActiveIndex(-1);

      return timer(500).then(() => setActiveIndex(idx));
    };
    timer(500)
      .then(() => setNext(0))
      .then(() => timer(2500))
      .then(() => setNext(1))
      .then(() => timer(2500))
      .then(() => setNext(2))
      .then(() => timer(3500))
      .then(() => setPageState(PageState.Main));
  }, []);

  return (
    <div className={styles.stage}>
      <h2
        className={classNames(styles.title, {
          [styles.active]: 0 === activeIndex,
        })}
      >
        IF WAITING ONE DAY
        <br />
        FOR PHOTOS IS EXCITING
      </h2>
      <h2
        className={classNames(styles.title, {
          [styles.active]: 1 === activeIndex,
        })}
      >
        IMAGINE 1-6 WEEKS
      </h2>
      <h1
        className={classNames(styles.title, {
          [styles.active]: 2 === activeIndex,
        })}
      >
        <span className="visually-hidden">Dispo but slow</span>
        <LogoSvg className={styles.svg} />
      </h1>
    </div>
  );
};

export { IntroAnimation };
