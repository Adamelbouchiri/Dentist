// Step2_HealthStatus.jsx

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Step2({ formData, updateData, nextStep, prevStep }) {
  const conditions = [
    "Diabetes",
    "High Blood Pressure",
    "Heart Conditions",
    "Asthma",
    "Blood Thinners",
    "Allergies",
    "None of the above",
  ];

  const toggleCondition = (condition) => {
    const exists = formData.medicalHistory.includes(condition);
    const updated = exists
      ? formData.medicalHistory.filter((c) => c !== condition)
      : [...formData.medicalHistory, condition];
    updateData({ medicalHistory: updated });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Do you have dental insurance ?</h2>
      <div className="flex gap-4 mb-8">
        {["Yes", "No"].map((val) => (
          <button
            key={val}
            onClick={() => updateData({ insurance: val })}
            className={`py-2 w-22 rounded-lg border-2 font-bold bg-white ${
              formData.insurance === val
                ? "border-primary-500 text-primary-500"
                : "border-gray-200"
            }`}
          >
            {val}
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">
        Are you currently taking any medications?
      </h2>
      <div className="flex gap-4 mb-8">
        {["Yes", "No"].map((val) => (
          <button
            key={val}
            onClick={() => updateData({ medication: val })}
            className={`py-2 w-22 rounded-lg border-2 font-bold bg-white ${
              formData.medication === val
                ? "border-primary-500 text-primary-500"
                : "border-gray-200"
            }`}
          >
            {val}
          </button>
        ))}
      </div>

      {formData.medication === "Yes" && (
        <div className="mb-8">
          <label
            htmlFor="medicationName"
            className="font-bold text-lg mb-4 inline-block"
          >
            Medication Name :
          </label>
          <input
            id="medicationName"
            type="text"
            placeholder="Enter your medicine"
            value={formData.medicationName}
            onChange={(e) => updateData({ medicationName: e.target.value })}
            className="mb-8 p-2 w-full border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          />
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Medical History?</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {conditions.map((condition) => (
          <button
            key={condition}
            onClick={() => toggleCondition(condition)}
            className={`px-3 py-2 border-2 rounded-lg bg-white font-bold ${
              formData.medicalHistory.includes(condition)
                ? "border-primary-500 text-primary-500"
                : "border-gray-200"
            }`}
          >
            {condition}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label
          htmlFor="otherCondition"
          className="font-bold text-lg mb-4 inline-block"
        >
          Others :
        </label>
        <input
          type="text"
          placeholder="Other condition"
          value={formData.otherCondition}
          onChange={(e) => updateData({ otherCondition: e.target.value })}
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
        {formData.medication &&
          formData.insurance &&
          formData.medicalHistory.length > 0 && (
            <button
              onClick={nextStep}
              className="text-white border-2 border-primary-500 bg-primary-500 px-4 py-2 rounded-lg flex items-center gap-2 font-bold cursor-pointer"
            >
              Next <FaArrowRight className="text-md" />
            </button>
          )}
      </div>
    </div>
  );
}
