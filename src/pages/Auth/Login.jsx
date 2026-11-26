import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiCheck } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import AppContext from "../../context/AppProvider";
import { flash } from "../../utils/flash";
import { getErrorMessage } from "../../lib/api";
import { applyServerErrors, loginSchema } from "../../lib/schemas";
import { useLogin } from "../../hooks/useAuth";
import { usePageMeta } from "../../hooks/usePageMeta";
import { AuthLayout, Divider, SocialButtons } from "../../components/auth/AuthLayout";
import { Input, PasswordInput } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";

export const Login = () => {
  const { t } = useTranslation();
  usePageMeta(t("auth.signIn"));
  const navigate = useNavigate();
  const { signIn } = useContext(AppContext);
  const login = useLogin();
  const [remember, setRemember] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const data = await login.mutateAsync(values);
      signIn(data.token, remember);
      navigate("/");
    } catch (error) {
      if (!applyServerErrors(error, setError)) {
        setError("email", { type: "server", message: getErrorMessage(error, t("auth.signInFailed")) });
      }
      flash.show(getErrorMessage(error, t("auth.signInFailed")), "error", 3500);
    }
  });

  return (
    <AuthLayout
      title={t("auth.welcome")}
      accent={t("auth.welcomeAccent")}
      subtitle={
        <>
          {t("auth.noAccount")}{" "}
          <Link to="/register" className="font-semibold text-primary-500 hover:underline">
            {t("auth.createOne")}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          label={t("fields.email")}
          type="email"
          autoComplete="email"
          placeholder={t("fields.emailPlaceholder")}
          error={errors.email}
          {...register("email")}
        />
        <PasswordInput
          label={t("fields.password")}
          autoComplete="current-password"
          placeholder={t("fields.passwordPlaceholder")}
          error={errors.password}
          {...register("password")}
        />

        <div className="flex items-center justify-between pt-1">
          <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm text-ink-600">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="peer sr-only" />
            <span className="grid size-5 place-items-center rounded-md bg-white ring-1 ring-inset ring-ink-300 transition peer-checked:bg-primary-500 peer-checked:ring-primary-500 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500">
              <FiCheck className="size-3 text-white" />
            </span>
            {t("auth.keepSignedIn")}
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-primary-500 hover:underline">
            {t("auth.forgot")}
          </Link>
        </div>

        <Button type="submit" size="lg" loading={login.isPending} className="w-full">
          {login.isPending ? t("auth.signingIn") : t("auth.signIn")}
        </Button>
      </form>

      <Divider />
      <SocialButtons />
    </AuthLayout>
  );
};
