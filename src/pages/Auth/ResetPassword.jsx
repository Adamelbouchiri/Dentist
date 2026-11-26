import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { flash } from "../../utils/flash";
import { useResetPassword } from "../../hooks/useAuth";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { PasswordInput } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const reset = useResetPassword();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    reset.mutate(
      { token, email, password, password_confirmation: passwordConfirmation },
      {
        onSuccess: (data) => {
          flash.show(data?.status || "Password reset successfully", "success", 3000);
          navigate("/login");
        },
      }
    );
  };

  return (
    <AuthLayout
      title="Reset your"
      accent="password"
      subtitle={email ? <>Choose a new password for <b className="text-ink-800">{email}</b>.</> : "Choose a new password."}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          placeholder="New password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat new password"
          required
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          error={reset.isError && "Failed to reset password. Please check the link or try again."}
        />
        <Button type="submit" size="lg" loading={reset.isPending} className="w-full">
          {reset.isPending ? "Resetting…" : "Reset password"}
        </Button>
      </form>

      <Link
        to="/login"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition hover:text-ink-900"
      >
        <FiArrowLeft /> Back to sign in
      </Link>
    </AuthLayout>
  );
};
