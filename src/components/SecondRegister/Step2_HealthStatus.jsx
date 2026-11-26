import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Button } from "../ui/Button";
import { Input } from "../ui/Field";
import { ChoiceCard, StepTitle } from "./ChoiceCard";

const conditions = [
  "Diabetes",
  "High Blood Pressure",
  "Heart Conditions",
  "Asthma",
  "Blood Thinners",
  "Allergies",
  "None",
];

export default function Step2({ formData, updateData, nextStep, prevStep }) {
  // "None" is exclusive: picking it clears the rest, picking a condition clears "None".
  const toggleCondition = (condition) => {
    const current = formData.medicalHistory;
    if (current.includes(condition)) {
      return updateData({ medicalHistory: current.filter((c) => c !== condition) });
    }
    updateData({
      medicalHistory: condition === "None" ? ["None"] : [...current.filter((c) => c !== "None"), condition],
    });
  };

  const canContinue = formData.medication && formData.insurance && formData.medicalHistory.length > 0;

  return (
    <div className="space-y-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <StepTitle index={1}>Do you have dental insurance?</StepTitle>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((val) => (
              <ChoiceCard key={val} selected={formData.insurance === val} onClick={() => updateData({ insurance: val })}>
                {val}
              </ChoiceCard>
            ))}
          </div>
        </section>

        <section>
          <StepTitle index={2}>Currently taking medication?</StepTitle>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((val) => (
              <ChoiceCard key={val} selected={formData.medication === val} onClick={() => updateData({ medication: val })}>
                {val}
              </ChoiceCard>
            ))}
          </div>
        </section>
      </div>

      {formData.medication === "Yes" && (
        <Input
          label="Medication name"
          placeholder="e.g. Ibuprofen 200mg"
          value={formData.medicationName}
          onChange={(e) => updateData({ medicationName: e.target.value })}
        />
      )}

      <section>
        <StepTitle index={3} hint="Select all that apply.">
          Medical history
        </StepTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map((c) => (
            <ChoiceCard key={c} selected={formData.medicalHistory.includes(c)} onClick={() => toggleCondition(c)}>
              {c}
            </ChoiceCard>
          ))}
        </div>
        <Input
          className="mt-5"
          label="Other conditions"
          placeholder="Anything else we should know"
          value={formData.otherCondition}
          onChange={(e) => updateData({ otherCondition: e.target.value })}
        />
      </section>

      <div className="flex justify-between border-t border-ink-200/70 pt-8">
        <Button onClick={prevStep} variant="outline" size="lg">
          <FiArrowLeft /> Back
        </Button>
        <Button onClick={nextStep} disabled={!canContinue} size="lg">
          Continue <FiArrowRight />
        </Button>
      </div>
    </div>
  );
}
