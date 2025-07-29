import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { FiUser, FiCalendar, FiSettings, FiLogOut } from "react-icons/fi";
import { useContext, useEffect, useRef, useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import AppContext from "../context/AppProvider";
import { flash } from "../utils/flash";
import axios from "axios";
import { BounceLoader } from "react-spinners";

export const Dashboard = () => {
  const { user, setUser, token, setToken, loadingUser } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#3802ff" size={50} />
      </div>
    );
  }

  if (user.role !== "user") {
    return <Navigate to="/" />;
  }

  async function handleLogout() {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (response.status === 200) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUser(null);
        setToken(null);
        flash.show(data.message, "success", 3000);
        navigate("/");
      }
    } catch (error) {
      
      flash.show(error.response.data.message, "error", 3000);
    } finally {
      setLoading(false);
    }
  }

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
            <h2 className="text-xl md:text-3xl font-bold text-accent-500">
              Dashboard
            </h2>
          </div>
          {/* Side Menu */}
          <div className="relative">
            {/* Navigation */}
            <ul className="space-y-3">
              <li>
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/user/dashboard"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-primary-500 transition-all duration-300 group backdrop-blur-sm ${
                    location.pathname === "/user/dashboard"
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
                  onClick={() => setIsOpen(false)}
                  to="appointments"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-primary-500 transition-all duration-300 group backdrop-blur-sm ${
                    location.pathname === "/user/dashboard/appointments"
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
                  onClick={() => setIsOpen(false)}
                  to="settings"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-primary-500  transition-all duration-300 group backdrop-blur-sm ${
                    location.pathname === "/user/dashboard/settings"
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
        <button
          onClick={handleLogout}
          className="flex bottom-4 absolute w-[80%] items-center align-bottom space-x-3 px-4 py-3 rounded-lg cursor-pointer text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group backdrop-blur-sm"
        >
          <FiLogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">
            {loading ? "Logging out..." : "Logout"}
          </span>
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
