import { Link } from "react-router-dom";
import { FiArrowUpRight, FiCalendar, FiDollarSign, FiTrendingDown, FiTrendingUp, FiUserPlus, FiXCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { useAdminStats } from "../hooks/useAdmin";
import { usePageMeta } from "../hooks/usePageMeta";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { BarsChart, TrendChart } from "../components/dashboard/Charts";
import { Badge, Card, NotImplemented } from "../components/ui/Misc";
import { PageLoader } from "../components/ui/Spinner";

const Delta = ({ current, previous }) => {
  const { t } = useTranslation();
  if (!previous) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  const up = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[13px] font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <FiTrendingUp className="size-3.5" /> : <FiTrendingDown className="size-3.5" />}
      {up ? "+" : ""}
      {pct}% <span className="font-normal text-ink-400">{t("overview.vsLastMonth")}</span>
    </span>
  );
};

const Kpi = ({ icon: Icon, label, value, children, featured }) => (
  <div
    className={`relative overflow-hidden rounded-3xl p-6 ${
      featured ? "gradient-primary text-white shadow-glow" : "bg-white shadow-soft ring-1 ring-ink-200/70"
    }`}
  >
    {featured && <div className="absolute -end-10 -top-10 size-40 rounded-full bg-white/20 blur-2xl" />}
    <div className="relative flex items-center justify-between">
      <p className={`text-sm font-medium ${featured ? "text-white/80" : "text-ink-500"}`}>{label}</p>
      <span className={`grid size-9 place-items-center rounded-xl ${featured ? "bg-white/15 ring-1 ring-white/25" : "bg-primary-50 text-primary-500"}`}>
        <Icon className="size-4" />
      </span>
    </div>
    <p className="relative mt-5 text-4xl font-semibold tracking-tight">{value}</p>
    <div className={`relative mt-1 ${featured ? "[&_*]:!text-white/80" : ""}`}>{children}</div>
  </div>
);

const ChartCard = ({ title, subtitle, children, className = "" }) => (
  <Card className={`p-6 ${className}`}>
    <h3 className="font-semibold tracking-tight text-ink-900">{title}</h3>
    {subtitle && <p className="text-[13px] text-ink-400">{subtitle}</p>}
    <div className="mt-6">{children}</div>
  </Card>
);

export const AdminOverview = () => {
  const { t, i18n } = useTranslation();
  usePageMeta(t("nav.overview"));
  const { data: stats, isPending } = useAdminStats();
  const locale = i18n.language;

  if (isPending) return <PageLoader className="h-[60vh]" />;

  const money = (v) => `$${Number(v || 0).toLocaleString(locale)}`;
  const shortDate = (d) => new Date(`${d}T00:00:00`).toLocaleDateString(locale, { day: "numeric", month: "short" });
  const longDate = (d) => new Date(`${d}T00:00:00`).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
  const monthLabel = (m) => new Date(`${m}-01T00:00:00`).toLocaleDateString(locale, { month: "short" });
  const monthLong = (m) => new Date(`${m}-01T00:00:00`).toLocaleDateString(locale, { month: "long", year: "numeric" });

  return (
    <div>
      <PageHeader title={t("overview.title")} accent={t("overview.titleAccent")} description={t("overview.lead")} />

      {stats?.notImplemented ? (
        <NotImplemented endpoint="GET /api/admin/stats" />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi featured icon={FiCalendar} label={t("overview.today")} value={stats.today_appointments}>
              <span className="text-[13px]">{t("overview.upcomingCount", { count: stats.upcoming_appointments ?? 0 })}</span>
            </Kpi>
            <Kpi icon={FiDollarSign} label={t("overview.revenue")} value={money(stats.month_revenue)}>
              <Delta current={stats.month_revenue} previous={stats.previous_month_revenue} />
            </Kpi>
            <Kpi icon={FiUserPlus} label={t("overview.newPatients")} value={stats.new_patients_month}>
              <Delta current={stats.new_patients_month} previous={stats.previous_new_patients_month} />
            </Kpi>
            <Kpi icon={FiXCircle} label={t("overview.cancellationRate")} value={`${Math.round((stats.cancellation_rate ?? 0) * 100)}%`}>
              <span className="text-[13px] text-ink-400">{t("overview.last30")}</span>
            </Kpi>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <ChartCard title={t("overview.appointmentsPerDay")} subtitle={t("overview.last30")}>
              <TrendChart
                data={stats.appointments_by_day ?? []}
                xKey="date"
                yKey="count"
                tickFormat={shortDate}
                labelFormat={longDate}
                format={(v) => t("overview.appointmentsCount", { count: v })}
              />
            </ChartCard>
            <ChartCard title={t("overview.revenuePerMonth")} subtitle={t("overview.last6Months")}>
              <BarsChart
                data={stats.revenue_by_month ?? []}
                xKey="month"
                yKey="revenue"
                tickFormat={monthLabel}
                labelFormat={monthLong}
                format={money}
              />
            </ChartCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
            <ChartCard title={t("overview.popularServices")} subtitle={t("overview.last30")}>
              <BarsChart
                horizontal
                data={stats.services_breakdown ?? []}
                xKey="service"
                yKey="count"
                height={Math.max(160, (stats.services_breakdown?.length ?? 0) * 40)}
                format={(v) => v}
              />
            </ChartCard>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold tracking-tight text-ink-900">{t("overview.todaySchedule")}</h3>
                  <p className="text-[13px] text-ink-400">{new Date().toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" })}</p>
                </div>
                <Link to="/admin/dashboard/calendar" className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary-500 hover:underline">
                  {t("overview.openCalendar")} <FiArrowUpRight className="rtl:-scale-x-100" />
                </Link>
              </div>
              {stats.today?.length ? (
                <ul className="mt-5 divide-y divide-ink-100">
                  {stats.today.map((a) => (
                    <li key={a.id} className="flex items-center gap-4 py-3">
                      <span className="w-14 shrink-0 text-sm font-semibold tabular-nums text-ink-900" dir="ltr">
                        {a.time?.slice(0, 5)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link to={`/admin/dashboard/users/${a.user?.id ?? a.user_id}`} className="block truncate text-sm font-semibold text-ink-900 hover:underline">
                          {a.user?.name}
                        </Link>
                        <p className="truncate text-[13px] text-ink-400">
                          {a.service} · {a.doctor}
                        </p>
                      </div>
                      <Badge value={a.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-8 rounded-2xl bg-ink-50 p-6 text-center text-sm text-ink-500">{t("overview.noneToday")}</p>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
