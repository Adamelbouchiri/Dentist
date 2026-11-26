import { useContext } from "react";
import { FiEdit3 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import AppContext from "../context/AppProvider";
import { useSecondRegistration } from "../hooks/useAccount";
import { usePageMeta } from "../hooks/usePageMeta";
import { ProfileHeader } from "../components/dashboard/ProfileHeader";
import { HealthRecord } from "../components/dashboard/HealthRecord";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/Misc";
import { PageLoader } from "../components/ui/Spinner";

export const Profile = () => {
  const { t } = useTranslation();
  usePageMeta(t("nav.profile"));
  const { user } = useContext(AppContext);
  const { data: registration, isPending, isError } = useSecondRegistration();

  if (isPending) return <PageLoader className="h-[60vh]" />;

  return (
    <div className="space-y-6">
      <ProfileHeader
        user={user}
        action={
          <Button to="/user/dashboard/settings" variant="outline" size="sm">
            <FiEdit3 /> {t("profile.edit")}
          </Button>
        }
      />

      {isError || !registration ? (
        <EmptyState
          title={t("profile.incompleteTitle")}
          description={t("profile.incompleteText")}
          action={<Button to="/second-registration">{t("profile.complete")}</Button>}
        />
      ) : (
        <HealthRecord user={user} record={registration} />
      )}
    </div>
  );
};
