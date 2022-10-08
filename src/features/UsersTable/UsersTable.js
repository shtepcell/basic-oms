import React from "react";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useUsersTable } from "./hooks/useUsersTable";

export const UsersTable = () => {
  const { columns, rows, loading, onEdit } = useUsersTable();

  return (
    <div style={{ height: 700 }}>
      <DataGrid
        loading={loading}
        density="compact"
        editMode="cell"
        getRowId={(item) => item._id}
        onCellEditCommit={onEdit}
        rows={rows}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        disableDensitySelector
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
      />
    </div>
  );
};
