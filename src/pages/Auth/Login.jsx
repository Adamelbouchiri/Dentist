import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheck } from "react-icons/fi";

import AppContext from "../../context/AppProvider";
import { flash } from "../../utils/flash";
import { getErrorMessage } from "../../lib/api";
import { useLogin } from "../../hooks/useAuth";
import { AuthLayout, Divider, SocialButtons } from "../../components/auth/AuthLayout";
import { Input, PasswordInput } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";

export const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useContext(AppContext);
  const login = useLogin();

  const [remember, setRemember] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const errors = login.error?.response?.data?.errors || {};
  const generalError = !login.error?.response?.data?.errors && login.error?.response?.data?.message;

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const data = await login.mutateAsync(formData);
      signIn(data.token, remember);
      navigate("/");
    } catch (error) {
      flash.show(getErrorMessage(error, "Unable to sign in"), "error", 3000);
    }
  }

  return (
    <AuthLayout
      title="Welcome"
      accent="back"
      subtitle={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-primary-500 hover:underline">
            Create one now
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email || generalError}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
        />

        <div className="flex items-center justify-between pt-1">
          <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-sm text-ink-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer sr-only"
            />
            <span className="grid size-5 place-items-center rounded-md bg-white ring-1 ring-inset ring-ink-300 transition peer-checked:bg-primary-500 peer-checked:ring-primary-500 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500">
              <FiCheck className="size-3 text-white" />
            </span>
            Keep me signed in
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-primary-500 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" loading={login.isPending} className="w-full">
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <Divider />
      <SocialButtons />
    </AuthLayout>
  );
};
