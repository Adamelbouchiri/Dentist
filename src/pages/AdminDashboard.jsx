import {
  FiBriefcase,
  FiCalendar,
  FiGrid,
  FiList,
  FiMail,
  FiSettings,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { useAdminMessages, useAdminReviews } from "../hooks/useAdmin";

export const AdminDashboard = () => {
  const { t } = useTranslation();
  // Unread / pending counts for the sidebar badges (silently 0 until endpoints exist)
  const { data: messages } = useAdminMessages({ status: "unread", page: 1 });
  const { data: reviews } = useAdminReviews({ status: "pending", page: 1 });

  const base = "/admin/dashboard";
  const items = [
    { to: base, label: t("nav.overview"), icon: FiGrid, end: true },
    { to: `${base}/appointments`, label: t("nav.appointments"), icon: FiList },
    { to: `${base}/calendar`, label: t("nav.calendar"), icon: FiCalendar },
    { to: `${base}/users`, label: t("nav.patients"), icon: FiUsers },
    { to: `${base}/messages`, label: t("nav.messages"), icon: FiMail, badge: messages?.total },
    { to: `${base}/reviews`, label: t("nav.reviewsAdmin"), icon: FiStar, badge: reviews?.total },
    { to: `${base}/catalog`, label: t("nav.catalog"), icon: FiBriefcase },
    { to: `${base}/settings`, label: t("nav.settings"), icon: FiSettings },
  ];

  return <DashboardShell role="admin" label={t("dashboard.admin")} items={items} />;
};
