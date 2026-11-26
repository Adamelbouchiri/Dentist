import { useMutation, useQuery } from "@tanstack/react-query";
import { api, getWithFallback } from "../lib/api";
import { queryKeys } from "../lib/queryClient";
import {
  doctors as staticDoctors,
  services as staticServices,
  testimonials as staticTestimonials,
  defaultTimeSlots,
} from "../data/clinic";

/* ------------------------------------------------------------------ */
/*  Normalisers — map API shapes to the shapes components use          */
/* ------------------------------------------------------------------ */
export const normalizeService = (s) => ({
  id: s.id,
  slug: s.slug ?? String(s.id),
  name: s.name,
  desc: s.description ?? s.desc ?? "",
  price: Number(s.price),
  duration: s.duration ?? "",
  icon: s.icon_url ?? s.icon,
  active: s.active ?? true,
  sort: s.sort ?? 0,
});

export const normalizeDoctor = (d) => ({
  id: d.id,
  name: d.name,
  speciality: d.speciality,
  rating: Number(d.rating ?? 5),
  image: d.image_url ?? d.image,
  working_hours: d.working_hours ?? null,
  days_off: d.days_off ?? [],
  active: d.active ?? true,
});

/* ------------------------------------------------------------------ */
/*  Public catalogue                                                   */
/* ------------------------------------------------------------------ */
export const useServices = () =>
  useQuery({
    queryKey: queryKeys.services,
    queryFn: async () => (await getWithFallback("/services", staticServices)).map(normalizeService),
    staleTime: 10 * 60 * 1000,
    placeholderData: staticServices.map(normalizeService),
  });

export const useDoctors = () =>
  useQuery({
    queryKey: queryKeys.doctors,
    queryFn: async () => (await getWithFallback("/doctors", staticDoctors)).map(normalizeDoctor),
    staleTime: 10 * 60 * 1000,
    placeholderData: staticDoctors.map(normalizeDoctor),
  });

/** Approved public reviews. Falls back to the static placeholder copy until the endpoint exists or has data. */
export const usePublicReviews = () =>
  useQuery({
    queryKey: queryKeys.publicReviews,
    queryFn: async () => {
      const data = await getWithFallback("/reviews", [], { params: { limit: 6 } });
      if (!data?.length) return staticTestimonials;
      return data.map((r) => ({
        quote: r.comment,
        name: r.user?.name ?? "Patient",
        title: r.service ?? "Patient",
        image: r.user?.avatar ?? null,
        rating: r.rating,
      }));
    },
    staleTime: 10 * 60 * 1000,
    placeholderData: staticTestimonials,
  });

/**
 * Slots for a doctor on a date. Without the endpoint, every default slot is offered
 * (the backend should still reject double bookings with a 422).
 */
export const useAvailability = (doctorId, date) =>
  useQuery({
    queryKey: queryKeys.availability(doctorId, date),
    queryFn: () =>
      getWithFallback(
        "/availability",
        { slots: defaultTimeSlots, booked: [], closed: false, fallback: true },
        { params: { doctor_id: doctorId, date } }
      ),
    enabled: !!doctorId && !!date,
    staleTime: 30 * 1000,
  });

export const useSendContact = () =>
  useMutation({
    mutationFn: (payload) => api.post("/contact", payload).then((r) => r.data),
  });
