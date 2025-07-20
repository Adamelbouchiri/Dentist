import { useContext, useEffect, useRef, useState } from "react";

// icons
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FaTooth } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { BiHomeAlt } from "react-icons/bi";
import { MdOutlineComment } from "react-icons/md";
import { FaRegEnvelope } from "react-icons/fa";
import { TiPlusOutline } from "react-icons/ti";
import { FiUser } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import AppContext from "../../context/AppProvider";
import { Link, Links } from "react-router-dom";

export const Navigation = () => {
  const BASE_URL = "http://127.0.0.1:8000";

  const { user } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);

  const [active, setActive] = useState("home");

  const [shadow, setShadow] = useState(false);

  const navRef = useRef(null);

  const navItems = [
    {
      name: "home",
      icon: <BiHomeAlt className="text-xl" />,
    },
    {
      name: "reviews",
      icon: <MdOutlineComment className="text-xl" />,
    },
    {
      name: "services",
      icon: <FaTooth className="text-xl" />,
    },
    {
      name: "contact",
      icon: <FaRegEnvelope className="text-xl" />,
    },
    {
      name: "dentists",
      icon: <TiPlusOutline className="text-xl" />,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div
      className={`lg:px-10 2xl:px-32 py-6  bg-white sticky top-0 left-0 z-50 transition-all duration-300 ${
        shadow ? "shadow-lg" : ""
      }`}
    >
      <div className="items-center justify-between hidden lg:flex">
        <ul className="flex items-center gap-8 xl:gap-14">
          <li className="font-bold py-2 px-6 rounded-3xl bg-gray-100 cursor-pointer text-sm xl:text-md">
            <a href="#home">Home</a>
          </li>
          <li className="font-bold py-2 px-6 rounded-3xl bg-gray-100 cursor-pointer text-sm xl:text-md">
            <a href="#services">Services</a>
          </li>
          <li className="font-bold py-2 px-6 rounded-3xl bg-gray-100 cursor-pointer text-sm xl:text-md">
            <a href="#reviews">Reviews</a>
          </li>
        </ul>

        <div className="px-6">
          <img src="./images/logo.png" alt="dentist" className="min-w-38" />
        </div>

        <ul className="flex items-center gap-8 xl:gap-14">
          <li className="font-bold py-2 px-6 rounded-3xl bg-gray-100 cursor-pointer text-sm xl:text-md">
            <a href="#contact">Contact</a>
          </li>
          <li className="font-bold py-2 px-6 rounded-3xl bg-gray-100 cursor-pointer text-sm xl:text-md">
            <a href="#dentists">Dentists</a>
          </li>
          {user ? (
            <Link
              to="/dashboard"
              className="flex gap-4 items-center font-bold py-2 px-6 rounded-3xl  cursor-pointer"
            >
              <div>{user?.name}</div>
              {user?.avatar?.startsWith("http") ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-12 h-12 rounded-lg"
                />
              ) : user?.avatar ? (
                <img
                  src={`${BASE_URL}/storage/images/${user.avatar}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-lg"
                />
              ) : (
                <span className="bg-accent-500 inline-block rounded-lg p-2">
                  <FiUser className="text-2xl text-zinc-100 " />
                </span>
              )}
            </Link>
          ) : (
            <li className="flex items-center font-bold text-sm py-2 px-6 rounded-3xl gradient bg-gradient-to-r from-[#c7bbff] to-accent-500 ">
              <Link to="/login">Login</Link>
              <span className="px-1">/</span>
              <Link to="/register">Register</Link>
            </li>
          )}
        </ul>
      </div>

      {/* mobile sidebar */}
      <div className="lg:hidden block px-10">
        <div className="flex justify-between items-center">
          <span onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
            <HiOutlineMenuAlt2 className="text-3xl text-zinc-600" />
          </span>

          <img src="./images/logo.png" alt="" />

          <div className=""></div>
        </div>
      </div>

      <div
        ref={navRef}
        className={`lg:hidden flex flex-col justify-between fixed top-0 h-full p-6 w-2/3 bg-white z-100 shadow-xl duration-200 transition-all ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="">
          <div className="flex justify-end">
            <MdClose
              onClick={() => setIsOpen(!isOpen)}
              className="text-3xl text-zinc-600 cursor-pointer"
            />
          </div>

          <div className="flex justify-center">
            <img src="./images/logo.png" alt="dentist" />
          </div>

          <ul className="mt-10">
            {navItems.map((item) => (
              <li
                key={item.name}
                onClick={() => {
                  setActive(item.name);
                  setIsOpen(false);
                }}
                className={`  text-lg items-center font-bold rounded-lg duration-300 transition-colors cursor-pointer hover:bg-primary-500 hover:text-white ${
                  active !== item.name && "text-zinc-400"
                } ${active === item.name && "bg-primary-500 text-white"} mb-4`}
              >
                <a
                  href={`#${item.name}`}
                  className="capitalize py-3 px-4 flex items-center gap-4"
                >
                  {item.icon} {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full">
          <Link
            to="/create-appointments"
            className=" block cursor-pointer font-bold py-3 px-6 rounded-3xl gradient bg-gradient-to-r from-[#c7bbff] to-accent-500"
          >
            Book Appointment
          </Link>

          {user ? (
            <Link
              to="/dashboard"
              className="mt-10 flex items-center gap-4 cursor-pointer"
            >
              {user?.avatar?.startsWith("http") ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-12 h-12 rounded-lg"
                />
              ) : user?.avatar ? (
                <img
                  src={`${BASE_URL}/storage/images/${user.avatar}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-lg"
                />
              ) : (
                <span className="bg-accent-500 inline-block rounded-lg p-2">
                  <FiUser className="text-2xl text-zinc-100 " />
                </span>
              )}

              <div className="flex justify-between items-center w-full">
                <div className="">
                  <h3 className="font-bold text-lg">{user?.name}</h3>
                  <p className="text-sm text-zinc-400">
                    {user.facebook_id ? "Facebook" : user?.email}
                  </p>
                </div>

                <IoIosArrowForward className="text-2xl text-zinc-400" />
              </div>
            </Link>
          ) : (
            <div className="mt-4 flex items-center gap-2">
              <Link
                to="/login"
                className="font-bold p-2 text-center rounded-3xl gradient bg-gradient-to-r from-[#c7bbff] to-accent-500 flex-1"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="font-bold p-2 text-center rounded-3xl gradient bg-gradient-to-r from-[#c7bbff] to-accent-500 flex-1"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
