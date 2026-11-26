import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiMove, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { useAdminCalendar, useUpdateAdminAppointment } from "../hooks/useAdmin";
import { useDoctors } from "../hooks/useCatalog";
import { usePageMeta } from "../hooks/usePageMeta";
import { getErrorMessage, toLocalISODate } from "../lib/api";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Field";
import { Badge, NotImplemented } from "../components/ui/Misc";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/Spinner";

// 30-minute rows from 09:00 to 17:30
const ROWS = Array.from({ length: 18 }, (_, i) => {
  const mins = 9 * 60 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

const weekStartOf = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() + (x.getDay() === 0 ? -6 : 1 - x.getDay()));
  return x;
};

const tone = {
  cancelled: "bg-ink-100 text-ink-400 line-through ring-ink-200",
  completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
};

export const AdminCalendar = () => {
  const { t, i18n } = useTranslation();
  usePageMeta(t("nav.calendar"));
  const locale = i18n.language;
  const [weekStart, setWeekStart] = useState(() => weekStartOf(new Date()));
  const [doctorId, setDoctorId] = useState("");
  const [selected, setSelected] = useState(null);
  const [move, setMove] = useState(null); // { appt, date, time }
  const [dragOver, setDragOver] = useState(null);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
      }),
    [weekStart]
  );

  const params = { from: toLocalISODate(days[0]), to: toLocalISODate(days[6]), doctor_id: doctorId || undefined };
  const { data, isPending, isFetching } = useAdminCalendar(params);
  const { data: doctors = [] } = useDoctors();
  const update = useUpdateAdminAppointment();

  const byCell = useMemo(() => {
    const map = {};
    if (Array.isArray(data)) {
      data.forEach((a) => {
        // snap to the 30-minute row it starts in
        const [h, m] = (a.time || "00:00").split(":").map(Number);
        const row = `${String(h).padStart(2, "0")}:${m < 30 ? "00" : "30"}`;
        (map[`${a.date}|${row}`] ||= []).push(a);
      });
    }
    return map;
  }, [data]);

  const shiftWeek = (n) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + n * 7);
    setWeekStart(d);
  };

  const todayKey = toLocalISODate(new Date());

  const confirmMove = () =>
    update.mutate(
      { id: move.appt.id, date: move.date, time: move.time },
      {
        onSuccess: () => {
          flash.show(t("calendar.moved"), "success", 3000);
          setMove(null);
        },
        onError: (e) => flash.show(getErrorMessage(e, t("calendar.moveFailed")), "error", 4000),
      }
    );

  return (
    <div>
      <PageHeader title={t("calendar.title")} accent={t("calendar.titleAccent")} description={t("calendar.lead")} />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftWeek(-1)}
            aria-label={t("booking.prevWeek")}
            className="grid size-10 place-items-center rounded-full bg-white text-ink-600 ring-1 ring-ink-200 transition hover:bg-ink-50"
          >
            <FiChevronLeft className="rtl:rotate-180" />
          </button>
          <button
            onClick={() => shiftWeek(1)}
            aria-label={t("booking.nextWeek")}
            className="grid size-10 place-items-center rounded-full bg-white text-ink-600 ring-1 ring-ink-200 transition hover:bg-ink-50"
          >
            <FiChevronRight className="rtl:rotate-180" />
          </button>
          <Button variant="outline" size="sm" className="h-10" onClick={() => setWeekStart(weekStartOf(new Date()))}>
            {t("calendar.today")}
          </Button>
          <p className="ms-2 text-sm font-semibold text-ink-900">
            {days[0].toLocaleDateString(locale, { day: "numeric", month: "short" })} – {days[6].toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="sm:w-60">
          <option value="">{t("calendar.allDoctors")}</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
      </div>

      {isPending ? (
        <PageLoader className="h-[50vh]" />
      ) : data?.notImplemented ? (
        <NotImplemented endpoint="GET /api/admin/appointments/calendar" />
      ) : (
        <>
          <div className={`overflow-x-auto rounded-3xl bg-white shadow-soft ring-1 ring-ink-200/70 transition-opacity ${isFetching ? "opacity-70" : ""}`}>
            <div className="grid min-w-[900px] grid-cols-[64px_repeat(7,1fr)]">
              {/* Header */}
              <div className="sticky top-0 border-b border-ink-100 bg-ink-50/60" />
              {days.map((d) => {
                const key = toLocalISODate(d);
                const isToday = key === todayKey;
                return (
                  <div key={key} className="border-b border-s border-ink-100 bg-ink-50/60 px-3 py-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                      {d.toLocaleDateString(locale, { weekday: "short" })}
                    </p>
                    <p
                      className={`mx-auto mt-1 grid size-8 place-items-center rounded-full text-sm font-semibold ${
                        isToday ? "gradient-primary text-white" : "text-ink-900"
                      }`}
                    >
                      {d.getDate()}
                    </p>
                  </div>
                );
              })}

              {/* Rows */}
              {ROWS.map((time) => (
                <div key={time} className="contents">
                  <div className="border-b border-ink-100 px-2 py-2 text-end text-xs tabular-nums text-ink-400" dir="ltr">
                    {time.endsWith(":00") ? time : ""}
                  </div>
                  {days.map((d) => {
                    const date = toLocalISODate(d);
                    const cellKey = `${date}|${time}`;
                    const items = byCell[cellKey] || [];
                    return (
                      <div
                        key={cellKey}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOver(cellKey);
                        }}
                        onDragLeave={() => setDragOver((k) => (k === cellKey ? null : k))}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(null);
                          const id = Number(e.dataTransfer.getData("text/plain"));
                          const appt = data.find((a) => a.id === id);
                          if (appt && (appt.date !== date || appt.time?.slice(0, 5) !== time)) setMove({ appt, date, time });
                        }}
                        className={`min-h-12 border-b border-s border-ink-100 p-1 transition-colors ${
                          dragOver === cellKey ? "bg-primary-50" : date === todayKey ? "bg-primary-50/20" : ""
                        }`}
                      >
                        {items.map((a) => (
                          <button
                            key={a.id}
                            draggable={a.status !== "cancelled" && a.status !== "completed"}
                            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(a.id))}
                            onClick={() => setSelected(a)}
                            className={`mb-1 block w-full cursor-grab truncate rounded-lg px-2 py-1 text-start text-xs font-semibold ring-1 ring-inset transition hover:brightness-95 active:cursor-grabbing ${
                              tone[a.status] ?? "bg-primary-50 text-primary-700 ring-primary-200"
                            }`}
                            title={`${a.time?.slice(0, 5)} · ${a.user?.name} · ${a.service}`}
                          >
                            <span dir="ltr">{a.time?.slice(0, 5)}</span> {a.user?.name}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 text-[13px] text-ink-400">
            <FiMove className="size-3.5" /> {t("calendar.dragHint")}
          </p>
        </>
      )}

      {/* Details */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        icon={FiUser}
        title={selected?.user?.name}
        description={selected && `${selected.service} · ${selected.doctor}`}
        footer={
          selected && (
            <Button to={`/admin/dashboard/users/${selected.user?.id ?? selected.user_id}`} variant="dark">
              {t("calendar.openFile")}
            </Button>
          )
        }
      >
        {selected && (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-ink-400">{t("booking.date")}</dt>
              <dd className="font-semibold text-ink-900">
                {new Date(`${selected.date}T00:00:00`).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}
              </dd>
            </div>
            <div>
              <dt className="text-ink-400">{t("booking.time")}</dt>
              <dd className="font-semibold text-ink-900" dir="ltr">{selected.time?.slice(0, 5)}</dd>
            </div>
            <div>
              <dt className="text-ink-400">{t("table.status")}</dt>
              <dd className="mt-1"><Badge value={selected.status} /></dd>
            </div>
            <div>
              <dt className="text-ink-400">{t("table.payment")}</dt>
              <dd className="mt-1"><Badge value={selected.payment_status} /></dd>
            </div>
          </dl>
        )}
      </Modal>

      {/* Confirm move */}
      <Modal
        open={!!move}
        onClose={() => setMove(null)}
        icon={FiMove}
        title={t("calendar.moveTitle")}
        description={
          move &&
          t("calendar.moveBody", {
            name: move.appt.user?.name,
            from: `${move.appt.date} ${move.appt.time?.slice(0, 5)}`,
            to: `${move.date} ${move.time}`,
          })
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setMove(null)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={confirmMove} loading={update.isPending}>
              {t("calendar.confirmMove")}
            </Button>
          </>
        }
      />
    </div>
  );
};
