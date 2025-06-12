import { useState } from "react";
import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Register = () => {

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  }

  return (
    <div className="flex justify-center py-10 px-6 lg:px-10 xl:px-38">
      <div className="w-full lg:w-1/2 p-4 lg:pe-12 xl:pe-20">
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
          <form onSubmit={(e) => handleSubmit(e)}>
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
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
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
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
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
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                {
                  showPassword1 ? (
                    <FaEye
                      className="absolute top-1/2 right-4 translate-y-[-50%] text-gray-400 text-2xl cursor-pointer"
                      onClick={() => setShowPassword1(!showPassword1)}
                    />
                  ) : (
                    <FaEyeSlash
                      className="absolute top-1/2 right-4 translate-y-[-50%] text-gray-400 text-2xl cursor-pointer"
                      onClick={() => setShowPassword1(!showPassword1)}
                    />
                  )
                }
              
              </div>
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
                  onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                />
                {
                  showPassword2 ? (
                    <FaEye
                      className="absolute top-1/2 right-4 translate-y-[-50%] text-gray-400 text-2xl cursor-pointer"
                      onClick={() => setShowPassword2(!showPassword2)}
                    />
                  ) : (
                    <FaEyeSlash
                      className="absolute top-1/2 right-4 translate-y-[-50%] text-gray-400 text-2xl cursor-pointer"
                      onClick={() => setShowPassword2(!showPassword2)}
                    />
                  )
                }
              </div>
            </div>

            <button className="w-full mt-6 p-2 rounded-full bg-primary-500 text-white font-semibold cursor-pointer">
              Create Account
            </button>

            <div className="relative">
              <hr className="mt-6 text-gray-200" />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-300 font-semibold">
                Or
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 xl:gap-8 mt-6">
              <button className="flex items-center w-full  p-2 rounded-full bg-gray-100 text-zinc-800 font-semibold cursor-pointer">
                <img
                  src="/images/google.png"
                  alt="google"
                  className=" w-6 h-6"
                />{" "}
                <span className="ps-4">Continue with Google</span>
              </button>

              <button className="flex items-center w-full  p-2 rounded-full bg-gray-100 text-zinc-800 font-semibold cursor-pointer">
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
