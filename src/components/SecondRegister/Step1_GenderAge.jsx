import { IoMaleOutline } from "react-icons/io5";
import { IoFemaleOutline } from "react-icons/io5";
import { BsArrowRight } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";

// Step1_GenderAge.jsx
export default function Step1({ formData, updateData, nextStep }) {
  
  const Ages = ["Under 18", "18 - 30", "30 - 40", "40 - 50", "50 - 60", "Above 60"];

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-8">What your gender ?</h2>
      <div className="flex gap-4 mb-16">
        {["Male", "Female"].map((gender) => (
          <div
            key={gender}
            onClick={() => updateData({ gender })}
            className={`relative p-4 rounded-lg border-2 w-32 h-32 flex flex-col items-center justify-center cursor-pointer bg-white font-bold text-lg ${
              formData.gender === gender
                ? "border-primary-500 text-primary-500 checked-box"
                : "border-gray-200"
            }`}
          >
            {gender === "Male" ? (
              <span className="text-3xl mb-2">
                <IoMaleOutline />
              </span>
            ) : (
              <span className="text-3xl mb-2">
                <IoFemaleOutline />
              </span>
            )}
            {gender}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-8">What is your age ?</h2>
      <div className="flex gap-6 mb-8 flex-wrap">
        {Ages.map(
          (age) => (
            <div
              key={age}
              onClick={() => updateData({ ageRange: age })}
              className={`relative flex justify-center items-center w-36 h-36 p-4 rounded-lg border-2 bg-white font-bold text-lg cursor-pointer ${
                formData.ageRange === age
                  ? "border-primary-500 text-primary-500 checked-box"
                  : "border-gray-200"
              }`}
            >
              {age}
            </div>
          )
        )}
      </div>

      {formData.gender && formData.ageRange && (
        <div className="flex justify-end mt-10">
          <button
            onClick={nextStep}
            className="bg-primary-500 text-white px-6 py-2 text-lg rounded-lg cursor-pointer flex items-center gap-2"
          >
            Next <FaArrowRight className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
}
