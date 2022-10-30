import useSWR from "swr";

import { fetcher } from "src/lib/request";

export const useAuth = () => {
  const { data, error, mutate } = useSWR("/api/auth", fetcher);

  return {
    user: data,
    loading: !data,
    error,
    mutate,
  };
};
