import { Stack, Typography } from "@mui/material";
import React from "react";

import { Header } from "src/components/Header";
import { AddCityButton } from "src/features/AddCityButton";
import { CitiesTable } from "src/features/CitiesTable";

import styles from "./index.module.css";

const Page = () => {
  return (
    <>
      <Header />
      <Stack className={styles.root} spacing={2}>
        <Typography variant="h4">Справочник городов</Typography>
        <AddCityButton />
        <CitiesTable />
      </Stack>
    </>
  );
};

export { Page as default };
