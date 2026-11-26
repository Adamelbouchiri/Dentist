import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { Spinner } from "../ui/Spinner";

export const Table = ({ columns, children, fetching }) => (
  <div className="relative overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink-200/70">
    {fetching && (
      <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden">
        <div className="h-full w-1/3 animate-[shimmer_1.2s_ease-in-out_infinite] gradient-primary" />
      </div>
    )}
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-ink-100 bg-ink-50/60">
            {columns.map((c) => (
              <th
                key={c.label}
                className={`whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-400 ${
                  c.align === "center" ? "text-center" : c.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y divide-ink-100 transition-opacity ${fetching ? "opacity-60" : ""}`}>{children}</tbody>
      </table>
    </div>
  </div>
);

export const Pagination = ({ page, lastPage, total, onChange, disabled }) => (
  <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
    <p className="text-sm text-ink-500">
      Page <span className="font-semibold text-ink-900">{page}</span> of{" "}
      <span className="font-semibold text-ink-900">{lastPage}</span>
      {total != null && <span className="text-ink-400"> · {total} results</span>}
    </p>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(page - 1, 1))}
        disabled={page <= 1 || disabled}
        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-ink-700 ring-1 ring-ink-200 transition hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronLeft /> Previous
      </button>
      <button
        onClick={() => onChange(Math.min(page + 1, lastPage))}
        disabled={page >= lastPage || disabled}
        className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink-900 px-4 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <FiChevronRight />
      </button>
    </div>
  </div>
);

/** Search input that submits on Enter / button. */
export const SearchBar = ({ value, onChange, onSubmit, placeholder, loading }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
    className="flex flex-1 items-center gap-2 rounded-full bg-white p-1.5 pl-4 ring-1 ring-ink-200 transition focus-within:ring-2 focus-within:ring-primary-500"
  >
    <FiSearch className="size-4 shrink-0 text-ink-400" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
    />
    <button
      type="submit"
      className="inline-flex h-9 items-center gap-2 rounded-full gradient-primary px-5 text-sm font-semibold text-white"
    >
      {loading && <Spinner className="size-3.5" />} Search
    </button>
  </form>
);

export const Segmented = ({ options, value, onChange }) => (
  <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-ink-200">
    {options.map((o) => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300 ${
          value === o.value ? "bg-ink-900 text-white shadow-soft" : "text-ink-500 hover:text-ink-900"
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);
