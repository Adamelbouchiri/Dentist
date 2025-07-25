import axios from "axios";
import { useContext, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaRegEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import AppContext from "../../context/AppProvider";
import { useNavigate } from "react-router-dom";

// Step3_ContactInfo.jsx

export default function Step3({ formData, updateData, prevStep }) {
  const navigate = useNavigate();

  const { token } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  const methods = [
    {
      name: "Phone Call",
      icon: <FaPhoneAlt className="text-xl mb-4" />,
    },
    { name: "WhatsApp", icon: <FaWhatsapp className="text-2xl mb-4" /> },
    { name: "Email", icon: <FaRegEnvelope className="text-xl mb-4" /> },
  ];

  async function handleContinue() {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/second-registration",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/");
      setIsLoading(false);
    }
  }

  console.log(formData);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Preferred Contact Method?</h2>
      <div className="flex gap-4 mb-6">
        {methods.map((method) => (
          <div
            key={method.name}
            onClick={() => updateData({ contactMethod: method.name })}
            className={`relative flex flex-col justify-center items-center w-32 h-32 md:w-36 md:h-36 p-4 rounded-lg border-2 bg-white font-bold text-lg cursor-pointer ${
              formData.contactMethod === method.name
                ? "border-primary-500 text-primary-500 checked-box"
                : "border-gray-200"
            }`}
          >
            {method.icon}
            <span className="text-sm md:text-base">{method.name}</span>
          </div>
        ))}
      </div>

      {(formData.contactMethod === "Phone Call" ||
        formData.contactMethod === "WhatsApp") && (
        <div className="">
          <label
            htmlFor="phone"
            className="font-bold text-lg mb-4 inline-block"
          >
            Phone Number :
          </label>
          <input
            id="phone"
            type="text"
            placeholder="Phone number"
            value={formData.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            className="mb-8 p-2 w-full border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          />
        </div>
      )}

      {formData.contactMethod === "Email" && (
        <div className="">
          <label
            htmlFor="email"
            className="font-bold text-lg mb-4 inline-block"
          >
            Your Email :
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className="mb-8 p-2 w-full border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          />
        </div>
      )}

      <div className="">
        <label
          htmlFor="address"
          className="font-bold text-lg mb-4 inline-block"
        >
          Your home address (optional) :
        </label>
        <input
          id="address"
          type="text"
          placeholder="Home Address"
          value={formData.address}
          onChange={(e) => updateData({ address: e.target.value })}
          className="mb-8 p-2 w-full border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
        />
      </div>

      <div className="">
        <label
          htmlFor="emergency"
          className="font-bold text-lg mb-4 inline-block"
        >
          Emergency Contact :
        </label>
        <input
          id="emergency"
          type="text"
          placeholder="Emergency Contact Info"
          value={formData.emergencyContact}
          onChange={(e) => updateData({ emergencyContact: e.target.value })}
          className="mb-8 p-2 w-full border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
        />
      </div>

      <div className="flex justify-center md:justify-end gap-4">
        <button
          onClick={prevStep}
          className="text-primary-500 border-2 border-primary-500 bg-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold cursor-pointer"
        >
          <FaArrowLeft className="text-md" /> Back
        </button>
        {formData.contactMethod !== "" &&
          (formData.phone !== "" || formData.email !== "") &&
          formData.emergencyContact !== "" && (
            <button
              disabled={isLoading}
              onClick={() => {
                handleContinue();
              }}
              className={`text-white border-2 border-primary-500 bg-primary-500 px-4 py-2 rounded-lg flex items-center gap-2 font-bold ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              Continue <FaArrowRight className="text-md" />
            </button>
          )}
      </div>
    </div>
  );
}
