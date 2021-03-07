import React from "react";
import classNames from "classnames";

import styles from "./Button.module.scss";
import { InternalExternalLink } from "../InternalExternalLink";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLSpanElement> {
  className?: string;
  to?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  to,
  className,
  ...props
}) => {
  if (to) {
    return (
      <InternalExternalLink
        to={to}
        className={classNames(styles.button, className)}
        {...props}
      >
        {children}
      </InternalExternalLink>
    );
  }
  return (
    <button className={classNames(styles.button, className)} {...props}>
      {children}
    </button>
  );
};

export { Button };
