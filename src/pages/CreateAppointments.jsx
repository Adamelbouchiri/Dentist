import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiCreditCard, FiDollarSign, FiStar } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import { DateTimePicker } from "../components/appointments/DateTimePicker";
import StripeWrapper from "../components/stripe/StripeWrapper";
import CheckoutForm from "../components/stripe/CheckoutForm";
import AppContext from "../context/AppProvider";
import { useCreateAppointment, useStartCheckout } from "../hooks/useAppointments";
import { useDoctors, useServices } from "../hooks/useCatalog";
import { usePageMeta } from "../hooks/usePageMeta";
import { getErrorMessage, toLocalISODate } from "../lib/api";
import { flash } from "../utils/flash";
import { Avatar, Logo } from "../components/ui/Misc";
import { Button } from "../components/ui/Button";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";
import { PageLoader } from "../components/ui/Spinner";

const Step = ({ n, title, subtitle, children }) => (
  <section className="rounded-[32px] bg-white p-6 shadow-soft ring-1 ring-ink-200/70 md:p-8">
    <div className="mb-7 flex items-start gap-4">
      <span className="font-display text-4xl italic leading-none text-gradient">0{n}</span>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-ink-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-400">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
);

const SummaryRow = ({ label, value, done, empty }) => (
  <div className="flex items-center justify-between gap-4 py-3.5">
    <span className="flex items-center gap-2.5 text-sm text-ink-500">
      <span
        className={`grid size-5 place-items-center rounded-full transition-colors ${
          done ? "gradient-primary text-white" : "ring-1 ring-ink-200"
        }`}
      >
        {done && <FiCheck className="size-3" />}
      </span>
      {label}
    </span>
    <span className={`text-end text-sm font-semibold ${done ? "text-ink-900" : "text-ink-300"}`}>{value || empty}</span>
  </div>
);

/** Numeric ids only — static fallback data uses string ids the API wouldn't recognise. */
const numericId = (id) => (typeof id === "number" ? id : undefined);

export const CreateAppointments = () => {
  const { t, i18n } = useTranslation();
  usePageMeta(t("booking.metaTitle"));
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const createAppointment = useCreateAppointment();
  const startCheckout = useStartCheckout();
  const { data: services = [], isPending: servicesLoading } = useServices();
  const { data: doctors = [] } = useDoctors();

  const [serviceId, setServiceId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Default to the first service once the catalogue is loaded
  useEffect(() => {
    if (!serviceId && services.length) setServiceId(services[0].id);
  }, [services, serviceId]);

  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (servicesLoading && !services.length) return <PageLoader />;

  const service = services.find((s) => s.id === serviceId) ?? services[0];
  const doctor = doctors.find((d) => d.id === doctorId);
  const ready = service && doctor && date && time;

  const payload = ready && {
    service_id: numericId(service.id),
    doctor_id: numericId(doctor.id),
    service: service.name,
    price: service.price,
    doctor: doctor.name,
    date: toLocalISODate(date),
    time,
  };

  const onBooked = () => {
    flash.show(t("booking.success"), "success", 3500);
    navigate("/user/dashboard/appointments");
  };

  const onBookingError = (error) => {
    // Slot taken in the meantime → refresh availability and let the patient pick again
    if (error?.response?.status === 422 && error.response.data?.errors?.time) {
      qc.invalidateQueries({ queryKey: ["availability"] });
      setTime(null);
    }
    flash.show(getErrorMessage(error, t("booking.failed")), "error", 5000);
  };

  const bookInPerson = () =>
    createAppointment.mutate(
      { ...payload, status: "upcoming", payment_status: "pay_in_person" },
      { onSuccess: onBooked, onError: onBookingError }
    );

  // Card: server creates a pending appointment + PaymentIntent (webhook marks it paid).
  // Legacy backends: create the appointment after Stripe confirms.
  const createIntent = () => startCheckout.mutateAsync(payload).catch((e) => {
    onBookingError(e);
    throw e;
  });

  const onCardPaid = ({ legacy }) => {
    if (!legacy) {
      qc.invalidateQueries({ queryKey: ["appointments"] });
      return onBooked();
    }
    createAppointment.mutate(
      { ...payload, status: "upcoming", payment_status: "paid" },
      { onSuccess: onBooked, onError: onBookingError }
    );
  };

  const locale = i18n.language;

  return (
    <div className="min-h-screen bg-ivory">
      <header className="sticky top-0 z-30 border-b border-ink-200/60 bg-ivory/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Logo className="h-10" />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link
              to="/user/dashboard/appointments"
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-100 sm:inline-flex"
            >
              <FiArrowLeft className="rtl:rotate-180" /> {t("booking.myAppointments")}
            </Link>
            <Link to="/user/dashboard">
              <Avatar user={user} className="size-10" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1360px] px-5 py-10 md:px-8 md:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500">{t("booking.eyebrow")}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-ink-900 md:text-5xl">
            {t("booking.title")} <span className="font-display italic text-gradient pe-1">{t("booking.titleAccent")}</span>
          </h1>
          <p className="mt-3 text-ink-500">{t("booking.lead")}</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">
          <div className="space-y-6">
            <Step n={1} title={t("booking.step1")} subtitle={t("booking.step1Hint")}>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => {
                  const selected = s.id === service?.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={`flex items-center gap-4 rounded-2xl p-4 text-start transition-all duration-300 ${
                        selected ? "bg-primary-50/60 ring-2 ring-primary-500" : "bg-white ring-1 ring-ink-200 hover:ring-ink-300"
                      }`}
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-ink-100">
                        {s.icon && <img src={s.icon} alt="" className="max-h-7 max-w-8 object-contain" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink-900">{t(`services.${s.slug}.name`, s.name)}</span>
                        <span className="block text-[13px] text-ink-400">{t(`services.${s.slug}.duration`, s.duration)}</span>
                      </span>
                      <span className={`text-sm font-semibold ${selected ? "text-primary-600" : "text-ink-900"}`}>
                        ${s.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step n={2} title={t("booking.step2")}>
              <div className="grid gap-3 sm:grid-cols-3">
                {doctors.map((d) => {
                  const selected = d.id === doctorId;
                  return (
                    <button
                      key={d.id}
                      onClick={() => {
                        setDoctorId(d.id);
                        setTime(null);
                      }}
                      className={`group relative overflow-hidden rounded-3xl text-start transition-all duration-300 ${
                        selected ? "ring-2 ring-primary-500 shadow-lift" : "ring-1 ring-ink-200 hover:ring-ink-300"
                      }`}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-ink-100">
                        {d.image && (
                          <img
                            src={d.image}
                            alt={d.name}
                            className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="flex items-start justify-between gap-2 bg-white p-4">
                        <div>
                          <p className="text-sm font-semibold text-ink-900">{d.name}</p>
                          <p className="text-[13px] text-ink-400">{t(`specialities.${d.speciality}`, d.speciality)}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-700">
                          <FiStar className="size-3 fill-amber-400 text-amber-400" /> {d.rating}
                        </span>
                      </div>
                      {selected && (
                        <span className="absolute end-3 top-3 grid size-7 place-items-center rounded-full gradient-primary text-white shadow-glow">
                          <FiCheck className="size-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step n={3} title={t("booking.step3")} subtitle={t("booking.step3Hint")}>
              <DateTimePicker
                doctor={doctor}
                selectedDate={date}
                onDateChange={(d) => {
                  setDate(d);
                  setTime(null);
                }}
                selectedTime={time}
                onTimeChange={setTime}
              />
            </Step>
          </div>

          {/* Summary & payment */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[32px] bg-white shadow-soft ring-1 ring-ink-200/70">
              <div className="relative overflow-hidden bg-ink-950 p-6 text-white md:p-7">
                <div className="absolute -end-16 -top-16 size-48 rounded-full bg-primary-500/50 blur-3xl" />
                <div className="absolute -bottom-20 start-0 size-40 rounded-full bg-accent-500/30 blur-3xl" />
                <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                  {t("booking.yourAppointment")}
                </p>
                <p className="relative mt-2 text-2xl font-semibold tracking-tight">
                  {service && t(`services.${service.slug}.name`, service.name)}
                </p>
                <p className="relative mt-4 flex items-baseline gap-1 text-4xl font-semibold tracking-tight">
                  ${service?.price.toLocaleString()}
                  <span className="text-sm font-normal text-white/50">{t("booking.total")}</span>
                </p>
              </div>

              <div className="divide-y divide-ink-100 px-6 md:px-7">
                <SummaryRow
                  label={t("booking.service")}
                  value={service && t(`services.${service.slug}.name`, service.name)}
                  done={!!service}
                  empty={t("booking.notSelected")}
                />
                <SummaryRow label={t("booking.specialist")} value={doctor?.name} done={!!doctor} empty={t("booking.notSelected")} />
                <SummaryRow
                  label={t("booking.date")}
                  value={date?.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "long" })}
                  done={!!date}
                  empty={t("booking.notSelected")}
                />
                <SummaryRow label={t("booking.time")} value={time} done={!!time} empty={t("booking.notSelected")} />
              </div>

              <div className="border-t border-ink-100 p-6 md:p-7">
                {!ready ? (
                  <p className="rounded-2xl bg-ink-50 p-4 text-center text-sm text-ink-500 ring-1 ring-ink-100">
                    {t("booking.selectAll")}
                  </p>
                ) : (
                  <>
                    <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-ink-50 p-1 ring-1 ring-ink-100">
                      {[
                        { id: "card", icon: FiCreditCard, label: t("booking.payByCard") },
                        { id: "person", icon: FiDollarSign, label: t("booking.payInPerson") },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setPaymentMethod(id)}
                          className={`inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                            paymentMethod === id ? "bg-white text-ink-900 shadow-soft" : "text-ink-500 hover:text-ink-900"
                          }`}
                        >
                          <Icon className="size-4" /> {label}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === "card" ? (
                      <StripeWrapper>
                        <CheckoutForm
                          amount={service.price}
                          email={user.email}
                          disabled={createAppointment.isPending}
                          createIntent={createIntent}
                          onSuccess={onCardPaid}
                        />
                      </StripeWrapper>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-emerald-50/60 p-4 ring-1 ring-emerald-100">
                          <p className="text-sm font-semibold text-ink-900">{t("booking.payAtClinic")}</p>
                          <p className="mt-1 text-sm text-ink-500">{t("booking.payAtClinicHint")}</p>
                        </div>
                        <Button size="lg" className="w-full" loading={createAppointment.isPending} onClick={bookInPerson}>
                          {t("booking.confirm")}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
