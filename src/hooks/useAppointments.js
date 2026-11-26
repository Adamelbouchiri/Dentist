import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, isMissingEndpoint } from "../lib/api";
import { queryKeys } from "../lib/queryClient";

export const useUserAppointments = () =>
  useQuery({
    queryKey: queryKeys.userAppointments,
    queryFn: () => api.get("/user-appointments").then((r) => r.data),
  });

/** Invalidate everything that depends on appointment data. */
const useInvalidateAppointments = () => {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.userAppointments });
    qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
    qc.invalidateQueries({ queryKey: queryKeys.adminStats });
    qc.invalidateQueries({ queryKey: ["availability"] });
  };
};

export const useCreateAppointment = () => {
  const invalidate = useInvalidateAppointments();
  return useMutation({
    mutationFn: (payload) => api.post("/appointments", payload).then((r) => r.data),
    onSuccess: invalidate,
  });
};

/**
 * Card checkout. Preferred flow: the server creates a pending appointment + PaymentIntent
 * and a Stripe webhook marks it paid. Returns `{ clientSecret, appointment, legacy }`.
 * `legacy: true` → the endpoint doesn't exist yet, so the caller must create the appointment
 * itself after the payment succeeds (old flow).
 */
export const useStartCheckout = () =>
  useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await api.post("/appointments/checkout", payload);
        return { clientSecret: data.client_secret, appointment: data.appointment, legacy: false };
      } catch (error) {
        if (!isMissingEndpoint(error)) throw error;
        const { data } = await api.post("/create-payment-intent", { amount: payload.price * 100 });
        return { clientSecret: data.clientSecret, appointment: null, legacy: true };
      }
    },
  });

/** Delete one of the current user's appointments, removing it optimistically. */
export const useDeleteAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/appointments/${id}`).then((r) => r.data),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.userAppointments });
      const previous = qc.getQueryData(queryKeys.userAppointments);
      qc.setQueryData(queryKeys.userAppointments, (old = []) => old.filter((a) => a.id !== id));
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.userAppointments, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.userAppointments }),
  });
};

export const useCancelAppointment = () => {
  const invalidate = useInvalidateAppointments();
  return useMutation({
    mutationFn: ({ id, reason }) => api.patch(`/appointments/${id}/cancel`, { reason }).then((r) => r.data),
    onSuccess: invalidate,
  });
};

export const useRescheduleAppointment = () => {
  const invalidate = useInvalidateAppointments();
  return useMutation({
    mutationFn: ({ id, date, time }) =>
      api.patch(`/appointments/${id}/reschedule`, { date, time }).then((r) => r.data),
    onSuccess: invalidate,
  });
};

export const useReviewAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rating, comment }) =>
      api.post(`/appointments/${id}/review`, { rating, comment }).then((r) => r.data),
    onSuccess: (review, { id }) => {
      qc.setQueryData(queryKeys.userAppointments, (old) =>
        old?.map((a) => (a.id === id ? { ...a, review: review?.review ?? review ?? { rating: 0 } } : a))
      );
      qc.invalidateQueries({ queryKey: queryKeys.userAppointments });
    },
  });
};
