import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useCitiesTable } from "./hooks/useCitiesTable";

export const CitiesTable = () => {
  const {
    rows,
    columns,
    loading,
    dialogOpened,
    onCloseDialog,
    successSnackbarOpened,
    errorSnackbarOpened,
    onSnackbarClose,
    onError,
    onAgreeDelete,
    errorMessage,
    onEdit,
  } = useCitiesTable();

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

      <Dialog open={dialogOpened} onClose={onCloseDialog}>
        <DialogTitle>Удалить город?</DialogTitle>
        <DialogActions>
          <Button onClick={onCloseDialog}>Отмена</Button>
          <Button color="error" onClick={onAgreeDelete}>
            Удалить
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
            : errorMessage || "Что-то пошло не так."}
        </Alert>
      </Snackbar>
    </div>
  );
};
