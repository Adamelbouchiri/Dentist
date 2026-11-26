import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressBar, onboardingSteps } from "../../components/SecondRegister/ProgressBar";
import Step1 from "../../components/SecondRegister/Step1_GenderAge";
import Step2 from "../../components/SecondRegister/Step2_HealthStatus";
import Step3 from "../../components/SecondRegister/Step3_ContactInfo";
import AppContext from "../../context/AppProvider";
import { Logo } from "../../components/ui/Misc";

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

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);
  const updateData = (updates) => setFormData((prev) => ({ ...prev, ...updates }));

  if (!user) return <Navigate to="/login" replace />;
  if (user.second_registration_done) return <Navigate to="/" replace />;

  const StepComponent = [Step1, Step2, Step3][step - 1];

  return (
    <div className="min-h-screen bg-ivory p-3 md:p-4">
      <div className="mx-auto grid min-h-[calc(100vh-32px)] max-w-[1500px] gap-4 md:grid-cols-[340px_1fr] lg:grid-cols-[400px_1fr]">
        <aside className="relative flex flex-col gap-10 overflow-hidden rounded-[32px] bg-white p-7 ring-1 ring-ink-200/70 md:p-10">
          <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full gradient-primary opacity-10 blur-3xl" />
          <Logo className="h-11" />
          <div>
            <h1 className="text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink-900 lg:text-4xl">
              Take care of your <span className="font-display italic text-gradient pr-1">dental health</span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-500">
              Three short steps so we can tailor every visit to you.
            </p>
          </div>
          <ProgressBar currentStep={step} />
          <p className="mt-auto hidden text-[13px] text-ink-400 md:block">
            Your information is confidential and only shared with your care team.
          </p>
        </aside>

        <main className="flex flex-col px-2 py-6 md:px-10 md:py-12 lg:px-16">
          <div className="mx-auto w-full max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-400">
              Step {step} / {onboardingSteps.length}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
              {onboardingSteps[step - 1].label}
            </h2>
            <p className="mt-2 text-ink-500">{onboardingSteps[step - 1].desc}</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-12"
              >
                <StepComponent formData={formData} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
