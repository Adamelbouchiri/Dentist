import React from "react";
import { FaCheck } from "react-icons/fa";

export const ProgressBar = ({ currentStep }) => {
  const steps = [
    "General details",
    "Physical health",
    "Contact details",
  ];

  return (
    <>
    <div className="flex md:hidden flex-row items-center justify-between px-4 py-8 w-full max-w-screen-sm mx-auto">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <div key={index} className="flex-1 flex flex-col items-center relative">
            {/* Step Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10
                ${
                  isActive || isCompleted
                    ? "bg-primary-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
            >
              {isCompleted ? <FaCheck size={14} /> : stepNumber}
            </div>

            {/* Horizontal dashed line */}
            {index < steps.length - 1 && (
              <div className={`absolute top-4 left-1/2 w-full border-t-2 border-dashed ${isCompleted ? "border-primary-500" : "border-gray-300"}`} />
            )}

            {/* Label */}
            <div className="mt-3 text-center">
              <div className="text-xs font-semibold text-black">{label}</div>
              <div className="text-xs text-gray-500 mt-2">
                {index === 0
                  ? "Some basic informations we need to get to know you"
                  : index === 1
                  ? "Your health condition that is important to consider"
                  : "Some contact informations we need to reach out to you"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <div className="hidden md:flex flex-col items-start py-12 ">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <div key={index} className="flex items-start space-x-3 relative">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold
                  ${
                    isActive || isCompleted
                      ? "bg-primary-500 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
              >
                {isCompleted ? <FaCheck  size={16} /> : stepNumber}
              </div>

              {/* Dashed Line */}
              {index < steps.length - 1 && (
                <div className={`w-px h-14 border-l-2 border-dashed ${ isCompleted? "border-primary-500" : "border-gray-300"} mt-1`} />
              )}
            </div>

            {/* Labels */}
            <div>
              <div className="text-sm font-semibold text-black">{label}</div>
              <div className="text-xs text-gray-500 mt-2">
                {index === 0
                  ? "Some basic informations we need to get to know you"
                  : index === 1
                  ? "Your health condition that is important to consider"
                  : "Some basic informations we need to get to know you"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
};
