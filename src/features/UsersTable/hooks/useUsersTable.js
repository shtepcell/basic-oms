import React from "react";

import { GridActionsCellItem } from "@mui/x-data-grid";
import PasswordIcon from "@mui/icons-material/Password";
import DeleteIcon from "@mui/icons-material/Delete";

import { useDepartments } from "src/api/department";
import { useAdminUsers } from "src/api/users";
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
  const { users, error, loading } = useAdminUsers();
  const { departments } = useDepartments();

  const onEdit = React.useCallback((params) => {
    const { value, field } = params;

    console.log(field, value);
  }, []);

  const onDelete = React.useCallback((params) => {
    console.log("delete");
  }, []);

  const onPasswordChange = React.useCallback((params) => {
    console.log("pass change");
  }, []);

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
      { field: "phone", headerName: "Телефон", width: 350, hide: true },
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
        field: "mirandaAccess",
        type: "boolean",
        editable: true,
        headerName: "Miranda",
        width: 150,
        valueGetter: accessGetter("miranda"),
        valueSetter: accessSetter("miranda"),
      },
      {
        field: "mirtelekomAccess",
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
        getActions: () => Actions({ onDelete, onPasswordChange }),
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
  };
};
