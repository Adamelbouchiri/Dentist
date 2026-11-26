import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { Input } from "../ui/Field";
import { ChoiceCard, StepTitle, useAnswerLabel } from "./ChoiceCard";

const conditions = ["Diabetes", "High Blood Pressure", "Heart Conditions", "Asthma", "Blood Thinners", "Allergies", "None"];

export default function Step2({ formData, updateData, nextStep, prevStep }) {
  const { t } = useTranslation();
  const label = useAnswerLabel();

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
          <StepTitle index={1}>{t("onboarding.insurance")}</StepTitle>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((val) => (
              <ChoiceCard key={val} selected={formData.insurance === val} onClick={() => updateData({ insurance: val })}>
                {label(val)}
              </ChoiceCard>
            ))}
          </div>
        </section>

        <section>
          <StepTitle index={2}>{t("onboarding.medication")}</StepTitle>
          <div className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((val) => (
              <ChoiceCard key={val} selected={formData.medication === val} onClick={() => updateData({ medication: val })}>
                {label(val)}
              </ChoiceCard>
            ))}
          </div>
        </section>
      </div>

      {formData.medication === "Yes" && (
        <Input
          label={t("onboarding.medicationName")}
          placeholder={t("onboarding.medicationPlaceholder")}
          value={formData.medicationName}
          onChange={(e) => updateData({ medicationName: e.target.value })}
        />
      )}

      <section>
        <StepTitle index={3} hint={t("onboarding.selectAll")}>
          {t("onboarding.history")}
        </StepTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map((c) => (
            <ChoiceCard key={c} selected={formData.medicalHistory.includes(c)} onClick={() => toggleCondition(c)}>
              {label(c)}
            </ChoiceCard>
          ))}
        </div>
        <Input
          className="mt-5"
          label={t("profile.otherConditions")}
          placeholder={t("onboarding.otherPlaceholder")}
          value={formData.otherCondition}
          onChange={(e) => updateData({ otherCondition: e.target.value })}
        />
      </section>

      <div className="flex justify-between border-t border-ink-200/70 pt-8">
        <Button onClick={prevStep} variant="outline" size="lg">
          <FiArrowLeft className="rtl:rotate-180" /> {t("common.back")}
        </Button>
        <Button onClick={nextStep} disabled={!canContinue} size="lg">
          {t("common.continue")} <FiArrowRight className="rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}
