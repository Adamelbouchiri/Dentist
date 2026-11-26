import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getWithFallback } from "../lib/api";
import { queryKeys } from "../lib/queryClient";

export const useSecondRegistration = () =>
  useQuery({
    queryKey: queryKeys.secondRegistration,
    queryFn: () => api.get("/user-second-registration").then((r) => r.data),
  });

/** Shared onSuccess: the API returns `{ user, message }` for account updates. */
const useAccountMutation = (mutationFn) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (data?.user) qc.setQueryData(queryKeys.user, data.user);
    },
  });
};

export const useUpdateAvatar = () =>
  useAccountMutation((file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api
      .post("/update-avatar", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  });

export const useUpdateName = () =>
  useAccountMutation((userName) => api.post("/update-name", { userName }).then((r) => r.data));

export const useUpdatePassword = () =>
  useAccountMutation((passwords) => api.post("/update-password", passwords).then((r) => r.data));

/** `{ email_reminders, whatsapp_reminders }` — `unavailable: true` until the endpoint exists. */
export const useNotificationPrefs = () =>
  useQuery({
    queryKey: queryKeys.notificationPrefs,
    queryFn: () =>
      getWithFallback("/user/notification-preferences", {
        email_reminders: true,
        whatsapp_reminders: false,
        unavailable: true,
      }),
  });

export const useUpdateNotificationPrefs = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prefs) => api.put("/user/notification-preferences", prefs).then((r) => r.data),
    onMutate: async (prefs) => {
      const previous = qc.getQueryData(queryKeys.notificationPrefs);
      qc.setQueryData(queryKeys.notificationPrefs, (old) => ({ ...old, ...prefs }));
      return { previous };
    },
    onError: (_e, _p, ctx) => qc.setQueryData(queryKeys.notificationPrefs, ctx?.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.notificationPrefs }),
  });
};
