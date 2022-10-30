import Head from "next/head";
import styles from "./index.module.css";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  Backdrop,
  Stack,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useRequest } from "../../hooks/useRequest";
import { RequestsList } from "../../components/RequestsList";
import useSWR from "swr";
import { Header } from "src/components/Header";

export default function Mass({ isAdmin }) {
  const [ids, setIds] = useState("");
  const [action, setAction] = useState("succes");
  const [loading, setLoading] = useState(false);
  const [notFounded, setNotFounded] = useState([]);
  const [notNeeded, setNotNeeded] = useState([]);
  const [showSuccess, setSuccess] = useState(false);
  const [unknonwError, setUnknonwError] = useState(false);
  const [nothingToChange, setNothingToChange] = useState(false);
  const request = useRequest();
  const { data, mutate } = useSWR("/api/requests", (url) =>
    request.get(url).then((response) => response.data)
  );

  const warningState = notNeeded.length || notFounded.length;

  const handleChange = useCallback((event) => {
    setAction(event.target.value);
  });

  const handleCloseAlert = useCallback(() => {
    setSuccess(false);
  }, []);

  const handleInputChange = useCallback(
    (event) => {
      setIds(event.target.value);

      notFounded.length && setNotFounded([]);
      notNeeded.length && setNotNeeded([]);
      setNothingToChange(false);
    },
    [notFounded, notNeeded]
  );

  const onClick = useCallback(() => {
    setLoading(true);

    request
      .post("/api/mass/", { ids, action, confirm: warningState })
      .then(() => {
        setNotFounded([]);
        setNotNeeded([]);
        setUnknonwError(false);
        setNothingToChange(false);
        setIds("");
        setSuccess(true);
        mutate();
      })
      .catch((error) => {
        const { data } = error.response || {};

        if (!data) {
          setUnknonwError(true);
        }

        setNothingToChange(data.nothingToChange);
        setNotFounded(data.notFounded || []);
        setNotNeeded(data.notNeeded || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [request, ids, action, warningState]);

  return (
    <>
      <Header />
      <div className={styles.page}>
        <Head>
          <title>Массовые изменения</title>
          <link rel="icon" href="/favicon-m.ico" />
        </Head>
        <main className={styles.content}>
          <Typography className={styles.title} variant="h3">
            Массовые изменения в СУЗ
          </Typography>
          <Typography className={styles.subtitle} variant="body1">
            Перечислите ID заказов <i>(через пробел)</i> и выберите что сделать.
          </Typography>
          <Typography className={styles.subtitle} variant="body1">
            Заявка отправится администратору и исполнится сразу после
            подтверждения.
          </Typography>
          <div className={styles.content}>
            <Stack spacing={2} direction="row">
              <TextField
                className={styles.input}
                id="outlined-multiline-static"
                label="ID заказов из СУЗ"
                placeholder="1234 4321 133 4000"
                value={ids}
                onChange={handleInputChange}
              />
              <Select value={action} onChange={handleChange} autoWidth>
                <MenuItem value="succes">Перевести в статус "Включен"</MenuItem>
                <MenuItem value="shutdown">
                  Перевести в статус "Отключен"
                </MenuItem>
                <MenuItem value="increase-priority">
                  Повысить приоритет
                </MenuItem>
                <MenuItem value="decrease-priority">
                  Понизить приоритет
                </MenuItem>
              </Select>
              <Button
                variant="outlined"
                disabled={loading || !ids}
                onClick={onClick}
                color={warningState ? "error" : "primary"}
              >
                Отправить
              </Button>
            </Stack>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
          <div className={styles.content}>
            {Boolean(notFounded.length) && (
              <Typography className={styles.warning} variant="body1">
                <b>Заказы не найдены:</b> {notFounded.join(", ")}
              </Typography>
            )}
            {Boolean(notNeeded.length) && (
              <Typography className={styles.warning} variant="body1">
                <b>Уже в этом статусе:</b> {notNeeded.join(", ")}
              </Typography>
            )}
            {nothingToChange && (
              <Typography className={styles.warning} variant="body1">
                Пустая заявка
              </Typography>
            )}
            {unknonwError && (
              <Typography color="error" variant="body1">
                <b>Что-то пошло не так</b>
              </Typography>
            )}
            {Boolean(warningState) && (
              <Typography variant="body2" color="primary">
                Нажмите еще раз "Отправить" и проблемные заказы будут исключены
                из заявки
              </Typography>
            )}
          </div>
          <RequestsList requests={data} refresh={mutate} isAdmin={isAdmin} />
          <Snackbar
            open={showSuccess}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
          >
            <Alert
              onClose={handleCloseAlert}
              severity="success"
              sx={{ width: "100%" }}
            >
              Заявка успешно отправлена
            </Alert>
          </Snackbar>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = async ({ res }) => {
  return {
    props: {
      fallback: {
        "/api/requests": res.locals.requests,
      },
      isAdmin: res.locals.__user.department.type === "admin",
    },
  };
};
