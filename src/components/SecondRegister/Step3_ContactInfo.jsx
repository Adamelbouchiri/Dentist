import { useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowLeft, FiCheck, FiHome, FiMail, FiPhone, FiUserPlus } from "react-icons/fi";
import { useSubmitSecondRegistration } from "../../hooks/useAuth";
import { getErrorMessage } from "../../lib/api";
import { flash } from "../../utils/flash";
import { Button } from "../ui/Button";
import { Input } from "../ui/Field";
import { ChoiceCard, StepTitle } from "./ChoiceCard";

const methods = [
  { name: "Phone Call", icon: <FiPhone /> },
  { name: "WhatsApp", icon: <FaWhatsapp /> },
  { name: "Email", icon: <FiMail /> },
];

export default function Step3({ formData, updateData, prevStep }) {
  const navigate = useNavigate();
  const submit = useSubmitSecondRegistration();

  const usesPhone = formData.contactMethod === "Phone Call" || formData.contactMethod === "WhatsApp";
  const canFinish =
    formData.contactMethod !== "" &&
    (formData.phone !== "" || formData.email !== "") &&
    formData.emergencyContact !== "";

  const handleContinue = () =>
    submit.mutate(formData, {
      onSuccess: () => {
        flash.show("Your profile is complete — welcome!", "success", 3000);
        navigate("/");
      },
      onError: (error) => flash.show(getErrorMessage(error, "Could not save your details"), "error", 3000),
    });

  return (
    <div className="space-y-12">
      <section>
        <StepTitle index={1}>Preferred contact method</StepTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {methods.map((m) => (
            <ChoiceCard
              key={m.name}
              icon={m.icon}
              selected={formData.contactMethod === m.name}
              onClick={() => updateData({ contactMethod: m.name })}
            >
              {m.name}
            </ChoiceCard>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {usesPhone && (
          <Input
            label="Phone number"
            icon={FiPhone}
            placeholder="+212 6 00 00 00 00"
            value={formData.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
          />
        )}
        {formData.contactMethod === "Email" && (
          <Input
            label="Email"
            type="email"
            icon={FiMail}
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => updateData({ email: e.target.value })}
          />
        )}
        <Input
          label="Emergency contact"
          icon={FiUserPlus}
          placeholder="Name and phone number"
          value={formData.emergencyContact}
          onChange={(e) => updateData({ emergencyContact: e.target.value })}
        />
        <Input
          label="Home address"
          hint="Optional"
          icon={FiHome}
          placeholder="Street, city"
          className="md:col-span-2"
          value={formData.address}
          onChange={(e) => updateData({ address: e.target.value })}
        />
      </section>

      <div className="flex justify-between border-t border-ink-200/70 pt-8">
        <Button onClick={prevStep} variant="outline" size="lg">
          <FiArrowLeft /> Back
        </Button>
        <Button onClick={handleContinue} disabled={!canFinish} loading={submit.isPending} size="lg">
          Complete profile {!submit.isPending && <FiCheck />}
        </Button>
      </div>
    </div>
  );
}
