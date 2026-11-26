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
  notificationPrefs: ["notification-preferences"],
  userAppointments: ["appointments", "mine"],

  services: ["catalog", "services"],
  doctors: ["catalog", "doctors"],
  publicReviews: ["catalog", "reviews"],
  availability: (doctorId, date) => ["availability", doctorId, date],

  adminAppointments: (params) => ["admin", "appointments", params],
  adminCalendar: (params) => ["admin", "appointments", "calendar", params],
  adminStats: ["admin", "stats"],
  adminUsers: (params) => ["admin", "users", params],
  adminUser: (id) => ["admin", "user", String(id)],
  adminMessages: (params) => ["admin", "messages", params],
  adminReviews: (params) => ["admin", "reviews", params],
  adminServices: ["admin", "services"],
  adminDoctors: ["admin", "doctors"],
};
