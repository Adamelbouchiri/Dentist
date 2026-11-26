import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AppContext from "../../context/AppProvider";
import { flash } from "../../utils/flash";
import { getErrorMessage } from "../../lib/api";
import { useRegister } from "../../hooks/useAuth";
import { AuthLayout, Divider, SocialButtons } from "../../components/auth/AuthLayout";
import { Input, PasswordInput } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";

export const Register = () => {
  const navigate = useNavigate();
  const { signIn } = useContext(AppContext);
  const register = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const errors = register.error?.response?.data?.errors || {};
  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const data = await register.mutateAsync(formData);
      signIn(data.token, true);
      navigate("/second-registration");
    } catch (error) {
      flash.show(getErrorMessage(error, "Unable to create account"), "error", 3000);
    }
  }

  return (
    <AuthLayout
      title="Create your"
      accent="account"
      subtitle="Join us and discover what your new smile is going to look like."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary-500 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-5">
        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Your full name"
          value={formData.name}
          onChange={set("name")}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={set("email")}
          error={errors.email}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            placeholder="Create password"
            value={formData.password}
            onChange={set("password")}
            error={errors.password}
          />
          <PasswordInput
            label="Confirm"
            autoComplete="new-password"
            placeholder="Repeat password"
            value={formData.password_confirmation}
            onChange={set("password_confirmation")}
          />
        </div>

        <Button type="submit" size="lg" loading={register.isPending} className="w-full">
          {register.isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <Divider />
      <SocialButtons />
    </AuthLayout>
  );
};
