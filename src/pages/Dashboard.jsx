import { FiCalendar, FiSettings, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { DashboardShell } from "../components/dashboard/DashboardShell";

export const Dashboard = () => {
  const { t } = useTranslation();
  const items = [
    { to: "/user/dashboard", label: t("nav.profile"), icon: FiUser, end: true },
    { to: "/user/dashboard/appointments", label: t("nav.appointments"), icon: FiCalendar },
    { to: "/user/dashboard/settings", label: t("nav.settings"), icon: FiSettings },
  ];
  return <DashboardShell role="user" label={t("dashboard.myAccount")} items={items} />;
};
