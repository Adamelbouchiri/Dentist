import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import AppContext from "../../context/AppProvider";
import { flash } from "../../utils/flash";
import { getErrorMessage } from "../../lib/api";
import { applyServerErrors, registerSchema } from "../../lib/schemas";
import { useRegister } from "../../hooks/useAuth";
import { usePageMeta } from "../../hooks/usePageMeta";
import { AuthLayout, Divider, SocialButtons } from "../../components/auth/AuthLayout";
import { Input, PasswordInput } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";

export const Register = () => {
  const { t } = useTranslation();
  usePageMeta(t("auth.createAccount"));
  const navigate = useNavigate();
  const { signIn } = useContext(AppContext);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", password_confirmation: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const data = await registerMutation.mutateAsync(values);
      signIn(data.token, true);
      navigate("/second-registration");
    } catch (error) {
      applyServerErrors(error, setError);
      flash.show(getErrorMessage(error, t("auth.registerFailed")), "error", 3500);
    }
  });

  return (
    <AuthLayout
      title={t("auth.createYour")}
      accent={t("auth.account")}
      subtitle={t("auth.registerLead")}
      footer={
        <>
          {t("auth.haveAccount")}{" "}
          <Link to="/login" className="font-semibold text-primary-500 hover:underline">
            {t("auth.signIn")}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          label={t("fields.fullName")}
          autoComplete="name"
          placeholder={t("fields.fullNamePlaceholder")}
          error={errors.name}
          {...register("name")}
        />
        <Input
          label={t("fields.email")}
          type="email"
          autoComplete="email"
          placeholder={t("fields.emailPlaceholder")}
          error={errors.email}
          {...register("email")}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordInput
            label={t("fields.password")}
            autoComplete="new-password"
            placeholder={t("fields.createPassword")}
            error={errors.password}
            {...register("password")}
          />
          <PasswordInput
            label={t("fields.confirm")}
            autoComplete="new-password"
            placeholder={t("fields.repeatPassword")}
            error={errors.password_confirmation}
            {...register("password_confirmation")}
          />
        </div>

        <Button type="submit" size="lg" loading={registerMutation.isPending} className="w-full">
          {registerMutation.isPending ? t("auth.creating") : t("auth.createAccount")}
        </Button>
      </form>

      <Divider />
      <SocialButtons />
    </AuthLayout>
  );
};
