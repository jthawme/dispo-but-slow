import classNames from "classnames";
import { useRouter } from "next/router";
import { PageState, useApp } from "../../AppContext";
import JTLogo from "../JTLogo";

import styles from "./LogoWrap.module.scss";

const LogoWrap = () => {
  const { pageState } = useApp();
  const router = useRouter();
  return (
    <a
      href="https://jthaw.me"
      target="_blank"
      className={classNames(styles.logo, {
        [styles.show]: pageState === PageState.Main || router.pathname !== "/",
      })}
    >
      <span>Made by</span>
      <JTLogo color="#232323" width={48} height={48} />
    </a>
  );
};

export { LogoWrap };
