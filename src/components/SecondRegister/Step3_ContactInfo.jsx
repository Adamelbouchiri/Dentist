import axios from "axios";
import { useContext } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaRegEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import AppContext from "../../context/AppProvider";

// Step3_ContactInfo.jsx

export default function Step3({ formData, updateData, prevStep }) {
  const { token } = useContext(AppContext);

  const methods = [
    {
      name: "Phone Call",
      icon: <FaPhoneAlt className="text-xl mb-4" />,
    },
    { name: "WhatsApp", icon: <FaWhatsapp className="text-2xl mb-4" /> },
    { name: "Email", icon: <FaRegEnvelope className="text-xl mb-4" /> },
  ];

  async function handleContinue() {
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
            className={`relative flex flex-col justify-center items-center w-36 h-36 p-4 rounded-lg border-2 bg-white font-bold text-lg cursor-pointer ${
              formData.contactMethod === method.name
                ? "border-primary-500 text-primary-500 checked-box"
                : "border-gray-200"
            }`}
          >
            {method.icon}
            {method.name}
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

      <div className="flex justify-end gap-4">
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
              onClick={() => {
                handleContinue();
              }}
              className="text-white border-2 border-primary-500 bg-primary-500 px-4 py-2 rounded-lg flex items-center gap-2 font-bold cursor-pointer"
            >
              Continue <FaArrowRight className="text-md" />
            </button>
          )}
      </div>
    </div>
  );
}
