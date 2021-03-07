import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { useApp } from "../AppContext";
import { Button } from "../Common/Button";

import styles from "./DevelopPage.module.scss";

function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}

const DevelopPage: React.FC = () => {
  const { push } = useRouter();
  const { photos } = useApp();
  const [saving, setSaving] = useState(false);
  const [savingStep, setSavingStep] = useState(0);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();

    (e.target as HTMLFormElement).blur();

    const fd = new FormData(e.target);
    const email = fd.get("email");

    setSaving(true);

    const d = new Date().getTime();
    const images = await Promise.all(
      photos.map((p, i) => urltoFile(p, `${email}-${d}-${i}.jpg`, "image/jpeg"))
    );
    setSavingStep(0);

    // let token;
    // api.token
    //   .get("save")
    //   .then((data) => {
    //     token = data.token;
    Promise.resolve()
      .then(() => {
        return api.uploads.getUrls(images.map((img) => img.name));
      })
      .then(({ urls }) => {
        setSavingStep(1);
        return Promise.all(
          images.map((imgFile, idx) => {
            return fetch(urls[idx], {
              method: "PUT",
              body: imgFile,
              headers: {
                "Content-Type": imgFile.type,
                "Content-Disposition": "attachment",
              },
            });
          })
        );
      })
      .then(() => {
        setSavingStep(2);
        return api.uploads.saveData(
          email as string,
          images.map((img) => img.name)
        );
      })
      .then(({ id }) => {
        push(`/photos?receipt=${id}`);
      })
      .finally(() => {
        setSaving(false);
      });
  }, []);

  return (
    <>
      <form
        onSubmit={onSubmit}
        className={classNames(styles.container, { [styles.uploading]: saving })}
      >
        <p>I can get these back to you, sometime in the next 1-6 weeks.</p>
        <p>
          Just going to need an e-mail address and I'll send them across no
          problem
        </p>
        <p>
          <label className={styles.label}>
            <span className={styles.title}>E-mail address</span>
            <input
              disabled={saving}
              type="email"
              name="email"
              placeholder="E-mail"
            />
          </label>
        </p>
        <p>
          <Button disabled={saving}>Let's do it</Button>
        </p>
        {saving && (
          <div className={styles.saving}>
            <div
              className={styles.savingBar}
              style={{ "--percentage": savingStep / 3 } as React.CSSProperties}
            >
              <div className={styles.savingBarTrack} />
            </div>
            <div className={styles.savingInfo}>Uploading photos...</div>
          </div>
        )}
      </form>
    </>
  );
};

export { DevelopPage };
