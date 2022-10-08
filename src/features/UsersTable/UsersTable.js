import React from "react";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useUsersTable } from "./hooks/useUsersTable";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Typography,
} from "@mui/material";

export const UsersTable = () => {
  const {
    columns,
    rows,
    loading,
    onEdit,
    deleteDialogOpened,
    onCloseDialog,
    onAgreeDelete,
    successSnackbarOpened,
    errorSnackbarOpened,
    onSnackbarClose,

    resetDialogOpened,
    onAgreeReset,

    onError,
  } = useUsersTable();

  return (
    <div style={{ height: 700 }}>
      <DataGrid
        loading={loading}
        density="compact"
        editMode="cell"
        getRowId={(item) => item._id}
        rows={rows}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        disableDensitySelector
        processRowUpdate={onEdit}
        experimentalFeatures={{ newEditingApi: true }}
        onProcessRowUpdateError={onError}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
      />
      <Dialog open={deleteDialogOpened} onClose={onCloseDialog}>
        <DialogTitle>Удалить пользователя?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Доступ к учетной записи будет ограничен. Данные о пользователе будут
            сохранены в системе. Логин пользователя станет доступным для новых
            учетных записей
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog}>Отмена</Button>
          <Button color="error" onClick={onAgreeDelete}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={resetDialogOpened} onClose={onCloseDialog}>
        <DialogTitle>Сбросить пароль?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Пароль к учетной записи будет изменен на{" "}
            <Typography variant="body1" component="i">
              Qaz1234
            </Typography>
            .
            <br />
            После входа пользователь должен изменить пароль на свой.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog}>Отмена</Button>
          <Button color="warning" onClick={onAgreeReset}>
            Сбросить
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={successSnackbarOpened || errorSnackbarOpened}
        autoHideDuration={3000}
        onClose={onSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={onSnackbarClose}
          severity={successSnackbarOpened ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {successSnackbarOpened
            ? "Успешно сохранено."
            : "Что-то пошло не так."}
        </Alert>
      </Snackbar>
    </div>
  );
};
