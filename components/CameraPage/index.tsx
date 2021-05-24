import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { lofi, applyPresetOnCanvas } from "instagram-filters";
import classNames from "classnames";

import styles from "./CameraPage.module.scss";
import { getCameraStream } from "../../utils/camera";
import { loadImage } from "../../utils/promises";
import { PageState, useApp } from "../AppContext";
import { Button } from "../Common/Button";
import { AnimatePresence, motion } from "framer-motion";
import { basicFade, slideDown, slideUp } from "../../utils/animations";
import { useMediaQuery } from "../../utils/hooks/mediaQuery";

enum CameraOption {
  Camera = "camera",
  Upload = "upload",
}

const MAX_SIZE = 1400;

const CameraPage: React.FC = () => {
  const { photos, setPhotos, setPageState } = useApp();

  const isLarge = useMediaQuery("(min-width: 560px)");

  const [busy, setBusy] = useState(false);
  const [option, setOption] = useState<CameraOption>(CameraOption.Camera);
  const [imagePreview, setImagePreview] = useState<string>();
  const cameraRef = useRef<HTMLDivElement>(null);
  const cameraStream = useRef<MediaStream>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onVideoRef = useCallback((el: HTMLVideoElement) => {
    if (el) {
      getCameraStream()
        .then((stream) => {
          el.srcObject = stream;
          cameraStream.current = el.srcObject;
        })
        .catch(() => {
          setOption(CameraOption.Upload);
        });
    }
  }, []);

  const bootstrapFileTake = useCallback(() => {
    inputRef.current.click();
  }, []);

  const takePhoto = useCallback(async () => {
    if (!option) {
      return;
    }

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setBusy(true);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const isLive = option === CameraOption.Camera;
    const preview = cameraRef.current.querySelector(`.${styles.preview}`) as
      | HTMLVideoElement
      | HTMLImageElement;

    const width = isLive
      ? (preview as HTMLVideoElement).videoWidth
      : (preview as HTMLImageElement).naturalWidth;
    const height = isLive
      ? (preview as HTMLVideoElement).videoHeight
      : (preview as HTMLImageElement).naturalHeight;

    const isPortrait = width < height;

    if (!isPortrait) {
      canvas.width = MAX_SIZE;
      canvas.height = (MAX_SIZE / width) * height;
    } else {
      canvas.width = (MAX_SIZE / height) * width;
      canvas.height = MAX_SIZE;
    }

    const w = canvas.width;
    const h = canvas.height;

    const noise = await loadImage("/noise.png");

    if ("ImageCapture" in window && preview.tagName === "video") {
      const ic = new ImageCapture(
        (preview as any).srcObject.getVideoTracks()[0]
      );
      try {
        const bitmap = await createImageBitmap(
          await ic.takePhoto({
            fillLightMode: "auto",
            imageWidth: 1280,
            imageHeight: 853,
          })
        );
        ctx.drawImage(bitmap, 0, 0, w, h);
      } catch {
        ctx.drawImage(preview, 0, 0, w, h);
      }
    } else {
      ctx.drawImage(preview, 0, 0, w, h);
    }

    applyPresetOnCanvas(canvas, lofi());

    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.1;
    if (w > h) {
      ctx.drawImage(noise, 0, 0, w, w);
    } else {
      ctx.drawImage(noise, 0, 0, h, h);
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.45;
    const outerRadius = w * 0.5;
    const innerRadius = w * 0.1;
    const grd = ctx.createRadialGradient(
      w / 2,
      h / 2,
      innerRadius,
      w / 2,
      h / 2,
      outerRadius
    );
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(1, "rgba(0,0,0,1)");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    setPhotos((p) => [...p, canvas.toDataURL("image/jpeg")]);

    setBusy(false);

    // canvas.toBlob((blob) => saveAs(blob), "image/jpeg", 1);
  }, [option]);

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOption(CameraOption.Upload);

      if (e.target.files.length) {
        const fr = new FileReader();
        fr.addEventListener(
          "load",
          () => {
            setImagePreview(fr.result as string);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                takePhoto();
              });
            });
          },
          false
        );
        fr.readAsDataURL(e.target.files[0]);
      }
    },
    [takePhoto]
  );

  useEffect(() => {
    if (photos.length >= 10) {
      setPageState(PageState.Develop);
    }
  }, [photos.length]);

  useEffect(() => {
    return () => {
      cameraStream.current &&
        cameraStream.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const onAdvance = useCallback(() => {
    setPageState(PageState.Develop);
  }, []);

  return (
    <motion.div {...basicFade}>
      <div className={classNames(styles.container, { [styles.busy]: busy })}>
        <div className={styles.flash}>
          <span>Capturing</span>
        </div>
        <div ref={cameraRef} className={styles.camera}>
          <div className={styles.img} />

          <div className={styles.counter}>{photos.length}</div>

          {option === CameraOption.Camera && (
            <video
              ref={onVideoRef}
              className={styles.preview}
              playsInline
              autoPlay
            />
          )}

          {option === CameraOption.Upload && imagePreview && (
            <img className={styles.preview} src={imagePreview} alt="" />
          )}

          <label className={styles.clicker}>
            <span
              className={classNames(styles.clickerHelp, {
                [styles.show]: photos.length === 0,
              })}
            >
              Take photo →
            </span>
            <button
              disabled={busy}
              className={styles.clickerBtn}
              onClick={
                option === CameraOption.Camera ? takePhoto : bootstrapFileTake
              }
            >
              <span className="visually-hidden">Take photo</span>
            </button>
          </label>
        </div>

        {option === CameraOption.Upload && (
          <div className={styles.options}>
            <div>
              <label>
                <input
                  ref={inputRef}
                  disabled={busy}
                  type="file"
                  accept="image/*"
                  onChange={onFileInput}
                />
                <span className={styles.btn}>Upload photo</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {photos.length > 0 && (
          <motion.button
            {...(!isLarge ? slideDown : slideUp)}
            disabled={busy}
            className={styles.advance}
            onClick={onAdvance}
          >
            Develop {photos.length} {photos.length > 1 ? "photos" : "photo"}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export { CameraPage };
