import { useState } from "react";
import { FiCalendar, FiCheckCircle, FiClock, FiPlus, FiTrash2, FiUser } from "react-icons/fi";

import { useDeleteAppointment, useUserAppointments } from "../hooks/useAppointments";
import { getErrorMessage } from "../lib/api";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { StatTile } from "../components/dashboard/StatTile";
import { Button } from "../components/ui/Button";
import { Badge, EmptyState } from "../components/ui/Misc";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/Spinner";

const parseDate = (d) => (d ? new Date(`${d}T00:00:00`) : null);

const AppointmentCard = ({ appt, onDelete }) => {
  const date = parseDate(appt.date);
  return (
    <article className="group flex gap-5 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-ink-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-ink-50 py-3 ring-1 ring-ink-100">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">
          {date?.toLocaleDateString("en-US", { month: "short" })}
        </span>
        <span className="text-2xl font-semibold tracking-tight text-ink-900">{date?.getDate()}</span>
        <span className="text-xs text-ink-400">{date?.toLocaleDateString("en-US", { weekday: "short" })}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-ink-900">{appt.service}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-500">
              <FiUser className="size-3.5" /> {appt.doctor}
            </p>
          </div>
          <button
            onClick={() => onDelete(appt)}
            aria-label="Delete appointment"
            className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-300 transition hover:bg-red-50 hover:text-red-500"
          >
            <FiTrash2 className="size-4" />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-2.5 py-1 text-xs font-semibold text-ink-600 ring-1 ring-ink-100">
            <FiClock className="size-3" /> {appt.time?.slice(0, 5)}
          </span>
          <Badge value={appt.status} />
          <Badge value={appt.payment_status} />
          <span className="ml-auto text-lg font-semibold tracking-tight text-ink-900">${appt.price}</span>
        </div>
      </div>
    </article>
  );
};

export const Appointments = () => {
  const { data: appointments = [], isPending } = useUserAppointments();
  const deleteAppointment = useDeleteAppointment();
  const [toDelete, setToDelete] = useState(null);

  if (isPending) return <PageLoader className="h-[60vh]" />;

  const isPast = (a) => a.status === "completed" || a.status === "cancelled";
  const upcoming = appointments.filter((a) => !isPast(a));
  const past = appointments.filter(isPast);

  const confirmDelete = () => {
    const appt = toDelete;
    setToDelete(null);
    deleteAppointment.mutate(appt.id, {
      onSuccess: (data) => flash.show(data?.message || "Appointment deleted", "success", 3000),
      onError: (error) => flash.show(getErrorMessage(error, "Could not delete appointment"), "error", 3000),
    });
  };

  return (
    <div>
      <PageHeader
        title="Your"
        accent="appointments"
        description="Manage your upcoming visits and review your history."
        action={
          <Button to="/create-appointments">
            <FiPlus /> New appointment
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile featured label="Total appointments" value={appointments.length} hint="All scheduled and past visits" icon={FiCalendar} />
        <StatTile label="Upcoming" value={upcoming.length} hint="Visits ahead of you" icon={FiClock} />
        <StatTile
          label="Completed"
          value={appointments.filter((a) => a.status === "completed").length}
          hint="Successfully finished"
          icon={FiCheckCircle}
        />
      </div>

      <section className="mt-12">
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-ink-900">Upcoming</h3>
        {upcoming.length === 0 ? (
          <EmptyState
            compact
            title="No upcoming appointments"
            description="Book your next visit and it will appear here."
            action={<Button to="/create-appointments" size="sm">Book a visit</Button>}
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {upcoming.map((a) => (
              <AppointmentCard key={a.id} appt={a} onDelete={setToDelete} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-ink-900">Past & completed</h3>
        {past.length === 0 ? (
          <EmptyState compact title="No past appointments yet" />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {past.map((a) => (
              <AppointmentCard key={a.id} appt={a} onDelete={setToDelete} />
            ))}
          </div>
        )}
      </section>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        icon={FiTrash2}
        tone="danger"
        title="Delete this appointment?"
        description={toDelete && `${toDelete.service} with ${toDelete.doctor} on ${toDelete.date}. This cannot be undone.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Keep it
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      />
    </div>
  );
};
