import { useEffect, useState } from "react";

export const useMediaQuery = (mqString: string, initial = false) => {
  const [matches, setMatches] = useState<boolean>(initial);

  useEffect(() => {
    const mq = window.matchMedia(mqString);

    const cb = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mq.addListener(cb);

    setMatches(mq.matches);

    return () => mq.removeListener(cb);
  }, []);

  return matches;
};
