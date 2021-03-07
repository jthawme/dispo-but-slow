import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import styles from "./ComponentSwitch.module.scss";

interface ComponentSwitchProps {
  name: string;
  children: React.ReactElement;
}

const ComponentSwitch: React.FC<ComponentSwitchProps> = ({
  name,
  children,
}) => {
  const lastKey = useRef<string>(name);
  const [currentChild, setCurrentChild] = useState(children);
  const [display, setDisplay] = useState(true);
  const timerRef = useRef<number>(-1);

  useEffect(() => {
    if (name !== lastKey.current) {
      lastKey.current = name;

      setDisplay(false);

      clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setCurrentChild(children);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setDisplay(true);
          });
        });
      }, 350);
    } else if (display) {
      setCurrentChild(children);
    }
  }, [name, display, children]);

  return React.cloneElement(currentChild, {
    className: classNames(
      styles.switch,
      { [styles.display]: display },
      currentChild.props.className
    ),
  });
};

export { ComponentSwitch };
