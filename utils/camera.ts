export const getCameraStream = () => {
  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "environment",
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 576, ideal: 720, max: 1080 },
    },
    audio: false,
  });
};

// export const ;
