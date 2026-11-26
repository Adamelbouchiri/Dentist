import { FiCalendar, FiSettings, FiUsers } from "react-icons/fi";
import { DashboardShell } from "../components/dashboard/DashboardShell";

const items = [
  { to: "/admin/dashboard", label: "Appointments", icon: FiCalendar, end: true },
  { to: "/admin/dashboard/users", label: "Patients", icon: FiUsers },
  { to: "/admin/dashboard/settings", label: "Settings", icon: FiSettings },
];

export const AdminDashboard = () => <DashboardShell role="admin" label="Admin" items={items} />;
