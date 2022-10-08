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

export const departmentGetter = (params) => params.row.department.name;
export const departmentSetter =
  (departments) =>
  ({ row, value }) => ({
    ...row,
    department: departments.find(({ _id }) => _id === value),
  });

export const departmentToOption = ({ _id, name }) => ({
  value: _id,
  label: name,
});
