import React from "react";
import classNames from "classnames";

import styles from "./Background.module.scss";

/**
 * The cool thing about the background is that its just 3 circle
 * rotating in a very basic animation, just blurred like crazy
 */

const Background: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={classNames(styles.circle, styles.one)} />
      <div className={classNames(styles.circle, styles.two)} />
      <div className={classNames(styles.circle, styles.three)} />
    </div>
  );
};

export { Background };
