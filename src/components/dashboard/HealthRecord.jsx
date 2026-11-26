import {
  FiActivity,
  FiAlertTriangle,
  FiCalendar,
  FiClipboard,
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
import { useTranslation } from "react-i18next";
import { Card } from "../ui/Misc";

export const InfoSection = ({ title, subtitle, rows }) => {
  const { t } = useTranslation();
  return (
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
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">{label}</dt>
              <dd className="mt-1 break-words text-[15px] font-medium text-ink-900">
                {value || <span className="font-normal italic text-ink-300">{t("profile.notProvided")}</span>}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </Card>
  );
};

/** Translate onboarding answers (stored in English) for display. */
const useAnswer = () => {
  const { t } = useTranslation();
  return (v) => (v ? t(`answers.${v}`, v) : v);
};

/** Personal / contact / medical blocks built from a user + second_registration record. */
export const HealthRecord = ({ user, record: r = {} }) => {
  const { t } = useTranslation();
  const a = useAnswer();
  const history = Array.isArray(r.medicalHistory) ? r.medicalHistory.map(a).join(", ") : a(r.medicalHistory);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <InfoSection
        title={t("profile.personal")}
        subtitle={t("profile.personalHint")}
        rows={[
          { icon: FiUser, label: t("fields.fullName"), value: user?.name },
          { icon: FiMail, label: t("fields.email"), value: user?.email },
          { icon: FiUser, label: t("profile.gender"), value: a(r.gender) },
          { icon: FiCalendar, label: t("profile.ageRange"), value: a(r.ageRange) },
        ]}
      />
      <InfoSection
        title={t("profile.contact")}
        subtitle={t("profile.contactHint")}
        rows={[
          { icon: FiPhone, label: t("fields.phone"), value: r.phone },
          { icon: FiMail, label: t("profile.contactEmail"), value: r.email },
          { icon: FiMessageCircle, label: t("profile.preferredMethod"), value: a(r.contactMethod) },
          { icon: FaWhatsapp, label: "WhatsApp", value: r.whatsapp },
          { icon: FiMapPin, label: t("profile.address"), value: r.address },
          { icon: FiUserPlus, label: t("profile.emergencyContact"), value: r.emergencyContact },
        ]}
      />
      <div className="xl:col-span-2">
        <InfoSection
          title={t("profile.medical")}
          subtitle={t("profile.medicalHint")}
          rows={[
            { icon: FiShield, label: t("profile.insurance"), value: a(r.insurance) },
            { icon: FiActivity, label: t("profile.medication"), value: a(r.medication) },
            { icon: FiClipboard, label: t("profile.medicationNames"), value: r.medicationName },
            { icon: FiHeart, label: t("profile.history"), value: history },
            { icon: FiAlertTriangle, label: t("profile.otherConditions"), value: r.otherCondition },
            { icon: FiUserPlus, label: t("profile.emergencyContact"), value: r.emergencyContact },
          ]}
        />
      </div>
    </div>
  );
};
