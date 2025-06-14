import { useContext, useState } from "react";
import { FaCheck, FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../context/AppProvider";
import axios from "axios";

export const Login = () => {
  const navigate = useNavigate();

  const { setToken } = useContext(AppContext);

  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleCheck = (e) => {
    setChecked(e.target.checked);
  };

  async function handleLogin(e) {
    e.preventDefault();

    console.log(formData);
    
    setErrors({});

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        formData
      );

      const data = response.data;

      localStorage.setItem("token", data.token);
      setToken(data.token);
      // navigate('/');
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  }

  return (
    <div className="flex justify-center py-10 px-6 lg:px-12 xl:px-40">
      <div className="w-full lg:w-1/2 p-4 lg:pe-12 xl:pe-20">
        <div className="flex justify-center">
          <img src="/images/logo.png" alt="login" />
        </div>

        <div className="pt-14">
          <h1 className="text-xl md:text-2xl lg:text-4xl">Sign In</h1>
          <p className="text-gray-500 text-sm md:text-base lg:text-lg pt-4 font-semibold">
            Don't have an account ?{" "}
            <Link
              to={"/register"}
              className="text-primary-500 underline font-bold"
            >
              Create now
            </Link>
          </p>
        </div>

        <div className="pt-10">
          <form onSubmit={(e) => handleLogin(e)} action="">
            <div className="pb-4">
              <label
                htmlFor="email"
                className="text-md font-semibold text-primary-500"
              >
                Email
              </label>
              <input
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                id="email"
                type="email"
                className="w-full p-3 mt-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 shadow-[0_0_10px_#3802ff33]"
                placeholder="Enter your email address"
                value={formData.email}
              />
            </div>

            <div className="pb-4">
              <label
                htmlFor="password"
                className="text-md font-semibold text-primary-500"
              >
                Password
              </label>
              <input
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                id="password"
                type="password"
                className="w-full p-3 mt-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 shadow-[0_0_10px_#3802ff33]"
                placeholder="Enter your password"
                value={formData.password}
              />
            </div>

            <div className="flex justify-between">
              <label
                htmlFor="save"
                className="inline-flex items-center cursor-pointer"
              >
                <input
                  onChange={(e) => handleCheck(e)}
                  id="save"
                  type="checkbox"
                  className="peer hidden"
                />
                <div className="w-5 h-5 border-2 border-gray-200 shadow-lg rounded-md peer-checked:bg-[#3802ff] peer-checked:border-transparent flex items-center justify-center transition">
                  <FaCheck className="text-white text-xs " />
                </div>
                <span className="ml-2 text-gray-700">Save account</span>
              </label>

              <a href="#" className="text-primary-500 underline font-bold">
                Forgot password ?
              </a>
            </div>

            <button className="w-full mt-6 p-2 rounded-full bg-primary-500 text-white font-semibold cursor-pointer">
              Sign In
            </button>

            <div className="relative">
              <hr className="mt-6 text-gray-200" />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-300 font-semibold">
                Or
              </span>
            </div>

            <button className="relative w-full mt-6 p-2 rounded-full bg-gray-100 text-zinc-800 font-semibold cursor-pointer">
              <img
                src="/images/google.png"
                alt="google"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6"
              />{" "}
              <span>Continue with Google</span>
            </button>

            <button className="relative w-full mt-6 p-2 rounded-full bg-gray-100 text-zinc-800 font-semibold cursor-pointer">
              <FaFacebook className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-700" />{" "}
              <span>Continue with Facebook</span>
            </button>
          </form>
        </div>
      </div>

      <div className="w-1/2 gradient-primary-to-b h-full rounded-xl px-6 xl:px-10 py-8 hidden lg:block">
        <div className="flex justify-center py-10">
          <img src="/images/logo-icon.png" alt="login" className="" />
        </div>

        <div className="text-center">
          <h1 className="text-3xl text-white">
            Transform your smile{" "}
            <span className="font-bold block">with the care it deserves</span>
          </h1>
        </div>

        <div className="flex justify-center py-10">
          <img src="/images/login-img.png" alt="login" className="w-[250px]" />
        </div>

        <div className="text-center">
          <h1 className="text-3xl text-white font-bold">
            A healthy smile can change <br /> your life.{" "}
            <span className="font-normal ">Take care of yours!</span>
          </h1>
        </div>

        <div className="py-6">
          <div className="bg-white rounded-xl p-4">
            <h1 className="text-lg font-bold">Join with 20k+ patients</h1>
            <p className="text-sm text-gray-400">
              Let's see our happy patients
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
