import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppProvider";

//Icons
import {
  FaCalendar,
  FaEnvelope,
  FaPhone,
  FaMapMarker,
  FaVenusMars,
  FaUserMd,
  FaExclamationTriangle,
  FaHeartbeat,
  FaClipboardList,
  FaPills,
  FaShieldAlt,
  FaComments,
  FaUserFriends,
  FaWhatsapp,
  FaUser,
} from "react-icons/fa";
import { FiUsers, FiUser } from "react-icons/fi";

import BounceLoader from "react-spinners/BounceLoader";

import axios from "axios";

import { flash } from "../utils/flash";

export const Profile = () => {
  const BASE_URL = "http://127.0.0.1:8000";
  const { user, token } = useContext(AppContext);

  const [registration, setRegistration] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const InfoCard = ({ icon: Icon, title, value, gradient, iconColor }) => (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Gradient Background Overlay */}
      <div
        className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
      ></div>

      {/* Icon Container */}
      <div
        className={`inline-flex items-center justify-center w-12 h-12 ${iconColor} rounded-xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
          {value || (
            <span className="text-gray-400 italic font-normal">
              Not provided
            </span>
          )}
        </p>
      </div>

      {/* Subtle Pattern */}
      <div className="absolute top-4 right-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full blur-xl"></div>
      </div>
    </div>
  );

  const MedicalCard = ({ icon: Icon, title, value, gradient, iconColor }) => (
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Gradient Background Overlay */}
      <div
        className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
      ></div>

      {/* Icon Container */}
      <div
        className={`inline-flex items-center justify-center w-12 h-12 ${iconColor} rounded-xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
          {value || (
            <span className="text-gray-400 italic font-normal">
              Not provided
            </span>
          )}
        </p>
      </div>

      {/* Subtle Pattern */}
      <div className="absolute top-4 right-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full blur-xl"></div>
      </div>
    </div>
  );

  const formatMedicalHistory = (history) => {
    if (!history || history.length === 0) return null;
    return history.join(", ");
  };

  const ContactCard = ({
    icon: Icon,
    title,
    value,
    gradient,
    iconColor,
    isClickable = false,
  }) => (
    <div
      className={`group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 ${
        isClickable ? "cursor-pointer" : ""
      }`}
    >
      {/* Gradient Background Overlay */}
      <div
        className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
      ></div>

      {/* Icon Container */}
      <div
        className={`inline-flex items-center justify-center w-12 h-12 ${iconColor} rounded-xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
          {value || (
            <span className="text-gray-400 italic font-normal">
              Not provided
            </span>
          )}
        </p>
      </div>

      {/* Subtle Pattern */}
      <div className="absolute top-4 right-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full blur-xl"></div>
      </div>
    </div>
  );

  const formatAddress = (address) => {
    if (!address) return null;
    return address.length > 50 ? `${address.substring(0, 50)}...` : address;
  };

  useEffect(() => {
    async function getSecondRegistration() {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/user-second-registration`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRegistration(response.data);
      } catch (error) {
        flash.show(error.response.data.message, "error", 3000);
      }
    }

    getSecondRegistration();
  }, []);

  return !user || !registration ? (
    <div className="flex justify-center items-center h-screen">
      <BounceLoader color="#3802ff" size={50} />
    </div>
  ) : (
    <div className="">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col items-center md:flex-row md:space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-lg bg-gradient-to-r from-primary-500 to-purple-600 flex flex-col md:flex-row items-center justify-center overflow-hidden">
              {user?.avatar?.startsWith("http") ? (
                <img
                  src={user?.avatar}
                  alt="Profile"
                  className="md:w-full md:h-full object-cover"
                />
              ) : user?.avatar ? (
                <img
                  src={`${BASE_URL}/storage/images/${user.avatar}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="w-12 h-12 text-white" />
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{user?.name}</h1>
            <p className="text-gray-600 mt-1 mb-2 text-sm md:text-lg">{user?.email}</p>

            <div className="mt-2">
              <h2 className="w-40 text-center flex items-center gap-2 text-white py-1 px-3 rounded-lg mb-2 text-sm bg-gradient-to-br from-primary-500 to-purple-600">
                <FaCalendar />
                {user?.created_at.split("T")[0]}
              </h2>
              <h2 className="w-40 text-center flex items-center gap-2 text-white py-1 px-3 rounded-lg text-sm bg-gradient-to-br from-primary-500 to-purple-600">
                <FiUsers />
                {user?.google_id
                  ? "Google account"
                  : user?.facebook_id
                  ? "Facebook account"
                  : "Regular account"}
              </h2>
            </div>

            <div className="flex items-center mt-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 p-4 bg-white rounded-md shadow-md">
        <div className="flex items-center gap-2 pb-6">
          <h1 className="text-2xl lg:text-3xl font-bold pb-2 border-b-2 border-primary-500">
            Personal Information
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          <InfoCard
            icon={FiUser}
            title="Full Name"
            value={user?.name}
            gradient="bg-gradient-to-r from-blue-500 to-purple-600"
            iconColor="bg-gradient-to-r from-blue-500 to-purple-600"
          />

          <InfoCard
            icon={FaEnvelope}
            title="Email Address"
            value={user?.email}
            gradient="bg-gradient-to-r from-green-500 to-teal-600"
            iconColor="bg-gradient-to-r from-green-500 to-teal-600"
          />

          <InfoCard
            icon={FaPhone}
            title="Phone Number"
            value={registration?.phone}
            gradient="bg-gradient-to-r from-orange-500 to-red-600"
            iconColor="bg-gradient-to-r from-orange-500 to-red-600"
          />

          <InfoCard
            icon={FaMapMarker}
            title="Address"
            value={registration?.address || "No Address Found"}
            gradient="bg-gradient-to-r from-purple-500 to-pink-600"
            iconColor="bg-gradient-to-r from-purple-500 to-pink-600"
          />

          <InfoCard
            icon={FaVenusMars}
            title="Gender"
            value={registration?.gender}
            gradient="bg-gradient-to-r from-indigo-500 to-blue-600"
            iconColor="bg-gradient-to-r from-indigo-500 to-blue-600"
          />

          <InfoCard
            icon={FaCalendar}
            title="Age Range"
            value={registration?.ageRange}
            gradient="bg-gradient-to-r from-cyan-500 to-blue-600"
            iconColor="bg-gradient-to-r from-cyan-500 to-blue-600"
          />
        </div>
      </div>

      <div className="mt-10 p-4 bg-white rounded-md shadow-md">
        <div className="flex items-center gap-2 pb-6">
          <h1 className="text-2xl lg:text-3xl font-bold pb-2 border-b-2 border-primary-500">
            Medical Information
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MedicalCard
            icon={FaShieldAlt}
            title="Insurance Provider"
            value={registration?.insurance}
            gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
            iconColor="bg-gradient-to-r from-blue-500 to-indigo-600"
          />

          <MedicalCard
            icon={FaPills}
            title="Current Medication"
            value={registration?.medication}
            gradient="bg-gradient-to-r from-green-500 to-emerald-600"
            iconColor="bg-gradient-to-r from-green-500 to-emerald-600"
          />

          <MedicalCard
            icon={FaClipboardList}
            title="Medication Names"
            value={registration?.medicationName}
            gradient="bg-gradient-to-r from-purple-500 to-violet-600"
            iconColor="bg-gradient-to-r from-purple-500 to-violet-600"
          />

          <MedicalCard
            icon={FaHeartbeat}
            title="Medical History"
            value={formatMedicalHistory(registration?.medicalHistory)}
            gradient="bg-gradient-to-r from-red-500 to-rose-600"
            iconColor="bg-gradient-to-r from-red-500 to-rose-600"
          />

          <MedicalCard
            icon={FaExclamationTriangle}
            title="Other Conditions"
            value={registration?.otherCondition}
            gradient="bg-gradient-to-r from-orange-500 to-amber-600"
            iconColor="bg-gradient-to-r from-orange-500 to-amber-600"
          />

          <MedicalCard
            icon={FaUserMd}
            title="Emergency Contact"
            value={registration?.emergencyContact}
            gradient="bg-gradient-to-r from-teal-500 to-cyan-600"
            iconColor="bg-gradient-to-r from-teal-500 to-cyan-600"
          />
        </div>
      </div>
      <div className="mt-10 p-4 bg-white rounded-md shadow-md">
        <div className="flex items-center gap-2 pb-6">
          <h1 className="text-2xl lg:text-3xl font-bold pb-2 border-b-2 border-primary-500">
            Contact Information
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContactCard
            icon={FaPhone}
            title="Phone Number"
            value={registration?.phone}
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
            iconColor="bg-gradient-to-r from-blue-500 to-blue-600"
            isClickable={true}
          />

          <ContactCard
            icon={FaEnvelope}
            title="Email Address"
            value={registration?.email}
            gradient="bg-gradient-to-r from-red-500 to-pink-600"
            iconColor="bg-gradient-to-r from-red-500 to-pink-600"
            isClickable={true}
          />

          <ContactCard
            icon={FaMapMarker}
            title="Address"
            value={formatAddress(registration?.address)}
            gradient="bg-gradient-to-r from-purple-500 to-violet-600"
            iconColor="bg-gradient-to-r from-purple-500 to-violet-600"
          />

          <ContactCard
            icon={FaComments}
            title="Preferred Contact Method"
            value={registration?.contactMethod}
            gradient="bg-gradient-to-r from-green-500 to-emerald-600"
            iconColor="bg-gradient-to-r from-green-500 to-emerald-600"
          />

          <ContactCard
            icon={FaWhatsapp}
            title="WhatsApp"
            value={registration?.whatsapp}
            gradient="bg-gradient-to-r from-green-400 to-green-600"
            iconColor="bg-gradient-to-r from-green-400 to-green-600"
            isClickable={true}
          />

          <ContactCard
            icon={FaUserFriends}
            title="Emergency Contact"
            value={registration?.emergencyContact}
            gradient="bg-gradient-to-r from-orange-500 to-red-600"
            iconColor="bg-gradient-to-r from-orange-500 to-red-600"
            isClickable={true}
          />
        </div>
      </div>
    </div>
  );
};
