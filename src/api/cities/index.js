import useSWR from "swr";

import { fetcher, request } from "src/lib/request";

export const deleteCity = (id) => {
  return request.delete(`/api/cities/${id}`);
};

export const patchCity = (id, { name, type, access }) => {
  return request
    .patch(`/api/cities/${id}`, { name, type, access })
    .then(({ data }) => data);
};

export const createCity = ({ name, type }) => {
  return request.post("/api/cities/", { name, type }).then(({ data }) => data);
};

export const useCities = () => {
  const { data, error, mutate } = useSWR("/api/cities", fetcher);

  if (!data) {
    return { loading: true, error, mutate };
  }

  return {
    cities: data.cities,
    loading: false,
    error,
    mutate,
  };
};
