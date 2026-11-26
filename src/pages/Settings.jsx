import { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiBell, FiCamera, FiLock, FiMail, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import AppContext from "../context/AppProvider";
import {
  useNotificationPrefs,
  useUpdateAvatar,
  useUpdateName,
  useUpdateNotificationPrefs,
  useUpdatePassword,
} from "../hooks/useAccount";
import { usePageMeta } from "../hooks/usePageMeta";
import { getErrorMessage } from "../lib/api";
import { applyServerErrors, changePasswordSchema, nameSchema } from "../lib/schemas";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { ProfileHeader } from "../components/dashboard/ProfileHeader";
import { Button } from "../components/ui/Button";
import { Input, PasswordInput, Switch } from "../components/ui/Field";
import { Card } from "../components/ui/Misc";
import { Spinner } from "../components/ui/Spinner";

const SettingsCard = ({ icon: Icon, title, description, children, className = "" }) => (
  <Card className={`p-6 md:p-8 ${className}`}>
    <div className="flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-50 text-primary-500">
        <Icon className="size-5" />
      </span>
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
        <p className="text-sm text-ink-400">{description}</p>
      </div>
    </div>
    <div className="mt-8">{children}</div>
  </Card>
);

export const Settings = () => {
  const { t } = useTranslation();
  usePageMeta(t("nav.settings"));
  const { user } = useContext(AppContext);

  const updateAvatar = useUpdateAvatar();
  const updateName = useUpdateName();
  const updatePassword = useUpdatePassword();
  const { data: prefs } = useNotificationPrefs();
  const updatePrefs = useUpdateNotificationPrefs();

  const nameForm = useForm({ resolver: zodResolver(nameSchema), defaultValues: { userName: user.name } });
  const pwForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", password: "", password_confirmation: "" },
  });

  const notifyError = (fallback) => (error) => flash.show(getErrorMessage(error, fallback), "error", 3500);

  const handleUpload = (file) =>
    file &&
    updateAvatar.mutate(file, {
      onSuccess: () => flash.show(t("settings.photoUpdated"), "success", 3000),
      onError: notifyError(t("settings.photoFailed")),
    });

  const saveName = nameForm.handleSubmit(({ userName }) =>
    updateName.mutate(userName, {
      onSuccess: (data) => {
        flash.show(data?.message || t("settings.nameUpdated"), "success", 3000);
        nameForm.reset({ userName });
      },
      onError: (e) => {
        applyServerErrors(e, nameForm.setError);
        notifyError(t("settings.nameFailed"))(e);
      },
    })
  );

  const savePassword = pwForm.handleSubmit((values) =>
    updatePassword.mutate(values, {
      onSuccess: (data) => {
        flash.show(data?.message || t("settings.passwordUpdated"), "success", 3000);
        pwForm.reset();
      },
      onError: (e) => {
        applyServerErrors(e, pwForm.setError);
        notifyError(t("settings.passwordFailed"))(e);
      },
    })
  );

  const togglePref = (key) => (value) =>
    updatePrefs.mutate({ ...prefs, unavailable: undefined, [key]: value }, { onError: notifyError(t("common.notAvailableYet")) });

  return (
    <div className="space-y-6">
      <PageHeader title={t("settings.title")} accent={t("settings.titleAccent")} description={t("settings.lead")} />

      <ProfileHeader
        user={user}
        avatarSlot={
          <label
            htmlFor="profile-pic-upload"
            className="absolute -bottom-1 -end-1 grid size-10 cursor-pointer place-items-center rounded-full bg-ink-900 text-white shadow-soft ring-4 ring-white transition hover:bg-primary-500"
            title={t("settings.changePhoto")}
          >
            {updateAvatar.isPending ? <Spinner /> : <FiCamera className="size-4" />}
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              disabled={updateAvatar.isPending}
              onChange={(e) => handleUpload(e.target.files[0])}
              className="sr-only"
            />
          </label>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SettingsCard icon={FiUser} title={t("settings.profile")} description={t("settings.profileHint")}>
          <form onSubmit={saveName} className="space-y-5" noValidate>
            <Input
              label={t("fields.fullName")}
              placeholder={t("fields.fullNamePlaceholder")}
              error={nameForm.formState.errors.userName}
              {...nameForm.register("userName")}
            />
            <Input label={t("fields.email")} icon={FiMail} value={user.email || ""} disabled hint={t("settings.emailLocked")} />
            <Button type="submit" loading={updateName.isPending} disabled={!nameForm.formState.isDirty}>
              {t("common.saveChanges")}
            </Button>
          </form>
        </SettingsCard>

        <SettingsCard icon={FiLock} title={t("settings.password")} description={t("settings.passwordHint")}>
          <form onSubmit={savePassword} className="space-y-5" noValidate>
            <PasswordInput
              label={t("settings.currentPassword")}
              autoComplete="current-password"
              placeholder={t("settings.currentPassword")}
              error={pwForm.formState.errors.currentPassword}
              {...pwForm.register("currentPassword")}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <PasswordInput
                label={t("settings.newPassword")}
                autoComplete="new-password"
                placeholder={t("settings.newPassword")}
                error={pwForm.formState.errors.password}
                {...pwForm.register("password")}
              />
              <PasswordInput
                label={t("fields.confirm")}
                autoComplete="new-password"
                placeholder={t("fields.repeatPassword")}
                error={pwForm.formState.errors.password_confirmation}
                {...pwForm.register("password_confirmation")}
              />
            </div>
            <Button type="submit" variant="dark" loading={updatePassword.isPending}>
              {t("settings.updatePassword")}
            </Button>
          </form>
        </SettingsCard>

        {user.role === "user" && (
          <SettingsCard icon={FiBell} title={t("settings.reminders")} description={t("settings.remindersHint")} className="xl:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              <Switch
                label={t("settings.emailReminders")}
                description={t("settings.emailRemindersHint")}
                checked={!!prefs?.email_reminders}
                disabled={!prefs || prefs.unavailable}
                onChange={togglePref("email_reminders")}
              />
              <Switch
                label={t("settings.whatsappReminders")}
                description={t("settings.whatsappRemindersHint")}
                checked={!!prefs?.whatsapp_reminders}
                disabled={!prefs || prefs.unavailable}
                onChange={togglePref("whatsapp_reminders")}
              />
            </div>
            {prefs?.unavailable && <p className="mt-6 text-[13px] text-ink-400">{t("common.comingSoon")}</p>}
          </SettingsCard>
        )}
      </div>
    </div>
  );
};
