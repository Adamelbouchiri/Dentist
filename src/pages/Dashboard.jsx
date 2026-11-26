import { FiCalendar, FiSettings, FiUser } from "react-icons/fi";
import { DashboardShell } from "../components/dashboard/DashboardShell";

const items = [
  { to: "/user/dashboard", label: "Profile", icon: FiUser, end: true },
  { to: "/user/dashboard/appointments", label: "Appointments", icon: FiCalendar },
  { to: "/user/dashboard/settings", label: "Settings", icon: FiSettings },
];

export const Dashboard = () => <DashboardShell role="user" label="My account" items={items} />;
