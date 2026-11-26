import { useContext, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiPlus,
  FiRefreshCw,
  FiStar,
  FiTrash2,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

import AppContext from "../context/AppProvider";
import {
  useCancelAppointment,
  useDeleteAppointment,
  useRescheduleAppointment,
  useReviewAppointment,
  useUserAppointments,
} from "../hooks/useAppointments";
import { useDoctors } from "../hooks/useCatalog";
import { usePageMeta } from "../hooks/usePageMeta";
import { useMoney } from "../hooks/useMoney";
import { getErrorMessage, isMissingEndpoint, toLocalISODate } from "../lib/api";
import { downloadInvoice } from "../lib/invoice";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { StatTile } from "../components/dashboard/StatTile";
import { DateTimePicker } from "../components/appointments/DateTimePicker";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Field";
import { Badge, EmptyState } from "../components/ui/Misc";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/Spinner";
import { StarRating } from "../components/ui/StarRating";

const parseDate = (d) => (d ? new Date(`${d}T00:00:00`) : null);
const startsAt = (a) => new Date(`${a.date}T${(a.time || "00:00").slice(0, 5)}:00`);
const ACTIVE = ["upcoming", "scheduled", "pending", "confirmed"];
const isPast = (a) => a.status === "completed" || a.status === "cancelled" || startsAt(a) < new Date();
/** Patients may change or cancel up to 24h before (backend enforces the same rule). */
const canChange = (a) => ACTIVE.includes(a.status) && startsAt(a) - Date.now() > 24 * 3600 * 1000;

const ActionButton = ({ icon: Icon, children, tone = "default", ...props }) => (
  <button
    {...props}
    className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition ${
      tone === "danger"
        ? "text-red-500 hover:bg-red-50"
        : tone === "primary"
        ? "bg-primary-50 text-primary-600 hover:bg-primary-100"
        : "text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50"
    }`}
  >
    <Icon className="size-3.5" /> {children}
  </button>
);

const AppointmentCard = ({ appt, onCancel, onReschedule, onReview, onInvoice, onDelete }) => {
  const { t, i18n } = useTranslation();
  const { money } = useMoney();
  const date = parseDate(appt.date);
  const locale = i18n.language;
  const changeable = canChange(appt);
  const tooLate = ACTIVE.includes(appt.status) && !changeable && startsAt(appt) > new Date();
  const invoiceable = appt.payment_status === "paid" || appt.status === "completed";
  const reviewable = appt.status === "completed" && !appt.review;

  return (
    <article className="group flex flex-col rounded-3xl bg-white p-5 shadow-soft ring-1 ring-ink-200/70 transition-all duration-300 hover:shadow-lift">
      <div className="flex gap-5">
        <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-ink-50 py-3 ring-1 ring-ink-100">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-500">
            {date?.toLocaleDateString(locale, { month: "short" })}
          </span>
          <span className="text-2xl font-semibold tracking-tight text-ink-900">{date?.getDate()}</span>
          <span className="text-xs text-ink-400">{date?.toLocaleDateString(locale, { weekday: "short" })}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-ink-900">{appt.service}</h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-500">
                <FiUser className="size-3.5" /> {appt.doctor}
              </p>
            </div>
            <span className="text-lg font-semibold tracking-tight text-ink-900">{money(appt.price)}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-2.5 py-1 text-xs font-semibold text-ink-600 ring-1 ring-ink-100">
              <FiClock className="size-3" /> {appt.time?.slice(0, 5)}
            </span>
            <Badge value={appt.status} />
            <Badge value={appt.payment_status} />
            {appt.review && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                <FiStar className="size-3 fill-amber-400 text-amber-400" /> {t("appointments.reviewed")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-4">
        {changeable && (
          <>
            <ActionButton icon={FiRefreshCw} onClick={() => onReschedule(appt)}>
              {t("appointments.reschedule")}
            </ActionButton>
            <ActionButton icon={FiXCircle} tone="danger" onClick={() => onCancel(appt)}>
              {t("appointments.cancel")}
            </ActionButton>
          </>
        )}
        {tooLate && <p className="text-[13px] text-ink-400">{t("appointments.tooLate")}</p>}
        {reviewable && (
          <ActionButton icon={FiStar} tone="primary" onClick={() => onReview(appt)}>
            {t("appointments.leaveReview")}
          </ActionButton>
        )}
        {invoiceable && (
          <ActionButton icon={FiDownload} onClick={() => onInvoice(appt)}>
            {t("appointments.invoice")}
          </ActionButton>
        )}
        {appt.status === "cancelled" && (
          <ActionButton icon={FiTrash2} tone="danger" onClick={() => onDelete(appt)}>
            {t("common.delete")}
          </ActionButton>
        )}
      </div>
    </article>
  );
};

export const Appointments = () => {
  const { t, i18n } = useTranslation();
  usePageMeta(t("nav.appointments"));
  const { user } = useContext(AppContext);
  const { data: appointments = [], isPending } = useUserAppointments();
  const { data: doctors = [] } = useDoctors();

  const deleteAppointment = useDeleteAppointment();
  const cancelAppointment = useCancelAppointment();
  const rescheduleAppointment = useRescheduleAppointment();
  const reviewAppointment = useReviewAppointment();

  const [toDelete, setToDelete] = useState(null);
  const [toCancel, setToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [toReschedule, setToReschedule] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [newTime, setNewTime] = useState(null);
  const [toReview, setToReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (isPending) return <PageLoader className="h-[60vh]" />;

  const upcoming = appointments.filter((a) => !isPast(a)).sort((a, b) => startsAt(a) - startsAt(b));
  const past = appointments.filter(isPast).sort((a, b) => startsAt(b) - startsAt(a));

  const onError = (fallback) => (error) =>
    flash.show(isMissingEndpoint(error) ? t("common.notAvailableYet") : getErrorMessage(error, fallback), "error", 4000);

  const confirmDelete = () => {
    const appt = toDelete;
    setToDelete(null);
    deleteAppointment.mutate(appt.id, {
      onSuccess: (data) => flash.show(data?.message || t("appointments.deleted"), "success", 3000),
      onError: onError(t("appointments.deleteFailed")),
    });
  };

  const confirmCancel = () =>
    cancelAppointment.mutate(
      { id: toCancel.id, reason: cancelReason.trim() || undefined },
      {
        onSuccess: () => {
          flash.show(t("appointments.cancelled"), "success", 3000);
          setToCancel(null);
          setCancelReason("");
        },
        onError: onError(t("appointments.cancelFailed")),
      }
    );

  const openReschedule = (appt) => {
    setToReschedule(appt);
    setNewDate(parseDate(appt.date));
    setNewTime(null);
  };

  const confirmReschedule = () =>
    rescheduleAppointment.mutate(
      { id: toReschedule.id, date: toLocalISODate(newDate), time: newTime },
      {
        onSuccess: () => {
          flash.show(t("appointments.rescheduled"), "success", 3000);
          setToReschedule(null);
        },
        onError: onError(t("appointments.rescheduleFailed")),
      }
    );

  const confirmReview = () =>
    reviewAppointment.mutate(
      { id: toReview.id, rating, comment: comment.trim() },
      {
        onSuccess: () => {
          flash.show(t("appointments.reviewThanks"), "success", 3500);
          setToReview(null);
          setComment("");
          setRating(5);
        },
        onError: onError(t("appointments.reviewFailed")),
      }
    );

  const handleInvoice = async (appt) => {
    // PDF core fonts can't render Arabic — fall back to English for the document
    const lng = i18n.language === "ar" ? "en" : i18n.language;
    try {
      await downloadInvoice(appt, user, i18n.getFixedT(lng), lng);
    } catch {
      flash.show(t("appointments.invoiceFailed"), "error", 3000);
    }
  };

  const rescheduleDoctor =
    toReschedule && (doctors.find((d) => d.id === toReschedule.doctor_id) ?? doctors.find((d) => d.name === toReschedule.doctor));

  const cardProps = {
    onCancel: setToCancel,
    onReschedule: openReschedule,
    onReview: setToReview,
    onInvoice: handleInvoice,
    onDelete: setToDelete,
  };

  return (
    <div>
      <PageHeader
        title={t("appointments.title")}
        accent={t("appointments.titleAccent")}
        description={t("appointments.lead")}
        action={
          <Button to="/create-appointments">
            <FiPlus /> {t("appointments.new")}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile featured label={t("appointments.total")} value={appointments.length} hint={t("appointments.totalHint")} icon={FiCalendar} />
        <StatTile label={t("appointments.upcoming")} value={upcoming.length} hint={t("appointments.upcomingHint")} icon={FiClock} />
        <StatTile
          label={t("appointments.completed")}
          value={appointments.filter((a) => a.status === "completed").length}
          hint={t("appointments.completedHint")}
          icon={FiCheckCircle}
        />
      </div>

      <section className="mt-12">
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-ink-900">{t("appointments.upcoming")}</h3>
        {upcoming.length === 0 ? (
          <EmptyState
            compact
            title={t("appointments.noUpcoming")}
            description={t("appointments.noUpcomingHint")}
            action={
              <Button to="/create-appointments" size="sm">
                {t("appointments.bookVisit")}
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {upcoming.map((a) => (
              <AppointmentCard key={a.id} appt={a} {...cardProps} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-ink-900">{t("appointments.past")}</h3>
        {past.length === 0 ? (
          <EmptyState compact title={t("appointments.noPast")} />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {past.map((a) => (
              <AppointmentCard key={a.id} appt={a} {...cardProps} />
            ))}
          </div>
        )}
      </section>

      {/* Delete (cancelled only) */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        icon={FiTrash2}
        tone="danger"
        title={t("appointments.deleteTitle")}
        description={t("appointments.deleteBody")}
        footer={
          <>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              {t("common.keep")}
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              {t("common.delete")}
            </Button>
          </>
        }
      />

      {/* Cancel */}
      <Modal
        open={!!toCancel}
        onClose={() => setToCancel(null)}
        icon={FiXCircle}
        tone="danger"
        title={t("appointments.cancelTitle")}
        description={
          toCancel &&
          t(toCancel.payment_status === "paid" ? "appointments.cancelBodyPaid" : "appointments.cancelBody", {
            service: toCancel.service,
            date: toCancel.date,
          })
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setToCancel(null)}>
              {t("common.keep")}
            </Button>
            <Button variant="danger" onClick={confirmCancel} loading={cancelAppointment.isPending}>
              {t("appointments.confirmCancel")}
            </Button>
          </>
        }
      >
        <Textarea
          label={t("appointments.cancelReason")}
          placeholder={t("common.optional")}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          className="[&_textarea]:min-h-24"
        />
      </Modal>

      {/* Reschedule */}
      <Modal
        open={!!toReschedule}
        onClose={() => setToReschedule(null)}
        icon={FiRefreshCw}
        size="xl"
        title={t("appointments.rescheduleTitle")}
        description={toReschedule && `${toReschedule.service} · ${toReschedule.doctor}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setToReschedule(null)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={confirmReschedule} disabled={!newDate || !newTime} loading={rescheduleAppointment.isPending}>
              {t("appointments.confirmReschedule")}
            </Button>
          </>
        }
      >
        {toReschedule && (
          <DateTimePicker
            doctor={rescheduleDoctor ?? { id: toReschedule.doctor_id ?? toReschedule.doctor }}
            selectedDate={newDate}
            onDateChange={(d) => {
              setNewDate(d);
              setNewTime(null);
            }}
            selectedTime={newTime}
            onTimeChange={setNewTime}
            ignoreSlot={{ date: toReschedule.date, time: toReschedule.time?.slice(0, 5) }}
          />
        )}
      </Modal>

      {/* Review */}
      <Modal
        open={!!toReview}
        onClose={() => setToReview(null)}
        icon={FiStar}
        title={t("appointments.reviewTitle")}
        description={toReview && `${toReview.service} · ${toReview.doctor}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setToReview(null)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={confirmReview} disabled={comment.trim().length < 3} loading={reviewAppointment.isPending}>
              {t("appointments.submitReview")}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <StarRating value={rating} onChange={setRating} />
          <Textarea
            label={t("appointments.reviewComment")}
            placeholder={t("appointments.reviewPlaceholder")}
            value={comment}
            maxLength={1000}
            onChange={(e) => setComment(e.target.value)}
          />
          <p className="text-[13px] text-ink-400">{t("appointments.reviewModeration")}</p>
        </div>
      </Modal>
    </div>
  );
};
