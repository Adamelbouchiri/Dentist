import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiCreditCard, FiDollarSign, FiStar } from "react-icons/fi";

import { DateTimePicker } from "../components/appointments/DateTimePicker";
import StripeWrapper from "../components/stripe/StripeWrapper";
import CheckoutForm from "../components/stripe/CheckoutForm";
import AppContext from "../context/AppProvider";
import { useCreateAppointment } from "../hooks/useAppointments";
import { getErrorMessage, toLocalISODate } from "../lib/api";
import { flash } from "../utils/flash";
import { doctors, services } from "../data/clinic";
import { Avatar, Logo } from "../components/ui/Misc";
import { Button } from "../components/ui/Button";

const paymentMethods = [
  { id: "card", name: "Pay by card", icon: FiCreditCard },
  { id: "person", name: "Pay in person", icon: FiDollarSign },
];

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

const SummaryRow = ({ label, value, done }) => (
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
    <span className={`text-right text-sm font-semibold ${done ? "text-ink-900" : "text-ink-300"}`}>
      {value || "Not selected"}
    </span>
  </div>
);

export const CreateAppointments = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const createAppointment = useCreateAppointment();

  const [serviceId, setServiceId] = useState(services[0].id);
  const [doctorId, setDoctorId] = useState(null);
  const [date, setDate] = useState(() => new Date());
  const [time, setTime] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;

  const service = services.find((s) => s.id === serviceId);
  const doctor = doctors.find((d) => d.id === doctorId);
  const ready = service && doctor && date && time;

  const handleAppointment = (paymentStatus) =>
    createAppointment.mutate(
      {
        service: service.name,
        price: service.price,
        doctor: doctor.name,
        date: toLocalISODate(date),
        time,
        status: "upcoming",
        payment_status: paymentStatus,
      },
      {
        onSuccess: () => {
          flash.show("Appointment created successfully", "success", 3000);
          navigate("/user/dashboard/appointments");
        },
        onError: (error) =>
          flash.show(getErrorMessage(error, "Appointment failed"), "error", error?.response?.status === 422 ? 5000 : 3000),
      }
    );

  return (
    <div className="min-h-screen bg-ivory">
      <header className="sticky top-0 z-30 border-b border-ink-200/60 bg-ivory/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Logo className="h-10" />
          <div className="flex items-center gap-2">
            <Link
              to="/user/dashboard/appointments"
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-ink-100 sm:inline-flex"
            >
              <FiArrowLeft /> My appointments
            </Link>
            <Link to="/user/dashboard">
              <Avatar user={user} className="size-10" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1360px] px-5 py-10 md:px-8 md:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500">Book a visit</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-ink-900 md:text-5xl">
            Make your <span className="font-display italic text-gradient pr-1">appointment</span>
          </h1>
          <p className="mt-3 text-ink-500">Choose a treatment, your specialist and a time that suits you.</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">
          <div className="space-y-6">
            <Step n={1} title="Choose a service" subtitle="Transparent pricing — no surprises.">
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => {
                  const selected = s.id === serviceId;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={`flex items-center gap-4 rounded-2xl p-4 text-left transition-all duration-300 ${
                        selected
                          ? "bg-primary-50/60 ring-2 ring-primary-500"
                          : "bg-white ring-1 ring-ink-200 hover:ring-ink-300"
                      }`}
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-ink-100">
                        <img src={s.icon} alt="" className="max-h-7 max-w-8 object-contain" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink-900">{s.name}</span>
                        <span className="block text-[13px] text-ink-400">{s.duration}</span>
                      </span>
                      <span className={`text-sm font-semibold ${selected ? "text-primary-600" : "text-ink-900"}`}>
                        ${s.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step n={2} title="Choose your specialist">
              <div className="grid gap-3 sm:grid-cols-3">
                {doctors.map((d) => {
                  const selected = d.id === doctorId;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDoctorId(d.id)}
                      className={`group relative overflow-hidden rounded-3xl text-left transition-all duration-300 ${
                        selected ? "ring-2 ring-primary-500 shadow-lift" : "ring-1 ring-ink-200 hover:ring-ink-300"
                      }`}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-ink-100">
                        <img
                          src={d.image}
                          alt={d.name}
                          className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-2 bg-white p-4">
                        <div>
                          <p className="text-sm font-semibold text-ink-900">{d.name}</p>
                          <p className="text-[13px] text-ink-400">{d.speciality}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-700">
                          <FiStar className="size-3 fill-amber-400 text-amber-400" /> {d.rating}
                        </span>
                      </div>
                      {selected && (
                        <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-full gradient-primary text-white shadow-glow">
                          <FiCheck className="size-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Step>

            <Step n={3} title="Choose date & time" subtitle="Mon – Sat · 9:30 – 16:00">
              <DateTimePicker
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
                <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary-500/50 blur-3xl" />
                <div className="absolute -bottom-20 left-0 size-40 rounded-full bg-accent-500/30 blur-3xl" />
                <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Your appointment</p>
                <p className="relative mt-2 text-2xl font-semibold tracking-tight">{service.name}</p>
                <p className="relative mt-4 flex items-baseline gap-1 text-4xl font-semibold tracking-tight">
                  ${service.price.toLocaleString()}
                  <span className="text-sm font-normal text-white/50">total</span>
                </p>
              </div>

              <div className="divide-y divide-ink-100 px-6 md:px-7">
                <SummaryRow label="Service" value={service.name} done />
                <SummaryRow label="Specialist" value={doctor?.name} done={!!doctor} />
                <SummaryRow
                  label="Date"
                  value={date?.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long" })}
                  done={!!date}
                />
                <SummaryRow label="Time" value={time} done={!!time} />
              </div>

              <div className="border-t border-ink-100 p-6 md:p-7">
                {!ready ? (
                  <p className="rounded-2xl bg-ink-50 p-4 text-center text-sm text-ink-500 ring-1 ring-ink-100">
                    Select a specialist, date and time to continue to payment.
                  </p>
                ) : (
                  <>
                    <div className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-ink-50 p-1 ring-1 ring-ink-100">
                      {paymentMethods.map(({ id, name, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setPaymentMethod(id)}
                          className={`inline-flex items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                            paymentMethod === id ? "bg-white text-ink-900 shadow-soft" : "text-ink-500 hover:text-ink-900"
                          }`}
                        >
                          <Icon className="size-4" /> {name}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === "card" ? (
                      <StripeWrapper>
                        <CheckoutForm
                          amount={service.price}
                          email={user.email}
                          disabled={createAppointment.isPending}
                          onSuccess={() => handleAppointment("paid")}
                        />
                      </StripeWrapper>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-2xl bg-emerald-50/60 p-4 ring-1 ring-emerald-100">
                          <p className="text-sm font-semibold text-ink-900">Pay at the clinic</p>
                          <p className="mt-1 text-sm text-ink-500">
                            Cash, credit/debit card or insurance (if applicable) on the day of your visit.
                          </p>
                        </div>
                        <Button
                          size="lg"
                          className="w-full"
                          loading={createAppointment.isPending}
                          onClick={() => handleAppointment("pay_in_person")}
                        >
                          Confirm appointment
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
