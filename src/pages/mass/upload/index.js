import { useCallback, useState } from "react";
import Head from "next/head";
import {
  Typography,
  Button,
  Input,
  CircularProgress,
  Backdrop,
  Link,
} from "@mui/material";
import { request } from "../../../lib/request";
import { ErrorList } from "../../../components/ErrorList";

import styles from "./index.module.css";
import { Header } from "src/components/Header";

const texts = {
  VALIDATE_ERROR: "Ошибка валидации таблицы",
  PARSING_ERROR: "Некорректный файл",
};

export default function Upload() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorCode, setErrorCode] = useState(null);
  const [needAproove, setNeedApproove] = useState(false);
  const [draftFile, setFile] = useState(null);
  const [orders, setOrders] = useState([]);

  const onChangeFile = useCallback((e) => {
    setLoading(true);
    setOrders([]);

    const file = e.target.files[0];
    setFile(file);

    const formData = new FormData();

    formData.append("xlsx", file, file.name);

    request
      .post("/api/mass/upload", formData)
      .then((data) => {
        setNeedApproove(true);
        setErrorCode(null);
        setErrors([]);
      })
      .catch((error) => {
        const { code, data } = error.response.data;

        setNeedApproove(false);
        setErrorCode(code);
        setErrors(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onAproove = useCallback(() => {
    setLoading(true);
    const formData = new FormData();

    formData.append("xlsx", draftFile, draftFile.name);

    request
      .post("/api/mass/import", formData, { timeout: 20000 })
      .then(({ data }) => {
        setNeedApproove(false);
        setOrders(data.orders);
      })
      .catch((error) => {
        setErrorCode("UNKNOWN_ERROR");
        console.error(error);
        console.error(error.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [draftFile]);

  return (
    <>
      <Header />
      <div className={styles.page}>
        <Head>
          <title>Массовая загрзука</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon-m.ico" />
        </Head>
        <main className={styles.content}>
          <Typography className={styles.title} variant="h3">
            Массовая загрузка заявок
          </Typography>
          <Typography className={styles.subtitle} variant="body1">
            На данный момент возможна загрузка заявок в статус проработки через
            этот{" "}
            <Link underline="hover" target="_blank" href={"/template.xlsx"}>
              шаблон
            </Link>
            .
          </Typography>
          <Typography className={styles.subtitle} variant="body1">
            И в статус "Включен" через этот{" "}
            <Link
              underline="hover"
              target="_blank"
              href={"/template-enable.xlsx"}
            >
              шаблон
            </Link>
            .
          </Typography>
          <Typography className={styles.subtitle} variant="body1">
            1. Скачайте шаблон.
          </Typography>
          <Typography className={styles.subtitle} variant="body1">
            2. Заполните табличку нужными данными.
          </Typography>
          <div className={styles.row}>
            <Typography className={styles.subtitle} variant="body1">
              3. Загрузите файл:
            </Typography>
            <label style={{ display: "inline-block" }} htmlFor="file-upload">
              {!loading && (
                <Input
                  style={{ display: "none" }}
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  id="file-upload"
                  type="file"
                  onChange={onChangeFile}
                />
              )}
              <Button variant="contained" component="span">
                Выбрать файл
              </Button>
            </label>
          </div>
          <Typography className={styles.subtitle} variant="body1">
            4. Исправьте ошибки (если есть) и подтвердите загрузку.
          </Typography>
          <Typography className={styles.subtitle} variant="body2">
            Если что-то не работает, или чего-то не хватает для решения ваших
            задач – можно писать в{" "}
            <Link
              underline="hover"
              href="https://t.me/+ZgFTaQAUnRwzZDE6"
              target="_blank"
            >
              телеграмм-чат
            </Link>
            .
          </Typography>
          <div className={styles.content}>
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            {errorCode && (
              <Typography className={styles.title} variant="h5">
                {texts[errorCode] || errorCode}
              </Typography>
            )}
            {Boolean(errors && errors.length) && <ErrorList data={errors} />}
            {needAproove && (
              <div className={styles.row}>
                <Typography className={styles.subtitle} variant="body1">
                  Ошибок, нет, загружаем?
                </Typography>
                <Button variant="contained" color="success" onClick={onAproove}>
                  Да
                </Button>
              </div>
            )}
            {orders.length > 0 && (
              <Typography className={styles.subtitle} variant="body1">
                Успешно созданно {orders.length} заказов:
              </Typography>
            )}
            {orders.map((id) => (
              <>
                <Link
                  key={id}
                  underline="hover"
                  href={`/order/${id}`}
                  target="_blank"
                >
                  {id}
                </Link>{" "}
              </>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
