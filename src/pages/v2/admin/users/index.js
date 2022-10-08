import { Button, Stack, Toolbar, Typography } from "@mui/material";
import React from "react";

import { Header } from "src/components/Header";
import { UsersTable } from "src/features/UsersTable";

import styles from "./index.module.css";

const Page = () => {
  return (
    <>
      <Header />
      <Stack className={styles.root} spacing={2}>
        <Typography variant="h4">Управление пользователями</Typography>
        <Button
          sx={{ width: 220 }}
          variant="contained"
          color="primary"
          href="/admin/users/add"
        >
          Создать пользователя
        </Button>

        <UsersTable />
      </Stack>
    </>
  );
};

export { Page as default };
