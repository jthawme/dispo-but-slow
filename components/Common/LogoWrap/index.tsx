import classNames from "classnames";
import { useRouter } from "next/router";
import { useMediaQuery } from "../../../utils/hooks/mediaQuery";
import { PageState, useApp } from "../../AppContext";
import JTLogo from "../JTLogo";

import styles from "./LogoWrap.module.scss";

const LogoWrap = () => {
  const { pageState } = useApp();
  const isTablet = useMediaQuery("(min-width: 560px)");

  const router = useRouter();
  return (
    <a
      href="https://jthaw.me"
      target="_blank"
      className={classNames(styles.logo, {
        [styles.show]: pageState === PageState.Main || router.pathname !== "/",
        [styles.big]: isTablet,
      })}
    >
      <span>Made by</span>
      <JTLogo
        color="#232323"
        width={isTablet ? 48 : 32}
        height={isTablet ? 48 : 32}
      />
    </a>
  );
};

export { LogoWrap };
