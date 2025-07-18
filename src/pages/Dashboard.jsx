import { Link, Outlet } from "react-router-dom";
import { FiUser, FiCalendar, FiSettings, FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";

export const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("profile");

  return (
    <div className="flex">
      <aside
        className={`${
          isOpen ?  "translate-x-0 shadow-2xl" : "translate-x-[-100%]" 
        } fixed w-64 bg-white lg:shadow-2xl lg:translate-x-0 h-screen p-6 lg:relative overflow-hidden transition-all duration-300`}
      >
        <div className="relative z-10">
          {/* Logo/Brand */}
          <div className="flex justify-center items-center mb-8  px-4 py-2 rounded-lg border-b border-gray-200">
            <h2 className="text-3xl font-bold text-accent-500">Dashboard</h2>
          </div>

          {/* Navigation */}
          <ul className="space-y-3">
            <li>
              <Link
                onClick={() => setActive("profile")}
                to="/dashboard"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-primary-500 transition-all duration-300 group backdrop-blur-sm ${
                  active === "profile" ? "bg-primary-500 text-white" : ""
                }`}
              >
                <FiUser className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setActive("appointments")}
                to="appointments"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-primary-500 transition-all duration-300 group backdrop-blur-sm ${
                  active === "appointments" ? "bg-primary-500 text-white" : ""
                }`}
              >
                <FiCalendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Appointments</span>
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setActive("settings")}
                to="settings"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-primary-500  transition-all duration-300 group backdrop-blur-sm ${
                  active === "settings" ? "bg-primary-500 text-white" : ""
                }`}
              >
                <FiSettings className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Settings</span>
              </Link>
            </li>
            <li className="pt-4">
              <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg cursor-pointer text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group backdrop-blur-sm">
                <FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-50 h-screen">
        <Outlet />
      </main>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-4 z-50 lg:hidden bg-primary-500 text-white p-1 rounded-lg cursor-pointer transition-all duration-300"
      >
        {isOpen ? (
          <IoClose
            className="w-6 h-6 rotate-180 transition-all duration-300"
          />
        ) : (
          <IoMenu className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};
