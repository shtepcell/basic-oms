import React from "react";

import { GridActionsCellItem } from "@mui/x-data-grid";
import PasswordIcon from "@mui/icons-material/Password";
import DeleteIcon from "@mui/icons-material/Delete";

import { useDepartments } from "src/api/department";
import {
  deleteUser,
  resetPasswordUser,
  updateUser,
  useAdminUsers,
} from "src/api/users";
import {
  accessGetter,
  accessSetter,
  departmentGetter,
  departmentSetter,
  departmentToOption,
} from "../helpers";

const Actions = ({ onDelete, onPasswordChange }) => [
  <GridActionsCellItem
    icon={<DeleteIcon />}
    label="Delete"
    onClick={onDelete}
  />,
  <GridActionsCellItem
    label="Сбросить пароль"
    icon={<PasswordIcon />}
    onClick={onPasswordChange}
    showInMenu
  />,
];

export const useUsersTable = () => {
  const { users, error, loading, mutate } = useAdminUsers();
  const { departments } = useDepartments();
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [dialogType, setDialogType] = React.useState(null);
  const [requestState, setRequestState] = React.useState(null);

  const onSnackbarClose = React.useCallback(() => {
    setRequestState(null);
  }, []);

  const onSuccess = React.useCallback((res) => {
    setRequestState("success");

    return res;
  }, []);

  const onError = React.useCallback((res) => {
    setRequestState("error");

    return res;
  }, []);

  const onEdit = React.useCallback((row) => {
    return updateUser(row._id, row).then(onSuccess);
  }, []);

  const onAgreeDelete = React.useCallback(() => {
    deleteUser(selectedUser)
      .then(() => {
        setDialogType(null);
        mutate();
        onSuccess();
      })
      .catch(onError);
  }, [selectedUser]);

  const onAgreeReset = React.useCallback(() => {
    resetPasswordUser(selectedUser)
      .then(() => {
        setDialogType(null);
        onSuccess();
      })
      .catch(onError);
  }, [selectedUser]);

  const onCloseDialog = React.useCallback(() => {
    setDialogType(null);
  }, []);

  const onDelete = React.useCallback(
    (id) => () => {
      setSelectedUser(id);
      setDialogType("delete");
    },
    []
  );

  const onPasswordChange = React.useCallback(
    (id) => () => {
      setSelectedUser(id);
      setDialogType("reset");
    },
    []
  );

  const columns = React.useMemo(
    () => [
      { field: "login", headerName: "Логин", width: 150 },
      { field: "name", headerName: "ФИО", width: 350, editable: true },
      {
        field: "email",
        headerName: "Email",
        width: 350,
        editable: true,
        hide: true,
      },
      {
        field: "phone",
        headerName: "Телефон",
        width: 350,
        hide: true,
        editable: true,
      },
      {
        field: "department",
        headerName: "Отдел",
        width: 220,
        type: "singleSelect",
        editable: true,
        valueOptions: departments.map(departmentToOption),
        valueGetter: departmentGetter,
        valueSetter: departmentSetter(departments),
      },
      {
        field: "access_miranda",
        type: "boolean",
        editable: true,
        headerName: "Miranda",
        width: 150,
        valueGetter: accessGetter("miranda"),
        valueSetter: accessSetter("miranda"),
      },
      {
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
            onPasswordChange: onPasswordChange(params.id),
          }),
      },
    ],
    [departments]
  );

  return {
    loading,
    error,
    rows: users || [],
    columns,
    onEdit,
    deleteDialogOpened: dialogType === "delete",

    onAgreeDelete,
    onCloseDialog,

    successSnackbarOpened: requestState === "success",
    errorSnackbarOpened: requestState === "error",
    onSnackbarClose,

    resetDialogOpened: dialogType === "reset",
    onAgreeReset,

    onError,
  };
};
