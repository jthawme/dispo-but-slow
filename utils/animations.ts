const slideUpVariants = {
  out: {
    y: "100%",
    transition: {
      duration: 0.5,
    },
  },
  in: {
    y: "0%",
    transition: {
      duration: 0.5,
    },
  },
};

const slideDownVariants = {
  out: {
    y: "-100%",
    transition: {
      duration: 0.5,
    },
  },
  in: {
    y: "0%",
    transition: {
      duration: 0.5,
    },
  },
};

const fadeVariants = {
  out: {
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
  in: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.5,
    },
  },
};

const fadeVariantsQuick = {
  out: {
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
  in: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const baseProps = {
  initial: "out",
  animate: "in",
  exit: "out",
};

export const slideUp = {
  ...baseProps,
  variants: slideUpVariants,
};

export const slideDown = {
  ...baseProps,
  variants: slideDownVariants,
};

export const basicFade = {
  ...baseProps,
  variants: fadeVariants,
};
export const basicFadeQuick = {
  ...baseProps,
  variants: fadeVariantsQuick,
};
