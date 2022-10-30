import useSWR from "swr";

import { fetcher, request } from "src/lib/request";

export const updateUser = (id, { name, access, email, phone, department }) => {
  return request
    .patch(`/api/admin/users/${id}`, {
      name,
      access: [...new Set(access)],
      email,
      phone,
      department,
    })
    .then(({ data }) => data);
};

export const deleteUser = (id) => {
  return request.delete(`/api/admin/users/${id}`).then(({ data }) => data);
};

export const resetPasswordUser = (id) => {
  return request
    .patch(`/api/admin/users/${id}/password`)
    .then(({ data }) => data);
};

export const useAdminUsers = () => {
  const { data, error, mutate } = useSWR("/api/admin/users", fetcher);

  if (!data) {
    return { loading: true, error, mutate };
  }

  return {
    users: data.users,
    loading: false,
    error,
    mutate,
  };
};
