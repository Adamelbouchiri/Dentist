import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
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
      .post("/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  });

export const useUpdateName = () =>
  useAccountMutation((userName) =>
    api.post("/update-name", { userName }).then((r) => r.data)
  );

export const useUpdatePassword = () =>
  useAccountMutation((passwords) =>
    api.post("/update-password", passwords).then((r) => r.data)
  );
