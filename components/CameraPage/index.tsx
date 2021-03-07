import React, { useCallback, useEffect, useRef, useState } from "react";
import { lofi, applyPresetOnCanvas } from "instagram-filters";
import classNames from "classnames";

import styles from "./CameraPage.module.scss";
import { getCameraStream } from "../../utils/camera";
import { loadImage } from "../../utils/promises";
import { PageState, useApp } from "../AppContext";
import { Button } from "../Common/Button";

enum CameraOption {
  Camera = "camera",
  Upload = "upload",
}

const MAX_SIZE = 1400;

const CameraPage: React.FC = () => {
  const { photos, setPhotos, setPageState } = useApp();

  const [option, setOption] = useState<CameraOption>();
  const [imagePreview, setImagePreview] = useState<string>();
  const cameraRef = useRef<HTMLDivElement>(null);
  const cameraStream = useRef<MediaStream>(null);

  const onVideoRef = useCallback((el: HTMLVideoElement) => {
    if (el) {
      getCameraStream().then((stream) => {
        el.srcObject = stream;
        cameraStream.current = el.srcObject;
      });
    }
  }, []);

  const takePhoto = useCallback(async () => {
    if (!option) {
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const isLive = option === CameraOption.Camera;
    const preview = cameraRef.current.querySelector(`.${styles.preview}`) as
      | HTMLVideoElement
      | HTMLImageElement;

    const width = isLive
      ? (preview as HTMLVideoElement).videoWidth
      : (preview as HTMLImageElement).width;
    const height = isLive
      ? (preview as HTMLVideoElement).videoHeight
      : (preview as HTMLImageElement).height;

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

    ctx.drawImage(preview, 0, 0, w, h);

    applyPresetOnCanvas(canvas, lofi());

    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.1;
    ctx.drawImage(noise, 0, 0, w, w);
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
          },
          false
        );
        fr.readAsDataURL(e.target.files[0]);
      }
    },
    [takePhoto]
  );

  useEffect(() => {
    if (option === CameraOption.Upload && cameraStream.current) {
      cameraStream.current.getTracks().forEach((t) => t.stop());
    }
  }, [option]);

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
    <div className={styles.container}>
      <div ref={cameraRef} className={styles.camera}>
        <img className={styles.img} src="/camera.png" alt="" />

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
          <button className={styles.clickerBtn} onClick={takePhoto}>
            <span className="visually-hidden">Take photo</span>
          </button>
        </label>
      </div>

      <div className={styles.mobileOptions}>
        {option !== CameraOption.Camera ? (
          <Button onClick={() => setOption(CameraOption.Camera)}>
            Use camera
          </Button>
        ) : (
          <Button onClick={takePhoto}>Take photo</Button>
        )}
      </div>

      <div className={styles.options}>
        <div>
          <button
            className={styles.btn}
            onClick={() => setOption(CameraOption.Camera)}
          >
            Use camera
          </button>
        </div>
        <div>OR</div>
        <div>
          <label>
            <input type="file" accept="image/*" onChange={onFileInput} />
            <span className={styles.btn}>Upload photo</span>
          </label>
        </div>
      </div>

      {photos.length > 0 && (
        <div className={styles.advance}>
          <Button onClick={onAdvance}>
            Develop {photos.length} {photos.length > 1 ? "photos" : "photo"}
          </Button>
        </div>
      )}
    </div>
  );
};

export { CameraPage };
