export const timer = (time = 1000) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), time);
  });
};

export const loadImage = (src): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.src = src;
  });
};
