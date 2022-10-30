export const accessGetter = (access) => (params) =>
  params.row.access.includes(access);

export const accessSetter =
  (access) =>
  ({ row, value }) => ({
    ...row,
    access: value
      ? [...row.access, access]
      : row.access.filter((v) => v !== access),
  });
