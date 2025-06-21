import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    setIsSubmitted(true);
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage(res.data.status);
    } catch (error) {
      setMessage(
        "Failed to reset password. Please check the link or try again."
      );
    } finally {
      setIsSubmitted(false);
      navigate("/login");
    }
  };

  return (
    <div className="flex md:items-center justify-center h-screen">
      <div className="w-[550px] mx-auto mt-10 p-4 shadow-lg rounded bg-white">
        <div className="flex items-center justify-center py-4">
          <img src="/images/logo.png" alt="icon" />
        </div>
        <div className="">
          <h2 className="text-2xl font-semibold py-4 text-center">
            Reset Your Password
          </h2>
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="password"
              className="block text-lg text-zinc-600 font-bold mb-2"
            >
              Password :
            </label>
            <input
              id="password"
              type="password"
              placeholder="New password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-400 focus:outline-none focus:border-primary-500 px-3 py-2 rounded-lg mb-6"
            />

            <label
              htmlFor="confirm-password"
              className="block text-lg text-zinc-600 font-bold mb-2"
            >
              Confirm Password :
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm password"
              value={passwordConfirmation}
              required
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full border-2 border-gray-400 focus:outline-none focus:border-primary-500 px-3 py-2 rounded-lg mb-3"
            />
            <button
              disabled={isSubmitted}
              type="submit"
              className={`w-full bg-primary-500 text-md md:text-lg text-white py-2 rounded-lg transition-colors duration-300 hover:bg-blue-600 ${
                isSubmitted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isSubmitted ? "Resetting..." : "Reset Password"}
            </button>
            <Link
              to="/login"
              className="w-full text-md md:text-lg text-zinc-600 font-bold rounded-lg pt-4 inline-block text-center"
            >
              <FaArrowLeft className="inline-block me-2" /> Back To Login
            </Link>
            {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};
