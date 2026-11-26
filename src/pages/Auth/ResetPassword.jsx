import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { flash } from "../../utils/flash";
import { applyServerErrors, resetSchema } from "../../lib/schemas";
import { useResetPassword } from "../../hooks/useAuth";
import { usePageMeta } from "../../hooks/usePageMeta";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { PasswordInput } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";

export const ResetPassword = () => {
  const { t } = useTranslation();
  usePageMeta(t("auth.resetTitle"));
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const reset = useResetPassword();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetSchema), defaultValues: { password: "", password_confirmation: "" } });

  const onSubmit = handleSubmit((values) =>
    reset.mutate(
      { token, email, ...values },
      {
        onSuccess: (data) => {
          flash.show(data?.status || t("auth.resetDone"), "success", 3000);
          navigate("/login");
        },
        onError: (error) => {
          if (!applyServerErrors(error, setError)) {
            setError("password_confirmation", { type: "server", message: t("auth.resetFailed") });
          }
        },
      }
    )
  );

  return (
    <AuthLayout
      title={t("auth.resetTitle")}
      accent={t("auth.resetAccent")}
      subtitle={email ? t("auth.resetLeadFor", { email }) : t("auth.resetLead")}
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <PasswordInput
          label={t("settings.newPassword")}
          autoComplete="new-password"
          placeholder={t("settings.newPassword")}
          error={errors.password}
          {...register("password")}
        />
        <PasswordInput
          label={t("fields.confirmPassword")}
          autoComplete="new-password"
          placeholder={t("fields.repeatPassword")}
          error={errors.password_confirmation}
          {...register("password_confirmation")}
        />
        <Button type="submit" size="lg" loading={reset.isPending} className="w-full">
          {reset.isPending ? t("auth.resetting") : t("auth.resetButton")}
        </Button>
      </form>

      <Link to="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition hover:text-ink-900">
        <FiArrowLeft className="rtl:rotate-180" /> {t("auth.backToSignIn")}
      </Link>
    </AuthLayout>
  );
};
