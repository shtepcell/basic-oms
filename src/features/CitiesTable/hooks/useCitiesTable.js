import { GridActionsCellItem } from "@mui/x-data-grid";
import React from "react";
import { deleteCity, patchCity, useCities } from "src/api/cities";
import DeleteIcon from "@mui/icons-material/Delete";

import { accessGetter, accessSetter } from "../helpers";
import { useAuth } from "src/hooks/useAuth";

const Actions = ({ onDelete, disabled }) => [
  <GridActionsCellItem
    icon={<DeleteIcon />}
    label="Delete"
    disabled={disabled}
    onClick={onDelete}
  />,
];

const useColumns = ({ onDelete }) => {
  const { user } = useAuth();
  const columns = React.useMemo(
    () => [
      {
        field: "type",
        headerName: "Тип",
        width: 80,
        type: "singleSelect",
        editable: true,
        valueOptions: ["г.", "пгт.", "с.", "пос.", "мыс."],
      },
      { field: "name", headerName: "Название", width: 350, editable: true },
      user &&
        user.department.type === "admin" && {
          field: "access_miranda",
          type: "boolean",
          editable: true,
          headerName: "Miranda",
          width: 150,
          valueGetter: accessGetter("miranda"),
          valueSetter: accessSetter("miranda"),
        },
      user &&
        user.department.type === "admin" && {
          field: "access_mirtelekom",
          type: "boolean",
          editable: true,
          headerName: "Mirtelekom",
          width: 150,
          valueGetter: accessGetter("mirtelekom"),
          valueSetter: accessSetter("mirtelekom"),
        },
      {
        field: "actions",
        type: "actions",
        getActions: (params) =>
          Actions({
            onDelete: onDelete(params.id),
            disabled: params.row.usage,
          }),
      },
    ],
    [user]
  );

  return columns.filter(Boolean);
};

export const useCitiesTable = () => {
  const { cities, loading, mutate } = useCities();
  const [selectedCity, setSelectedCity] = React.useState(null);
  const [dialogOpened, setDialogOpened] = React.useState(false);
  const [requestState, setRequestState] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const onDelete = React.useCallback(
    (id) => () => {
      setSelectedCity(id);
      setDialogOpened(true);
    },
    []
  );

  const onSnackbarClose = React.useCallback(() => {
    setRequestState(null);
  }, []);

  const onCloseDialog = React.useCallback(() => {
    setDialogOpened(false);
  }, []);

  const onSuccess = React.useCallback((res) => {
    setRequestState("success");

    return res;
  }, []);

  const onError = React.useCallback((error) => {
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      setErrorMessage(error.response.data.message);
    }

    setRequestState("error");

    return error;
  }, []);

  const onEdit = React.useCallback((row) => {
    return patchCity(row._id, row).then(onSuccess);
  }, []);

  const onAgreeDelete = React.useCallback(() => {
    deleteCity(selectedCity)
      .then(() => {
        onSuccess();
        mutate();
      })
      .catch(onError)
      .finally(onCloseDialog);
  }, [selectedCity, onSuccess, onCloseDialog, onError]);

  const columns = useColumns({ onDelete });

  return {
    columns,
    rows: cities || [],
    loading,

    successSnackbarOpened: requestState === "success",
    errorSnackbarOpened: requestState === "error",
    onSnackbarClose,
    errorMessage,

    dialogOpened,
    onAgreeDelete,

    onError,
    onCloseDialog,
    onEdit,
  };
};
