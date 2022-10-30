import Head from "next/head";
import useSWR from "swr";

import { Typography } from "@mui/material";

import styles from "./index.module.css";
import { fetcher } from "../../lib/request";
import React from "react";
import { Header } from "src/components/Header";

const Page = () => {
  const { data, error } = useSWR("/api/analytics", fetcher);

  if (error) {
    return (
      <>
        <Head>
          <title>Аналитика</title>
        </Head>
        <Header />
        <main className={styles.root}>Ошибка при подсчете аналитики</main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Аналитика</title>
      </Head>
      <Header />
      <main className={styles.root}>
        <div>
          <Typography variant="h4" color="primary">
            Средний срок организации
          </Typography>
          <div className={styles.section}>
            <Typography variant="body1">ГЗП:</Typography>
            <Typography variant="body1">
              {data && data.gzpBuild.value} д.
            </Typography>
            <Typography variant="body1">
              Заявок: {data && data.gzpBuild.count}
            </Typography>
          </div>
          <div className={styles.section}>
            <Typography variant="body1">СТОП:</Typography>
            <Typography variant="body1">
              {data && data.stopBuild.value} д.
            </Typography>
            <Typography variant="body1">
              Заявок: {data && data.stopBuild.count}
            </Typography>
          </div>
        </div>
        <div>
          <Typography variant="h4" marginTop={4} color="primary">
            Средний срок проработки
          </Typography>
          <div className={styles.section}>
            <Typography variant="body1">ГЗП:</Typography>
            <Typography variant="body1">
              {data && data.gzpPre.value} д.
            </Typography>
            <Typography variant="body1">
              Заявок: {data && data.gzpPre.count}
            </Typography>
          </div>
          <div className={styles.section}>
            <Typography variant="body1">СТОП:</Typography>
            <Typography variant="body1">
              {data && data.stopPre.value} д.
            </Typography>
            <Typography variant="body1">
              Заявок: {data && data.stopPre.count}
            </Typography>
          </div>
        </div>
      </main>
    </>
  );
};

export { Page as default };
