import { FiPlus, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const DEFAULT_HOURS = {
  mon: [["09:30", "12:30"], ["14:00", "16:30"]],
  tue: [["09:30", "12:30"], ["14:00", "16:30"]],
  wed: [["09:30", "12:30"], ["14:00", "16:30"]],
  thu: [["09:30", "12:30"], ["14:00", "16:30"]],
  fri: [["09:30", "12:30"], ["14:00", "16:30"]],
  sat: [["09:30", "12:30"]],
  sun: [],
};

const timeInput =
  "h-9 w-24 rounded-xl bg-white px-2 text-sm text-ink-900 ring-1 ring-inset ring-ink-200 outline-none focus:ring-2 focus:ring-primary-500";

/** Edit `{ mon: [["09:30","12:30"], ...], ... }`. */
export const WorkingHoursEditor = ({ value = DEFAULT_HOURS, onChange }) => {
  const { t } = useTranslation();
  const set = (day, ranges) => onChange({ ...value, [day]: ranges });

  return (
    <div className="divide-y divide-ink-100 rounded-2xl ring-1 ring-ink-200/70">
      {WEEKDAYS.map((day) => {
        const ranges = value[day] ?? [];
        const open = ranges.length > 0;
        return (
          <div key={day} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <label className="flex w-28 cursor-pointer items-center gap-2 text-sm font-semibold text-ink-800">
              <input
                type="checkbox"
                checked={open}
                onChange={(e) => set(day, e.target.checked ? [["09:30", "12:30"]] : [])}
                className="size-4 accent-[#3802ff]"
              />
              {t(`weekdays.${day}`)}
            </label>
            {open ? (
              <div className="flex flex-1 flex-wrap items-center gap-2" dir="ltr">
                {ranges.map(([from, to], i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-2xl bg-ink-50 p-1 ring-1 ring-ink-100">
                    <input
                      type="time"
                      step="1800"
                      value={from}
                      onChange={(e) => set(day, ranges.map((r, k) => (k === i ? [e.target.value, r[1]] : r)))}
                      className={timeInput}
                    />
                    <span className="text-ink-400">–</span>
                    <input
                      type="time"
                      step="1800"
                      value={to}
                      onChange={(e) => set(day, ranges.map((r, k) => (k === i ? [r[0], e.target.value] : r)))}
                      className={timeInput}
                    />
                    <button
                      type="button"
                      onClick={() => set(day, ranges.filter((_, k) => k !== i))}
                      aria-label={t("common.remove")}
                      className="grid size-7 place-items-center rounded-lg text-ink-400 hover:bg-white hover:text-red-500"
                    >
                      <FiX className="size-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => set(day, [...ranges, ["14:00", "16:30"]])}
                  className="inline-flex h-9 items-center gap-1 rounded-xl px-2.5 text-[13px] font-semibold text-primary-500 hover:bg-primary-50"
                >
                  <FiPlus className="size-3.5" /> {t("catalog.addHours")}
                </button>
              </div>
            ) : (
              <span className="text-sm text-ink-400">{t("catalog.closed")}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
