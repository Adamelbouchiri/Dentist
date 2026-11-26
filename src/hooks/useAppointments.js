import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { queryKeys } from "../lib/queryClient";

export const useUserAppointments = () =>
  useQuery({
    queryKey: queryKeys.userAppointments,
    queryFn: () => api.get("/user-appointments").then((r) => r.data),
  });

export const useCreateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post("/appointments", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.userAppointments });
      qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
    },
  });
};

/** Delete one of the current user's appointments, removing it optimistically. */
export const useDeleteAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/appointments/${id}`).then((r) => r.data),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.userAppointments });
      const previous = qc.getQueryData(queryKeys.userAppointments);
      qc.setQueryData(queryKeys.userAppointments, (old = []) =>
        old.filter((a) => a.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.userAppointments, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.userAppointments }),
  });
};
