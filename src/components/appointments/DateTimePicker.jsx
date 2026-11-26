import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useAvailability } from "../../hooks/useCatalog";
import { toLocalISODate } from "../../lib/api";

const weekdayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const getWeekStart = (from = new Date()) => {
  const d = startOfDay(from);
  const offset = d.getDay() === 0 ? -6 : 1 - d.getDay(); // Monday-based week
  d.setDate(d.getDate() + offset);
  return d;
};

/** Whether the clinic / doctor is closed on a given day (without hitting the API). */
export const isClosedDay = (date, doctor) => {
  const key = weekdayKeys[date.getDay()];
  if (doctor?.days_off?.includes(toLocalISODate(date))) return true;
  if (doctor?.working_hours) return !doctor.working_hours[key]?.length;
  return key === "sun"; // clinic default: Mon–Sat
};

/**
 * Week strip + time slots for one doctor. Booked slots come from GET /availability;
 * `ignoreSlot` lets the reschedule dialog keep the patient's current slot selectable.
 */
export const DateTimePicker = ({ doctor, selectedDate, onDateChange, selectedTime, onTimeChange, ignoreSlot }) => {
  const { t, i18n } = useTranslation();
  const [weekStart, setWeekStart] = useState(() => getWeekStart(selectedDate || new Date()));
  const today = startOfDay(new Date());
  const locale = i18n.language;

  const dateKey = selectedDate ? toLocalISODate(selectedDate) : null;
  const { data: availability, isFetching } = useAvailability(doctor?.id, dateKey);

  const weekDates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
      }),
    [weekStart]
  );

  const canGoBack = weekStart > getWeekStart();
  const shiftWeek = (dir) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + dir * 7);
    setWeekStart(d);
  };

  const isSelectedToday = selectedDate && startOfDay(selectedDate).getTime() === today.getTime();
  const isSlotPast = (time) => {
    if (!isSelectedToday) return false;
    const [h, m] = time.split(":").map(Number);
    const slot = new Date();
    slot.setHours(h, m, 0, 0);
    return slot <= new Date();
  };

  const slots = availability?.slots ?? [];
  const booked = new Set(
    (availability?.booked ?? []).filter((s) => !(ignoreSlot && ignoreSlot.date === dateKey && ignoreSlot.time === s))
  );
  const closed = availability?.closed || (selectedDate && isClosedDay(selectedDate, doctor));

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-900">
          {weekDates[3].toLocaleDateString(locale, { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => shiftWeek(-1)}
            disabled={!canGoBack}
            aria-label={t("booking.prevWeek")}
            className="grid size-9 place-items-center rounded-full text-ink-600 ring-1 ring-ink-200 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <FiChevronLeft className="rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => shiftWeek(1)}
            aria-label={t("booking.nextWeek")}
            className="grid size-9 place-items-center rounded-full text-ink-600 ring-1 ring-ink-200 transition hover:bg-ink-50"
          >
            <FiChevronRight className="rtl:rotate-180" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDates.map((date) => {
          const disabled = date < today || isClosedDay(date, doctor);
          const selected = selectedDate && startOfDay(selectedDate).getTime() === date.getTime();
          const isToday = date.getTime() === today.getTime();
          return (
            <button
              type="button"
              key={date.toISOString()}
              disabled={disabled}
              onClick={() => onDateChange(date)}
              className={`relative flex flex-col items-center gap-1 rounded-2xl py-3 transition-all duration-300 ${
                selected
                  ? "gradient-primary text-white shadow-glow"
                  : disabled
                  ? "cursor-not-allowed text-ink-300"
                  : "bg-ink-50/70 text-ink-700 ring-1 ring-ink-100 hover:bg-white hover:ring-ink-300"
              }`}
            >
              <span className={`text-xs font-semibold uppercase ${selected ? "text-white/80" : "text-ink-400"}`}>
                {date.toLocaleDateString(locale, { weekday: "short" })}
              </span>
              <span className="text-lg font-semibold">{date.getDate()}</span>
              {isToday && !selected && <span className="absolute bottom-1.5 size-1 rounded-full bg-primary-500" />}
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">{t("booking.availableTimes")}</p>
        <div className="flex items-center gap-3 text-xs text-ink-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-ink-900" /> {t("booking.selected")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-ink-200" /> {t("booking.taken")}
          </span>
        </div>
      </div>

      {!doctor ? (
        <p className="mt-3 rounded-2xl bg-ink-50 p-4 text-center text-sm text-ink-500 ring-1 ring-ink-100">
          {t("booking.pickDoctorFirst")}
        </p>
      ) : closed ? (
        <p className="mt-3 rounded-2xl bg-ink-50 p-4 text-center text-sm text-ink-500 ring-1 ring-ink-100">
          {t("booking.closedDay")}
        </p>
      ) : (
        <div className={`mt-3 grid grid-cols-3 gap-2 transition-opacity sm:grid-cols-4 ${isFetching ? "opacity-50" : ""}`}>
          {slots.map((time) => {
            const taken = booked.has(time);
            const disabled = !selectedDate || isSlotPast(time) || taken;
            const selected = selectedTime === time && !disabled;
            return (
              <button
                type="button"
                key={time}
                disabled={disabled}
                onClick={() => onTimeChange(time)}
                title={taken ? t("booking.taken") : undefined}
                className={`h-11 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selected
                    ? "bg-ink-900 text-white shadow-soft"
                    : taken
                    ? "cursor-not-allowed bg-ink-100 text-ink-300"
                    : disabled
                    ? "cursor-not-allowed text-ink-300 line-through decoration-ink-200"
                    : "bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-400"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
