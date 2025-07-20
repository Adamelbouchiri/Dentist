import React, { use, useContext, useState } from "react";
import { FaUser, FaCamera, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import AppContext from "../context/AppProvider";
import axios from "axios";
import { flash } from "../utils/flash";

export const Settings = () => {
  const BASE_URL = "http://127.0.0.1:8000";

  const { user, setUser, token } = useContext(AppContext);

  const [userName, setUserName] = useState(`${user.name}`);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isUploading, setIsUploading] = useState(false); // <-- Add loading state

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    password: "",
    password_confirmation: "",
  });

  const handleNameChange = (e) => {
    setUserName(e.target.value);
    console.log(userName);
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  async function handleUploadProfile(file) {
    if (!file) return;

    setIsUploading(true); // Start loading

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/update-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      console.log(data);

      setUser(data.user);

      flash.show("Profile picture updated!", "success", 3000);
    } catch (error) {
      console.error(error);
      flash.show("Failed to update picture", "error", 3000);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSaveName() {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/update-name`,
        { userName: userName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setUser(data.user);

      flash.show(data.message, "success", 3000);
    } catch (error) {
      flash.show(error.response.data.message, "error", 3000);
      console.log(error.response.data.message);
    }
  }

  const handleChangePassword = () => {
    // TODO: Add password change logic here
    console.log("Change password:", passwords);
  };

  return !user ? (
    <div className="flex justify-center items-center h-screen">
      <BounceLoader color="#3802ff" size={50} />
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50 ">
      <div className="">
        {/* User Info Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                {user?.avatar?.startsWith("http") ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
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
              <label
                htmlFor="profile-pic-upload"
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <FaCamera className="w-4 h-4 text-gray-600" />
              </label>
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                disabled={isUploading} // disable input while uploading
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleUploadProfile(file);
                  }
                }}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              <div className="flex items-center mt-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-500">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <FaUser className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Profile Settings
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={handleNameChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <button
                onClick={() => handleSaveName()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-101 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Password Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <FaLock className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Change Password
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange("current", e.target.value)
                    }
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <FaEyeSlash className="w-5 h-5 cursor-pointer" />
                    ) : (
                      <FaEye className="w-5 h-5 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwords.password}
                    onChange={(e) =>
                      handlePasswordChange("new", e.target.value)
                    }
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <FaEyeSlash className="w-5 h-5 cursor-pointer" />
                    ) : (
                      <FaEye className="w-5 h-5 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwords.password_confirmation}
                    onChange={(e) =>
                      handlePasswordChange("confirm", e.target.value)
                    }
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors outline-none"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="w-5 h-5 cursor-pointer" />
                    ) : (
                      <FaEye className="w-5 h-5 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-101 cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
