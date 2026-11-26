import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "../lib/api";
import { queryKeys } from "../lib/queryClient";

export const useAdminAppointments = (params) =>
  useQuery({
    queryKey: queryKeys.adminAppointments(params),
    queryFn: () => api.get("/admin/appointments", { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });

export const useUpdateAppointmentStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) =>
      api.put(`/admin/appointments/${id}`, { status }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
      qc.invalidateQueries({ queryKey: queryKeys.userAppointments });
    },
  });
};

export const useDeleteAdminAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/appointments/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "appointments"] }),
  });
};

export const useAdminUsers = (params) =>
  useQuery({
    queryKey: queryKeys.adminUsers(params),
    queryFn: () => api.get("/admin/users", { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
    },
  });
};
