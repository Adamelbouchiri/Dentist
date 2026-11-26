import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Single-series charts: one brand hue, recessive grid & axes, hover tooltip on every chart.
const SERIES = "#3802ff";
const GRID = "#ececf3";
const AXIS = "#8a8aa3";

const axisProps = {
  stroke: AXIS,
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

const ChartTooltip = ({ active, payload, label, format = (v) => v, labelFormat = (l) => l }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white px-3 py-2 text-[13px] shadow-[0_12px_30px_-10px_rgb(11_10_26/0.3)] ring-1 ring-ink-200/70">
      <p className="text-ink-500">{labelFormat(label)}</p>
      <p className="mt-0.5 flex items-center gap-2 font-semibold text-ink-900">
        <span className="size-2 rounded-full" style={{ background: SERIES }} />
        {format(payload[0].value)}
      </p>
    </div>
  );
};

/** Change over time (appointments per day). */
export const TrendChart = ({ data, xKey, yKey, format, labelFormat, tickFormat, height = 240 }) => (
  <div dir="ltr" style={{ height }}>
    <ResponsiveContainer>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES} stopOpacity={0.18} />
            <stop offset="100%" stopColor={SERIES} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey={xKey} {...axisProps} tickFormatter={tickFormat} minTickGap={24} />
        <YAxis {...axisProps} allowDecimals={false} width={40} />
        <Tooltip
          cursor={{ stroke: AXIS, strokeDasharray: "3 3" }}
          content={<ChartTooltip format={format} labelFormat={labelFormat} />}
        />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={SERIES}
          strokeWidth={2}
          fill="url(#trendFill)"
          activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

/** Magnitude per category (revenue per month, vertical) or ranking (services, horizontal). */
export const BarsChart = ({ data, xKey, yKey, format, axisFormat = format, labelFormat, tickFormat, horizontal = false, height = 240 }) => (
  <div dir="ltr" style={{ height }}>
    <ResponsiveContainer>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 8, left: horizontal ? 8 : -16, bottom: 0 }}
        barCategoryGap={horizontal ? 10 : "28%"}
      >
        <CartesianGrid horizontal={!horizontal} vertical={horizontal} stroke={GRID} />
        {horizontal ? (
          <>
            <XAxis type="number" {...axisProps} allowDecimals={false} tickFormatter={axisFormat} />
            <YAxis type="category" dataKey={xKey} {...axisProps} width={140} tick={{ fill: "#45455c", fontSize: 12 }} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} {...axisProps} tickFormatter={tickFormat} />
            <YAxis {...axisProps} width={64} tickFormatter={axisFormat} />
          </>
        )}
        <Tooltip cursor={{ fill: "rgb(56 2 255 / 0.05)" }} content={<ChartTooltip format={format} labelFormat={labelFormat} />} />
        <Bar
          dataKey={yKey}
          fill={SERIES}
          radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
          maxBarSize={horizontal ? 18 : 36}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
