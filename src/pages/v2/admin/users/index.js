import { Button, Stack, Typography } from "@mui/material";
import React from "react";

import AddIcon from "@mui/icons-material/Add";

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
          sx={{ width: 240 }}
          variant="contained"
          color="primary"
          href="/admin/users/add"
          startIcon={<AddIcon />}
        >
          Создать пользователя
        </Button>

        <UsersTable />
      </Stack>
    </>
  );
};

export { Page as default };
