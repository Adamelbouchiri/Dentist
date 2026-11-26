import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const timeSlots = ["09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00"];
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

export const DateTimePicker = ({ selectedDate, onDateChange, selectedTime, onTimeChange }) => {
  const [weekStart, setWeekStart] = useState(() => getWeekStart());
  const today = startOfDay(new Date());

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

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-900">
          {weekDates[3].toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-1.5">
          <button
            onClick={() => shiftWeek(-1)}
            disabled={!canGoBack}
            aria-label="Previous week"
            className="grid size-9 place-items-center rounded-full text-ink-600 ring-1 ring-ink-200 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => shiftWeek(1)}
            aria-label="Next week"
            className="grid size-9 place-items-center rounded-full text-ink-600 ring-1 ring-ink-200 transition hover:bg-ink-50"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDates.map((date, i) => {
          const past = date < today;
          const selected = selectedDate && startOfDay(selectedDate).getTime() === date.getTime();
          const isToday = date.getTime() === today.getTime();
          return (
            <button
              key={date.toISOString()}
              disabled={past}
              onClick={() => onDateChange(date)}
              className={`relative flex flex-col items-center gap-1 rounded-2xl py-3 transition-all duration-300 ${
                selected
                  ? "gradient-primary text-white shadow-glow"
                  : past
                  ? "cursor-not-allowed text-ink-300"
                  : "bg-ink-50/70 text-ink-700 ring-1 ring-ink-100 hover:bg-white hover:ring-ink-300"
              }`}
            >
              <span className={`text-xs font-semibold uppercase tracking-wider ${selected ? "text-white/80" : "text-ink-400"}`}>
                {dayNames[i]}
              </span>
              <span className="text-lg font-semibold">{date.getDate()}</span>
              {isToday && !selected && <span className="absolute bottom-1.5 size-1 rounded-full bg-primary-500" />}
            </button>
          );
        })}
      </div>

      <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Available times</p>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {timeSlots.map((time) => {
          const disabled = !selectedDate || isSlotPast(time);
          const selected = selectedTime === time && !disabled;
          return (
            <button
              key={time}
              disabled={disabled}
              onClick={() => onTimeChange(time)}
              className={`h-11 rounded-full text-sm font-semibold transition-all duration-300 ${
                selected
                  ? "bg-ink-900 text-white shadow-soft"
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
    </div>
  );
};
