import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { format, toDate } from "date-fns";
import styles from "../styles/pages/Photos.module.scss";
import { api } from "../utils/api";
import { Button } from "../components/Common/Button";
import { PageState, useApp } from "../components/AppContext";

interface PhotosObject {
  email: string;
  developDate: number;
  developDateFull: number;
  files: string;
  urls: string[];
  sent: boolean;
  id: string;
}

export default function Photos() {
  const router = useRouter();
  const { setPhotos, setPageState } = useApp();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<PhotosObject | undefined>();

  useEffect(() => {
    const photosId = router.query.receipt;

    if (photosId) {
      setPhotos([]);
      setPageState(PageState.Main);

      api.photos
        .get(photosId)
        .then((data) => {
          if (!data.status) {
            throw new Error("err");
          }

          setItem(data.item);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [router.query]);

  const hasDeveloped = useMemo(() => {
    if (!item) {
      return false;
    }

    const d = toDate(item.developDateFull);
    d.setHours(0, 0, 0, 0);

    return d.getTime() < new Date().getTime();
  }, [item]);

  return (
    <main className={styles.main}>
      {loading && <span className={styles.loading}>Loading</span>}
      {error && !loading && (
        <div className={styles.error}>
          <h2 className={styles.title}>Uh Oh</h2>
          <p>Can't seem to find record of your photos</p>
          <p>
            Feel free to get in touch if you think thats wrong –{" "}
            <a href="mailto:hi@jthaw.me?subject=dispo issue">Email me</a>
          </p>
          <Button to="/">Or take some new ones</Button>
        </div>
      )}
      {!loading && !error && item && !hasDeveloped && (
        <div className={styles.display}>
          <h2 className={styles.title}>Not quite developed yet mate</h2>
          <div className={styles.content}>
            <p>Check back sometime in the future, not sure when&nbsp;really.</p>
          </div>

          <div className={styles.cta}>
            <Button to="/">Take some more</Button>
          </div>
        </div>
      )}
      {!loading && !error && item && hasDeveloped && (
        <div className={styles.display}>
          <h2 className={styles.title}>
            Developed on {format(new Date(item.developDateFull), "dd/MM/yy")}
          </h2>
          <p>
            I'm sure it was worth the wait. We're having NEW AGE FUN with a
            VINTAGE FEEL!
          </p>

          <div className={styles.images}>
            {item.urls.map((url) => (
              <a
                href={url.split("+").join("%2").split("@").join("%40")}
                download
                className={styles.image}
              >
                <img
                  src={url.split("+").join("%2").split("@").join("%40")}
                  alt=""
                />
              </a>
            ))}
          </div>

          <div className={styles.cta}>
            <Button to="/">Take some more</Button>
          </div>
        </div>
      )}
    </main>
  );
}
