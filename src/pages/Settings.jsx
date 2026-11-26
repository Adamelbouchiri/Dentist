import { useContext, useState } from "react";
import { FiCamera, FiLock, FiMail, FiUser } from "react-icons/fi";

import AppContext from "../context/AppProvider";
import { useUpdateAvatar, useUpdateName, useUpdatePassword } from "../hooks/useAccount";
import { getErrorMessage } from "../lib/api";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { ProfileHeader } from "../components/dashboard/ProfileHeader";
import { Button } from "../components/ui/Button";
import { Input, PasswordInput } from "../components/ui/Field";
import { Card } from "../components/ui/Misc";
import { Spinner } from "../components/ui/Spinner";

const emptyPasswords = { currentPassword: "", password: "", password_confirmation: "" };

const SettingsCard = ({ icon: Icon, title, description, children }) => (
  <Card className="p-6 md:p-8">
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
  const { user } = useContext(AppContext);

  const [userName, setUserName] = useState(user.name);
  const [passwords, setPasswords] = useState(emptyPasswords);

  const updateAvatar = useUpdateAvatar();
  const updateName = useUpdateName();
  const updatePassword = useUpdatePassword();

  const notifyError = (fallback) => (error) => flash.show(getErrorMessage(error, fallback), "error", 3000);

  const handleUpload = (file) =>
    file &&
    updateAvatar.mutate(file, {
      onSuccess: () => flash.show("Profile picture updated", "success", 3000),
      onError: notifyError("Failed to update picture"),
    });

  const handleSaveName = (e) => {
    e.preventDefault();
    updateName.mutate(userName, {
      onSuccess: (data) => flash.show(data?.message || "Name updated", "success", 3000),
      onError: notifyError("Failed to update name"),
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    updatePassword.mutate(passwords, {
      onSuccess: (data) => flash.show(data?.message || "Password changed", "success", 3000),
      onError: notifyError("Failed to change password"),
      onSettled: () => setPasswords(emptyPasswords),
    });
  };

  const setPw = (field) => (e) => setPasswords((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="space-y-6">
      <PageHeader title="Account" accent="settings" description="Update your profile details and security." />

      <ProfileHeader
        user={user}
        avatarSlot={
          <label
            htmlFor="profile-pic-upload"
            className="absolute -bottom-1 -right-1 grid size-10 cursor-pointer place-items-center rounded-full bg-ink-900 text-white shadow-soft ring-4 ring-white transition hover:bg-primary-500"
            title="Change photo"
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
        <SettingsCard icon={FiUser} title="Profile" description="How your name appears to our team.">
          <form onSubmit={handleSaveName} className="space-y-5">
            <Input label="Full name" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your full name" />
            <Input label="Email address" icon={FiMail} value={user.email || ""} disabled hint="Cannot be changed" />
            <Button type="submit" loading={updateName.isPending} disabled={!userName.trim() || userName === user.name}>
              Save changes
            </Button>
          </form>
        </SettingsCard>

        <SettingsCard icon={FiLock} title="Password" description="Use at least 8 characters with a mix of symbols.">
          <form onSubmit={handleChangePassword} className="space-y-5">
            <PasswordInput
              label="Current password"
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={setPw("currentPassword")}
              placeholder="Current password"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <PasswordInput
                label="New password"
                autoComplete="new-password"
                value={passwords.password}
                onChange={setPw("password")}
                placeholder="New password"
              />
              <PasswordInput
                label="Confirm"
                autoComplete="new-password"
                value={passwords.password_confirmation}
                onChange={setPw("password_confirmation")}
                placeholder="Repeat new password"
              />
            </div>
            <Button type="submit" variant="dark" loading={updatePassword.isPending}>
              Update password
            </Button>
          </form>
        </SettingsCard>
      </div>
    </div>
  );
};
