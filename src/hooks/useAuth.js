import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { queryKeys } from "../lib/queryClient";

export const fetchUser = () => api.get("/user").then((r) => r.data);

export const useUserQuery = (token) =>
  useQuery({
    queryKey: queryKeys.user,
    queryFn: fetchUser,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

export const useLogin = () =>
  useMutation({
    mutationFn: (credentials) => api.post("/login", credentials).then((r) => r.data),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (payload) => api.post("/register", payload).then((r) => r.data),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: () => api.post("/logout").then((r) => r.data),
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (email) => api.post("/forgot-password", { email }).then((r) => r.data),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (payload) => api.post("/reset-password", payload).then((r) => r.data),
  });

export const useSubmitSecondRegistration = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      api.post("/second-registration", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.user });
      qc.invalidateQueries({ queryKey: queryKeys.secondRegistration });
    },
  });
};
