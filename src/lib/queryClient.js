import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: (failureCount, error) => {
        const status = error?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  user: ["user"],
  secondRegistration: ["second-registration"],
  userAppointments: ["appointments", "mine"],
  adminAppointments: (params) => ["admin", "appointments", params],
  adminUsers: (params) => ["admin", "users", params],
};
