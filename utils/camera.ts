export const getCameraStream = () => {
  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "environment",
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 853, max: 1080 },
    },
    audio: false,
  });
};

// export const ;
