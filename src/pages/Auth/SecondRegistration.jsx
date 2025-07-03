import React, { useContext, useState } from "react";
import { ProgressBar } from "../../components/SecondRegister/ProgressBar";
import Step1 from "../../components/SecondRegister/Step1_GenderAge";
import Step2 from "../../components/SecondRegister/Step2_HealthStatus";
import Step3 from "../../components/SecondRegister/Step3_ContactInfo";
import AppContext from "../../context/AppProvider";
import { Navigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";

export const SecondRegistration = () => {
  const { user } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: "",
    ageRange: "",
    insurance: "",
    medication: "",
    medicationName: "",
    medicalHistory: [],
    otherCondition: "",
    contactMethod: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  if (user === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BounceLoader color="#3802ff" size={50} />
      </div>
    );
  }

  if (user.second_registration_done) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="p-6 xl:p-10 flex flex-col items-center bg-white md:w-[25%] border-r border-r-primary-500">
        <img src="/images/logo.png" alt="register-two" />
        <h1 className="pb-4 pt-10 text-2xl lg:text-3xl xl:text-4xl font-bold leading-10 lg:leading-12 text-center md:text-start">
          Take care of your <br className="hidden lg:block" /> Dents health
        </h1>
        <p className="text-md text-zinc-400 text-center md:text-start">
          Follow the 3 steps to fill in your inforamtion so that we can offer
          you the best service
        </p>

        <ProgressBar currentStep={step} />
      </div>

      <div className="md:flex-1 p-8 lg:p-14 bg-[#f9f4f4] pt-24">
        {step === 1 && (
          <Step1
            formData={formData}
            updateData={updateData}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <Step2
            formData={formData}
            updateData={updateData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        {step === 3 && (
          <Step3
            formData={formData}
            updateData={updateData}
            prevStep={prevStep}
          />
        )}
      </div>
    </div>
  );
};
