import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { useForgotPassword } from "../../hooks/useAuth";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Input } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const forgot = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    forgot.mutate(email);
  };

  return (
    <AuthLayout
      title="Forgot your"
      accent="password?"
      subtitle="Enter the email linked to your account and we'll send you a secure link to reset it."
    >
      {forgot.isSuccess ? (
        <div className="rounded-3xl bg-white p-6 text-center shadow-soft ring-1 ring-ink-200/70">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl gradient-primary text-white shadow-glow">
            <FiMail className="size-6" />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-ink-900">Check your inbox</h2>
          <p className="mt-1.5 text-sm text-ink-500">
            {forgot.data?.status || "If an account exists for that email, a reset link is on its way."}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            icon={FiMail}
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={forgot.isError && "Unable to send reset link. Please try again."}
          />
          <Button type="submit" size="lg" loading={forgot.isPending} className="w-full">
            {forgot.isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}

      <Link
        to="/login"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition hover:text-ink-900"
      >
        <FiArrowLeft /> Back to sign in
      </Link>
    </AuthLayout>
  );
};
