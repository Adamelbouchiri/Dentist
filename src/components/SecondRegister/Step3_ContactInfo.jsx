import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowLeft, FiCheck, FiHome, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useSubmitSecondRegistration } from "../../hooks/useAuth";
import { getErrorMessage } from "../../lib/api";
import { flash } from "../../utils/flash";
import { Button } from "../ui/Button";
import { Input } from "../ui/Field";
import { ChoiceCard, StepTitle, useAnswerLabel } from "./ChoiceCard";

const methods = [
  { name: "Phone Call", icon: <FiPhone /> },
  { name: "WhatsApp", icon: <FaWhatsapp /> },
  { name: "Email", icon: <FiMail /> },
];

const PHONE = /^[+\d\s().-]{6,20}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Step3({ formData, updateData, prevStep }) {
  const { t } = useTranslation();
  const label = useAnswerLabel();
  const navigate = useNavigate();
  const submit = useSubmitSecondRegistration();

  const usesPhone = formData.contactMethod === "Phone Call" || formData.contactMethod === "WhatsApp";
  const phoneError = usesPhone && formData.phone && !PHONE.test(formData.phone) ? "validation.phone" : null;
  const emailError = formData.contactMethod === "Email" && formData.email && !EMAIL.test(formData.email) ? "validation.email" : null;
  const contactOk = usesPhone ? PHONE.test(formData.phone) : EMAIL.test(formData.email);
  const canFinish = formData.contactMethod !== "" && contactOk && formData.emergencyContact.trim() !== "";

  const handleContinue = () =>
    submit.mutate(formData, {
      onSuccess: () => {
        flash.show(t("onboarding.done"), "success", 3000);
        navigate("/");
      },
      onError: (error) => flash.show(getErrorMessage(error, t("onboarding.failed")), "error", 3500),
    });

  return (
    <div className="space-y-12">
      <section>
        <StepTitle index={1}>{t("onboarding.contactMethod")}</StepTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {methods.map((m) => (
            <ChoiceCard key={m.name} icon={m.icon} selected={formData.contactMethod === m.name} onClick={() => updateData({ contactMethod: m.name })}>
              {label(m.name)}
            </ChoiceCard>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {usesPhone && (
          <Input
            label={t("fields.phone")}
            icon={FiPhone}
            type="tel"
            dir="ltr"
            placeholder="+212 6 00 00 00 00"
            value={formData.phone}
            error={phoneError}
            onChange={(e) => updateData({ phone: e.target.value })}
          />
        )}
        {formData.contactMethod === "Email" && (
          <Input
            label={t("fields.email")}
            type="email"
            icon={FiMail}
            placeholder={t("fields.emailPlaceholder")}
            value={formData.email}
            error={emailError}
            onChange={(e) => updateData({ email: e.target.value })}
          />
        )}
        <Input
          label={t("profile.emergencyContact")}
          icon={FiUserPlus}
          placeholder={t("onboarding.emergencyPlaceholder")}
          value={formData.emergencyContact}
          onChange={(e) => updateData({ emergencyContact: e.target.value })}
        />
        <Input
          label={t("profile.address")}
          hint={t("common.optional")}
          icon={FiHome}
          placeholder={t("onboarding.addressPlaceholder")}
          className="md:col-span-2"
          value={formData.address}
          onChange={(e) => updateData({ address: e.target.value })}
        />
      </section>

      <div className="flex justify-between border-t border-ink-200/70 pt-8">
        <Button onClick={prevStep} variant="outline" size="lg">
          <FiArrowLeft className="rtl:rotate-180" /> {t("common.back")}
        </Button>
        <Button onClick={handleContinue} disabled={!canFinish} loading={submit.isPending} size="lg">
          {t("onboarding.complete")} {!submit.isPending && <FiCheck />}
        </Button>
      </div>
    </div>
  );
}
