import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/forgot-password",
        {
          email,
        }
      );

      setMessage(response.data.status);
    } catch (error) {
      setMessage("Unable to send reset link. Please try again.");
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div className="h-screen flex md:items-center justify-center">
      <div className="w-[550px] mx-auto mt-10 p-4 shadow-lg rounded bg-white">
        <div className="flex items-center justify-center py-4">
          <img src="/images/logo.png" alt="icon" />
        </div>
        <div className="">
          <h2 className="text-lg md:text-xl font-semibold py-2 text-center">
            Forgot Your Password ?
          </h2>
          <p className="text-gray-400 text-sm pb-6 text-center">
            A code will be sent to your email, to help you reset your password
          </p>
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="email"
              className="text-left inline-block text-gray-600 font-bold mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-400 px-3 py-2 rounded-lg mb-3 focus:outline-none focus:border-primary-500 focus:border-2"
            />
            <button
              disabled={isSubmitted}
              type="submit"
              className={`w-full text-md md:text-lg bg-primary-500 text-white py-2 rounded-lg transition duration-300 hover:bg-blue-600  ${
                isSubmitted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isSubmitted ? "Sending..." : "Send Reset Link"}
            </button>
            <Link
              to="/login"
              className="w-full text-md md:text-lg text-zinc-600 font-bold rounded-lg pt-4 inline-block text-center"
            >
              <FaArrowLeft className="inline-block me-2" /> Back To Login
            </Link>
            {message && (
              <p className="mt-3 text-sm text-gray-700 text-center">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
