import useSWR from "swr";

import { fetcher } from "src/lib/request";

export const useAdminUsers = () => {
  const { data, error } = useSWR("/api/admin/users", fetcher);

  if (!data) {
    return { loading: true, error };
  }

  return {
    users: data.users,
    loading: false,
    error,
  };
};
