import { Link, Outlet, useLocation } from "react-router-dom";
import { FiUser, FiCalendar, FiSettings, FiLogOut } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { FaHome } from "react-icons/fa";

export const Dashboard = () => {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("profile");
  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex">
      <aside
        ref={navRef}
        className={`${
          isOpen ? "translate-x-0 shadow-2xl" : "translate-x-[-100%]"
        } fixed w-64 bg-white lg:shadow-2xl lg:translate-x-0 h-screen p-6 lg:relative overflow-hidden transition-all duration-300 z-50`}
      >
        <div className="relative ">
          {/* Logo/Brand */}
          <div className="flex justify-center items-center mb-8  px-4 py-2 rounded-lg border-b border-gray-200">
            <h2 className="text-3xl font-bold text-accent-500">Dashboard</h2>
          </div>
          {/* Side Menu */}
          <div className="relative">
            {/* Navigation */}
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-primary-500 transition-all duration-300 group backdrop-blur-sm ${
                    location.pathname === "/dashboard"
                      ? "bg-primary-500 text-white"
                      : ""
                  }`}
                >
                  <FiUser className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="appointments"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-primary-500 transition-all duration-300 group backdrop-blur-sm ${
                    location.pathname === "/dashboard/appointments"
                      ? "bg-primary-500 text-white"
                      : ""
                  }`}
                >
                  <FiCalendar className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Appointments</span>
                </Link>
              </li>
              <li>
                <Link
                  to="settings"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-primary-500  transition-all duration-300 group backdrop-blur-sm ${
                    location.pathname === "/dashboard/settings"
                      ? "bg-primary-500 text-white"
                      : ""
                  }`}
                >
                  <FiSettings className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Settings</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-primary-500 transition-all duration-300 group backdrop-blur-sm"
                >
                  <FaHome className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />{" "}
                  <span className="font-medium">Home</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <button className="flex bottom-4 absolute w-[80%] items-center align-bottom space-x-3 px-4 py-3 rounded-lg cursor-pointer text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group backdrop-blur-sm">
          <FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      <main className="flex-1 p-6 h-screen overflow-y-auto bg-gray-50">
        <Outlet />
      </main>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-4 z-50 lg:hidden bg-primary-500 text-white p-2 rounded-md cursor-pointer transition-all duration-300"
      >
        {isOpen ? (
          <IoClose className="w-6 h-6 rotate-180 transition-all duration-300 text-2xl" />
        ) : (
          <IoMenu className="w-6 h-6 text-2xl" />
        )}
      </button>
    </div>
  );
};
