import { DateTimePicker } from "../components/appointments/DateTimePicker";
import { useContext, useState } from "react";
import {
  FaStar,
  FaPaypal,
  FaCreditCard,
  FaMoneyBillWave,
  FaExclamationTriangle,
} from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import StripeWrapper from "../components/stripe/StripeWrapper";
import CheckoutForm from "../components/stripe/CheckoutForm";
import Lottie from "lottie-react";
import loadingAnimation from "../animation/Loading-animation.json";
import axios from "axios";
import AppContext from "../context/AppProvider";
import { flash } from "../utils/flash";
import { Navigate } from "react-router-dom";

export const CreateAppointments = () => {
  const { user, token } = useContext(AppContext);

  const [selectedCategory, setSelectedCategory] = useState("General Checkups");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const today = new Date();

  const [selectDate, setSelectDate] = useState(today);
  const [selectTime, setSelectTime] = useState("09:30");

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("Pay by Card");
  const [currentDoctorSlide, setCurrentDoctorSlide] = useState(0);

  const [formData, setFormData] = useState({
    service: selectedCategory,
    price: 150,
    doctor: "",
    date: selectDate.toISOString().split("T")[0],
    time: selectTime,
    status: "upcoming",
    payment_status: "",
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    {
      id: "general",
      name: "General Checkups",
      icon: "/images/services-icon-1.png",
      price: 150,
    },
    {
      id: "whitening",
      name: "Teeth Whitening",
      icon: "/images/services-icon-2.png",
      price: 300,
    },
    {
      id: "braces",
      name: "Braces/Invisalign",
      icon: "/images/services-icon-3.png",
      price: 2500,
    },
    {
      id: "emergency",
      name: "Emergency Dentistry",
      icon: "/images/services-icon-4.png",
      price: 200,
    },
    {
      id: "cosmetic",
      name: "Cosmetic Dentistry",
      icon: "/images/services-icon-5.png",
      price: 800,
    },
  ];

  const doctors = [
    {
      id: 1,
      name: "Dr. Cris waxon",
      speciality: "General Dentist",
      rating: 4.9,
      image: "/images/doctor-1.jpg",
    },
    {
      id: 2,
      name: "Dr. Tayler Smith",
      speciality: "Orthodontist",
      rating: 4.8,
      image: "/images/doctor-2.jpg",
    },
    {
      id: 3,
      name: "Dr. John Doe",
      speciality: "General Dentist",
      rating: 4.8,
      image: "/images/doctor-3.jpg",
    },
  ];

  const paymentMethods = [
    { id: "card", name: "Pay by Card", icon: FaCreditCard },
    { id: "person", name: "Pay in Person", icon: FaMoneyBillWave },
  ];

  if(user.role === "admin") {
    return <Navigate to="/admin/dashboard" />
  }

  const handleBookDoctor = (doctorId) => {
    setSelectedDoctor(doctorId);
  };

  const getSelectedCategoryPrice = () => {
    const category = categories.find((cat) => cat.name === selectedCategory);
    return category ? category.price : 0;
  };

  // Carousel navigation functions
  const nextDoctorSlide = () => {
    const maxSlides = Math.ceil(doctors.length / 2);
    setCurrentDoctorSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevDoctorSlide = () => {
    const maxSlides = Math.ceil(doctors.length / 2);
    setCurrentDoctorSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  // Get doctors for current slide
  const getCurrentSlideDoctors = () => {
    const startIndex = currentDoctorSlide * 2;
    return doctors.slice(startIndex, startIndex + 2);
  };

  async function handleAppointment(paymentStatus) {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        payment_status: paymentStatus,
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/appointments",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      console.log(data);

      flash.show("Appointment created successfully", "success", 3000);
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errors = error.response.data.errors;
        console.error("Validation failed:", errors);
        const firstError = Object.values(errors)[0][0]; // get first error message
        flash.show(firstError || "Validation error", "error", 5000);
      } else {
        flash.show("Appointment failed", "error", 3000);
        console.error(error);
      }
    } finally {
      setFormData({
        ...formData,
        doctor: "",
        date: selectDate.toISOString().split("T")[0],
        time: selectTime,
        status: "upcoming",
        payment_status: "",
      });
      setSelectedCategory("General Checkups");
      setSelectedDoctor(null);
      setLoading(false);
    }
  }

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case "Pay by Card":
        return (
          <StripeWrapper>
            <CheckoutForm
              amount={getSelectedCategoryPrice()}
              setFormData={setFormData}
              email={formData.email}
              serviceName={selectedCategory}
              onSuccess={() => {
                handleAppointment("paid");
              }}
            />
          </StripeWrapper>
        );
      case "Pay in Person":
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <FaMoneyBillWave className="text-green-600 text-4xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">
                Pay in Person
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                You can pay cash or card at our clinic during your appointment.
              </p>
              <div className="bg-white rounded-lg p-3 text-left">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Accepted Payment Methods:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cash</li>
                  <li>• Credit/Debit Cards</li>
                  <li>• Insurance (if applicable)</li>
                </ul>
              </div>
            </div>

            {/* Total and Pay Button */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Service: {selectedCategory}
                </span>
                <span className="text-sm text-gray-900">
                  ${getSelectedCategoryPrice()}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ${getSelectedCategoryPrice()}
                </span>
              </div>
              <button disabled={loading} onClick={() => {handleAppointment("pay_in_person")}} className={`w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                {getPaymentButtonText()}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getPaymentButtonText = () => {
    const price = getSelectedCategoryPrice();
    switch (selectedPaymentMethod) {
      case "Pay by Card":
        return `Pay $${price}`;
      case "Pay in Person":
        return `Confirm Appointment`;
      default:
        return `Pay $${price}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-center md:justify-start">
          <img src="/images/logo.png" alt="doctor logo" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Appointment Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                Make your appointment
              </h2>
              {/* Category Selection */}
              <div className="mb-4 p-6 rounded-xl bg-white border-2 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-400 mb-4 border-b border-gray-200 pb-2">
                  Choose service
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((category) => {
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            service: category.name,
                          }));
                          setFormData((prev) => ({
                            ...prev,
                            price: category.price,
                          }));
                          setSelectedCategory(category.name);
                          console.log(formData);
                        }}
                        className={`p-3 rounded-xl border-2 text-left transition-colors cursor-pointer ${
                          selectedCategory === category.name
                            ? "border-accent-500 bg-blue-50 text-accent-500"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={category.icon || "/placeholder.svg"}
                              alt="category icon"
                              className="w-6 h-6"
                            />
                            <span className="text-sm font-medium">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-green-600">
                            ${category.price}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Doctor Selection - Carousel */}
              <div className="mb-4 p-6 rounded-xl bg-white border-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg flex-1 font-semibold text-gray-400 border-b border-gray-200 pb-2">
                    Choose Doctor
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevDoctorSlide}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <IoIosArrowBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextDoctorSlide}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <IoIosArrowForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getCurrentSlideDoctors().map((doctor) => (
                    <div
                      key={doctor.id}
                      className="border border-gray-200 rounded-lg p-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={doctor.image || "/placeholder.svg"}
                          alt={doctor.name}
                          className="w-18 h-18 rounded-lg object-top"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {doctor.name}
                          </h4>
                          <span className="text-sm text-gray-400 me-1">
                            {doctor.speciality}
                          </span>
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center">
                              <FaStar className="text-yellow-400 me-2" />{" "}
                              {doctor.rating}
                            </div>
                            <button
                              onClick={() => {
                                handleBookDoctor(doctor.id);
                                setFormData((prev) => ({
                                  ...prev,
                                  doctor: doctor.name,
                                }));
                              }}
                              className={` py-1 px-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                selectedDoctor === doctor.id
                                  ? "bg-accent-500 text-white"
                                  : "bg-primary-500 text-white hover:bg-blue-700"
                              }`}
                            >
                              {selectedDoctor === doctor.id
                                ? "Selected"
                                : "Book"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Carousel indicators */}
                <div className="flex justify-center mt-4 gap-2">
                  {Array.from({ length: Math.ceil(doctors.length / 2) }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentDoctorSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          currentDoctorSlide === index
                            ? "bg-primary-500"
                            : "bg-gray-300"
                        }`}
                      />
                    )
                  )}
                </div>
              </div>
              {/* Date and Time Picker Placeholder */}
              <div className="mb-8">
                <DateTimePicker
                  selectedDate={selectDate}
                  setSelectDate={setSelectDate}
                  selectedTime={selectTime}
                  setSelectTime={setSelectTime}
                  setFormData={setFormData}
                />
              </div>
            </div>
          </div>
          {/* Right Side - Payment */}
          <div className="bg-white shadow-lg rounded-lg p-6 h-fit">
            <h3 className="text-lg font-semibold text-zinc-800 mb-6">
              Payment method
            </h3>
            {formData.service &&
            formData.doctor &&
            formData.date &&
            formData.time ? (
              <div className="">
                {/* Payment Method Selection */}
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.name)}
                        className={`p-3 rounded-lg border text-left transition-colors flex items-center gap-3 cursor-pointer ${
                          selectedPaymentMethod === method.name
                            ? "border-accent-500 bg-blue-50 text-blue-500"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        <IconComponent className="text-lg" />
                        <span className="text-sm font-medium">
                          {method.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* Dynamic Payment Form */}
                <div className="mb-6">{renderPaymentForm()}</div>
              </div>
            ) : (
              <div className="">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
                      <FaExclamationTriangle className="w-3 h-3 text-amber-600" />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed font-medium">
                      Please select a service, doctor, date, and time to proceed
                      with payment.
                    </p>
                  </div>
                </div>

                <Lottie animationData={loadingAnimation} loop={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
