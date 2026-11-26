import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { FiLock } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "../../lib/api";
import { useMoney } from "../../hooks/useMoney";
import { flash } from "../../utils/flash";
import { Button } from "../ui/Button";

const cardStyle = {
  style: {
    base: {
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
      fontSize: "15px",
      color: "#0b0a1a",
      "::placeholder": { color: "#b4b4c8" },
    },
    invalid: { color: "#ef4444" },
  },
};

/**
 * `createIntent()` must resolve to `{ clientSecret, legacy }` (see useStartCheckout).
 * `onSuccess({ legacy, paymentIntent })` fires once Stripe confirms the payment.
 */
const CheckoutForm = ({ amount, email, createIntent, onSuccess, disabled }) => {
  const { t } = useTranslation();
  const { base, converted } = useMoney();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const { clientSecret, legacy } = await createIntent();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { email },
        },
      });

      if (result.error) {
        flash.show(result.error.message, "error", 4000);
      } else if (result.paymentIntent.status === "succeeded") {
        onSuccess({ legacy, paymentIntent: result.paymentIntent });
      }
    } catch (error) {
      flash.show(getErrorMessage(error, t("booking.paymentError")), "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="mb-2 text-[13px] font-semibold text-ink-700">{t("booking.cardDetails")}</p>
        <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-inset ring-ink-200 transition focus-within:ring-2 focus-within:ring-primary-500">
          <CardElement options={cardStyle} />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full" loading={loading} disabled={!stripe || disabled}>
        {!loading && <FiLock className="size-4" />} {t("booking.pay", { amount: base(amount) })}
      </Button>
      {converted && (
        <p className="text-center text-[12px] leading-snug text-ink-400">{t("booking.chargedIn", { amount: base(amount) })}</p>
      )}
    </form>
  );
};

export default CheckoutForm;
