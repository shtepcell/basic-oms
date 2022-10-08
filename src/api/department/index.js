import useSWR from "swr";

import { fetcher, request } from "src/lib/request";

export const updateDepartment = (id, { name, priorityCapacity }) => {
  return request.post(`/admin/departments/${id}`, { name, priorityCapacity });
};

export const addCityToDepartment = (id, cityId) => {
  return request.post(`/api/admin/department/${id}/city`, { cityId });
};

export const deleteCityFromDepartment = (id, cityId) => {
  return request.delete(`/api/admin/department/${id}/city/${cityId}`);
};

export const useDepartments = () => {
  const { data, error } = useSWR("/api/departments", fetcher, {
    fallbackData: { departments: [] },
  });

  return { departments: data.departments, error };
};
