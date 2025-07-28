import { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import AppContext from "../../context/AppProvider";
import { flash } from "../../utils/flash";

export const Register = () => {
  const { setToken } = useContext(AppContext);

  const navigate = useNavigate();

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        formData
      );

      const data = response.data;

      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/second-Registration");
    } catch (error) {
      setErrors(error.response.data.errors);
      flash.show(error.response.data.message, "error", 3000);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/api/auth/google/redirect";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://127.0.0.1:8000/api/auth/facebook/redirect";
  };

  return (
    <div className="flex justify-center py-10 px-4 lg:px-10 xl:px-38">
      <div className="w-full lg:w-1/2 p-2 lg:pe-12 xl:pe-20">
        <div className="flex justify-center">
          <img src="/images/logo.png" alt="login" />
        </div>

        <div className="pt-6">
          <h1 className="text-xl md:text-2xl lg:text-4xl">Create an Account</h1>
          <p className="text-gray-400 text-sm lg:text-md pt-2 font-semibold">
            Join us to see what the new smile looks like is gonna be
          </p>
        </div>

        <div className="pt-4">
          <form onSubmit={(e) => handleRegister(e)}>
            <div className="pb-2">
              <label
                htmlFor="full-name"
                className="text-md font-semibold text-primary-500"
              >
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                value={formData.name}
                className="w-full p-3 mt-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 shadow-[0_0_10px_#3802ff33]"
                placeholder="Enter your full name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            <div className="pb-2">
              <label
                htmlFor="email"
                className="text-md font-semibold text-primary-500"
              >
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                className="w-full p-3 mt-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 shadow-[0_0_10px_#3802ff33]"
                placeholder="Enter your email address"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            <div className="pb-2">
              <label
                htmlFor="password"
                className="text-md font-semibold text-primary-500"
              >
                Password
              </label>
              <div className="relative mt-4">
                <input
                  id="password"
                  type={showPassword1 ? "text" : "password"}
                  value={formData.password}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 shadow-[0_0_10px_#3802ff33]"
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                {showPassword1 ? (
                  <FaEye
                    className="absolute top-1/2 right-4 translate-y-[-50%] text-gray-400 text-2xl cursor-pointer"
                    onClick={() => setShowPassword1(!showPassword1)}
                  />
                ) : (
                  <FaEyeSlash
                    className="absolute top-1/2 right-4 translate-y-[-50%] text-gray-400 text-2xl cursor-pointer"
                    onClick={() => setShowPassword1(!showPassword1)}
                  />
                )}
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}
            </div>

            <div className="pb-2">
              <label
                htmlFor="confirm-password"
                className="text-md font-semibold text-primary-500"
              >
                Confirm Password
              </label>
              <div className="relative mt-4">
                <input
                  id="confirm-password"
                  type={showPassword2 ? "text" : "password"}
                  value={formData.password_confirmation}
                  className="w-full p-3  rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 shadow-[0_0_10px_#3802ff33]"
                  placeholder="Confirm your password"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password_confirmation: e.target.value,
                    })
                  }
                />
                {showPassword2 ? (
                  <FaEye
                    className="absolute top-1/2 right-4 translate-y-[-50%] text-gray-400 text-2xl cursor-pointer"
                    onClick={() => setShowPassword2(!showPassword2)}
                  />
                ) : (
                  <FaEyeSlash
                    className="absolute top-1/2 right-4 translate-y-[-50%] text-gray-400 text-2xl cursor-pointer"
                    onClick={() => setShowPassword2(!showPassword2)}
                  />
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className={`w-full mt-6 p-2 rounded-full bg-primary-500 text-white font-semibold ${loading ? "cursor-not-allowed" : " cursor-pointer"}`}>
              { loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="relative">
              <hr className="mt-6 text-gray-200" />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-300 font-semibold">
                Or
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 xl:gap-8 mt-6">
              <button
                onClick={() => {
                  handleGoogleLogin();
                }}
                className="flex items-center w-full  p-2 rounded-full bg-gray-100 text-zinc-800 font-semibold cursor-pointer"
              >
                <img
                  src="/images/google.png"
                  alt="google"
                  className=" w-6 h-6"
                />{" "}
                <span className="ps-4">Continue with Google</span>
              </button>

              <button
                onClick={() => {
                  handleFacebookLogin();
                }}
                className="flex items-center w-full  p-2 rounded-full bg-gray-100 text-zinc-800 font-semibold cursor-pointer"
              >
                <FaFacebook className="text-xl text-blue-700" />{" "}
                <span className="ps-4">Continue with Facebook</span>
              </button>
            </div>
          </form>

          <div className="flex justify-center pt-6">
            <p className="text-gray-400 text-sm lg:text-md font-semibold">
              Already have an account ?{" "}
              <Link
                to={"/login"}
                className="text-primary-500 underline font-bold"
              >
                Sign In
              </Link>
            </p>
          </div>
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
