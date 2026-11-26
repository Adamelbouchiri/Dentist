import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useForgotPassword } from "../../hooks/useAuth";
import { usePageMeta } from "../../hooks/usePageMeta";
import { forgotSchema } from "../../lib/schemas";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Input } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";

export const ForgotPassword = () => {
  const { t } = useTranslation();
  usePageMeta(t("auth.forgotTitle"));
  const forgot = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotSchema), defaultValues: { email: "" } });

  const onSubmit = handleSubmit(({ email }) => forgot.mutate(email));

  return (
    <AuthLayout title={t("auth.forgotTitle")} accent={t("auth.forgotAccent")} subtitle={t("auth.forgotLead")}>
      {forgot.isSuccess ? (
        <div className="rounded-3xl bg-white p-6 text-center shadow-soft ring-1 ring-ink-200/70">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl gradient-primary text-white shadow-glow">
            <FiMail className="size-6" />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-ink-900">{t("auth.checkInbox")}</h2>
          <p className="mt-1.5 text-sm text-ink-500">{forgot.data?.status || t("auth.checkInboxHint")}</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <Input
            label={t("fields.email")}
            type="email"
            icon={FiMail}
            placeholder={t("fields.emailPlaceholder")}
            error={errors.email || (forgot.isError && t("auth.resetLinkFailed"))}
            {...register("email")}
          />
          <Button type="submit" size="lg" loading={forgot.isPending} className="w-full">
            {forgot.isPending ? t("common.sending") : t("auth.sendResetLink")}
          </Button>
        </form>
      )}

      <Link to="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition hover:text-ink-900">
        <FiArrowLeft className="rtl:rotate-180" /> {t("auth.backToSignIn")}
      </Link>
    </AuthLayout>
  );
};
