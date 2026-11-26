import { IoFemaleOutline, IoMaleOutline } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { ChoiceCard, StepTitle, useAnswerLabel } from "./ChoiceCard";

const ages = ["Under 18", "18 - 30", "30 - 40", "40 - 50", "50 - 60", "Above 60"];

export default function Step1({ formData, updateData, nextStep }) {
  const { t } = useTranslation();
  const label = useAnswerLabel();
  const canContinue = formData.gender && formData.ageRange;

  return (
    <div className="space-y-12">
      <section>
        <StepTitle index={1}>{t("onboarding.gender")}</StepTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { value: "Male", icon: <IoMaleOutline /> },
            { value: "Female", icon: <IoFemaleOutline /> },
          ].map((g) => (
            <ChoiceCard key={g.value} icon={g.icon} selected={formData.gender === g.value} onClick={() => updateData({ gender: g.value })}>
              {label(g.value)}
            </ChoiceCard>
          ))}
        </div>
      </section>

      <section>
        <StepTitle index={2}>{t("onboarding.age")}</StepTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ages.map((age) => (
            <ChoiceCard key={age} selected={formData.ageRange === age} onClick={() => updateData({ ageRange: age })}>
              {label(age)}
            </ChoiceCard>
          ))}
        </div>
      </section>

      <div className="flex justify-end border-t border-ink-200/70 pt-8">
        <Button onClick={nextStep} disabled={!canContinue} size="lg">
          {t("common.continue")} <FiArrowRight className="rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}
