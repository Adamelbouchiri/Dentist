import { useContext } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiCalendar,
  FiClipboard,
  FiEdit3,
  FiHeart,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiShield,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import AppContext from "../context/AppProvider";
import { useSecondRegistration } from "../hooks/useAccount";
import { ProfileHeader } from "../components/dashboard/ProfileHeader";
import { Button } from "../components/ui/Button";
import { Card, EmptyState } from "../components/ui/Misc";
import { PageLoader } from "../components/ui/Spinner";

const InfoSection = ({ title, subtitle, rows }) => (
  <Card className="p-6 md:p-8">
    <h3 className="text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
    {subtitle && <p className="mt-0.5 text-sm text-ink-400">{subtitle}</p>}
    <dl className="mt-6 grid gap-x-8 sm:grid-cols-2">
      {rows.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3.5 border-t border-ink-100 py-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-500">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">{label}</dt>
            <dd className="mt-1 break-words text-[15px] font-medium text-ink-900">
              {value || <span className="font-normal italic text-ink-300">Not provided</span>}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  </Card>
);

export const Profile = () => {
  const { user } = useContext(AppContext);
  const { data: registration, isPending, isError } = useSecondRegistration();

  if (isPending) return <PageLoader className="h-[60vh]" />;

  const r = registration || {};

  return (
    <div className="space-y-6">
      <ProfileHeader
        user={user}
        action={
          <Button to="/user/dashboard/settings" variant="outline" size="sm">
            <FiEdit3 /> Edit profile
          </Button>
        }
      />

      {isError || !registration ? (
        <EmptyState
          title="Your health profile is incomplete"
          description="Complete the short onboarding so our team can prepare for your visits."
          action={<Button to="/second-registration">Complete profile</Button>}
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <InfoSection
            title="Personal information"
            subtitle="Basic details on your file"
            rows={[
              { icon: FiUser, label: "Full name", value: user?.name },
              { icon: FiMail, label: "Email", value: user?.email },
              { icon: FiUser, label: "Gender", value: r.gender },
              { icon: FiCalendar, label: "Age range", value: r.ageRange },
            ]}
          />
          <InfoSection
            title="Contact information"
            subtitle="How we reach you"
            rows={[
              { icon: FiPhone, label: "Phone", value: r.phone },
              { icon: FiMail, label: "Contact email", value: r.email },
              { icon: FiMessageCircle, label: "Preferred method", value: r.contactMethod },
              { icon: FaWhatsapp, label: "WhatsApp", value: r.whatsapp },
              { icon: FiMapPin, label: "Address", value: r.address },
              { icon: FiUserPlus, label: "Emergency contact", value: r.emergencyContact },
            ]}
          />
          <div className="xl:col-span-2">
            <InfoSection
              title="Medical information"
              subtitle="Shared only with your care team"
              rows={[
                { icon: FiShield, label: "Dental insurance", value: r.insurance },
                { icon: FiActivity, label: "Current medication", value: r.medication },
                { icon: FiClipboard, label: "Medication names", value: r.medicationName },
                {
                  icon: FiHeart,
                  label: "Medical history",
                  value: Array.isArray(r.medicalHistory) ? r.medicalHistory.join(", ") : r.medicalHistory,
                },
                { icon: FiAlertTriangle, label: "Other conditions", value: r.otherCondition },
                { icon: FiUserPlus, label: "Emergency contact", value: r.emergencyContact },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};
