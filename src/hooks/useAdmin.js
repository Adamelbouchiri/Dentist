import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getWithFallback } from "../lib/api";
import { queryKeys } from "../lib/queryClient";
import { normalizeDoctor, normalizeService } from "./useCatalog";

/** Marker returned when an endpoint isn't implemented yet (see docs/API_SPEC.md). */
export const NOT_IMPLEMENTED = { notImplemented: true };

/* ---------------------------- Appointments ---------------------------- */
export const useAdminAppointments = (params) =>
  useQuery({
    queryKey: queryKeys.adminAppointments(params),
    queryFn: () => api.get("/admin/appointments", { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });

export const useAdminCalendar = (params) =>
  useQuery({
    queryKey: queryKeys.adminCalendar(params),
    queryFn: () => getWithFallback("/admin/appointments/calendar", NOT_IMPLEMENTED, { params }),
    placeholderData: keepPreviousData,
  });

const useInvalidateAdminAppointments = () => {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["admin", "appointments"] });
    qc.invalidateQueries({ queryKey: queryKeys.adminStats });
    qc.invalidateQueries({ queryKey: ["admin", "user"] });
    qc.invalidateQueries({ queryKey: queryKeys.userAppointments });
    qc.invalidateQueries({ queryKey: ["availability"] });
  };
};

/** Update status and/or move an appointment (`{ id, status?, date?, time?, doctor_id?, doctor? }`). */
export const useUpdateAdminAppointment = () => {
  const invalidate = useInvalidateAdminAppointments();
  return useMutation({
    mutationFn: ({ id, ...changes }) => api.put(`/admin/appointments/${id}`, changes).then((r) => r.data),
    onSuccess: invalidate,
  });
};

// Kept for existing callers
export const useUpdateAppointmentStatus = useUpdateAdminAppointment;

export const useDeleteAdminAppointment = () => {
  const invalidate = useInvalidateAdminAppointments();
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/appointments/${id}`).then((r) => r.data),
    onSuccess: invalidate,
  });
};

/* ------------------------------- Stats -------------------------------- */
export const useAdminStats = () =>
  useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: () => getWithFallback("/admin/stats", NOT_IMPLEMENTED),
    staleTime: 60 * 1000,
  });

/* ------------------------------- Users -------------------------------- */
export const useAdminUsers = (params) =>
  useQuery({
    queryKey: queryKeys.adminUsers(params),
    queryFn: () => api.get("/admin/users", { params }).then((r) => r.data),
    placeholderData: keepPreviousData,
  });

export const useAdminUser = (id) =>
  useQuery({
    queryKey: queryKeys.adminUser(id),
    queryFn: () => getWithFallback(`/admin/users/${id}`, NOT_IMPLEMENTED),
    enabled: !!id,
  });

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
};

export const useAddPatientNote = (userId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`/admin/users/${userId}/notes`, { body }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminUser(userId) }),
  });
};

export const useDeletePatientNote = (userId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (noteId) => api.delete(`/admin/notes/${noteId}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminUser(userId) }),
  });
};

/* --------------------------- Contact messages -------------------------- */
export const useAdminMessages = (params) =>
  useQuery({
    queryKey: queryKeys.adminMessages(params),
    queryFn: () => getWithFallback("/admin/contact-messages", NOT_IMPLEMENTED, { params }),
    placeholderData: keepPreviousData,
  });

export const useUpdateMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, read }) => api.patch(`/admin/contact-messages/${id}`, { read }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] }),
  });
};

export const useDeleteMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/contact-messages/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] }),
  });
};

/* ------------------------------- Reviews ------------------------------- */
export const useAdminReviews = (params) =>
  useQuery({
    queryKey: queryKeys.adminReviews(params),
    queryFn: () => getWithFallback("/admin/reviews", NOT_IMPLEMENTED, { params }),
    placeholderData: keepPreviousData,
  });

export const useModerateReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approved }) => api.patch(`/admin/reviews/${id}`, { approved }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
      qc.invalidateQueries({ queryKey: queryKeys.publicReviews });
    },
  });
};

export const useDeleteReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/reviews/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
      qc.invalidateQueries({ queryKey: queryKeys.publicReviews });
    },
  });
};

/* -------------------------- Catalogue management ----------------------- */
const toFormData = (values, method) => {
  const fd = new FormData();
  Object.entries(values).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (v instanceof File) fd.append(k, v);
    else if (typeof v === "object") fd.append(k, JSON.stringify(v));
    else if (typeof v === "boolean") fd.append(k, v ? "1" : "0");
    else fd.append(k, v);
  });
  if (method) fd.append("_method", method);
  return fd;
};

const useCatalogResource = (resource, key, publicKey, normalize) => {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: publicKey });
  };

  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const data = await getWithFallback(`/admin/${resource}`, NOT_IMPLEMENTED);
      return data.notImplemented ? data : data.map(normalize);
    },
  });

  const save = useMutation({
    mutationFn: ({ id, ...values }) =>
      api
        .post(id ? `/admin/${resource}/${id}` : `/admin/${resource}`, toFormData(values, id ? "PUT" : undefined), {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/admin/${resource}/${id}`).then((r) => r.data),
    onSuccess: invalidate,
  });

  return { list, save, remove };
};

export const useAdminServices = () =>
  useCatalogResource("services", queryKeys.adminServices, queryKeys.services, normalizeService);

export const useAdminDoctors = () =>
  useCatalogResource("doctors", queryKeys.adminDoctors, queryKeys.doctors, normalizeDoctor);
